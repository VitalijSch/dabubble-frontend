"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AuthCard } from "./AuthCard";
import { AvatarPicker } from "./AvatarPicker";
import { REGISTER_PATH } from "./routing";
import { useSignUp } from "./SignUpContext";

/**
 * Second sign-up step: choose an avatar. It needs the checked details from the first step, so
 * without them (URL opened directly, page reloaded, details changed after going back) it sends
 * the user to the first step. `replace`, so the back button doesn't lead here again.
 *
 * Only a convenience: the backend checks everything again when the account is created.
 */
export function AvatarStep() {
  const { details } = useSignUp();
  const router = useRouter();

  useEffect(() => {
    if (!details) router.replace(REGISTER_PATH);
  }, [details, router]);

  // Nothing until there are details, so the card doesn't flash before the redirect.
  if (!details) return null;

  return (
    <AuthCard title="Wähle deinen Avatar" backHref={REGISTER_PATH}>
      <AvatarPicker name={details.full_name} />
    </AuthCard>
  );
}
