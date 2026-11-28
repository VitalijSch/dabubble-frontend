import { type ChangeEvent, type MouseEvent, useState } from "react";

import { LockIcon, VisibilityIcon, VisibilityOffIcon } from "./icons";
import { TextField, type TextFieldProps } from "./TextField";

type PasswordFieldProps = Omit<TextFieldProps, "type" | "icon" | "iconAction" | "ref">;

export function PasswordField({ onChange, ...props }: PasswordFieldProps) {
  const [hasPassword, setHasPassword] = useState(false);
  const [showsPassword, setShowsPassword] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const isFilled = event.currentTarget.value !== "";
    setHasPassword(isFilled);
    if (!isFilled) setShowsPassword(false);
    onChange?.(event);
  }

  const Eye = showsPassword ? VisibilityOffIcon : VisibilityIcon;

  return (
    <TextField
      {...props}
      icon={LockIcon}
      type={showsPassword ? "text" : "password"}
      onChange={handleChange}
      autoCapitalize="none"
      autoCorrect="off"
      spellCheck={false}
      iconAction={
        hasPassword && (
          <button
            type="button"
            aria-label={showsPassword ? "Passwort verbergen" : "Passwort anzeigen"}
            onMouseDown={keepFocusInPasswordField}
            onClick={() => setShowsPassword((shows) => !shows)}
            className="text-muted hover:text-purple-1 hover:bg-line/30 active:bg-line/40 focus-visible:outline-purple-1 flex size-10 cursor-pointer items-center justify-center rounded-full transition-colors focus-visible:outline-2"
          >
            <Eye className="size-6" />
          </button>
        )
      }
    />
  );
}

function keepFocusInPasswordField(event: MouseEvent) {
  event.preventDefault();
}
