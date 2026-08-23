import { prisma } from "@/lib/db"
import type { NotificationType } from "@/generated/prisma/enums"

/**
 * Event-driven notification creation with idempotency via dedupeKey.
 * Safe to call repeatedly (e.g. lazy sweeps); duplicates are swallowed.
 */
export async function notify(input: {
  userId: string
  type: NotificationType
  title: string
  message: string
  link?: string
  dedupeKey?: string
}): Promise<void> {
  try {
    await prisma.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        title: input.title,
        message: input.message,
        link: input.link,
        dedupeKey: input.dedupeKey ?? null,
      },
    })
  } catch {
    // Unique violation on (userId, dedupeKey) = already notified. Fine.
  }
}

export async function logActivity(input: {
  userId: string
  action: string
  entityType?: string
  entityId?: string
  details?: string
}): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        userId: input.userId,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        details: input.details?.slice(0, 500),
      },
    })
  } catch (err) {
    console.error("[activity] failed to log:", err)
  }
}

/** Fire-and-forget readiness snapshot (dynamic import avoids service cycles). */
export async function recordSnapshotSafe(userId: string): Promise<void> {
  try {
    const { recordReadinessSnapshot } = await import("./dashboard-service")
    await recordReadinessSnapshot(userId)
  } catch {
    // Snapshot recording is best-effort.
  }
}

/**
 * Lazy deadline sweep: notifies about applications in active stages whose
 * internship deadline is within 72h. Idempotent per application per day.
 */
export async function sweepDeadlines(userId: string): Promise<void> {
  const soon = new Date(Date.now() + 72 * 60 * 60 * 1000)
  const apps = await prisma.application.findMany({
    where: {
      userId,
      status: { in: ["saved", "applied", "assessment"] },
      internship: { isActive: true, deadline: { gt: new Date(), lte: soon } },
    },
    include: { internship: { include: { company: true } } },
  })

  for (const app of apps) {
    const day = new Date().toISOString().slice(0, 10)
    await notify({
      userId,
      type: "deadline",
      title: `Deadline approaching: ${app.internship.company.name}`,
      message: `"${app.internship.title}" closes ${app.internship.deadline.toLocaleDateString()}. Your application is in "${app.status}" stage.`,
      link: "/applications",
      dedupeKey: `deadline:${app.id}:${day}`,
    })
  }
}
