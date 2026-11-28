import Link from "next/link";
import type { ReactNode } from "react";

import { ArrowBackIcon } from "./icons";

type AuthCardProps = {
  title: string;
  description?: ReactNode;
  backHref?: string;
  children: ReactNode;
};

export function AuthCard({ title, description, backHref, children }: AuthCardProps) {
  return (
    <section
      aria-labelledby="auth-card-title"
      className="relative w-full max-w-[606px] rounded-[30px] bg-white px-6 py-10 shadow-[0_2px_10px_rgba(0,0,0,0.08)] sm:px-[53px]"
    >
      {backHref && (
        <Link
          href={backHref}
          aria-label="Zurück"
          className="hover:bg-surface hover:text-purple-1 focus-visible:outline-purple-1 absolute top-[38px] left-3 flex size-10 items-center justify-center rounded-full text-black transition-colors focus-visible:outline-2 sm:top-[45px] sm:left-8"
        >
          <ArrowBackIcon className="size-6" />
        </Link>
      )}

      <header className="flex flex-col gap-8 text-center sm:px-[14px]">
        <h1
          id="auth-card-title"
          className="text-purple-1 px-8 text-[30px] leading-[1.2] font-bold sm:px-0 sm:text-[46px]"
        >
          {title}
        </h1>
        {description && <p className="text-xl leading-[1.2]">{description}</p>}
      </header>

      <div className={description ? "mt-[41px]" : undefined}>{children}</div>
    </section>
  );
}
