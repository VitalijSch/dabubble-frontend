"use client";

import { type FormEvent, useEffect, useState, useTransition } from "react";

import { api } from "@/lib/api";

import { AvatarList } from "./AvatarList";
import { AvatarPreview } from "./AvatarPreview";
import type { AvatarChoice } from "./avatars";
import { AvatarUpload } from "./AvatarUpload";
import { primaryButton } from "./buttons";
import type { RegisterDetails } from "./signUpChecks";
import { type AvatarPick, createAccount } from "./signUpRequests";

export function AvatarPicker({
  details,
  onCreated,
}: {
  details: RegisterDetails;
  onCreated: (confirmationSentTo: string) => void;
}) {
  const [choice, setChoice] = useState<AvatarChoice>(null);
  const [uploadError, setUploadError] = useState<string>();
  const [formError, setFormError] = useState<string>();
  const [isCreatingAccount, startTransition] = useTransition();
  useReleasePreviewMemoryWhenReplaced(choice?.kind === "upload" ? choice.previewUrl : undefined);

  function choose(next: AvatarChoice) {
    setUploadError(undefined);
    setFormError(undefined);
    setChoice(next);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!choice || isCreatingAccount) return;
    const avatar = toAvatarPick(choice);
    startTransition(async () => {
      const result = await createAccount(api, details, avatar);
      startTransition(() => {
        if (result.ok) {
          onCreated(result.confirmationSentTo);
        } else {
          setUploadError(result.avatarError);
          setFormError(result.formError);
        }
      });
    });
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className="mx-auto mt-14 flex max-w-[472px] flex-col items-center gap-8">
        <AvatarUpload
          error={uploadError}
          onError={setUploadError}
          onFile={(file) => choose({ kind: "upload", file, previewUrl: URL.createObjectURL(file) })}
        >
          <AvatarPreview choice={choice} />
        </AvatarUpload>

        <div className="flex w-full flex-col gap-2">
          <p className="text-center text-[32px] leading-[44px] font-bold break-words">
            {details.full_name}
          </p>
          <AvatarList
            chosenId={choice?.kind === "built-in" ? choice.id : undefined}
            onChoose={(id) => choose({ kind: "built-in", id })}
          />
        </div>
      </div>

      <p
        role="alert"
        className="text-error my-[11px] flex min-h-10 items-center text-sm leading-[19px]"
      >
        {formError}
      </p>

      <div className="flex justify-end">
        <button type="submit" disabled={!choice || isCreatingAccount} className={primaryButton}>
          Weiter
        </button>
      </div>
    </form>
  );
}

function toAvatarPick(choice: NonNullable<AvatarChoice>): AvatarPick {
  return choice.kind === "upload" ? { avatar: choice.file } : { default_avatar: choice.id };
}

function useReleasePreviewMemoryWhenReplaced(previewUrl: string | undefined) {
  useEffect(() => {
    if (previewUrl) return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);
}
