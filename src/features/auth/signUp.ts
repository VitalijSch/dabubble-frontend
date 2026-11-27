function text(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === "string" ? value : "";
}

/**
 * Whether the "Konto erstellen" form is filled out: name, email and password have a value
 * and the privacy box is ticked. Enables "Weiter". Name and email must be more than spaces;
 * the password counts as typed, since spaces are allowed in it. Whether the values are
 * valid (email format, password length) is checked on submit, not here.
 */
export function isSignUpFilled(data: FormData): boolean {
  return (
    text(data, "name").trim() !== "" &&
    text(data, "email").trim() !== "" &&
    text(data, "password") !== "" &&
    data.has("privacy")
  );
}
