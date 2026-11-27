/**
 * Public API of the auth feature: login, sign-up, avatar choice, password reset.
 * Other code imports from "@/features/auth" only — never from files inside this folder.
 */
export { AuthCard } from "./AuthCard";
export { AuthLayout } from "./AuthLayout";
export { AVATARS, type AvatarId } from "./avatars";
export { AvatarStep } from "./AvatarStep";
export {
  AVATAR_PATH,
  getAuthRedirect,
  HOME_PATH,
  LOGIN_PATH,
  REGISTER_PATH,
  SESSION_COOKIE,
} from "./routing";
export { SignUpProvider } from "./SignUpContext";
export { SignUpForm } from "./SignUpForm";
