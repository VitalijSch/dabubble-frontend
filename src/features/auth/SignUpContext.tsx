"use client";

import { createContext, type ReactNode, use, useCallback, useState } from "react";

import type { RegisterDetails } from "./signUpChecks";

type SignUpState = {
  details: RegisterDetails | null;
  setDetails: (details: RegisterDetails | null) => void;
  signUpRun: number;
  finishSignUp: () => void;
};

const SignUpContext = createContext<SignUpState | null>(null);

export function SignUpProvider({ children }: { children: ReactNode }) {
  const [details, setDetails] = useState<RegisterDetails | null>(null);
  const [signUpRun, setSignUpRun] = useState(0);

  const finishSignUp = useCallback(() => {
    setDetails(null);
    setSignUpRun((run) => run + 1);
  }, []);

  return (
    <SignUpContext value={{ details, setDetails, signUpRun, finishSignUp }}>
      {children}
    </SignUpContext>
  );
}

export function useSignUp(): SignUpState {
  const state = use(SignUpContext);
  if (!state)
    throw new Error("useSignUp needs a <SignUpProvider> (src/app/(auth)/register/layout.tsx).");
  return state;
}
