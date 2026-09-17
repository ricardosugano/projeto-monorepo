import type { ChangeEvent } from "react";

export interface InputProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "email" | "password" | "number";
  placeholder?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  helperText,
  required = false,
}: InputProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        marginBottom: "16px",
        textAlign: "left",
      }}
    >
      <label
        style={{
          fontWeight: 600,
          fontSize: "14px",
        }}
      >
        {label}
        {required && " *"}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          padding: "10px 12px",
          borderRadius: "6px",
          border: error ? "1px solid red" : "1px solid #ccc",
          fontSize: "14px",
        }}
      />

      {error && (
        <span style={{ fontSize: "12px" }}>
          {error}
        </span>
      )}

      {!error && helperText && (
        <span style={{ fontSize: "12px" }}>
          {helperText}
        </span>
      )}
    </div>
  );
}