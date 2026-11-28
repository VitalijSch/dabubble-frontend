import { type NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE, getAuthRedirect } from "@/features/auth";

export function proxy(request: NextRequest) {
  const hasSessionCookie = request.cookies.has(SESSION_COOKIE);
  const redirectTo = getAuthRedirect(request.nextUrl.pathname, hasSessionCookie);
  if (!redirectTo) return NextResponse.next();
  return NextResponse.redirect(new URL(redirectTo, request.url));
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.[^/]+$).*)"],
};
