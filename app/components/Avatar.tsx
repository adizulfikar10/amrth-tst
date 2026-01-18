import React from "react";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: React.ReactNode;
  className?: string;
}

export function Avatar({
  src,
  alt = "Avatar",
  fallback = "?",
  className = "avatar",
}: AvatarProps) {
  if (src) {
    return <img src={src} alt={alt} className={className} />;
  }
  return <div className={className}>{fallback}</div>;
}
