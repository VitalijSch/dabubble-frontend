import type { Metadata } from "next";

import { AuthCard, AvatarPicker, REGISTER_PATH } from "@/features/auth";

export const metadata: Metadata = { title: "Avatar wählen · DABubble" };

/** Second sign-up step: choose an avatar. */
export default function AvatarPage() {
  return (
    <AuthCard title="Wähle deinen Avatar" backHref={REGISTER_PATH}>
      {/* Placeholder until the sign-up card hands over the name that was entered. */}
      <AvatarPicker name="Frederik Beck" />
    </AuthCard>
  );
}
