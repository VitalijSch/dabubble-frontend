/**
 * Who may see which page. Used by src/proxy.ts on every page request.
 *
 * - Guests land on the login page; every app page sends them there.
 * - Logged-in users never see the auth pages; they go to the main page.
 * - Legal pages are open to everyone.
 */

/** Cookie that marks a logged-in user. Set on login, deleted on logout. */
export const SESSION_COOKIE = "dabubble_session";

export const LOGIN_PATH = "/login";
export const HOME_PATH = "/";
export const REGISTER_PATH = "/register";

/** Pages only for logged-out users. Add sign-up, choose avatar, reset password … as they are built. */
const GUEST_ONLY_PATHS = [LOGIN_PATH, REGISTER_PATH];

/** Pages for everyone, logged in or not. */
const PUBLIC_PATHS = ["/impressum", "/datenschutz"];

function matches(pathname: string, paths: string[]): boolean {
  return paths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

/** Where to send the visitor instead, or `null` if they may see `pathname`. */
export function getAuthRedirect(pathname: string, isLoggedIn: boolean): string | null {
  if (matches(pathname, PUBLIC_PATHS)) return null;
  if (matches(pathname, GUEST_ONLY_PATHS)) return isLoggedIn ? HOME_PATH : null;
  return isLoggedIn ? null : LOGIN_PATH;
}
