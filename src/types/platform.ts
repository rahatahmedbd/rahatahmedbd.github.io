import type { PortfolioLanguage, PortfolioTheme } from "@/types/portfolio";

export type Experience = "website" | "rahatverse";
export type TourMode = "auto" | "explore" | "guide";
export type TimeOfDay = "morning" | "day" | "evening" | "night";
export type Weather = "sunny" | "cloudy" | "rain";
export type GraphicsQuality = "low" | "medium" | "high";

export interface UserPreferences {
  reducedMotion: boolean;
  compactNavigation: boolean;
}

export interface RahatVerseSettings {
  graphics: GraphicsQuality;
  sound: boolean;
  music: boolean;
  motion: boolean;
  timeOfDay: TimeOfDay;
  weather: Weather;
}

export interface TourProgress {
  currentStopId: string;
  currentStopIndex: number;
  mode: TourMode;
  isPlaying: boolean;
  completed: boolean;
}

export interface OrderFormData {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  message: string;
}

export interface OrderDraft {
  currentStep: number;
  selectedTypeId: string | null;
  selectedPackageId: string | null;
  selectedExtras: string[];
  formData: OrderFormData;
  isSubmitted: boolean;
  orderId: string;
}

export interface PlatformState {
  currentExperience: Experience;
  currentTheme: PortfolioTheme;
  language: PortfolioLanguage;
  userPreferences: UserPreferences;
  tourProgress: TourProgress;
  settings: RahatVerseSettings;
  orderDraft: OrderDraft;
}

export type PlatformStatePatch = Partial<
  Omit<PlatformState, "userPreferences" | "tourProgress" | "settings" | "orderDraft">
> & {
  userPreferences?: Partial<UserPreferences>;
  tourProgress?: Partial<TourProgress>;
  settings?: Partial<RahatVerseSettings>;
  orderDraft?: Partial<OrderDraft>;
};
