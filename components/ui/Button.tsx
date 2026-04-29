import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-shopify-white text-shopify-black border-2 border-transparent hover:opacity-90",
  secondary:
    "bg-transparent text-shopify-white border-2 border-shopify-white hover:bg-shopify-white hover:text-shopify-black",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-pill px-6 py-3 text-[16px] leading-normal font-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon focus-visible:ring-offset-2 focus-visible:ring-offset-void disabled:pointer-events-none disabled:opacity-50 ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
}
