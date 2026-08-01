import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactElement,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "light" | "gold";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 ease-premium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60";

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

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-base",
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
    ...rest
  } = props;

  const classes = cn(base, variants[variant as Variant], sizes[size as Size], className);

  if (typeof href === "string") {
    const external = href.startsWith("http");
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
