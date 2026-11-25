import { describe, expect, it } from "vitest";

import { getInitials } from "./utils";

describe("getInitials", () => {
  it("uses first and last name", () => {
    expect(getInitials("Ada Lovelace")).toBe("AL");
  });

  it("ignores middle names and extra whitespace", () => {
    expect(getInitials("  grace   brewster  hopper ")).toBe("GH");
  });

  it("returns one letter for a single name", () => {
    expect(getInitials("Linus")).toBe("L");
  });

  it("returns an empty string for an empty name", () => {
    expect(getInitials("   ")).toBe("");
  });
});
