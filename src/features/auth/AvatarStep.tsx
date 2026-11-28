"use client";

import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useState, useTransition } from "react";

import { CONFIRMATION_BOX_VISIBLE_MS, AccountCreatedOverlay } from "./AccountCreatedOverlay";
import { AuthCard } from "./AuthCard";
import { AvatarPicker } from "./AvatarPicker";
import { LOGIN_PATH, REGISTER_PATH } from "./routing";
import { useSignUp } from "./SignUpContext";
import type { RegisterDetails } from "./signUpChecks";

type CreatedAccount = { details: RegisterDetails; confirmationSentTo: string };

export function AvatarStep() {
  const { details, finishSignUp } = useSignUp();
  const [created, setCreated] = useState<CreatedAccount | null>(null);
  const signsUpAgain = created !== null && details !== null && created.details !== details;
  if (signsUpAgain) setCreated(null);

  useSendBackToFirstStep(details === null && created === null);
  useGoToLoginAfterConfirmation(created !== null, () => {
    finishSignUp();
    setCreated(null);
  });

  if (!details) return null;

  return (
    <>
      <div inert={created !== null} className="contents">
        <AuthCard title="Wähle deinen Avatar" backHref={REGISTER_PATH}>
          <AvatarPicker
            details={details}
            onCreated={(confirmationSentTo) => setCreated({ details, confirmationSentTo })}
          />
        </AuthCard>
      </div>
      {created && <AccountCreatedOverlay email={created.confirmationSentTo} />}
    </>
  );
}

function useSendBackToFirstStep(hasNoDetails: boolean) {
  const router = useRouter();
  useEffect(() => {
    if (hasNoDetails) router.replace(REGISTER_PATH);
  }, [hasNoDetails, router]);
}

function useGoToLoginAfterConfirmation(isShowingConfirmation: boolean, forgetSignUp: () => void) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const leaveForLoginWhileForgettingSignUp = useEffectEvent(() =>
    startTransition(() => {
      router.replace(LOGIN_PATH);
      forgetSignUp();
    }),
  );

  useEffect(() => {
    if (!isShowingConfirmation) return;
    const timer = setTimeout(leaveForLoginWhileForgettingSignUp, CONFIRMATION_BOX_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [isShowingConfirmation]);
}
