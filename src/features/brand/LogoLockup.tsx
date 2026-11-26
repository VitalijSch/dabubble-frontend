import type { ComponentProps } from "react";

import { Logo } from "./Logo";
import { LogoName } from "./LogoName";

/**
 * Logo + black "DABubble" wordmark side by side, at the Figma size (242 × 70).
 * The parts are marked `data-brand="logo"` / `data-brand="name"` so the intro can fly onto them.
 */
export function LogoLockup({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div
      role="img"
      aria-label="DABubble"
      className={`flex items-center gap-4 ${className}`}
      {...props}
    >
      <Logo data-brand="logo" className="size-[70px] shrink-0" />
      <LogoName data-brand="name" className="h-6 w-[157px] shrink-0 text-black" />
    </div>
  );
}
