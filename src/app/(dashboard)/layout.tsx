import { redirect } from "next/navigation"
import { getAuthSession } from "@/lib/session"
import { prisma } from "@/lib/db"
import { DashboardChrome } from "@/components/dashboard/DashboardChrome"

/**
 * Server-side auth gate for every dashboard route.
 * - No session → /login (middleware handles UX; this is enforcement)
 * - Session but incomplete onboarding → /onboarding
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getAuthSession()
  if (!session) redirect("/login")

  const profile = await prisma.profile.findUnique({
    where: { userId: session.userId },
    select: { onboardedAt: true },
  })
  if (!profile?.onboardedAt) redirect("/onboarding")

  return <DashboardChrome>{children}</DashboardChrome>
}
