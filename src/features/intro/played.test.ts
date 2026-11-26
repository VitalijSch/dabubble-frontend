import { describe, expect, it } from "vitest";

import { INTRO_PLAYED_ATTR, INTRO_PLAYED_KEY, introPlayedScript } from "./played";

/** Runs the inline <head> script against a fake sessionStorage and <html>. */
function runScript(storage: Record<string, string> | "blocked") {
  const attributes = new Set<string>();
  const sessionStorage = {
    getItem(key: string) {
      if (storage === "blocked") throw new Error("SecurityError");
      return storage[key] ?? null;
    },
  };
  const document = { documentElement: { setAttribute: (name: string) => attributes.add(name) } };
  new Function("sessionStorage", "document", introPlayedScript)(sessionStorage, document);
  return attributes;
}

describe("introPlayedScript", () => {
  it("marks <html> when the intro already played in this tab", () => {
    expect(runScript({ [INTRO_PLAYED_KEY]: "1" })).toEqual(new Set([INTRO_PLAYED_ATTR]));
  });

  it("leaves <html> alone on the first visit", () => {
    expect(runScript({})).toEqual(new Set());
  });

  it("does not throw when storage is blocked", () => {
    expect(runScript("blocked")).toEqual(new Set());
  });
});
