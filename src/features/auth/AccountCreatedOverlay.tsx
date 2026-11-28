"use client";

import { type RefObject, useLayoutEffect, useRef } from "react";

const BACKGROUND_FADE_MS = 300;
const SLIDE_IN_MS = 1000;
const READING_TIME_MS = 2700;
const EASE_OUT_CUBIC = "cubic-bezier(0.33, 1, 0.68, 1)";

export const CONFIRMATION_BOX_VISIBLE_MS = BACKGROUND_FADE_MS + SLIDE_IN_MS + READING_TIME_MS;

const SLIDE_IN_AFTER_BACKGROUND_FADE: KeyframeAnimationOptions = {
  delay: BACKGROUND_FADE_MS,
  duration: SLIDE_IN_MS,
  easing: EASE_OUT_CUBIC,
  fill: "both",
};

const FULL_WIDTH_ON_PHONES = "right-4 bottom-4 left-4";
const IN_BOTTOM_RIGHT_CORNER = "sm:left-auto sm:w-[360px] md:right-[50px] md:bottom-[50px]";
const CENTRED_BETWEEN_CARD_AND_RIGHT_EDGE =
  "2xl:right-auto 2xl:left-[calc(75%+151.5px)] 2xl:-translate-x-1/2";

export function AccountCreatedOverlay({ email }: { email: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  useSlideInFromBeyondRightEdge(boxRef);

  return (
    <div className="bg-surface/60 motion-safe:animate-overlay-fade fixed inset-0 z-50 overflow-hidden">
      <div
        ref={boxRef}
        role="status"
        className={`bg-purple-1 absolute flex flex-col gap-2 rounded-[30px_30px_0_30px] p-8 text-white shadow-[0_6px_10px_rgba(0,0,0,0.2)] ${FULL_WIDTH_ON_PHONES} ${IN_BOTTOM_RIGHT_CORNER} ${CENTRED_BETWEEN_CARD_AND_RIGHT_EDGE}`}
      >
        <p className="text-[26px] leading-[1.3] font-bold">Prüfe dein Postfach!</p>
        <p className="text-base leading-[1.4] break-words">
          Wir haben dir eine E-Mail an <span className="font-bold">{email}</span> geschickt.
          Bestätige darin deine Adresse, dann kannst du dich anmelden.
        </p>
      </div>
    </div>
  );
}

function useSlideInFromBeyondRightEdge(boxRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box || prefersReducedMotion()) return;
    const distanceToRightEdge = window.innerWidth - box.getBoundingClientRect().left;
    const slide = box.animate(
      [{ transform: `translateX(${distanceToRightEdge}px)` }, { transform: "none" }],
      SLIDE_IN_AFTER_BACKGROUND_FADE,
    );
    return () => slide.cancel();
  }, [boxRef]);
}

function prefersReducedMotion(): boolean {
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}
