import type { Metadata } from "next";

import { AvatarStep } from "@/features/auth";

export const metadata: Metadata = { title: "Avatar wählen · DABubble" };

export default function ChooseAvatarPage() {
  return <AvatarStep />;
}
