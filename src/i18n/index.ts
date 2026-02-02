import { useCallback } from "react";
import { useLocaleStore } from "../app/store/useLocaleStore";
import { translations, type Locale } from "./translations";

export function translate(
  locale: Locale,
  key: string,
  vars?: Record<string, string | number>
) {
  const template =
    translations[locale]?.[key] ?? translations.en?.[key] ?? key;
  if (!vars) return template;
  return Object.keys(vars).reduce((acc, currentKey) => {
    return acc.replace(`{${currentKey}}`, String(vars[currentKey]));
  }, template);
}

export function useT() {
  const locale = useLocaleStore((state) => state.locale);
  return useCallback(
    (key: string, vars?: Record<string, string | number>) =>
      translate(locale, key, vars),
    [locale]
  );
}
