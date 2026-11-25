import { Logo, LogoName } from "@/features/brand";

/**
 * Intro screen shown when the app starts (Figma frame "00-Intro").
 *
 * This is the first frame of the logo animation: the logo sits in the centre and the
 * wordmark waits, invisible, to its left. All sizes are percentages of the 696 × 184
 * design box, so the whole group scales down on small screens.
 */
export function IntroScreen() {
  return (
    <main className="relative flex min-h-dvh flex-1 items-center justify-center overflow-hidden bg-[linear-gradient(1.46deg,#313AE6_1.22%,#797EF3_98.76%)]">
      <h1 className="sr-only">DABubble</h1>

      {/* Design: 696 × 184, shifted 51px right of centre so the logo itself is centred. */}
      <div className="relative aspect-[696/184] w-[min(696px,85vw)] translate-x-[7.33%]">
        <LogoName className="absolute top-[33.46%] bottom-[27.41%] left-[-40.8%] w-[67.81%] text-white opacity-0" />
        <Logo className="absolute inset-y-0 left-[29.93%] w-[26.87%]" />
      </div>
    </main>
  );
}
