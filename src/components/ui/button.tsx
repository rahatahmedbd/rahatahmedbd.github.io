"use client";

import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactElement,
  ReactNode,
} from "react";
import { useRipple } from "@/components/ui/ripple";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "light" | "gold";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-full font-semibold transition-all duration-300 ease-premium active:scale-[0.97] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white shadow-[0_10px_30px_-12px_rgba(244,63,94,0.6)] hover:bg-brand-500 hover:shadow-[0_16px_40px_-12px_rgba(244,63,94,0.7)] hover:-translate-y-0.5",
  secondary:
    "border border-border/20 bg-surface text-fg hover:border-brand-500/40 hover:-translate-y-0.5 hover:shadow-soft",
  ghost: "text-fg-soft hover:text-fg hover:bg-canvas-muted",
  light:
    "bg-white text-brand-700 hover:bg-white/90 hover:-translate-y-0.5 shadow-soft",
  gold: "bg-gradient-to-br from-gold-400 to-gold-600 text-white hover:-translate-y-0.5 shadow-soft",
};

/** Touch targets never fall below 40px, even at the smallest size. */
const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

/** Ripple colour tuned per variant so it reads on both light and dark fills. */
const rippleColor: Record<Variant, string> = {
  primary: "rgba(255,255,255,0.35)",
  secondary: "rgba(244,63,94,0.18)",
  ghost: "rgba(244,63,94,0.15)",
  light: "rgba(244,63,94,0.18)",
  gold: "rgba(255,255,255,0.35)",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAnchorProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button(props: ButtonButtonProps): ReactElement;
export function Button(props: ButtonAnchorProps): ReactElement;
export function Button(props: any): ReactElement {
  const {
    variant = "primary",
    size = "md",
    className,
    children,
    href,
    onPointerDown,
    ...rest
  } = props;

  const { onPointerDown: ripplePointerDown, rippleLayer } = useRipple(
    rippleColor[variant as Variant]
  );

  const classes = cn(
    base,
    variants[variant as Variant],
    sizes[size as Size],
    className
  );

  const handlePointerDown = (e: any) => {
    ripplePointerDown(e);
    onPointerDown?.(e);
  };

  if (typeof href === "string") {
    const external = href.startsWith("http");
    return (
      <a
        href={href}
        className={classes}
        onPointerDown={handlePointerDown}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {children}
        {rippleLayer}
      </a>
    );
  }

  return (
    <button className={classes} onPointerDown={handlePointerDown} {...rest}>
      {children}
      {rippleLayer}
    </button>
  );
}
