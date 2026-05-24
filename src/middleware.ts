import { NextRequest, NextResponse } from "next/server"

const PROTECTED = ["/profile"]

/* Check cookie presence only — pg/Node.js is unavailable in Edge runtime.
   Full session validation happens in each protected page's server component. */
const SESSION_COOKIE = "better-auth.session_token"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (!PROTECTED.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }
  const session = request.cookies.get(SESSION_COOKIE)
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/profile/:path*"],
}
