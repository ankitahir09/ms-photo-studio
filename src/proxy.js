import { NextResponse } from "next/server";

export async function proxy(request) {
  const pathname = request.nextUrl.pathname;

  // Protect /admin routes (except the login page itself)
  if (
    pathname.startsWith("/admin/") ||
    pathname.startsWith("/upload") ||
    pathname.startsWith("/settings")
  ) {
    if (pathname === "/admin") {
      return NextResponse.next();
    }

    const sessionCookie = request.cookies.get("auth_token");
    
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/upload",
    "/upload-video",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
