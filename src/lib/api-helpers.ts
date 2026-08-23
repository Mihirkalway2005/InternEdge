import { NextRequest, NextResponse } from "next/server"
import { ZodError, type ZodType } from "zod"
import { getAuthSession, type AuthSession } from "./session"

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

/** Wrap a route handler with uniform error mapping. */
export function handleRoute<Args extends unknown[]>(
  handler: (...args: Args) => Promise<NextResponse>,
) {
  return async (...args: Args): Promise<NextResponse> => {
    try {
      return await handler(...args)
    } catch (err) {
      if (err instanceof ApiError) {
        return json(
          { error: err.message, ...(err.details ? { details: err.details } : {}) },
          err.status,
        )
      }
      if (err instanceof ZodError) {
        return json({ error: "Invalid request data", details: err.issues }, 400)
      }
      console.error("[api] unhandled error:", err)
      return json({ error: "Internal server error" }, 500)
    }
  }
}

/**
 * Resolve the authenticated session or throw a 401.
 * Identity ALWAYS comes from the session cookie — never from client input.
 */
export async function requireUser(): Promise<AuthSession> {
  const session = await getAuthSession()
  if (!session) throw new ApiError(401, "Authentication required")
  return session
}

export async function requireAdmin(): Promise<AuthSession> {
  const user = await requireUser()
  if (user.userRole !== "admin") throw new ApiError(403, "Admin access required")
  return user
}

/** Validate a JSON body against a schema (throws 400 on failure). */
export async function parseBody<T>(
  req: Request,
  schema: ZodType<T>,
): Promise<T> {
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    throw new ApiError(400, "Invalid JSON body")
  }
  const result = schema.safeParse(raw)
  if (!result.success) {
    throw new ApiError(400, "Invalid request data", result.error.issues)
  }
  return result.data
}

export function parseQuery<T>(req: NextRequest, schema: ZodType<T>): T {
  const params = Object.fromEntries(new URL(req.url).searchParams.entries())
  const result = schema.safeParse(params)
  if (!result.success) {
    throw new ApiError(400, "Invalid query parameters", result.error.issues)
  }
  return result.data
}

/**
 * Load an owned row or throw 404. Ownership failures are indistinguishable
 * from missing rows to prevent resource enumeration across accounts.
 */
export function assertOwned<T extends { userId: string }>(
  row: T | null | undefined,
  userId: string,
): asserts row is T {
  if (!row || row.userId !== userId) {
    throw new ApiError(404, "Resource not found")
  }
}

export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  )
}
