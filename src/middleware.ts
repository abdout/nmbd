import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { 
  apiAuthPrefix, 
  authRoutes, 
  DEFAULT_LOGIN_REDIRECT, 
  publicRoutes 
} from "./routes"
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth: authNextAuth } = NextAuth(authConfig)

export default authNextAuth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  const isOnboardingRoute = nextUrl.pathname.startsWith("/onboarding")

  if (isApiAuthRoute) {
    return
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return
  }

  if (!isLoggedIn && !isPublicRoute) {
    const callbackUrl = nextUrl.pathname + nextUrl.search
    const encodedCallbackUrl = encodeURIComponent(callbackUrl)
    return Response.redirect(new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl))
  }

  // If logged in and not in onboarding, redirect to onboarding
  if (isLoggedIn && !isOnboardingRoute && req.auth?.user?.onboardingStatus === "PENDING") {
    return NextResponse.redirect(new URL("/onboarding", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|fonts).*)',
    "/dashboard/:path*",
    "/profile/:path*"
  ],
}