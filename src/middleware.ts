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
 * UX-level gate only: redirects based on session cookie presence so users
 * don't land on pages that would immediately bounce. Every API route and
 * server layout still enforces real authentication independently.
 */
export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  const authed = hasSessionCookie(req)

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  )

  if (isProtected && !authed) {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    url.search = `?next=${encodeURIComponent(pathname + search)}`
    return NextResponse.redirect(url)
  }

  if (authed && AUTH_PAGES.includes(pathname)) {
    const url = req.nextUrl.clone()
    url.pathname = "/dashboard"
    url.search = ""
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico)).*)",
  ],
}
