import type { Metadata } from "next";

import { IntroScreen } from "@/features/intro";

export const metadata: Metadata = { title: "Anmeldung · DABubble" };

/** Where every visit starts: the intro plays over the login page. The login card is built next. */
export default function LoginPage() {
  return <IntroScreen />;
}
