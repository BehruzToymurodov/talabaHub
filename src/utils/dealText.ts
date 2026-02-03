import type { Deal } from "../types";
import type { Locale } from "../i18n/translations";
import { dealTitleI18n } from "../features/deals/dealTitleI18n";

export function getDealTitle(deal: Deal, locale: Locale) {
  return (
    deal.titleI18n?.[locale] ??
    dealTitleI18n[deal.id]?.[locale] ??
    deal.title
  );
}
