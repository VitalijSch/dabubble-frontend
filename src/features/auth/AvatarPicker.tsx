"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { type AvatarId, AVATARS, DEFAULT_AVATAR_SRC } from "./avatars";
import { AvatarUpload } from "./AvatarUpload";
import { primaryButton } from "./buttons";

/** Either one of the built-in avatars or a picture the user uploaded (shown from a blob URL). */
type AvatarChoice =
  { kind: "default"; id: AvatarId } | { kind: "upload"; file: File; url: string } | null;

/**
 * Body of the "Wähle deinen Avatar" card (Figma "82. Choose avatar component"): the big
 * preview, the user's name and the six avatars to pick from. Clicking the preview uploads an
 * own picture instead. The preview shows the pick; "Weiter" stays disabled until there is one.
 * UI only: submitting does nothing yet.
 */
export function AvatarPicker({ name }: { name: string }) {
  const [choice, setChoice] = useState<AvatarChoice>(null);
  const [uploadError, setUploadError] = useState<string>();
  const avatar = choice?.kind === "default" ? AVATARS.find((a) => a.id === choice.id) : undefined;
  const uploadUrl = choice?.kind === "upload" ? choice.url : undefined;

  // Free the uploaded picture's memory once another one replaces it or the card goes away.
  useEffect(() => {
    if (uploadUrl) return () => URL.revokeObjectURL(uploadUrl);
  }, [uploadUrl]);

  return (
    <form noValidate onSubmit={(event) => event.preventDefault()}>
      {/* Figma: 472 px wide, centred in the card 151 px from the top (title ends at 95). */}
      <div className="mx-auto mt-14 flex max-w-[472px] flex-col items-center gap-8">
        <AvatarUpload
          error={uploadError}
          onError={setUploadError}
          onFile={(file) => {
            setUploadError(undefined);
            setChoice({ kind: "upload", file, url: URL.createObjectURL(file) });
          }}
        >
          {uploadUrl ? (
            <Image
              src={uploadUrl}
              alt="Hochgeladenes Bild"
              width={168}
              height={168}
              className="size-[168px] rounded-full object-cover"
            />
          ) : avatar ? (
            // The avatar files have 4 px padding around the 64 px character. Scale the file so
            // the character fills the 168 px circle (72/64 × 168 = 189) and cut the padding off.
            <div className="size-[168px] overflow-hidden rounded-full">
              <Image
                src={avatar.src}
                alt="Gewählter Avatar"
                width={189}
                height={189}
                className="-m-[10.5px] size-[189px] max-w-none"
              />
            </div>
          ) : (
            <Image
              src={DEFAULT_AVATAR_SRC}
              alt="Noch kein Avatar gewählt"
              width={168}
              height={168}
              className="size-[168px]"
            />
          )}
        </AvatarUpload>

        {/* Figma "Frame 203": name, 8 px, "Aus der Liste wählen", 16 px, the avatars. */}
        <div className="flex w-full flex-col gap-2">
          <p className="text-center text-[32px] leading-[44px] font-bold break-words">{name}</p>
          <fieldset>
            <legend className="text-xl leading-[27px]">Aus der Liste wählen</legend>
            <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
              {AVATARS.map((a, index) => (
                // Figma "80. avatar interaction": the 72 px file is the hit area; its 4 px
                // padding around the 64 px character tints on hover and when picked.
                <label
                  key={a.id}
                  className="group hover:bg-surface has-checked:bg-surface has-focus-visible:outline-purple-1 relative size-[72px] cursor-pointer rounded-full transition-colors has-focus-visible:outline-2"
                >
                  <input
                    type="radio"
                    name="avatar"
                    value={a.id}
                    checked={choice?.kind === "default" && choice.id === a.id}
                    onChange={() => {
                      setUploadError(undefined);
                      setChoice({ kind: "default", id: a.id });
                    }}
                    className="peer sr-only"
                  />
                  <Image
                    src={a.src}
                    alt={`Avatar ${index + 1}`}
                    width={72}
                    height={72}
                    className="size-[72px]"
                  />
                  {/* Ring on the edge of the character: Light purple on hover, Purple 1 when picked. */}
                  <span
                    aria-hidden="true"
                    className="group-hover:ring-line peer-checked:ring-purple-1! pointer-events-none absolute inset-1 rounded-full ring-2 ring-transparent transition-shadow"
                  />
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      <div className="mt-[62px] flex justify-end">
        <button type="submit" disabled={!choice} className={primaryButton}>
          Weiter
        </button>
      </div>
    </form>
  );
}
