import { type ComponentProps, type ComponentType, type SVGProps, useId } from "react";

type TextFieldProps = Omit<ComponentProps<"input">, "className"> & {
  /** Accessible name of the input (not shown; the placeholder is what users see). */
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** Pink message under the field (Figma "Rosa error"). Its line is always reserved, so nothing jumps. */
  error?: string;
};

/** Rounded input with a leading icon, as in Figma ("Name input", "Email Input Box", "PW input"). */
export function TextField({ label, icon: Icon, error, ...inputProps }: TextFieldProps) {
  const errorId = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <label
        className={`bg-surface hover:border-line focus-within:border-purple-1! flex h-[60px] cursor-text items-center gap-4 rounded-full border px-6 transition-colors sm:gap-[30px] sm:px-[31px] ${
          error ? "border-error" : "border-transparent"
        }`}
      >
        <Icon className="text-muted size-6 shrink-0" />
        <span className="sr-only">{label}</span>
        <input
          className="placeholder:text-muted w-0 flex-1 bg-transparent text-lg leading-[1.2] font-medium text-black outline-none"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          {...inputProps}
        />
      </label>
      <p id={errorId} className="text-error min-h-[19px] text-sm leading-[19px]">
        {error}
      </p>
    </div>
  );
}
