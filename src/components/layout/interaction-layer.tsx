"use client";

import { useEffect } from "react";

/**
 * Small, global polish behaviours that do not deserve their own component:
 *
 *  • Anchor highlight — the target section pulses briefly after a jump.
 *  • Smart prefetch — /order is warmed as soon as any link to it is visible.
 *  • Theme transition — colour changes are eased instead of snapping.
 *
 * All of it is passive and listener-light: one delegated click handler and
 * one IntersectionObserver.
 */
export function InteractionLayer() {
  useEffect(() => {
    const flash = (hash: string) => {
      const id = hash.replace("#", "");
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.remove("anchor-flash");
      // Force a reflow so the animation can restart on repeat clicks.
      void el.offsetWidth;
      el.classList.add("anchor-flash");
      window.setTimeout(() => el.classList.remove("anchor-flash"), 1600);
    };

    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      if (href.startsWith("#") && href.length > 1) {
        window.setTimeout(() => flash(href), 260);
      }
    };

    document.addEventListener("click", onClick);
    if (window.location.hash) window.setTimeout(() => flash(window.location.hash), 500);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Warm the order route the first time any /order link scrolls into view.
  useEffect(() => {
    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('a[href="/order"], a[href^="/order?"]')
    );
    if (links.length === 0) return;

    let done = false;
    const warm = () => {
      if (done) return;
      done = true;
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "document";
      link.href = "/order";
      document.head.appendChild(link);
      observer.disconnect();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) warm();
      },
      { rootMargin: "200px" }
    );
    links.forEach((link) => observer.observe(link));
    return () => observer.disconnect();
  }, []);

  // Ease colour changes when the theme flips (class swap on <html>).
  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      root.classList.add("theme-transition");
      window.setTimeout(() => root.classList.remove("theme-transition"), 300);
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return null;
}
