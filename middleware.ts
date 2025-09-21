
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // If user is on sign in page and already authenticated, redirect to appropriate dashboard
    if (pathname === "/auth/signin" && token) {
      const role = token.role as string;
      let redirectPath = "/";
      
      switch (role) {
        case "ADMIN":
          redirectPath = "/admin";
          break;
        case "CLEANER":
          redirectPath = "/cleaner";
          break;
        case "CUSTOMER":
        default:
          redirectPath = "/dashboard";
          break;
      }
      
      return NextResponse.redirect(new URL(redirectPath, req.url));
    }

    // If user is on home page and authenticated, redirect to appropriate dashboard
    if (pathname === "/" && token) {
      const role = token.role as string;
      let redirectPath = "/dashboard";
      
      switch (role) {
        case "ADMIN":
          redirectPath = "/admin";
          break;
        case "CLEANER":
          redirectPath = "/cleaner";
          break;
        case "CUSTOMER":
        default:
          redirectPath = "/dashboard";
          break;
      }
      
      return NextResponse.redirect(new URL(redirectPath, req.url));
    }

    // Allow access to public routes
    if (["/auth/signin", "/auth/signup", "/"].includes(pathname)) {
      return NextResponse.next();
    }

    // Role-based access control
    if (token) {
      const role = token.role as string;
      
      // Admin can access all routes
      if (role === "ADMIN") {
        return NextResponse.next();
      }
      
      // Cleaner can only access cleaner routes
      if (role === "CLEANER" && !pathname.startsWith("/cleaner")) {
        return NextResponse.redirect(new URL("/cleaner", req.url));
      }
      
      // Customer can only access customer routes
      if (role === "CUSTOMER" && pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      
      if (role === "CUSTOMER" && pathname.startsWith("/cleaner")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Public routes that don't require authentication
        if (["/auth/signin", "/auth/signup", "/"].includes(pathname)) {
          return true;
        }
        
        // All other routes require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
