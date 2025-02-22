
import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { 
  apiAuthPrefix, 
  authRoutes, 
  DEFAULT_LOGIN_REDIRECT, 
  publicRoutes 
} from "./routes"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  console.log("[Middleware] Request Details:", {
    path: nextUrl.pathname,
    isLoggedIn,
    sessionData: req.auth,
    timestamp: new Date().toISOString()
  });

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)

  if (isApiAuthRoute) {
    console.log("[Middleware] API Auth Route:", nextUrl.pathname);
    return
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      console.log("[Middleware] Authenticated user on auth route - redirecting to:", DEFAULT_LOGIN_REDIRECT);
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    console.log("[Middleware] Unauthenticated user on auth route - allowing");
    return
  }

  if (!isLoggedIn && !isPublicRoute) {
    console.log("[Middleware] Unauthorized access - redirecting to login:", {
      from: nextUrl.pathname,
      isPublic: isPublicRoute
    });
    
    const callbackUrl = nextUrl.pathname + nextUrl.search
    const encodedCallbackUrl = encodeURIComponent(callbackUrl)
    const loginUrl = `/login?callbackUrl=${encodedCallbackUrl}`

    console.log("[Middleware] Redirect URL:", loginUrl);
    return Response.redirect(new URL(loginUrl, nextUrl))
  }

  return
})

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|fonts).*)',
  ],
}