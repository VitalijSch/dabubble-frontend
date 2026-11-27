"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { REGISTER_PATH, showsSignUpPrompt } from "./routing";

/**
 * "Neu bei DABubble? Konto erstellen" in the auth header. Hidden while signing up
 * (sign-up card, choose avatar), where it would link back to the start.
 *
 * Client component only for `usePathname`; every auth route is static, so the
 * pathname is known while prerendering and no `<Suspense>` is needed.
 */
export function SignUpPrompt({ linkClassName }: { linkClassName: string }) {
  if (!showsSignUpPrompt(usePathname())) return null;

  return (
    <div className="flex flex-col items-center gap-2.5 sm:items-end">
      <p className="text-lg leading-[25px]">Neu bei DABubble?</p>
      <Link href={REGISTER_PATH} className={linkClassName}>
        Konto erstellen
      </Link>
    </div>
  );
}
