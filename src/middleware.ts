import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

const PROTECTED = ["/profile"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (!PROTECTED.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return NextResponse.redirect(new URL("/", request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/profile/:path*"],
}
