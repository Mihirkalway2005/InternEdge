import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "./db"

/**
 * BetterAuth Server Configuration for InternEdge
 * Backed by Prisma + PostgreSQL via the Prisma adapter.
 */
export const auth = betterAuth({
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "internedge_better_auth_secret_key_2026_984f7e2a8190d632c8e1f0b",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:8443",
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "demo_github_id",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "demo_github_secret",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "demo_google_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "demo_google_secret",
    },
  },
})
