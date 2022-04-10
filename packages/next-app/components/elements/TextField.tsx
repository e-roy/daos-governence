import React, { InputHTMLAttributes } from "react";

export type TextFieldProps = {
  name?: string;
  label?: string;
  value?: string;
  required?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  typeClass?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const TextField: React.FC<TextFieldProps> = ({
  name,
  label,
  value,
  type = "text",
  required,
  autoComplete,
  placeholder,
  className,
  onChange,
  onFocus,
  onBlur,
}) => {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className={"block text-sm font-medium text-stone-700"}
      >
        {label}
      </label>
      <div className={"mt-1"}>
        <input
          id={name}
          name={name}
          value={value}
          type={type}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          onChange={(e) => {
            onChange(e);
          }}
          onFocus={(e) => {
            onFocus && onFocus(e);
          }}
          onBlur={(e) => {
            onBlur && onBlur(e);
          }}
          className={
            "block w-full rounded-md border border-stone-200 shadow-sm text-base text-stone-700 py-2 px-3 focus:outline-transparent focus:border-stone-300 focus:ring focus:ring-stone-200 focus:ring-opacity-50"
          }
        />
      </div>
    </div>
  );
};
