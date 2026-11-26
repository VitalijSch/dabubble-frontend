"use client"; // The final flight measures where the header logo is, which needs the DOM.

import { useEffect, useRef } from "react";

import { Logo, LogoName } from "@/features/brand";

import { flightTransform } from "./flight";
import { hasIntroPlayed, markIntroPlayed, rememberIntroStarted } from "./played";

/** Must match the flight timing in intro.css (2250ms delay, 800ms, same easing). */
const FLIGHT: KeyframeAnimationOptions = {
  delay: 2250,
  duration: 800,
  easing: "cubic-bezier(0.65, 0, 0.35, 1)",
  fill: "both",
};

/**
 * Intro shown on the login page (Figma frame "00-Intro"), once per browser tab (see played.ts).
 *
 * Plays the logo animation (timeline in intro.css), then the logo and wordmark fly to the
 * element marked `data-intro-target` (the auth header's logo) and shrink to its size while
 * the background fades out. Purely decorative, so it is hidden from screen readers.
 * All sizes are percentages of the 696 × 184 design box, so it scales on small screens.
 */
export function IntroScreen() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const nameStripRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Already shown in this tab: intro.css keeps it hidden, nothing to animate.
    if (hasIntroPlayed()) return;
    rememberIntroStarted();

    const overlay = overlayRef.current;
    if (!overlay) return;

    // The CSS animation that ends the intro; the flight below runs on its clock.
    const clock = overlay
      .getAnimations()
      .find((a) => a instanceof CSSAnimation && a.animationName === "intro-hide");
    // Once it is over, coming back to the login page doesn't replay it.
    clock?.finished.then(markIntroPlayed, () => {
      // Cancelled (page left mid-intro): it plays again next time.
    });

    const logo = logoRef.current;
    const nameStrip = nameStripRef.current;
    const name = nameRef.current;
    const target = document.querySelector("[data-intro-target]");
    const targetLogo = target?.querySelector('[data-brand="logo"]');
    const targetName = target?.querySelector('[data-brand="name"]');
    if (!logo || !nameStrip || !name || !targetLogo || !targetName) return;

    const animations = matchMedia("(prefers-reduced-motion: reduce)").matches
      ? [logo, nameStrip].map((el) => el.animate([{ opacity: 1 }, { opacity: 0 }], FLIGHT))
      : [
          logo.animate(
            [
              { transform: "none" },
              {
                transform: flightTransform(
                  logo.getBoundingClientRect(),
                  targetLogo.getBoundingClientRect(),
                ),
              },
            ],
            FLIGHT,
          ),
          nameStrip.animate(
            [
              { transform: "none" },
              {
                transform: flightTransform(
                  nameStrip.getBoundingClientRect(),
                  targetName.getBoundingClientRect(),
                ),
              },
            ],
            FLIGHT,
          ),
          name.animate([{ color: "#fff" }, { color: "#000" }], FLIGHT),
        ];

    // Run on the same clock as the CSS part of the intro, even if this code loads late.
    let cancelled = false;
    void clock?.ready.then(() => {
      if (cancelled) return;
      for (const animation of animations) animation.startTime = clock.startTime;
      overlay.dataset.flight = "ready";
    });

    return () => {
      cancelled = true;
      for (const animation of animations) animation.cancel();
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      data-intro=""
      data-testid="intro"
      className="animate-intro-hide fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
    >
      <div className="animate-intro-bg-out absolute inset-0 bg-[linear-gradient(1.46deg,#313AE6_1.22%,#797EF3_98.76%)]" />
      <div className="relative aspect-[696/184] w-[min(696px,85vw)]">
        {/* The wordmark slides out of this strip, which is clipped at the logo's moving right edge. */}
        <div
          ref={nameStripRef}
          className="animate-intro-reveal absolute top-[33.46%] right-0 bottom-[27.41%] left-[32.18%] overflow-hidden motion-reduce:animate-none"
        >
          <LogoName
            ref={nameRef}
            className="animate-intro-name h-full w-full text-white motion-reduce:animate-none"
          />
        </div>
        <div ref={logoRef} className="absolute inset-y-0 left-0 z-10 w-[26.87%]">
          <Logo className="animate-intro-logo h-full w-full motion-reduce:animate-none" />
        </div>
      </div>
    </div>
  );
}
