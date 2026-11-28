import Link from "next/link";

import { CheckBoxBlankIcon, CheckBoxIcon } from "./icons";

export function PrivacyCheckbox({ hasError, messageId }: { hasError: boolean; messageId: string }) {
  return (
    <label className="group font-open-sans text-menu flex cursor-pointer items-center gap-2 leading-[1.2]">
      <span data-testid="privacy-box" className="relative size-6 shrink-0">
        <input
          type="checkbox"
          name="privacy"
          className="peer sr-only"
          aria-invalid={hasError ? true : undefined}
          aria-describedby={hasError ? messageId : undefined}
        />
        <span
          aria-hidden="true"
          className="group-hover:bg-surface group-active:bg-line/40 peer-focus-visible:outline-purple-1 absolute -inset-2 rounded-full transition-colors group-has-[a:hover]:bg-transparent peer-focus-visible:outline-2"
        />
        <CheckBoxBlankIcon className={`${squareColour(hasError)} peer-checked:hidden`} />
        <CheckBoxIcon className={`${squareColour(false)} hidden peer-checked:block`} />
      </span>
      <span>
        Ich stimme der{" "}
        <Link
          href="/datenschutz"
          className="font-figtree text-purple-2 hover:text-purple-1 focus-visible:outline-purple-1 rounded-full py-[5px] text-lg leading-[1.2] transition-colors focus-visible:outline-2"
        >
          Datenschutzerklärung
        </Link>{" "}
        zu.
      </span>
    </label>
  );
}

function squareColour(hasError: boolean): string {
  const colour = hasError
    ? "text-error"
    : "text-purple-2 group-hover:text-purple-1 group-has-[a:hover]:text-purple-2";
  return `${colour} relative size-6 transition-colors`;
}
