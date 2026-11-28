export const INTRO_PLAYED_KEY = "dabubble:intro-played";
export const INTRO_PLAYED_ATTRIBUTE = "data-intro-played";

export const hideIntroIfAlreadyPlayedScript = `try{if(sessionStorage.getItem(${JSON.stringify(INTRO_PLAYED_KEY)}))document.documentElement.setAttribute(${JSON.stringify(INTRO_PLAYED_ATTRIBUTE)},"")}catch(e){}`;

export function hasIntroPlayed(): boolean {
  return document.documentElement.hasAttribute(INTRO_PLAYED_ATTRIBUTE);
}

export function rememberIntroStarted(): void {
  try {
    sessionStorage.setItem(INTRO_PLAYED_KEY, "1");
  } catch {
    return;
  }
}

export function markIntroPlayed(): void {
  document.documentElement.setAttribute(INTRO_PLAYED_ATTRIBUTE, "");
}
