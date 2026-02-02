import { Link } from "react-router-dom";
import type { Deal } from "../../../types";
import { Button } from "../../../components/ui/button";
import { CompactDealCard } from "./CompactDealCard";
import { useT } from "../../../i18n";
import { Card } from "../../../components/ui/card";

const GRID_CLASS =
  "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-4";

type Props = {
  title: string;
  subtitle: string;
  deals: Deal[];
  lockedDeals: Set<string>;
  viewMoreHref: string;
  verifyHref: string;
  viewDealPrefix: string;
};

export function HomeSection({
  title,
  subtitle,
  deals,
  lockedDeals,
  viewMoreHref,
  verifyHref,
  viewDealPrefix,
}: Props) {
  const t = useT();

  if (deals.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <Button asChild variant="ghost">
          <Link to={viewMoreHref}>{t("action.viewMore")}</Link>
        </Button>
      </div>
      <div className={`mt-4 ${GRID_CLASS}`}>
        {deals.map((deal) => (
          <CompactDealCard
            key={deal.id}
            deal={deal}
            locked={lockedDeals.has(deal.id)}
            ctaHref={verifyHref}
            viewHref={`${viewDealPrefix}${deal.id}`}
          />
        ))}
      </div>
    </section>
  );
}

export function HomeEmptyState({ onClear }: { onClear: () => void }) {
  const t = useT();
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6">
      <Card className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-center">
        <h3 className="text-lg font-semibold">{t("deals.noResultsTitle")}</h3>
        <p className="text-sm text-muted-foreground">{t("deals.noResultsDesc")}</p>
        <Button variant="outline" onClick={onClear}>
          {t("action.clearSearch")}
        </Button>
      </Card>
    </div>
  );
}
