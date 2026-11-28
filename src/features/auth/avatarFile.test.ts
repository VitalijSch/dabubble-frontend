import { describe, expect, it } from "vitest";

import {
  AVATAR_ACCEPT,
  BACKEND_AVATAR_MAX_BYTES,
  AVATAR_TOO_LARGE,
  AVATAR_WRONG_FORMAT,
  checkAvatarFile,
} from "./avatarFile";

function file(name: string, bytes: number, type = "image/png"): File {
  return new File([new Uint8Array(bytes)], name, { type });
}

describe("checkAvatarFile", () => {
  it.each(["me.jpg", "me.jpeg", "me.png", "me.webp", "ME.PNG", "my.photo.JPeG"])(
    "accepts %s",
    (name) => {
      expect(checkAvatarFile(file(name, 1000))).toBeUndefined();
    },
  );

  it.each(["me.gif", "me.svg", "me.heic", "me.png.exe", "png", "me"])("rejects %s", (name) => {
    expect(checkAvatarFile(file(name, 1000))).toBe(AVATAR_WRONG_FORMAT);
  });

  it("accepts an image of exactly 2 MB and rejects one byte more", () => {
    expect(BACKEND_AVATAR_MAX_BYTES).toBe(2 * 1024 * 1024);
    expect(checkAvatarFile(file("me.png", BACKEND_AVATAR_MAX_BYTES))).toBeUndefined();
    expect(checkAvatarFile(file("me.png", BACKEND_AVATAR_MAX_BYTES + 1))).toBe(AVATAR_TOO_LARGE);
  });

  it("uses the backend's wording for a file that is too large", () => {
    expect(AVATAR_TOO_LARGE).toBe("Das Bild ist zu groß (max. 2 MB).");
  });

  it("reports the wrong format before the size", () => {
    expect(checkAvatarFile(file("me.gif", BACKEND_AVATAR_MAX_BYTES + 1))).toBe(AVATAR_WRONG_FORMAT);
  });
});

describe("AVATAR_ACCEPT", () => {
  it("lets the file picker offer only the formats the backend takes", () => {
    expect(AVATAR_ACCEPT.split(",")).toEqual([
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
      "image/jpeg",
      "image/png",
      "image/webp",
    ]);
  });
});
