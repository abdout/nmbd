import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { 
  apiAuthPrefix, 
  authRoutes, 
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
  onboardingRoutes,
  isOnboardingRoute
} from "./routes"
import { db } from "@/lib/db"

const { auth } = NextAuth(authConfig)

export default auth(async (req) => {
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
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  const isOnboarding = isOnboardingRoute(nextUrl.pathname)

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

  // Handle onboarding routes
  if (isOnboarding && isLoggedIn && req.auth?.user?.email) {
    try {
      const user = await db.user.findUnique({
        where: { email: req.auth.user.email },
        select: { onboardingStep: true }
      });

      if (!user) {
        console.log("[Middleware] User not found in database");
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }

      const currentStep = user.onboardingStep || 1;
      const requestedStep = getOnboardingStep(nextUrl.pathname);

      // Only allow access to current or previous steps
      if (requestedStep > currentStep) {
        console.log("[Middleware] Invalid onboarding step - redirecting to appropriate step");
        const redirectPath = getOnboardingPathByStep(currentStep);
        return Response.redirect(new URL(redirectPath, nextUrl));
      }
    } catch (error) {
      console.error("[Middleware] Error checking onboarding step:", error);
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
  }

  return;
})

// Helper function to get onboarding step number from path
function getOnboardingStep(path: string): number {
  switch (path) {
    case onboardingRoutes.INFORMATION:
      return 1;
    case onboardingRoutes.EDUCATION:
      return 2;
    case onboardingRoutes.ACTIVITY:
      return 3;
    case onboardingRoutes.REVIEW:
      return 4;
    default:
      return 1;
  }
}

// Helper function to get onboarding path by step number
function getOnboardingPathByStep(step: number): string {
  switch (step) {
    case 1:
      return onboardingRoutes.INFORMATION;
    case 2:
      return onboardingRoutes.EDUCATION;
    case 3:
      return onboardingRoutes.ACTIVITY;
    case 4:
      return onboardingRoutes.REVIEW;
    default:
      return onboardingRoutes.INFORMATION;
  }
}

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