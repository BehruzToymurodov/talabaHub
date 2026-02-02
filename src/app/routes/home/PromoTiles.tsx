import { Link } from "react-router-dom";
import type { DealCategory, Deal } from "../../../types";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { useT } from "../../../i18n";
import { categoryLabelKeys } from "../../../features/deals/constants";

export type PromoTile = {
  category: DealCategory;
  descriptionKey: string;
  accentClass: string;
};

type Props = {
  tiles: PromoTile[];
  deals: Deal[];
};

export function PromoTiles({ tiles, deals }: Props) {
  const t = useT();
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6">
      <div className="grid gap-3 md:grid-cols-3">
        {tiles.map((tile) => {
          const count = deals.filter((deal) => deal.category === tile.category)
            .length;
          const label = t(categoryLabelKeys[tile.category]);
          return (
            <Card
              key={tile.category}
              className={`group relative overflow-hidden border border-border p-5 transition hover:-translate-y-0.5 hover:shadow-md ${tile.accentClass}`}
            >
              <div className="space-y-2">
                <Badge variant="secondary">{label}</Badge>
                <h3 className="text-lg font-semibold">{t(tile.descriptionKey)}</h3>
                <p className="text-xs text-muted-foreground">
                  {count} {t("nav.deals")}
                </p>
              </div>
              <Link
                to={`/deals?category=${encodeURIComponent(tile.category)}`}
                className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label={`${label} ${t("action.viewMore")}`}
              />
            </Card>
          );
        })}
      </div>
    </section>
  );
}
