import Link from "next/link";
import type { ReactNode } from "react";

import { LogoLockup } from "@/features/brand";

import { SignUpPrompt } from "./SignUpPrompt";

const TEXT_LINK =
  "font-figtree text-purple-2 hover:text-purple-1 focus-visible:outline-purple-1 rounded-full px-[15px] py-2.5 text-lg leading-[1.2] transition-colors focus-visible:outline-2";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-surface grid min-h-dvh grid-rows-[1fr_auto_1fr] text-black">
      <header className="flex flex-col items-center gap-6 self-start px-6 pt-6 sm:flex-row sm:items-start sm:justify-between md:px-[75px] md:pt-[75px]">
        <LogoLockup data-intro-target="" />
        <SignUpPrompt linkClassName={`${TEXT_LINK} sm:-mr-2.5`} />
      </header>

      <main className="flex justify-center px-4 py-6">{children}</main>

      <footer className="self-end pb-6 md:pb-12">
        <nav aria-label="Rechtliches" className="flex justify-center gap-4">
          <Link href="/impressum" className={TEXT_LINK}>
            Impressum
          </Link>
          <Link href="/datenschutz" className={TEXT_LINK}>
            Datenschutz
          </Link>
        </nav>
      </footer>
    </div>
  );
}
