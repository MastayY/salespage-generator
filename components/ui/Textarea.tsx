import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className = "", ...props }: TextareaProps) {
  return (
    <textarea
      className={`w-full rounded-sm border border-shade-70 bg-dark-forest px-4 py-3 text-shopify-white placeholder:text-shade-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon focus-visible:ring-offset-2 focus-visible:ring-offset-void ${className}`}
      {...props}
    />
  );
}
