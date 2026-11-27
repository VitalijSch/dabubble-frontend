/**
 * Avatar images from Figma, served from public/avatars/. PNG, because the backend does not
 * accept SVG; rendered from the Figma SVGs at a higher resolution so they stay sharp.
 *
 * - avatar_0.png: "81. Profile", the 168 px placeholder shown until an avatar is chosen
 *   (504 × 504, 3×).
 * - avatar_1–6.png: the avatars a new user can choose from ("00c.Charaters"), 432 × 432 (6×
 *   the Figma 72 px frame): the round character with transparent padding of 1/18 of the
 *   width around it (4 px at 72 px).
 *
 * The id is what gets stored for the user once sign-up talks to a backend.
 */
export const DEFAULT_AVATAR_SRC = "/avatars/avatar_0.png";

export const AVATARS = [
  { id: "avatar_1", src: "/avatars/avatar_1.png" },
  { id: "avatar_2", src: "/avatars/avatar_2.png" },
  { id: "avatar_3", src: "/avatars/avatar_3.png" },
  { id: "avatar_4", src: "/avatars/avatar_4.png" },
  { id: "avatar_5", src: "/avatars/avatar_5.png" },
  { id: "avatar_6", src: "/avatars/avatar_6.png" },
] as const;

export type AvatarId = (typeof AVATARS)[number]["id"];
