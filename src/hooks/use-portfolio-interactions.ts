"use client";

import { useEffect } from "react";

import { readBrowserStorage, writeBrowserStorage } from "@/utils/browser-storage";
import type { PortfolioLanguage, PortfolioTheme } from "@/types/portfolio";

const LANGUAGE_STORAGE_KEY = "portfolio-lang";
const THEME_STORAGE_KEY = "portfolio-theme";
const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"] as const;

function isLanguage(value: string | null | undefined): value is PortfolioLanguage {
  return value === "bn" || value === "en";
}

function isTheme(value: string | null): value is PortfolioTheme {
  return value === "light" || value === "dark";
}

function formatCounter(value: number, language: PortfolioLanguage, hasPlusSuffix: boolean): string {
  const number = String(value);
  const formattedNumber =
    language === "bn"
      ? number.replace(/\d/gu, (digit) => bengaliDigits[Number(digit)] ?? digit)
      : number;

  return hasPlusSuffix ? `${formattedNumber}+` : formattedNumber;
}

function getCounterTarget(element: HTMLElement): number | null {
  const target = Number.parseInt(element.dataset.count ?? "", 10);
  return Number.isNaN(target) ? null : target;
}

function getCounterDuration(element: HTMLElement): number {
  const duration = Number.parseInt(element.dataset.countDuration ?? "", 10);
  return Number.isNaN(duration) ? 1800 : duration;
}

export function usePortfolioInteractions(): void {
  useEffect(() => {
    const cleanupCallbacks: Array<() => void> = [];
    const pendingTimeouts = new Set<number>();
    const schedule = (callback: () => void, delay: number): number => {
      const timeoutId = window.setTimeout(() => {
        pendingTimeouts.delete(timeoutId);
        callback();
      }, delay);
      pendingTimeouts.add(timeoutId);
      return timeoutId;
    };

    const documentElement = document.documentElement;
    const body = document.body;
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const colorSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const themeToggle = document.getElementById("themeToggle");
    const languageButtons = Array.from(
      document.querySelectorAll<HTMLButtonElement>(".lang-switch__btn"),
    );

    let currentLanguage: PortfolioLanguage = "bn";

    const updateThemeMeta = (theme: PortfolioTheme) => {
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", theme === "dark" ? "#0F0D0B" : "#7A0C2E");
    };

    const applyTheme = (theme: PortfolioTheme, animate: boolean) => {
      if (animate) {
        body.classList.add("theme-transitioning");
        schedule(() => body.classList.remove("theme-transitioning"), 500);
      }

      documentElement.dataset.theme = theme;
      updateThemeMeta(theme);
      themeToggle?.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
      );
    };

    const preferredTheme: PortfolioTheme = colorSchemeQuery.matches ? "dark" : "light";
    const savedTheme = readBrowserStorage(THEME_STORAGE_KEY);
    applyTheme(isTheme(savedTheme) ? savedTheme : preferredTheme, false);
    body.classList.remove("preload");

    const handleThemeToggle = () => {
      const activeTheme: PortfolioTheme =
        documentElement.dataset.theme === "dark" ? "dark" : "light";
      const nextTheme: PortfolioTheme = activeTheme === "dark" ? "light" : "dark";
      applyTheme(nextTheme, true);
      writeBrowserStorage(THEME_STORAGE_KEY, nextTheme);
    };

    themeToggle?.addEventListener("click", handleThemeToggle);
    cleanupCallbacks.push(() => themeToggle?.removeEventListener("click", handleThemeToggle));

    const handleThemeShortcut = (event: KeyboardEvent) => {
      if (event.altKey && event.key.toLowerCase() === "t") {
        event.preventDefault();
        handleThemeToggle();
      }
    };
    document.addEventListener("keydown", handleThemeShortcut);
    cleanupCallbacks.push(() => document.removeEventListener("keydown", handleThemeShortcut));

    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      if (!readBrowserStorage(THEME_STORAGE_KEY)) {
        applyTheme(event.matches ? "dark" : "light", true);
      }
    };
    colorSchemeQuery.addEventListener("change", handleSystemThemeChange);
    cleanupCallbacks.push(() =>
      colorSchemeQuery.removeEventListener("change", handleSystemThemeChange),
    );

    const counters = Array.from(document.querySelectorAll<HTMLElement>("[data-count]"));
    const counterSuffixes = new Map(
      counters.map((counter) => [counter, counter.textContent?.includes("+") ?? false]),
    );

    const renderCountedCounters = () => {
      counters.forEach((counter) => {
        if (!counter.classList.contains("is-counted")) {
          return;
        }

        const target = getCounterTarget(counter);
        if (target === null) {
          return;
        }

        counter.textContent = formatCounter(
          target,
          currentLanguage,
          counterSuffixes.get(counter) ?? false,
        );
      });
    };

    const applyLanguage = (language: PortfolioLanguage) => {
      currentLanguage = language;
      documentElement.lang = language;

      document
        .querySelectorAll<HTMLElement>("[data-lang-bn], [data-lang-en]")
        .forEach((element) => {
          const translation = element.getAttribute(`data-lang-${language}`);
          if (translation) {
            element.textContent = translation;
          }
        });

      languageButtons.forEach((button) => {
        const isActive = button.dataset.lang === language;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });

      body.classList.remove("lang-bn", "lang-en");
      body.classList.add(`lang-${language}`);
      renderCountedCounters();
    };

    const savedLanguage = readBrowserStorage(LANGUAGE_STORAGE_KEY);
    applyLanguage(isLanguage(savedLanguage) ? savedLanguage : "bn");

    const languageButtonHandlers = languageButtons.map((button) => {
      const handler = () => {
        const nextLanguage = button.dataset.lang;
        if (!isLanguage(nextLanguage) || nextLanguage === currentLanguage) {
          return;
        }

        body.classList.add("language-fading");
        schedule(() => {
          applyLanguage(nextLanguage);
          writeBrowserStorage(LANGUAGE_STORAGE_KEY, nextLanguage);
          schedule(() => body.classList.remove("language-fading"), 50);
        }, 150);
      };
      button.addEventListener("click", handler);
      return { button, handler };
    });
    cleanupCallbacks.push(() => {
      languageButtonHandlers.forEach(({ button, handler }) =>
        button.removeEventListener("click", handler),
      );
    });

    const finishCounter = (counter: HTMLElement) => {
      const target = getCounterTarget(counter);
      if (target === null) {
        return;
      }

      counter.textContent = formatCounter(
        target,
        currentLanguage,
        counterSuffixes.get(counter) ?? false,
      );
      counter.classList.add("is-counted");
    };

    const animateCounter = (counter: HTMLElement) => {
      const target = getCounterTarget(counter);
      if (target === null) {
        return;
      }

      if (reducedMotionQuery.matches) {
        finishCounter(counter);
        return;
      }

      const duration = getCounterDuration(counter);
      const startTime = performance.now();
      const animate = (timestamp: number) => {
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easedProgress = 1 - (1 - progress) ** 3;
        const currentValue = Math.floor(target * easedProgress);
        counter.textContent = formatCounter(
          currentValue,
          currentLanguage,
          counterSuffixes.get(counter) ?? false,
        );

        if (progress < 1) {
          window.requestAnimationFrame(animate);
        } else {
          finishCounter(counter);
        }
      };

      window.requestAnimationFrame(animate);
    };

    counters.forEach((counter) => {
      counter.textContent = formatCounter(
        0,
        currentLanguage,
        counterSuffixes.get(counter) ?? false,
      );
    });

    if (counters.length > 0) {
      if (reducedMotionQuery.matches || !("IntersectionObserver" in window)) {
        counters.forEach(finishCounter);
      } else {
        const counterObserver = new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting || !(entry.target instanceof HTMLElement)) {
                return;
              }

              animateCounter(entry.target);
              observer.unobserve(entry.target);
            });
          },
          { root: null, rootMargin: "0px 0px -50px 0px", threshold: 0.4 },
        );
        counters.forEach((counter) => counterObserver.observe(counter));
        cleanupCallbacks.push(() => counterObserver.disconnect());
      }
    }

    const revealElements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (revealElements.length > 0) {
      if (reducedMotionQuery.matches || !("IntersectionObserver" in window)) {
        revealElements.forEach((element) => element.classList.add("is-visible"));
      } else {
        const revealObserver = new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting || !(entry.target instanceof HTMLElement)) {
                return;
              }

              const delay = Number.parseInt(entry.target.dataset.revealDelay ?? "0", 10);
              schedule(
                () => entry.target.classList.add("is-visible"),
                Number.isNaN(delay) ? 0 : delay,
              );
              observer.unobserve(entry.target);
            });
          },
          { root: null, rootMargin: "0px 0px -80px 0px", threshold: 0.1 },
        );
        revealElements.forEach((element) => revealObserver.observe(element));
        cleanupCallbacks.push(() => revealObserver.disconnect());
      }
    }

    const nav = document.getElementById("nav");
    const navToggle = document.getElementById("navToggle");
    const mobileMenu = document.getElementById("navMobile");
    const navBackdrop = document.getElementById("navBackdrop");
    const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>(".nav__link"));
    const mobileLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(".nav__mobile-link"),
    );
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));

    if (nav && navToggle && mobileMenu) {
      let menuOpen = false;
      let previousBodyOverflow = "";
      let previousBodyPaddingRight = "";
      let previousScrollPosition = window.scrollY;
      let scrollTicking = false;

      const setMenuState = (isOpen: boolean) => {
        menuOpen = isOpen;
        mobileMenu.classList.toggle("is-open", isOpen);
        navBackdrop?.classList.toggle("is-visible", isOpen);
        navToggle.classList.toggle("is-active", isOpen);
        navToggle.setAttribute("aria-expanded", String(isOpen));
        navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
        mobileMenu.setAttribute("aria-hidden", String(!isOpen));
        navBackdrop?.setAttribute("aria-hidden", String(!isOpen));

        if (isOpen) {
          previousBodyOverflow = body.style.overflow;
          previousBodyPaddingRight = body.style.paddingRight;
          body.style.overflow = "hidden";
          body.style.paddingRight = `${window.innerWidth - documentElement.clientWidth}px`;
        } else {
          body.style.overflow = previousBodyOverflow;
          body.style.paddingRight = previousBodyPaddingRight;
        }
      };

      const handleMenuToggle = () => setMenuState(!menuOpen);
      const handleBackdropClick = () => setMenuState(false);
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape" && menuOpen) {
          setMenuState(false);
          navToggle.focus();
        }
      };
      const handleResize = () => {
        if (window.innerWidth >= 900 && menuOpen) {
          setMenuState(false);
        }
      };
      const setActiveLink = (sectionId: string) => {
        [...navLinks, ...mobileLinks].forEach((link) => {
          const isActive = link.getAttribute("href") === `#${sectionId}`;
          link.classList.toggle("is-active", isActive);
          if (link.classList.contains("nav__link")) {
            if (isActive) {
              link.setAttribute("aria-current", "page");
            } else {
              link.removeAttribute("aria-current");
            }
          }
        });
      };
      const updateNavOnScroll = () => {
        const currentScrollPosition = window.scrollY;
        nav.classList.toggle("is-scrolled", currentScrollPosition > 20);

        if (window.innerWidth < 900) {
          const shouldHide =
            currentScrollPosition > previousScrollPosition &&
            currentScrollPosition > 200 &&
            !menuOpen;
          nav.classList.toggle("is-hidden", shouldHide);
        } else {
          nav.classList.remove("is-hidden");
        }

        previousScrollPosition = currentScrollPosition;
        scrollTicking = false;
      };
      const handleScroll = () => {
        if (!scrollTicking) {
          scrollTicking = true;
          window.requestAnimationFrame(updateNavOnScroll);
        }
      };
      const handleMobileLinkClick = () => schedule(() => setMenuState(false), 150);

      navToggle.addEventListener("click", handleMenuToggle);
      navBackdrop?.addEventListener("click", handleBackdropClick);
      document.addEventListener("keydown", handleEscape);
      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleScroll, { passive: true });
      mobileLinks.forEach((link) => link.addEventListener("click", handleMobileLinkClick));
      cleanupCallbacks.push(() => {
        navToggle.removeEventListener("click", handleMenuToggle);
        navBackdrop?.removeEventListener("click", handleBackdropClick);
        document.removeEventListener("keydown", handleEscape);
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleScroll);
        mobileLinks.forEach((link) => link.removeEventListener("click", handleMobileLinkClick));
      });

      updateNavOnScroll();
      setActiveLink(window.location.hash.slice(1) || "home");

      if (sections.length > 0 && "IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && entry.target instanceof HTMLElement) {
                setActiveLink(entry.target.id);
              }
            });
          },
          { root: null, rootMargin: "-20% 0px -60% 0px", threshold: 0 },
        );
        sections.forEach((section) => sectionObserver.observe(section));
        cleanupCallbacks.push(() => sectionObserver.disconnect());
      }
    }

    const anchorLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
    const anchorHandlers = anchorLinks.map((anchor) => {
      const handler = (event: MouseEvent) => {
        const targetSelector = anchor.getAttribute("href");
        if (!targetSelector || targetSelector === "#" || targetSelector.length < 2) {
          return;
        }

        const target = document.querySelector<HTMLElement>(targetSelector);
        const navHeight = document.getElementById("nav")?.offsetHeight ?? 0;
        if (!target) {
          return;
        }

        event.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - navHeight - 20,
          behavior: "smooth",
        });
        window.history.pushState(null, "", targetSelector);
      };
      anchor.addEventListener("click", handler);
      return { anchor, handler };
    });
    cleanupCallbacks.push(() => {
      anchorHandlers.forEach(({ anchor, handler }) => anchor.removeEventListener("click", handler));
    });

    const year = document.getElementById("year");
    if (year) {
      year.textContent = String(new Date().getFullYear());
    }

    const handleImageError = (image: HTMLImageElement) => {
      if (image.dataset.errorHandled) {
        return;
      }

      image.dataset.errorHandled = "true";
      const parent = image.parentElement;
      if (parent) {
        parent.style.background = "linear-gradient(135deg, #F3EEE4, #E8DFD1)";
        parent.style.display = "flex";
        parent.style.alignItems = "center";
        parent.style.justifyContent = "center";
        parent.style.color = "#8B7F73";
        parent.style.fontSize = "2rem";

        const icon = document.createElement("span");
        icon.textContent = "📷";
        icon.setAttribute("aria-hidden", "true");
        icon.style.opacity = "0.4";
        parent.appendChild(icon);
      }
      image.style.display = "none";
    };
    const images = Array.from(document.images);
    const imageHandlers = images.map((image) => {
      const handler = () => handleImageError(image);
      image.addEventListener("error", handler, { once: true });
      if (image.complete && image.naturalWidth === 0) {
        handleImageError(image);
      }
      return { image, handler };
    });
    cleanupCallbacks.push(() => {
      imageHandlers.forEach(({ image, handler }) => image.removeEventListener("error", handler));
    });

    document.querySelectorAll<HTMLAnchorElement>('a[href^="http"]').forEach((link) => {
      try {
        const destination = new URL(link.href);
        if (destination.origin !== window.location.origin) {
          link.rel = link.rel || "noopener noreferrer";
          link.target = link.target || "_blank";
        }
      } catch {
        // Ignore malformed third-party URLs; browser navigation remains unchanged.
      }
    });

    const mailLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('a[href^="mailto:"]'),
    );
    const mailHandlers = mailLinks.map((link) => {
      const handler = () => {
        const email = link.href.replace(/^mailto:/u, "");
        if (navigator.clipboard) {
          void navigator.clipboard.writeText(email).catch(() => undefined);
        }
      };
      link.addEventListener("click", handler);
      return { link, handler };
    });
    cleanupCallbacks.push(() => {
      mailHandlers.forEach(({ link, handler }) => link.removeEventListener("click", handler));
    });

    return () => {
      pendingTimeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
      cleanupCallbacks.forEach((cleanup) => cleanup());
    };
  }, []);
}
