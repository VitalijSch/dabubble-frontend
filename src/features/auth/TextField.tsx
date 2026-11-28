import {
  type ComponentProps,
  type ComponentType,
  type ReactNode,
  type SVGProps,
  useId,
} from "react";

export type TextFieldProps = Omit<ComponentProps<"input">, "className"> & {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  error?: string;
  iconAction?: ReactNode;
};

const HIDE_EDGE_PASSWORD_EYE = "[&::-ms-reveal]:hidden";

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
          {iconAction ? (
            <SpaceKeptForIconAction />
          ) : (
            <Icon className="text-muted size-6 shrink-0" />
          )}
          <span className="sr-only">{label}</span>
          <input
            className={`placeholder:text-muted w-0 flex-1 bg-transparent text-lg leading-[1.2] font-medium text-black outline-none ${HIDE_EDGE_PASSWORD_EYE}`}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            {...inputProps}
          />
        </label>
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

function SpaceKeptForIconAction() {
  return <span className="size-6 shrink-0" />;
}
