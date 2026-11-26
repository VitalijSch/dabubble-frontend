/**
 * The intro plays once per browser tab. sessionStorage is per tab and survives reloads,
 * so a new tab plays it again, but reloading or coming back to the login page does not.
 *
 * While the attribute below is on <html>, intro.css hides the intro.
 */
export const INTRO_PLAYED_KEY = "dabubble:intro-played";
export const INTRO_PLAYED_ATTR = "data-intro-played";

/**
 * Inline <head> script: on a full page load it sets the attribute before the first paint,
 * so an intro that already played never flashes up. Must stay plain ES5 without imports.
 */
export const introPlayedScript = `try{if(sessionStorage.getItem(${JSON.stringify(INTRO_PLAYED_KEY)}))document.documentElement.setAttribute(${JSON.stringify(INTRO_PLAYED_ATTR)},"")}catch(e){}`;

export function hasIntroPlayed(): boolean {
  return document.documentElement.hasAttribute(INTRO_PLAYED_ATTR);
}

/** Remember for this tab (survives reloads) that the intro has been shown. */
export function rememberIntroStarted(): void {
  try {
    sessionStorage.setItem(INTRO_PLAYED_KEY, "1");
  } catch {
    // Storage blocked (e.g. strict privacy mode): the intro simply plays again next time.
  }
}

/** Hide the intro from now on, also when navigating back to the login page without a reload. */
export function markIntroPlayed(): void {
  document.documentElement.setAttribute(INTRO_PLAYED_ATTR, "");
}
