import { handleRoute, json, requireUser } from "@/lib/api-helpers"
import { getDashboardOverview } from "@/lib/services/dashboard-service"

/** Single authenticated aggregate powering the dashboard page. */
export const GET = handleRoute(async () => {
  const { userId } = await requireUser()
  const overview = await getDashboardOverview(userId)
  return json(overview)
})
