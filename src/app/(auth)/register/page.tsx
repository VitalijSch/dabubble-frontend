import type { Metadata } from "next";

import { AuthCard, LOGIN_PATH, SignUpForm } from "@/features/auth";

export const metadata: Metadata = { title: "Konto erstellen · DABubble" };

export default function RegisterPage() {
  return (
    <AuthCard
      title="Konto erstellen"
      description="Mit deinem Namen und deiner E-Mail-Adresse hast du dein neues DABubble-Konto."
      backHref={LOGIN_PATH}
    >
      <SignUpForm />
    </AuthCard>
  );
}
