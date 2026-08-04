"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Height-animated disclosure. Measures the panel with a ResizeObserver so the
 * transition stays correct when the language (and therefore the text length)
 * changes underneath it.
 */
export function AccordionItem({
  question,
  children,
  open,
  onToggle,
  icon,
  className,
}: {
  question: ReactNode;
  children: ReactNode;
  open: boolean;
  onToggle: () => void;
  icon?: ReactNode;
  className?: string;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const update = () => setHeight(el.scrollHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [children]);

  return (
    <div
      className={cn(
        "card-surface overflow-hidden rounded-3xl transition-colors duration-300",
        open && "border-brand-500/25",
        className
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="press flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-canvas-muted/40"
      >
        <span className="flex items-center gap-3 text-sm font-bold leading-snug text-fg sm:text-base">
          {icon}
          {question}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-fg-muted transition-transform duration-400 ease-premium",
            open && "rotate-180 text-brand-500"
          )}
        />
      </button>

      <div
        style={{ height: open ? height : 0 }}
        className="overflow-hidden transition-[height] duration-400 ease-premium"
        aria-hidden={!open}
      >
        <div ref={bodyRef} className="border-t border-border/8 px-5 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}
