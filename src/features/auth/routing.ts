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
/** Second sign-up step, after the "Konto erstellen" card. */
export const AVATAR_PATH = `${REGISTER_PATH}/avatar`;

/** Pages only for logged-out users (sub-paths included). Add reset password … as it is built. */
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

/**
 * Whether the auth header offers "Neu bei DABubble? Konto erstellen". Not while signing
 * up (the sign-up card and the steps after it), where it would point back at the start.
 */
export function showsSignUpPrompt(pathname: string): boolean {
  return !matches(pathname, [REGISTER_PATH]);
}
