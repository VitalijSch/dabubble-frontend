import Link from "next/link";
import type { ReactNode } from "react";

import { LogoLockup } from "@/features/brand";

/** Text link style shared by the header and footer (Figma component "8. Sign up"). */
const textLink =
  "font-figtree text-purple-2 hover:text-purple-1 focus-visible:outline-purple-1 rounded-full px-[15px] py-2.5 text-lg leading-[1.2] transition-colors focus-visible:outline-2";

/**
 * Frame shared by every auth page (login, sign-up, choose avatar, reset password, …):
 * logo top left, "Neu bei DABubble?" top right, legal links at the bottom.
 * The page's card goes in the middle.
 *
 * The outer rows share the leftover height equally, so the card sits in the exact
 * centre of the viewport (as in Figma); on short screens they shrink to their content
 * and push the card down instead of overlapping it.
 */
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-surface grid min-h-dvh grid-rows-[1fr_auto_1fr] text-black">
      <header className="flex flex-col items-center gap-6 self-start px-6 pt-6 sm:flex-row sm:items-start sm:justify-between md:px-[75px] md:pt-[75px]">
        {/* The intro on the login page flies its logo onto this one. */}
        <LogoLockup data-intro-target="" />
        <div className="flex flex-col items-center gap-2.5 sm:items-end">
          <p className="text-lg leading-[25px]">Neu bei DABubble?</p>
          <Link href="/register" className={`${textLink} sm:-mr-2.5`}>
            Konto erstellen
          </Link>
        </div>
      </header>

      <main className="flex justify-center px-4 py-6">{children}</main>

      <footer className="self-end pb-6 md:pb-12">
        <nav aria-label="Rechtliches" className="flex justify-center gap-4">
          <Link href="/impressum" className={textLink}>
            Impressum
          </Link>
          <Link href="/datenschutz" className={textLink}>
            Datenschutz
          </Link>
        </nav>
      </footer>
    </div>
  );
}
