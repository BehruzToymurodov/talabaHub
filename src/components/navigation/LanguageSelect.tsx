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

  return (
    <Select value={locale} onValueChange={(value) => setLocale(value as Locale)}>
      <SelectTrigger className="h-9 w-[140px]">
        <SelectValue placeholder={t("label.language")} />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(localeNames) as Locale[]).map((key) => (
          <SelectItem key={key} value={key}>
            {localeNames[key]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
