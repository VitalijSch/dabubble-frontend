import { describe, expect, it } from "vitest";

import { getAuthRedirect } from "./routing";

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
    });

    it("may see the legal pages", () => {
      expect(getAuthRedirect("/impressum", true)).toBeNull();
    });
  });

  it("does not treat look-alike paths as auth pages", () => {
    expect(getAuthRedirect("/login-help", false)).toBe("/login");
  });
});
