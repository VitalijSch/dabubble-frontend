import { afterEach, describe, expect, it, vi } from "vitest";

import {
  hideIntroIfAlreadyPlayedScript,
  INTRO_PLAYED_ATTRIBUTE,
  INTRO_PLAYED_KEY,
  rememberIntroStarted,
} from "./played";

function runHideIntroScriptWith(storage: Record<string, string> | "blocked") {
  const attributes = new Set<string>();
  const sessionStorage = {
    getItem(key: string) {
      if (storage === "blocked") throw new Error("SecurityError");
      return storage[key] ?? null;
    },
  };
  const document = { documentElement: { setAttribute: (name: string) => attributes.add(name) } };
  new Function("sessionStorage", "document", hideIntroIfAlreadyPlayedScript)(
    sessionStorage,
    document,
  );
  return attributes;
}

describe("hideIntroIfAlreadyPlayedScript", () => {
  it("marks <html> when the intro already played in this tab", () => {
    expect(runHideIntroScriptWith({ [INTRO_PLAYED_KEY]: "1" })).toEqual(
      new Set([INTRO_PLAYED_ATTRIBUTE]),
    );
  });

  it("leaves <html> alone on the first visit", () => {
    expect(runHideIntroScriptWith({})).toEqual(new Set());
  });

  it("does not throw when storage is blocked", () => {
    expect(runHideIntroScriptWith("blocked")).toEqual(new Set());
  });
});

describe("rememberIntroStarted", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("lets the intro simply play again next time when the browser blocks storage", () => {
    vi.stubGlobal("sessionStorage", {
      setItem() {
        throw new Error("SecurityError");
      },
    });

    expect(() => rememberIntroStarted()).not.toThrow();
  });
});
