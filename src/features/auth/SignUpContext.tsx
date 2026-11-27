"use client";

import { createContext, type ReactNode, use, useState } from "react";

import type { RegisterDetails } from "./signUp";

type SignUpState = {
  /** The first step's details, once the backend has checked them; `null` until then. */
  details: RegisterDetails | null;
  setDetails: (details: RegisterDetails | null) => void;
};

const SignUpContext = createContext<SignUpState | null>(null);

/**
 * Carries the sign-up details from the "Konto erstellen" card to the avatar step. Wraps every
 * /register page from their shared layout, which stays mounted while the user moves between
 * the steps.
 *
 * Kept in memory only, never in storage: it holds the password. A reload loses it, and the
 * avatar step then sends the user back to the first step.
 */
export function SignUpProvider({ children }: { children: ReactNode }) {
  const [details, setDetails] = useState<RegisterDetails | null>(null);
  return <SignUpContext value={{ details, setDetails }}>{children}</SignUpContext>;
}

export function useSignUp(): SignUpState {
  const state = use(SignUpContext);
  if (!state)
    throw new Error("useSignUp needs a <SignUpProvider> (src/app/(auth)/register/layout.tsx).");
  return state;
}
