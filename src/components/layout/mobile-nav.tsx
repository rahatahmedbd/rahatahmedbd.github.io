"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Award, Home, Mail, Rocket, User } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { useActiveSection } from "@/hooks/use-active-section";
import { useScrollState } from "@/hooks/use-scroll-direction";
import { cn } from "@/lib/utils";

const sectionIds = ["home", "about", "services", "work", "trust", "contact"];

interface NavItem {
  id: string;
  href: string;
  icon: typeof Home;
  en: string;
  bn: string;
  primary?: boolean;
}

const items: NavItem[] = [
  { id: "home", href: "#home", icon: Home, en: "Home", bn: "হোম" },
  { id: "about", href: "#about", icon: User, en: "About", bn: "পরিচয়" },
  { id: "order", href: "/order", icon: Rocket, en: "Order", bn: "অর্ডার", primary: true },
  { id: "work", href: "#work", icon: Award, en: "Work", bn: "কাজ" },
  { id: "contact", href: "#contact", icon: Mail, en: "Contact", bn: "যোগাযোগ" },
];

/**
 * App-style bottom navigation for phones. Five destinations, the primary
 * conversion raised in the middle, and a live active-section indicator so a
 * visitor always knows where they are inside the one-page journey.
 */
export function MobileNav() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const active = useActiveSection(sectionIds);
  const { hidden } = useScrollState(12);

  const onHome = pathname === "/";
  const onOrder = pathname.startsWith("/order");

  const resolve = useCallback(
    (href: string) => (href.startsWith("#") && !onHome ? `/${href}` : href),
    [onHome]
  );

  const prefetchOrder = useCallback(() => router.prefetch("/order"), [router]);

  /* The order page owns the bottom of the screen with its own sticky
     summary + submit bar — two stacked bars would be a trap on a phone. */
  if (onOrder) return null;

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed inset-x-0 bottom-0 z-[55] lg:hidden",
        "transition-transform duration-400 ease-premium",
        hidden ? "translate-y-[130%]" : "translate-y-0"
      )}
    >
      <div className="glass mx-3 mb-[calc(0.5rem+env(safe-area-inset-bottom))] flex items-stretch justify-around rounded-3xl border border-border/12 shadow-lift">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.primary
            ? onOrder
            : onHome && active === item.id;

          if (item.primary) {
            return (
              <a
                key={item.id}
                href={item.href}
                onTouchStart={prefetchOrder}
                onPointerEnter={prefetchOrder}
                className="press relative -mt-5 flex w-[22%] flex-col items-center justify-end gap-1 pb-2"
              >
                <span
                  className={cn(
                    "grid h-[52px] w-[52px] place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-[0_12px_28px_-10px_rgba(244,63,94,0.85)] transition-transform duration-300",
                    isActive && "scale-105 ring-2 ring-brand-400/50 ring-offset-2 ring-offset-canvas"
                  )}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400">
                  {t(item)}
                </span>
              </a>
            );
          }

          return (
            <a
              key={item.id}
              href={resolve(item.href)}
              className={cn(
                "press relative flex w-[19.5%] flex-col items-center gap-1 px-1 pb-2 pt-2.5 text-[10px] font-semibold transition-colors",
                isActive ? "text-brand-600 dark:text-brand-400" : "text-fg-muted"
              )}
            >
              <span
                className={cn(
                  "absolute top-0 h-0.5 rounded-full bg-brand-500 transition-all duration-400 ease-premium",
                  isActive ? "w-7 opacity-100" : "w-0 opacity-0"
                )}
              />
              <Icon
                className={cn(
                  "h-[19px] w-[19px] transition-transform duration-300",
                  isActive && "scale-110"
                )}
              />
              <span className="leading-none">{t(item)}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
