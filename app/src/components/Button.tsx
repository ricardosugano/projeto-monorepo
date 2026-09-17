import type { ReactNode } from "react";

export interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function Button({
  children,
  variant = "primary",
  size = "medium",
  isLoading = false,
  disabled = false,
  onClick,
  type = "button",
}: ButtonProps) {
  const estilosBase = {
    border: "none",
    borderRadius: "6px",
    cursor: disabled || isLoading ? "not-allowed" : "pointer",
    opacity: disabled || isLoading ? 0.6 : 1,
    padding:
      size === "small"
        ? "4px 8px"
        : size === "large"
          ? "12px 24px"
          : "8px 16px",
    fontWeight: 600,
    transition: "background-color 0.3s, color 0.3s",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  };

  const estilosVariant = {
    primary: {
      backgroundColor: "#007bff",
      color: "#fff}",
    },
    secondary: {
      backgroundColor: "#6c757d",
      color: "#fff",
    },
    danger: {
      backgroundColor: "#dc3545",
      color: "#fff",
    },
  };

  const estilosTamanhos = {
    small: {
      fontSize: "12px",
      padding: "6px 12px",
    },
    medium: {
      fontSize: "14px",
      padding: "10px 18px",
    },
    large: {
      fontSize: "16px",
      padding: "14px 24px",
    },
  };

  return (
    <button
      type={type}
      style={{
        ...estilosBase,
        ...estilosVariant[variant],
        ...estilosTamanhos[size],
      }}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}
