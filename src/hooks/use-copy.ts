"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Clipboard copy with a short-lived "copied" flag for inline feedback. */
export function useCopy(resetAfter = 1800) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const copy = useCallback(
    async (text: string) => {
      let ok = false;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
          ok = true;
        } else {
          // Legacy fallback — some in-app browsers block the async clipboard.
          const el = document.createElement("textarea");
          el.value = text;
          el.setAttribute("readonly", "");
          el.style.position = "fixed";
          el.style.opacity = "0";
          document.body.appendChild(el);
          el.select();
          ok = document.execCommand("copy");
          document.body.removeChild(el);
        }
      } catch {
        ok = false;
      }

      if (ok) {
        setCopied(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), resetAfter);
      }
      return ok;
    },
    [resetAfter]
  );

  return { copied, copy } as const;
}
