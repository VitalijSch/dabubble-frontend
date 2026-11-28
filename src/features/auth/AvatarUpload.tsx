"use client";

import { type ChangeEvent, type ReactNode, useId } from "react";

import { AVATAR_ACCEPT, AVATAR_MAX_MEGABYTES, checkAvatarFile } from "./avatarFile";
import { AddPhotoIcon } from "./icons";

export function AvatarUpload({
  children,
  error,
  onFile,
  onError,
}: {
  children: ReactNode;
  error: string | undefined;
  onFile: (file: File) => void;
  onError: (message: string) => void;
}) {
  const hintId = useId();
  const errorId = useId();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    allowPickingTheSameFileAgain(event.target);
    if (!file) return;
    const problem = checkAvatarFile(file);
    if (problem) onError(problem);
    else onFile(file);
  }

  return (
    <div className="flex flex-col items-center">
      <label className="group has-focus-visible:outline-purple-1 relative size-[168px] cursor-pointer rounded-full has-focus-visible:outline-2 has-focus-visible:outline-offset-4">
        <input
          type="file"
          accept={AVATAR_ACCEPT}
          aria-label="Eigenes Bild hochladen"
          aria-describedby={error ? `${hintId} ${errorId}` : hintId}
          aria-invalid={error ? true : undefined}
          onChange={handleChange}
          className="sr-only"
        />
        {children}
        <UploadHintOnHover hintId={hintId} />
        <UploadBadgeAlsoVisibleOnPhones />
      </label>

      {error && (
        <p id={errorId} role="alert" className="text-error mt-3 text-center text-sm">
          {error}
        </p>
      )}
    </div>
  );
}

function allowPickingTheSameFileAgain(input: HTMLInputElement) {
  input.value = "";
}

function UploadHintOnHover({ hintId }: { hintId: string }) {
  return (
    <span className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-full bg-black/50 text-center text-white opacity-0 transition-opacity group-hover:opacity-100 group-has-focus-visible:opacity-100">
      <AddPhotoIcon className="size-8" />
      <span className="text-base leading-5 font-bold">Bild hochladen</span>
      <span id={hintId} className="text-xs leading-4">
        JPG, PNG oder WEBP
        <br />
        max. {AVATAR_MAX_MEGABYTES} MB
      </span>
    </span>
  );
}

function UploadBadgeAlsoVisibleOnPhones() {
  return (
    <span
      aria-hidden="true"
      className="bg-purple-1 group-hover:bg-purple-2 pointer-events-none absolute right-1 bottom-1 flex size-11 items-center justify-center rounded-full text-white shadow-md ring-4 ring-white transition-colors"
    >
      <AddPhotoIcon className="size-6" />
    </span>
  );
}
