import { type ChangeEvent, useState } from "react";

import { LockIcon, VisibilityIcon, VisibilityOffIcon } from "./icons";
import { TextField, type TextFieldProps } from "./TextField";

type PasswordFieldProps = Omit<TextFieldProps, "type" | "icon" | "iconAction" | "ref">;

/**
 * The password input. Empty, it shows the lock (Figma "PW input"); once something is typed,
 * the lock turns into an eye in the same place that shows what was typed and hides it again.
 *
 * Hidden by default and again when the field is emptied. Otherwise it stays as the user left
 * it, also after "Weiter".
 */
export function PasswordField({ onChange, ...props }: PasswordFieldProps) {
  const [filled, setFilled] = useState(false);
  const [visible, setVisible] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const hasValue = event.currentTarget.value !== "";
    setFilled(hasValue);
    if (!hasValue) setVisible(false);
    onChange?.(event);
  }

  const Eye = visible ? VisibilityOffIcon : VisibilityIcon;

  return (
    <TextField
      {...props}
      icon={LockIcon}
      type={visible ? "text" : "password"}
      onChange={handleChange}
      // Shown as text, the password must not be autocorrected, capitalised or spell-checked.
      autoCapitalize="none"
      autoCorrect="off"
      spellCheck={false}
      iconAction={
        filled && (
          <button
            type="button"
            aria-label={visible ? "Passwort verbergen" : "Passwort anzeigen"}
            // A mouse click keeps the focus (and the caret) in the input, so it doesn't count
            // as leaving the field. The keyboard still reaches the button with Tab.
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setVisible((shown) => !shown)}
            className="text-muted hover:text-purple-1 hover:bg-line/30 active:bg-line/40 focus-visible:outline-purple-1 flex size-10 cursor-pointer items-center justify-center rounded-full transition-colors focus-visible:outline-2"
          >
            <Eye className="size-6" />
          </button>
        )
      }
    />
  );
}
