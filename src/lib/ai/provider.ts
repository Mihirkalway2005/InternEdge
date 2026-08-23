import type { ZodType } from "zod"

export class AIServiceError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: unknown,
  ) {
    super(message)
    this.name = "AIServiceError"
  }
}

const BASE_URL = process.env.LLM_BASE_URL || "https://api.groq.com/openai/v1"
const MODEL = process.env.LLM_MODEL || "openai/gpt-oss-120b"
const TIMEOUT_MS = Number(process.env.LLM_TIMEOUT_MS || 30_000)

/** AI features degrade gracefully when no key is configured. */
export function isAIEnabled(): boolean {
  return Boolean(process.env.GROQ_API_KEY)
}

type ChatMessage = { role: "system" | "user" | "assistant"; content: string }

function extractJson(raw: string): unknown {
  const trimmed = raw.trim()
  // Strip markdown fences if the model added them.
  const unfenced = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/, "")
  try {
    return JSON.parse(unfenced)
  } catch {
    // Attempt to grab the outermost JSON object.
    const start = unfenced.indexOf("{")
    const end = unfenced.lastIndexOf("}")
    if (start !== -1 && end > start) {
      return JSON.parse(unfenced.slice(start, end + 1))
    }
    throw new AIServiceError("Model returned non-JSON output")
  }
}

async function callChat(
  messages: ChatMessage[],
  maxTokens: number,
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new AIServiceError("LLM provider not configured")

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.3,
        max_tokens: maxTokens,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    })

    if (res.status === 429) {
      throw new AIServiceError("AI rate limit reached, retry shortly", 429)
    }
    if (!res.ok) {
      const body = await res.text().catch(() => "")
      throw new AIServiceError(
        `LLM request failed (${res.status})`,
        res.status >= 500 ? 502 : 400,
        body.slice(0, 500),
      )
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[]
    }
    const content = data.choices?.[0]?.message?.content
    if (!content) throw new AIServiceError("Empty LLM response")
    return content
  } catch (err) {
    if (err instanceof AIServiceError) throw err
    if ((err as Error).name === "AbortError") {
      throw new AIServiceError("AI request timed out", 504)
    }
    throw new AIServiceError(`AI request failed: ${(err as Error).message}`)
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Request a structured JSON completion and validate it against a Zod schema.
 * Performs one repair retry when validation fails.
 */
export async function chatJSON<T>(options: {
  system: string
  user: string
  schema: ZodType<T>
  maxTokens?: number
}): Promise<T> {
  const { system, user, schema, maxTokens = 2048 } = options

  let raw = await callChat(
    [
      { role: "system", content: `${system}\nRespond with valid JSON only.` },
      { role: "user", content: user },
    ],
    maxTokens,
  )

  let parsed = schema.safeParse(extractJson(raw))
  if (parsed.success) return parsed.data

  // One repair pass with the validation errors surfaced to the model.
  raw = await callChat(
    [
      { role: "system", content: `${system}\nRespond with valid JSON only.` },
      { role: "user", content: user },
      { role: "assistant", content: raw },
      {
        role: "user",
        content: `Your previous JSON was invalid: ${JSON.stringify(
          parsed.error.issues.slice(0, 10),
        )}. Return corrected JSON matching the requested shape exactly.`,
      },
    ],
    maxTokens,
  )

  parsed = schema.safeParse(extractJson(raw))
  if (parsed.success) return parsed.data
  throw new AIServiceError("AI produced invalid structure after retry", 502)
}
