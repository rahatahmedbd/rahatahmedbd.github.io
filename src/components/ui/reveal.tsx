"use client";

import type { ElementType, ReactNode } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "scale" | "fade";

const offsets: Record<Direction, string> = {
  up: "translate-y-6",
  down: "-translate-y-6",
  left: "translate-x-6",
  right: "-translate-x-6",
  scale: "scale-[0.97]",
  fade: "",
};

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  direction?: Direction;
  delay?: number;
  className?: string;
  once?: boolean;
}

/** Fade/slide content into view on scroll. Respects prefers-reduced-motion. */
export function Reveal({
  children,
  as: Tag = "div",
  direction = "up",
  delay = 0,
  className,
  once = true,
}: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ once });

  return (
    <Tag
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        "transition-all duration-[800ms] ease-premium will-change-transform",
        inView
          ? "opacity-100 translate-x-0 translate-y-0 scale-100"
          : cn("opacity-0", offsets[direction]),
        className
      )}
    >
      {children}
    </Tag>
  );
}
