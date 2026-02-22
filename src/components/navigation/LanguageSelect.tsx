import { useLocaleStore } from "../../app/store/useLocaleStore";
import { useT } from "../../i18n";
import { localeNames, type Locale } from "../../i18n/translations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function LanguageSelect() {
  const locale = useLocaleStore((state) => state.locale);
  const setLocale = useLocaleStore((state) => state.setLocale);
  const t = useT();
  const localeFlags: Record<Locale, string> = {
    uz: "🇺🇿",
    ru: "🇷🇺",
    en: "🇺🇸",
  };

  return (
    <Select value={locale} onValueChange={(value) => setLocale(value as Locale)}>
      <SelectTrigger
        aria-label={`${t("label.language")}: ${localeNames[locale]}`}
        className="h-9 w-11 justify-center px-2 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 sm:w-[140px] sm:justify-between sm:px-4"
      >
        <span className="text-lg sm:hidden" aria-hidden="true">
          {localeFlags[locale]}
        </span>
        <SelectValue className="hidden sm:inline" />
        <span className="sr-only sm:hidden">{localeNames[locale]}</span>
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(localeNames) as Locale[]).map((key) => (
          <SelectItem
            key={key}
            value={key}
            textValue={localeNames[key]}
            aria-label={localeNames[key]}
            leading={
              <span className="text-lg sm:hidden" aria-hidden="true">
                {localeFlags[key]}
              </span>
            }
          >
            <span className="hidden sm:inline">{localeNames[key]}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
