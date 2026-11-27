import {
  type ComponentProps,
  type ComponentType,
  type ReactNode,
  type SVGProps,
  useId,
} from "react";

export type TextFieldProps = Omit<ComponentProps<"input">, "className"> & {
  /** Accessible name of the input (not shown; the placeholder is what users see). */
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** Pink message under the field (Figma "Rosa error"). Its line is always reserved, so nothing jumps. */
  error?: string;
  /**
   * A 40 px round button shown instead of the icon, centred on the icon's place, e.g. the
   * password's eye. Its own icon should be 24 px like the field's.
   */
  iconAction?: ReactNode;
};

/** Rounded input with a leading icon, as in Figma ("Name input", "Email Input Box", "PW input"). */
export function TextField({ label, icon: Icon, error, iconAction, ...inputProps }: TextFieldProps) {
  const errorId = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        <label
          className={`bg-surface hover:border-line focus-within:border-purple-1! has-[+div>button:focus-visible]:border-purple-1! flex h-[60px] cursor-text items-center gap-4 rounded-full border px-6 transition-colors sm:gap-[30px] sm:px-[31px] ${
            error ? "border-error" : "border-transparent"
          }`}
        >
          {/* With an action, an empty 24 px slot keeps the input where it is. */}
          {iconAction ? (
            <span className="size-6 shrink-0" />
          ) : (
            <Icon className="text-muted size-6 shrink-0" />
          )}
          <span className="sr-only">{label}</span>
          <input
            // Edge draws its own eye in password inputs; the password field has its own.
            className="placeholder:text-muted w-0 flex-1 bg-transparent text-lg leading-[1.2] font-medium text-black outline-none [&::-ms-reveal]:hidden"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            {...inputProps}
          />
        </label>
        {/*
          Outside the label, so the button doesn't end up in the input's accessible name, and
          laid over the icon's slot: 1 px border + padding + 12 px (half the icon) − 20 px.
        */}
        {iconAction && (
          <div className="absolute top-1/2 left-[17px] -translate-y-1/2 sm:left-6">
            {iconAction}
          </div>
        )}
      </div>
      <p id={errorId} className="text-error min-h-[19px] text-sm leading-[19px]">
        {error}
      </p>
    </div>
  );
}
