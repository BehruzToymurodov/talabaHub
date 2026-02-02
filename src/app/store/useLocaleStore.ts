import { create } from "zustand";
import type { Locale } from "../../i18n/translations";

const STORAGE_KEY = "talabahub:locale";

type LocaleState = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  hydrate: () => void;
};

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: "uz",
  setLocale: (locale) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, locale);
      document.documentElement.lang = locale;
    }
    set({ locale });
  },
  hydrate: () => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    const locale = stored ?? "uz";
    document.documentElement.lang = locale;
    set({ locale });
  },
}));
