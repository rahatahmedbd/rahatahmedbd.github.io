"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarouselProps {
  children: ReactNode[];
  /** Tailwind width classes applied to each slide wrapper. */
  itemClassName?: string;
  className?: string;
  ariaLabel?: string;
  /** Show dot indicators under the rail. */
  dots?: boolean;
  /** Show desktop arrow buttons. */
  arrows?: boolean;
}

/**
 * Native scroll-snap carousel: swipeable on touch, arrow-driven on desktop,
 * keyboard reachable, and zero JS animation. Indicators derive from the real
 * scroll position, so they never disagree with what the user sees.
 */
export function Carousel({
  children,
  itemClassName = "w-[86%] sm:w-[54%] lg:w-[42%]",
  className,
  ariaLabel,
  dots = true,
  arrows = true,
}: CarouselProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const slides = Array.from(el.children) as HTMLElement[];
    const center = el.scrollLeft + el.clientWidth / 2;
    let closest = 0;
    let best = Infinity;
    slides.forEach((slide, i) => {
      const mid = slide.offsetLeft + slide.offsetWidth / 2;
      const dist = Math.abs(mid - center);
      if (dist < best) {
        best = dist;
        closest = i;
      }
    });
    setIndex(closest);
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure, children.length]);

  const scrollTo = (i: number) => {
    const el = railRef.current;
    if (!el) return;
    const slide = el.children[i] as HTMLElement | undefined;
    if (!slide) return;
    el.scrollTo({
      left: slide.offsetLeft - (el.clientWidth - slide.offsetWidth) / 2,
      behavior: "smooth",
    });
  };

  const step = (dir: -1 | 1) => scrollTo(Math.min(Math.max(index + dir, 0), children.length - 1));

  return (
    <div className={cn("relative", className)}>
      <div
        ref={railRef}
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
        className="no-scrollbar snap-rail flex gap-4 overflow-x-auto px-1 pb-2"
      >
        {children.map((child, i) => (
          <div key={i} className={cn("snap-item shrink-0", itemClassName)}>
            {child}
          </div>
        ))}
      </div>

      {arrows && children.length > 1 && (
        <>
          <ArrowButton dir="left" disabled={edges.start} onClick={() => step(-1)} />
          <ArrowButton dir="right" disabled={edges.end} onClick={() => step(1)} />
        </>
      )}

      {dots && children.length > 1 && (
        <div className="mt-5 flex items-center justify-center gap-1.5">
          {children.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => scrollTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-400 ease-premium",
                i === index ? "w-6 bg-brand-500" : "w-1.5 bg-border/25 hover:bg-border/40"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ArrowButton({
  dir,
  onClick,
  disabled,
}: {
  dir: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "left" ? "Previous" : "Next"}
      className={cn(
        "absolute top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-border/12 bg-surface/90 text-fg shadow-soft backdrop-blur transition-all duration-300 hover:border-brand-500/40 disabled:pointer-events-none disabled:opacity-0 lg:grid",
        dir === "left" ? "-left-4" : "-right-4"
      )}
    >
      {dir === "left" ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
    </button>
  );
}
