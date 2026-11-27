import { describe, expect, it } from "vitest";

import { getAuthRedirect, showsSignUpPrompt } from "./routing";

describe("getAuthRedirect", () => {
  describe("guest", () => {
    it("is sent from the main page to the login page", () => {
      expect(getAuthRedirect("/", false)).toBe("/login");
    });

    it("is sent from any other app page to the login page", () => {
      expect(getAuthRedirect("/channels/general", false)).toBe("/login");
    });

    it("may see the auth pages", () => {
      expect(getAuthRedirect("/login", false)).toBeNull();
      expect(getAuthRedirect("/register", false)).toBeNull();
      expect(getAuthRedirect("/register/avatar", false)).toBeNull();
    });

    it("may see the legal pages", () => {
      expect(getAuthRedirect("/impressum", false)).toBeNull();
      expect(getAuthRedirect("/datenschutz", false)).toBeNull();
    });
  });

  describe("logged-in user", () => {
    it("may see the main page and other app pages", () => {
      expect(getAuthRedirect("/", true)).toBeNull();
      expect(getAuthRedirect("/channels/general", true)).toBeNull();
    });

    it("is sent from the auth pages to the main page", () => {
      expect(getAuthRedirect("/login", true)).toBe("/");
      expect(getAuthRedirect("/register", true)).toBe("/");
      expect(getAuthRedirect("/register/avatar", true)).toBe("/");
    });

    it("may see the legal pages", () => {
      expect(getAuthRedirect("/impressum", true)).toBeNull();
    });
  });

  it("does not treat look-alike paths as auth pages", () => {
    expect(getAuthRedirect("/login-help", false)).toBe("/login");
  });
});

describe("showsSignUpPrompt", () => {
  it("is shown on the login page", () => {
    expect(showsSignUpPrompt("/login")).toBe(true);
  });

  it("is hidden while signing up: on the sign-up page and when choosing the avatar", () => {
    expect(showsSignUpPrompt("/register")).toBe(false);
    expect(showsSignUpPrompt("/register/avatar")).toBe(false);
  });

  it("is shown on look-alike paths", () => {
    expect(showsSignUpPrompt("/register-help")).toBe(true);
  });
});
