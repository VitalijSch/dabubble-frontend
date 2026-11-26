import { type NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE, getAuthRedirect } from "@/features/auth";

/**
 * Sends guests to the login page and logged-in users away from it.
 *
 * This is only an optimistic check (does the session cookie exist?). Pages and
 * server actions that touch user data must still verify the session themselves.
 */
export function proxy(request: NextRequest) {
  const isLoggedIn = request.cookies.has(SESSION_COOKIE);
  const target = getAuthRedirect(request.nextUrl.pathname, isLoggedIn);

  return target ? NextResponse.redirect(new URL(target, request.url)) : NextResponse.next();
}

export const config = {
  // Pages only: skip API routes, Next.js assets and files with an extension (images, robots.txt, …).
  matcher: ["/((?!api|_next/static|_next/image|.*\\.[^/]+$).*)"],
};
