import { describe, expect, it } from "vitest";

import { isSignUpFilled } from "./signUp";

function form(fields: Record<string, string>): FormData {
  const data = new FormData();
  for (const [name, value] of Object.entries(fields)) data.set(name, value);
  return data;
}

const filled = {
  name: "Frederik Beck",
  email: "frederik@beispiel.de",
  password: "geheim123",
  privacy: "on",
};

describe("isSignUpFilled", () => {
  it("is true when every field has a value and the privacy box is ticked", () => {
    expect(isSignUpFilled(form(filled))).toBe(true);
  });

  it("is false for an empty form", () => {
    expect(isSignUpFilled(form({}))).toBe(false);
  });

  it.each(["name", "email", "password"])("is false while %s is empty", (field) => {
    expect(isSignUpFilled(form({ ...filled, [field]: "" }))).toBe(false);
  });

  it.each(["name", "email"])("is false while %s has only spaces", (field) => {
    expect(isSignUpFilled(form({ ...filled, [field]: "   " }))).toBe(false);
  });

  it("is false while the privacy box is not ticked", () => {
    const { privacy: _, ...rest } = filled;
    expect(isSignUpFilled(form(rest))).toBe(false);
  });
});
