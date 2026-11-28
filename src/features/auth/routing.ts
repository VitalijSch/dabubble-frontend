export const SESSION_COOKIE = "dabubble_session";

export const LOGIN_PATH = "/login";
export const HOME_PATH = "/";
export const REGISTER_PATH = "/register";
export const AVATAR_PATH = `${REGISTER_PATH}/avatar`;

const GUEST_ONLY_PATHS = [LOGIN_PATH, REGISTER_PATH];

const PUBLIC_PATHS = ["/impressum", "/datenschutz"];

function isUnderAnyOf(pathname: string, paths: string[]): boolean {
  return paths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function getAuthRedirect(pathname: string, isLoggedIn: boolean): string | null {
  if (isUnderAnyOf(pathname, PUBLIC_PATHS)) return null;
  if (isUnderAnyOf(pathname, GUEST_ONLY_PATHS)) return isLoggedIn ? HOME_PATH : null;
  return isLoggedIn ? null : LOGIN_PATH;
}

export function showsSignUpPrompt(pathname: string): boolean {
  return !isUnderAnyOf(pathname, [REGISTER_PATH]);
}
