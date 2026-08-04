"use client";

import { Check, Copy } from "lucide-react";
import { useCopy } from "@/hooks/use-copy";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

/** Copy-to-clipboard with inline tick + a global toast confirmation. */
export function CopyButton({
  value,
  label,
  toastTitle = "Copied to clipboard",
  className,
}: {
  value: string;
  label?: string;
  toastTitle?: string;
  className?: string;
}) {
  const { copied, copy } = useCopy();
  const { toast } = useToast();

  return (
    <button
      type="button"
      aria-label={label ?? `Copy ${value}`}
      onClick={async () => {
        const ok = await copy(value);
        toast({
          title: ok ? toastTitle : "Could not copy",
          description: ok ? value : "Please copy it manually.",
          tone: ok ? "success" : "error",
        });
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-fg-muted transition-colors hover:bg-canvas-muted hover:text-fg",
        className
      )}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      {label ? <span>{label}</span> : null}
    </button>
  );
}
