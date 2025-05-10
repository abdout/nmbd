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

  // Check if the request is for an image or static asset
  const isImageRequest = nextUrl.pathname.startsWith('/_next/image')
  const isStaticAsset = 
    nextUrl.pathname.startsWith('/_next/static') || 
    nextUrl.pathname.startsWith('/public') || 
    nextUrl.pathname.includes('.jpg') ||
    nextUrl.pathname.includes('.jpeg') ||
    nextUrl.pathname.includes('.png') ||
    nextUrl.pathname.includes('.svg') ||
    nextUrl.pathname.includes('.gif')

  // Allow all image and static asset requests to pass through
  if (isImageRequest || isStaticAsset) {
    console.log("[Middleware] Allowing image or static asset:", nextUrl.pathname);
    return;
  }

  console.log("[Middleware] Request Details:", {
    path: nextUrl.pathname,
    isLoggedIn,
    sessionData: req.auth,
    timestamp: new Date().toISOString()
  });

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.some(route => {
    if (route.includes(':')) {
      // Convert /paper/:id to regex: ^/paper/[^/]+$
      const pattern = '^' + route.replace(/:[^/]+/g, '[^/]+') + '$';
      return new RegExp(pattern).test(nextUrl.pathname);
    }
    return route === nextUrl.pathname;
  });
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
    // Match all paths except:
    // 1. API auth routes (/api/auth/*)
    // 2. Static files (/_next/static/*)
    // 3. Image files (/_next/image*)
    // 4. Public assets (favicon.ico, fonts, etc.)
    '/((?!api/auth|_next/static|_next/image|favicon.ico|fonts).*)',
  ],
}