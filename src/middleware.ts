import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedPaths: string[] = ["/admin", "/game", "/leader", "/store"];

export async function middleware(req: NextRequest) {
  const pathname: string = req.nextUrl.pathname;
  
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("token:", token);
  console.log("pathname:", pathname);

  // Check if pathname starts with any protected path
  const isProtected: boolean = protectedPaths.some((path) => pathname.startsWith(path));

  // Redirect logged-in users away from auth pages
  if (token && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Allow access to non-protected routes
  if (!isProtected) {
    return NextResponse.next();
  }

  // If no token, redirect to login page
  if (!token) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // Restrict /admin to only admin users
  if (pathname.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Everything OK, proceed to requested route
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/game/:path*", "/leader/:path*", "/auth/:path*", "/store/:path*"],
};