export const PLACEHOLDER_AVATAR_SRC = "/avatars/avatar_0.png";

export const AVATARS = [
  { id: "avatar_1", src: "/avatars/avatar_1.png" },
  { id: "avatar_2", src: "/avatars/avatar_2.png" },
  { id: "avatar_3", src: "/avatars/avatar_3.png" },
  { id: "avatar_4", src: "/avatars/avatar_4.png" },
  { id: "avatar_5", src: "/avatars/avatar_5.png" },
  { id: "avatar_6", src: "/avatars/avatar_6.png" },
] as const;

export type AvatarId = (typeof AVATARS)[number]["id"];

export type AvatarChoice =
  { kind: "built-in"; id: AvatarId } | { kind: "upload"; file: File; previewUrl: string } | null;
