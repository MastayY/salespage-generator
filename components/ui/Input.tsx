import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-sm border border-shade-70 bg-dark-forest px-4 py-3 text-shopify-white placeholder:text-shade-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon focus-visible:ring-offset-2 focus-visible:ring-offset-void ${className}`}
      {...props}
    />
  );
}
