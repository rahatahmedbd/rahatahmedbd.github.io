"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  Experience,
  GraphicsQuality,
  OrderDraft,
  PlatformState,
  PlatformStatePatch,
  RahatVerseSettings,
  TimeOfDay,
  TourMode,
  TourProgress,
  UserPreferences,
  Weather,
} from "@/types/platform";
import type { PortfolioLanguage, PortfolioTheme } from "@/types/portfolio";
import { initialOrderFormData } from "@/data/platform";
import { readBrowserStorage, writeBrowserStorage } from "@/utils/browser-storage";

const PLATFORM_STORAGE_KEY = "rahat-platform-state-v1";

const initialOrderDraft: OrderDraft = {
  currentStep: 1,
  selectedTypeId: null,
  selectedPackageId: null,
  selectedExtras: [],
  formData: initialOrderFormData,
  isSubmitted: false,
  orderId: "",
};

const initialPlatformState: PlatformState = {
  currentExperience: "website",
  currentTheme: "light",
  language: "bn",
  userPreferences: {
    reducedMotion: false,
    compactNavigation: false,
  },
  tourProgress: {
    currentStopId: "website-store",
    currentStopIndex: 0,
    mode: "auto",
    isPlaying: true,
    completed: false,
  },
  settings: {
    graphics: "medium",
    sound: true,
    music: false,
    motion: true,
    timeOfDay: "day",
    weather: "sunny",
  },
  orderDraft: initialOrderDraft,
};

interface PlatformContextValue extends PlatformState {
  hydrated: boolean;
  setExperience: (experience: Experience) => void;
  setTheme: (theme: PortfolioTheme) => void;
  setLanguage: (language: PortfolioLanguage) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  updateTourProgress: (progress: Partial<TourProgress>) => void;
  updateSettings: (settings: Partial<RahatVerseSettings>) => void;
  updateOrderDraft: (draft: Partial<OrderDraft>) => void;
  resetOrderDraft: () => void;
}

const PlatformContext = createContext<PlatformContextValue | null>(null);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isExperience(value: unknown): value is Experience {
  return value === "website" || value === "rahatverse";
}

function isTheme(value: unknown): value is PortfolioTheme {
  return value === "light" || value === "dark";
}

function isLanguage(value: unknown): value is PortfolioLanguage {
  return value === "bn" || value === "en";
}

function isTourMode(value: unknown): value is TourMode {
  return value === "auto" || value === "explore" || value === "guide";
}

function isGraphicsQuality(value: unknown): value is GraphicsQuality {
  return value === "low" || value === "medium" || value === "high";
}

function isTimeOfDay(value: unknown): value is TimeOfDay {
  return value === "morning" || value === "day" || value === "evening" || value === "night";
}

function isWeather(value: unknown): value is Weather {
  return value === "sunny" || value === "cloudy" || value === "rain";
}

function readBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function readString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function readNumber(
  value: unknown,
  fallback: number,
  minimum = 0,
  maximum = Number.MAX_SAFE_INTEGER,
): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(Math.max(Math.floor(value), minimum), maximum);
}

function hydrateState(value: unknown): PlatformState {
  if (!isRecord(value)) return initialPlatformState;

  const userPreferences = isRecord(value.userPreferences) ? value.userPreferences : {};
  const persistedTour = isRecord(value.tourProgress) ? value.tourProgress : {};
  const persistedSettings = isRecord(value.settings) ? value.settings : {};

  return {
    ...initialPlatformState,
    currentExperience: isExperience(value.currentExperience)
      ? value.currentExperience
      : initialPlatformState.currentExperience,
    currentTheme: isTheme(value.currentTheme)
      ? value.currentTheme
      : initialPlatformState.currentTheme,
    language: isLanguage(value.language) ? value.language : initialPlatformState.language,
    userPreferences: {
      reducedMotion: readBoolean(
        userPreferences.reducedMotion,
        initialPlatformState.userPreferences.reducedMotion,
      ),
      compactNavigation: readBoolean(
        userPreferences.compactNavigation,
        initialPlatformState.userPreferences.compactNavigation,
      ),
    },
    tourProgress: {
      currentStopId: readString(
        persistedTour.currentStopId,
        initialPlatformState.tourProgress.currentStopId,
      ),
      currentStopIndex: readNumber(
        persistedTour.currentStopIndex,
        initialPlatformState.tourProgress.currentStopIndex,
        0,
        99,
      ),
      mode: isTourMode(persistedTour.mode)
        ? persistedTour.mode
        : initialPlatformState.tourProgress.mode,
      isPlaying: readBoolean(persistedTour.isPlaying, initialPlatformState.tourProgress.isPlaying),
      completed: readBoolean(persistedTour.completed, initialPlatformState.tourProgress.completed),
    },
    settings: {
      graphics: isGraphicsQuality(persistedSettings.graphics)
        ? persistedSettings.graphics
        : initialPlatformState.settings.graphics,
      sound: readBoolean(persistedSettings.sound, initialPlatformState.settings.sound),
      music: readBoolean(persistedSettings.music, initialPlatformState.settings.music),
      motion: readBoolean(persistedSettings.motion, initialPlatformState.settings.motion),
      timeOfDay: isTimeOfDay(persistedSettings.timeOfDay)
        ? persistedSettings.timeOfDay
        : initialPlatformState.settings.timeOfDay,
      weather: isWeather(persistedSettings.weather)
        ? persistedSettings.weather
        : initialPlatformState.settings.weather,
    },
    // Contact details intentionally stay in memory. They are never written to
    // localStorage; this keeps the convenience of route switching without
    // persisting personal information in a long-lived browser store.
    orderDraft: initialOrderDraft,
  };
}

function serializeState(state: PlatformState): string {
  return JSON.stringify({
    currentExperience: state.currentExperience,
    currentTheme: state.currentTheme,
    language: state.language,
    userPreferences: state.userPreferences,
    tourProgress: state.tourProgress,
    settings: state.settings,
  });
}

export function PlatformProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [state, setState] = useState<PlatformState>(initialPlatformState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const hydrationId = window.setTimeout(() => {
      const savedState = readBrowserStorage(PLATFORM_STORAGE_KEY);
      if (savedState) {
        try {
          setState(hydrateState(JSON.parse(savedState) as unknown));
        } catch {
          // A malformed preference blob should never prevent the site from loading.
        }
      }
      setHydrated(true);
    }, 0);

    return () => window.clearTimeout(hydrationId);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeBrowserStorage(PLATFORM_STORAGE_KEY, serializeState(state));
  }, [hydrated, state]);

  useEffect(() => {
    document.documentElement.dataset.theme = state.currentTheme;
    document.documentElement.lang = state.language;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", state.currentTheme === "dark" ? "#0a0c12" : "#7A0C2E");
    document.body.classList.remove("preload");
  }, [state.currentTheme, state.language]);

  const routeExperience: Experience | null = pathname
    ? pathname.startsWith("/rahatverse")
      ? "rahatverse"
      : "website"
    : null;
  const updateState = useCallback((patch: PlatformStatePatch) => {
    setState((previous) => ({
      ...previous,
      ...patch,
      userPreferences: patch.userPreferences
        ? { ...previous.userPreferences, ...patch.userPreferences }
        : previous.userPreferences,
      tourProgress: patch.tourProgress
        ? { ...previous.tourProgress, ...patch.tourProgress }
        : previous.tourProgress,
      settings: patch.settings ? { ...previous.settings, ...patch.settings } : previous.settings,
      orderDraft: patch.orderDraft
        ? { ...previous.orderDraft, ...patch.orderDraft }
        : previous.orderDraft,
    }));
  }, []);

  const setExperience = useCallback(
    (experience: Experience) => updateState({ currentExperience: experience }),
    [updateState],
  );
  const setTheme = useCallback(
    (theme: PortfolioTheme) => updateState({ currentTheme: theme }),
    [updateState],
  );
  const setLanguage = useCallback(
    (language: PortfolioLanguage) => updateState({ language }),
    [updateState],
  );
  const updatePreferences = useCallback(
    (preferences: Partial<UserPreferences>) => updateState({ userPreferences: preferences }),
    [updateState],
  );
  const updateTourProgress = useCallback(
    (progress: Partial<TourProgress>) => updateState({ tourProgress: progress }),
    [updateState],
  );
  const updateSettings = useCallback(
    (settings: Partial<RahatVerseSettings>) => updateState({ settings }),
    [updateState],
  );
  const updateOrderDraft = useCallback(
    (draft: Partial<OrderDraft>) => updateState({ orderDraft: draft }),
    [updateState],
  );
  const resetOrderDraft = useCallback(
    () =>
      updateState({ orderDraft: { ...initialOrderDraft, formData: { ...initialOrderFormData } } }),
    [updateState],
  );

  const value = useMemo<PlatformContextValue>(() => {
    const effectiveState = routeExperience
      ? { ...state, currentExperience: routeExperience }
      : state;

    return {
      ...effectiveState,
      hydrated,
      setExperience,
      setTheme,
      setLanguage,
      updatePreferences,
      updateTourProgress,
      updateSettings,
      updateOrderDraft,
      resetOrderDraft,
    };
  }, [
    routeExperience,
    state,
    hydrated,
    resetOrderDraft,
    setExperience,
    setLanguage,
    setTheme,
    updateOrderDraft,
    updatePreferences,
    updateSettings,
    updateTourProgress,
  ]);

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
}

export function usePlatform(): PlatformContextValue {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error("usePlatform must be used inside PlatformProvider");
  }
  return context;
}

export { initialOrderDraft };
