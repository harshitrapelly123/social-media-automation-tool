import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // Protect the /create-post route
  if (request.nextUrl.pathname.startsWith("/create-post") && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Protect the /dashboard route
  if (request.nextUrl.pathname.startsWith("/dashboard") && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/create-post/:path*", "/dashboard/:path*"],
};
