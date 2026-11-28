"use client";

import { type RefObject, useEffect, useRef } from "react";

import { Logo, LogoName } from "@/features/brand";

import { flightTransform } from "./flight";
import { hasIntroPlayed, markIntroPlayed, rememberIntroStarted } from "./played";

const FLIGHT_TIMING_SAME_AS_INTRO_CSS: KeyframeAnimationOptions = {
  delay: 2250,
  duration: 800,
  easing: "cubic-bezier(0.65, 0, 0.35, 1)",
  fill: "both",
};

const INTRO_CLOCK_ANIMATION_NAME = "intro-hide";

type IntroRefs = {
  overlay: RefObject<HTMLDivElement | null>;
  logo: RefObject<HTMLDivElement | null>;
  nameStrip: RefObject<HTMLDivElement | null>;
  name: RefObject<SVGSVGElement | null>;
};

export function IntroScreen() {
  const overlay = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLDivElement>(null);
  const nameStrip = useRef<HTMLDivElement>(null);
  const name = useRef<SVGSVGElement>(null);
  usePlayIntroOnce({ overlay, logo, nameStrip, name });

  return (
    <div
      ref={overlay}
      aria-hidden="true"
      data-intro=""
      data-testid="intro"
      className="animate-intro-hide fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
    >
      <div className="animate-intro-bg-out absolute inset-0 bg-[linear-gradient(1.46deg,#313AE6_1.22%,#797EF3_98.76%)]" />
      <div className="relative aspect-[696/184] w-[min(696px,85vw)]">
        <div
          ref={nameStrip}
          className="animate-intro-reveal absolute top-[33.46%] right-0 bottom-[27.41%] left-[32.18%] overflow-hidden motion-reduce:animate-none"
        >
          <LogoName
            ref={name}
            className="animate-intro-name h-full w-full text-white motion-reduce:animate-none"
          />
        </div>
        <div ref={logo} className="absolute inset-y-0 left-0 z-10 w-[26.87%]">
          <Logo className="animate-intro-logo h-full w-full motion-reduce:animate-none" />
        </div>
      </div>
    </div>
  );
}

function usePlayIntroOnce({ overlay: overlayRef, logo, nameStrip, name }: IntroRefs) {
  useEffect(() => {
    if (hasIntroPlayed()) return;
    rememberIntroStarted();

    const overlay = overlayRef.current;
    if (!overlay) return;
    const clock = findIntroClock(overlay);
    markPlayedWhenOver(clock);

    const parts = findFlightParts({ logo, nameStrip, name });
    if (!parts) return;
    const flight = flyToHeaderLogo(parts);
    return startOnIntroClockAndReturnStop(flight, clock, overlay);
  }, [overlayRef, logo, nameStrip, name]);
}

function findIntroClock(overlay: HTMLElement): Animation | undefined {
  return overlay
    .getAnimations()
    .find(
      (animation) =>
        animation instanceof CSSAnimation && animation.animationName === INTRO_CLOCK_ANIMATION_NAME,
    );
}

function markPlayedWhenOver(clock: Animation | undefined) {
  clock?.finished.then(markIntroPlayed, () => {});
}

type FlightParts = {
  logo: HTMLElement;
  nameStrip: HTMLElement;
  name: SVGSVGElement;
  headerLogo: Element;
  headerName: Element;
};

function findFlightParts(refs: Omit<IntroRefs, "overlay">): FlightParts | null {
  const header = document.querySelector("[data-intro-target]");
  const parts = {
    logo: refs.logo.current,
    nameStrip: refs.nameStrip.current,
    name: refs.name.current,
    headerLogo: header?.querySelector('[data-brand="logo"]'),
    headerName: header?.querySelector('[data-brand="name"]'),
  };
  const allFound = Object.values(parts).every(Boolean);
  return allFound ? (parts as FlightParts) : null;
}

function flyToHeaderLogo(parts: FlightParts): Animation[] {
  if (prefersReducedMotion()) return [fadeOut(parts.logo), fadeOut(parts.nameStrip)];
  return [
    flyOnto(parts.logo, parts.headerLogo),
    flyOnto(parts.nameStrip, parts.headerName),
    parts.name.animate([{ color: "#fff" }, { color: "#000" }], FLIGHT_TIMING_SAME_AS_INTRO_CSS),
  ];
}

function flyOnto(element: Element, target: Element): Animation {
  const landing = flightTransform(element.getBoundingClientRect(), target.getBoundingClientRect());
  return element.animate(
    [{ transform: "none" }, { transform: landing }],
    FLIGHT_TIMING_SAME_AS_INTRO_CSS,
  );
}

function fadeOut(element: Element): Animation {
  return element.animate([{ opacity: 1 }, { opacity: 0 }], FLIGHT_TIMING_SAME_AS_INTRO_CSS);
}

function prefersReducedMotion(): boolean {
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function startOnIntroClockAndReturnStop(
  flight: Animation[],
  clock: Animation | undefined,
  overlay: HTMLElement,
) {
  let isStopped = false;
  void clock?.ready.then(() => {
    if (isStopped) return;
    for (const animation of flight) animation.startTime = clock.startTime;
    announceFlightIsReady(overlay);
  });
  return () => {
    isStopped = true;
    for (const animation of flight) animation.cancel();
  };
}

function announceFlightIsReady(overlay: HTMLElement) {
  overlay.dataset.flight = "ready";
}
