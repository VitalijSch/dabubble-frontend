import type { ComponentProps } from "react";

import { Logo } from "./Logo";
import { LogoName } from "./LogoName";

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
