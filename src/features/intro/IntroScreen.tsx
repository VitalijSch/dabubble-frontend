import { Logo, LogoName } from "@/features/brand";

/**
 * Intro shown when the app starts (Figma frame "00-Intro").
 *
 * Covers the page, plays the logo animation (timeline in intro.css)
 * and then fades out. Purely decorative, so it is hidden from screen readers.
 * All sizes are percentages of the 696 × 184 design box, so it scales on small screens.
 */
export function IntroScreen() {
  return (
    <div
      aria-hidden="true"
      data-testid="intro"
      className="animate-intro-out fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[linear-gradient(1.46deg,#313AE6_1.22%,#797EF3_98.76%)]"
    >
      <div className="relative aspect-[696/184] w-[min(696px,85vw)]">
        {/* The wordmark slides out of this strip, which is clipped at the logo's moving right edge. */}
        <div className="animate-intro-reveal absolute top-[33.46%] right-0 bottom-[27.41%] left-[32.18%] overflow-hidden motion-reduce:animate-none">
          <LogoName className="animate-intro-name h-full w-full text-white motion-reduce:animate-none" />
        </div>
        <Logo className="animate-intro-logo absolute inset-y-0 left-0 z-10 w-[26.87%] motion-reduce:animate-none" />
      </div>
    </div>
  );
}
