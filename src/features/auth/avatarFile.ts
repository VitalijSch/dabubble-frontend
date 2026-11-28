/**
 * What the backend accepts as an uploaded avatar (dabubble-backend: `AVATAR_EXTENSIONS` in
 * apps/users/models.py, `AVATAR_MAX_UPLOAD_SIZE` in config/settings/base.py). The OpenAPI
 * contract only carries the extensions, so keep the size in step with the backend by hand.
 *
 * Only a convenience, so the user hears about a wrong file at once: the backend checks again
 * (and also that the file really is an image) when the account is created.
 */
const EXTENSIONS = ["jpg", "jpeg", "png", "webp"] as const;
const MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export const AVATAR_MAX_BYTES = 2 * 1024 * 1024;

/** For the file input's `accept`: the file picker then offers only these formats. */
export const AVATAR_ACCEPT = [...EXTENSIONS.map((e) => `.${e}`), ...MIME_TYPES].join(",");

/** The backend's own message, so it reads the same whichever side catches it. */
export const AVATAR_TOO_LARGE = `Das Bild ist zu groß (max. ${AVATAR_MAX_BYTES / (1024 * 1024)} MB).`;

export const AVATAR_WRONG_FORMAT = "Bitte wähle ein Bild im Format JPG, PNG oder WEBP.";

/** The message for a picked file, or `undefined` if it may be sent. Checks like the backend: by extension. */
export function checkAvatarFile(file: File): string | undefined {
  const dot = file.name.lastIndexOf(".");
  const extension = dot > 0 ? file.name.slice(dot + 1).toLowerCase() : "";
  if (!(EXTENSIONS as readonly string[]).includes(extension)) return AVATAR_WRONG_FORMAT;
  if (file.size > AVATAR_MAX_BYTES) return AVATAR_TOO_LARGE;
  return undefined;
}
