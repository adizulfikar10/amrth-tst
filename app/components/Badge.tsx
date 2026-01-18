import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "admin" | "ops" | string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant,
  className = "",
}) => {
  const getVariantClass = (variant?: string) => {
    if (!variant) return "";
    switch (variant.toLowerCase()) {
      case "admin":
        return "badge-admin";
      case "ops":
        return "badge-ops";
      default:
        return "";
    }
  };

  const variantClass = getVariantClass(variant);

  return (
    <span className={`badge ${variantClass} ${className}`.trim()}>
      {children}
    </span>
  );
};
