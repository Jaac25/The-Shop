import clsx from "clsx";
import { ReactNode } from "react";

export const Button = ({
  children,
  className,
  onClick,
  type = "button",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "submit" | "reset" | "button";
  disabled?: boolean;
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "bg-primary text-white hover:cursor-pointer hover:scale-105 hover:opacity-70 p-2 line-clamp-2 rounded-xl font-medium transition-all duration-200",
        className,
      )}
    >
      {children}
    </button>
  );
};
