import { Link } from "react-router-dom";
import type { Deal } from "../../../types";
import { Button } from "../../../components/ui/button";
import { CompactDealCard } from "./CompactDealCard";
import { useT } from "../../../i18n";
import { Card } from "../../../components/ui/card";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ROW_ITEM_CLASS = "w-full";
const PAGE_SIZE = 4;

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
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(deals.length / PAGE_SIZE));
  const pageDeals = useMemo(() => {
    const start = page * PAGE_SIZE;
    return deals.slice(start, start + PAGE_SIZE);
  }, [deals, page]);

  if (deals.length === 0) return null;

  return (
    <section className="group mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold">{title}</h2>
          <p className="text-base text-muted-foreground">{subtitle}</p>
        </div>
        <Button asChild variant="ghost">
          <Link to={viewMoreHref}>{t("action.viewMore")}</Link>
        </Button>
      </div>
      <div className="relative mt-4">
        <div className="rounded-3xl border border-border bg-card/70 p-4 shadow-sm">
          <div
            key={page}
            className="grid gap-4 transition-all duration-300 ease-out animate-fade-up sm:grid-cols-2 lg:grid-cols-4"
          >
            {pageDeals.map((deal) => (
              <div key={deal.id} className={ROW_ITEM_CLASS}>
                <CompactDealCard
                  deal={deal}
                  locked={lockedDeals.has(deal.id)}
                  ctaHref={verifyHref}
                  viewHref={`${viewDealPrefix}${deal.id}`}
                />
              </div>
            ))}
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 z-20 hidden -translate-x-full -translate-y-1/2 bg-primary text-primary-foreground shadow-lg opacity-0 invisible transition-all duration-200 pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto md:inline-flex"
          onClick={() => setPage((prev) => Math.max(0, prev - 1))}
          disabled={page === 0}
          aria-label={t("action.prev")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 z-20 hidden translate-x-full -translate-y-1/2 bg-primary text-primary-foreground shadow-lg opacity-0 invisible transition-all duration-200 pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto md:inline-flex"
          onClick={() => setPage((prev) => Math.min(totalPages - 1, prev + 1))}
          disabled={page >= totalPages - 1}
          aria-label={t("action.next")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
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
