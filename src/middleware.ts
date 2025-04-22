import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { 
  apiAuthPrefix, 
  authRoutes, 
  DEFAULT_LOGIN_REDIRECT, 
  publicRoutes 
} from "./routes"

const { auth } = NextAuth(authConfig)

// Middleware using Next.js 14/15 syntax
export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const pathname = nextUrl.pathname
  
  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix)
  
  // Check if the path matches any public route, including dynamic routes
  const isPublicRoute = publicRoutes.some(route => {
    // For exact matches
    if (route === pathname) return true;
    
    // For dynamic routes
    if (route.includes('[id]')) {
      const routePattern = route.replace('[id]', '[^/]+');
      const regex = new RegExp(`^${routePattern.replace(/\//g, '\\/')}$`);
      return regex.test(pathname);
    }
    
    return false;
  });
  
  const isAuthRoute = authRoutes.includes(pathname)

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
    const callbackUrl = pathname + nextUrl.search
    const encodedCallbackUrl = encodeURIComponent(callbackUrl)

    return Response.redirect(new URL(
      `/login?callbackUrl=${encodedCallbackUrl}`,
      nextUrl
    ))
  }

  return
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}