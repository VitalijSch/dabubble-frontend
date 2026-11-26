"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { REGISTER_PATH } from "./routing";

/**
 * "Neu bei DABubble? Konto erstellen" in the auth header. Hidden on the sign-up page,
 * where it would link to the page you are on.
 *
 * Client component only for `usePathname`; every auth route is static, so the
 * pathname is known while prerendering and no `<Suspense>` is needed.
 */
export function SignUpPrompt({ linkClassName }: { linkClassName: string }) {
  if (usePathname() === REGISTER_PATH) return null;

  return (
    <div className="flex flex-col items-center gap-2.5 sm:items-end">
      <p className="text-lg leading-[25px]">Neu bei DABubble?</p>
      <Link href={REGISTER_PATH} className={linkClassName}>
        Konto erstellen
      </Link>
    </div>
  );
}
