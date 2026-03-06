import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-change-me");

const protectedPaths = ["/calculator", "/results"];
const authPaths = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;

  let isAuthenticated = false;
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isAuthenticated = true;
    } catch {
      // invalid token
    }
  }

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const isAuthPage = authPaths.some((p) => pathname.startsWith(p));
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/calculator", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/calculator/:path*", "/results/:path*", "/login", "/register"],
};
