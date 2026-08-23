import { NextRequest, NextResponse } from "next/server"

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/applications",
  "/internships",
  "/interviews",
  "/portfolio",
  "/profile",
  "/resume",
  "/roadmap",
  "/analytics",
  "/notifications",
  "/onboarding",
]

const AUTH_PAGES = ["/login", "/signup"]

function hasSessionCookie(req: NextRequest): boolean {
  return Boolean(
    req.cookies.get("better-auth.session_token") ||
      req.cookies.get("__Secure-better-auth.session_token"),
  )
}

/**
 * UX-level gate only: redirects unauthenticated users to /login when attempting
 * to access protected routes. Every API route and server layout still enforces
 * real authentication independently via getAuthSession().
 *
 * We intentionally do not redirect /login or /signup to /dashboard based solely
 * on cookie presence, because an expired or invalid cookie in the browser would
 * cause an infinite redirect bounce between middleware (/dashboard) and DashboardLayout (/login),
 * which triggers "SecurityError: Attempt to use history.replaceState() more than 100 times per 10 seconds".
 */
export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  const authed = hasSessionCookie(req)

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  )

  if (isProtected && !authed && pathname !== "/login") {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    url.search = `?next=${encodeURIComponent(pathname + search)}`
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico)).*)",
  ],
}
