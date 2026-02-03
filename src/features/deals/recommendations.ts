import type { Deal } from "../../types";

export function getRecommendations(deals: Deal[], currentId: string, category: string) {
  return deals
    .filter((deal) => deal.id !== currentId && deal.category === category)
    .slice(0, 4);
}
