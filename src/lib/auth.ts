import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "./db"

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. Copy .env.example to .env and configure it.`,
    )
  }
  return value
}

// Fail fast at boot when critical secrets are absent instead of silently
// running with an insecure fallback value.
const secret = process.env.BETTER_AUTH_SECRET || requireEnv("BETTER_AUTH_SECRET")

const githubId = process.env.GITHUB_CLIENT_ID
const githubSecret = process.env.GITHUB_CLIENT_SECRET
const googleId = process.env.GOOGLE_CLIENT_ID
const googleSecret = process.env.GOOGLE_CLIENT_SECRET

export const socialProvidersEnabled = {
  github: Boolean(githubId && githubSecret),
  google: Boolean(googleId && googleSecret),
} as const

/**
 * BetterAuth Server Configuration for InternEdge
 * Backed by Prisma + PostgreSQL via the Prisma adapter.
 */
export const auth = betterAuth({
  secret,
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.APP_URL ||
    "http://localhost:8443",
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh once a day
  },
  // Social providers are only registered when real credentials exist.
  ...(githubId && githubSecret
    ? {
        socialProviders: {
          github: { clientId: githubId, clientSecret: githubSecret },
        },
      }
    : {}),
  ...(googleId && googleSecret
    ? {
        socialProviders: {
          google: { clientId: googleId, clientSecret: googleSecret },
        },
      }
    : {}),
})
