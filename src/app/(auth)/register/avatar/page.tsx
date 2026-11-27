import type { Metadata } from "next";

import { AvatarStep } from "@/features/auth";

export const metadata: Metadata = { title: "Avatar wählen · DABubble" };

/** Second sign-up step: choose an avatar. */
export default function AvatarPage() {
  return <AvatarStep />;
}
