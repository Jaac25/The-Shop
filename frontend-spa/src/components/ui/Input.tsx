import clsx from "clsx";
import type { DetailedHTMLProps, InputHTMLAttributes } from "react";

export const Input = ({
  label,
  className,
  ...props
}: {
  label?: string;
  className?: string;
} & DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) => {
  return (
    <div className="w-full">
      {!!label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}
      <input {...props} className={clsx("input-field", className)} />
    </div>
  );
};
