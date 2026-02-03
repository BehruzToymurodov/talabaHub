import type { Deal } from "../../types";
import type { Locale } from "../../i18n/translations";
import { getDealTitle } from "../../utils/dealText";

type Filters = {
  search: string;
  category: string;
  sort: string;
  locale?: Locale;
};

export function filterDeals(deals: Deal[], filters: Filters) {
  const localizedTitle = (deal: Deal) =>
    filters.locale ? getDealTitle(deal, filters.locale) : deal.title;
  let next = [...deals];
  if (filters.search) {
    const term = filters.search.toLowerCase();
    next = next.filter(
      (deal) =>
        deal.brand.toLowerCase().includes(term) ||
        localizedTitle(deal).toLowerCase().includes(term)
    );
  }
  if (filters.category && filters.category !== "All") {
    next = next.filter((deal) => deal.category === filters.category);
  }
  if (filters.sort === "new") {
    next.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  if (filters.sort === "expiring") {
    next.sort((a, b) => a.expiresAt.localeCompare(b.expiresAt));
  }
  if (filters.sort === "trending") {
    next.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
  return next;
}
