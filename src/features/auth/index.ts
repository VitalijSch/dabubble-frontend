/**
 * Public API of the auth feature: login, sign-up, avatar choice, password reset.
 * Other code imports from "@/features/auth" only — never from files inside this folder.
 */
export { AuthLayout } from "./AuthLayout";
export { getAuthRedirect, HOME_PATH, LOGIN_PATH, SESSION_COOKIE } from "./routing";
