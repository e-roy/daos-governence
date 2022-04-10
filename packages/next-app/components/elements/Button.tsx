import React, { ButtonHTMLAttributes } from "react";

export type ButtonProps = {
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = ({
  className = "",
  type,
  disabled,
  onClick,
  children,
}) => {
  const btnBase =
    "flex rounded-xl px-4 py-2 border border-black rounded-lg shadow-md font-medium bg-stone-200/70 hover:bg-stone-100/90";

  if (disabled)
    return (
      <div className={`${btnBase} ${className} p-[1px]`}>
        <div className="m-[2px]">{children}</div>
      </div>
    );

  return (
    <button
      className={`${btnBase} ${className} w-full`}
      type={type}
      onClick={onClick}
    >
      <div className="m-[3px]hover:shadow-xl mx-auto">{children}</div>
    </button>
  );
};
