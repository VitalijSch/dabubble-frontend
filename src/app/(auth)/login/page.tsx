import type { Metadata } from "next";

import { IntroScreen } from "@/features/intro";

export const metadata: Metadata = { title: "Anmeldung · DABubble" };

export default function LoginPage() {
  return <IntroScreen />;
}
