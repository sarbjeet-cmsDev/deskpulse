import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const publicPaths = [
    "/auth/login",
    "/auth/signup",
    "/auth/forgotpassword",
    "/reset-password",
  ];

  const isPublicRoute = publicPaths.includes(req.nextUrl.pathname);
  const isProtectedRoute =
    req.nextUrl.pathname.startsWith("/admin") ||
    req.nextUrl.pathname.startsWith("/user");

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/:path*", "/reset-password", "/admin/:path*", "/user/:path*"],
};
