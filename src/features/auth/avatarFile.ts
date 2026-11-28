const EXTENSIONS_THE_BACKEND_ACCEPTS = ["jpg", "jpeg", "png", "webp"] as const;
const MIME_TYPES_THE_BACKEND_ACCEPTS = ["image/jpeg", "image/png", "image/webp"] as const;

const BYTES_PER_MEGABYTE = 1024 * 1024;

export const BACKEND_AVATAR_MAX_BYTES = 2 * BYTES_PER_MEGABYTE;

export const AVATAR_ACCEPT = [
  ...EXTENSIONS_THE_BACKEND_ACCEPTS.map((extension) => `.${extension}`),
  ...MIME_TYPES_THE_BACKEND_ACCEPTS,
].join(",");

export const AVATAR_MAX_MEGABYTES = BACKEND_AVATAR_MAX_BYTES / BYTES_PER_MEGABYTE;

export const AVATAR_TOO_LARGE = `Das Bild ist zu groß (max. ${AVATAR_MAX_MEGABYTES} MB).`;

export const AVATAR_WRONG_FORMAT = "Bitte wähle ein Bild im Format JPG, PNG oder WEBP.";

export function checkAvatarFile(file: File): string | undefined {
  if (!hasAllowedExtension(file.name)) return AVATAR_WRONG_FORMAT;
  if (file.size > BACKEND_AVATAR_MAX_BYTES) return AVATAR_TOO_LARGE;
  return undefined;
}

function hasAllowedExtension(fileName: string): boolean {
  return (EXTENSIONS_THE_BACKEND_ACCEPTS as readonly string[]).includes(extensionOf(fileName));
}

function extensionOf(fileName: string): string {
  const lastDot = fileName.lastIndexOf(".");
  const hasExtension = lastDot > 0;
  return hasExtension ? fileName.slice(lastDot + 1).toLowerCase() : "";
}
