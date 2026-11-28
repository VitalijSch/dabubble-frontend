import Image from "next/image";

import { type AvatarId, AVATARS } from "./avatars";

const AVATAR_SIZE = 72;

export function AvatarList({
  chosenId,
  onChoose,
}: {
  chosenId: AvatarId | undefined;
  onChoose: (id: AvatarId) => void;
}) {
  return (
    <fieldset>
      <legend className="text-xl leading-[27px]">Aus der Liste wählen</legend>
      <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
        {AVATARS.map((avatar, index) => (
          <label
            key={avatar.id}
            className="group hover:bg-surface has-checked:bg-surface has-focus-visible:outline-purple-1 relative size-[72px] cursor-pointer rounded-full transition-colors has-focus-visible:outline-2"
          >
            <input
              type="radio"
              name="avatar"
              value={avatar.id}
              checked={chosenId === avatar.id}
              onChange={() => onChoose(avatar.id)}
              className="peer sr-only"
            />
            <Image
              src={avatar.src}
              alt={`Avatar ${index + 1}`}
              width={AVATAR_SIZE}
              height={AVATAR_SIZE}
              className="size-[72px]"
            />
            <RingWhenHoveredOrChosen />
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function RingWhenHoveredOrChosen() {
  return (
    <span
      aria-hidden="true"
      className="group-hover:ring-line peer-checked:ring-purple-1! pointer-events-none absolute inset-1 rounded-full ring-2 ring-transparent transition-shadow"
    />
  );
}
