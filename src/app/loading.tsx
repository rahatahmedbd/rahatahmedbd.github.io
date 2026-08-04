import { Skeleton } from "@/components/ui/skeleton";

/** Route-level skeleton — matches the shape of a typical content page. */
export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
        <Skeleton className="h-7 w-40 rounded-full" />
        <Skeleton className="h-10 w-full max-w-lg" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-border/10 bg-surface p-6">
            <Skeleton className="h-11 w-11 rounded-2xl" />
            <Skeleton className="mt-4 h-4 w-2/3" />
            <Skeleton className="mt-2.5 h-3 w-full" />
            <Skeleton className="mt-2 h-3 w-4/5" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
