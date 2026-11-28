import Image from "next/image";

import { type AvatarChoice, type AvatarId, AVATARS, PLACEHOLDER_AVATAR_SRC } from "./avatars";

const PREVIEW_SIZE = 168;
const ZOOM_PAST_TRANSPARENT_PADDING = 72 / 64;
const ZOOMED_AVATAR_SIZE = PREVIEW_SIZE * ZOOM_PAST_TRANSPARENT_PADDING;

export function AvatarPreview({ choice }: { choice: AvatarChoice }) {
  if (choice?.kind === "upload") return <UploadedPicture url={choice.previewUrl} />;
  if (choice?.kind === "built-in")
    return <ChosenAvatarFillingTheCircle src={avatarSrc(choice.id)} />;
  return (
    <Image
      src={PLACEHOLDER_AVATAR_SRC}
      alt="Noch kein Avatar gewählt"
      width={PREVIEW_SIZE}
      height={PREVIEW_SIZE}
      className="size-[168px]"
    />
  );
}

function UploadedPicture({ url }: { url: string }) {
  return (
    <Image
      src={url}
      alt="Hochgeladenes Bild"
      width={PREVIEW_SIZE}
      height={PREVIEW_SIZE}
      className="size-[168px] rounded-full object-cover"
    />
  );
}

function ChosenAvatarFillingTheCircle({ src }: { src: string }) {
  return (
    <div className="size-[168px] overflow-hidden rounded-full">
      <Image
        src={src}
        alt="Gewählter Avatar"
        width={ZOOMED_AVATAR_SIZE}
        height={ZOOMED_AVATAR_SIZE}
        className="-m-[10.5px] size-[189px] max-w-none"
      />
    </div>
  );
}

function avatarSrc(id: AvatarId): string {
  return AVATARS.find((avatar) => avatar.id === id)?.src ?? PLACEHOLDER_AVATAR_SRC;
}
