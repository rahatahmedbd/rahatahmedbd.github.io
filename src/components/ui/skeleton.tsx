import { cn } from "@/lib/utils";

/** Shimmering placeholder block used by every async / dynamic boundary. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative overflow-hidden rounded-2xl bg-canvas-muted",
        "after:absolute after:inset-0 after:-translate-x-full after:animate-shimmer",
        "after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent",
        className
      )}
    />
  );
}

/** Card-shaped skeleton used while code-split panels load. */
export function SkeletonPanel({
  className,
  lines = 3,
}: {
  className?: string;
  lines?: number;
}) {
  return (
    <div className={cn("rounded-3xl border border-border/10 bg-surface p-6", className)}>
      <Skeleton className="h-10 w-10 rounded-2xl" />
      <Skeleton className="mt-4 h-4 w-2/3" />
      <div className="mt-3 space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className={cn("h-3", i === lines - 1 ? "w-1/2" : "w-full")} />
        ))}
      </div>
    </div>
  );
}
