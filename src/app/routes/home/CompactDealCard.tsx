import { Link } from "react-router-dom";
import type { Deal } from "../../../types";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { useT } from "../../../i18n";
import { categoryLabelKeys } from "../../../features/deals/constants";
import { formatDate } from "../../../utils/date";
import { resolveAssetPath } from "../../../utils/assets";

type Props = {
  deal: Deal;
  locked: boolean;
  ctaHref: string;
  viewHref: string;
};

export function CompactDealCard({ deal, locked, ctaHref, viewHref }: Props) {
  const t = useT();
  const logoSrc = resolveAssetPath(deal.image, "brands");
  const bannerSrc = resolveAssetPath(deal.bannerImage, "banners");

  return (
    <Card className="relative overflow-hidden p-3 transition hover:-translate-y-0.5 hover:shadow-md">
      {locked && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-background/90 p-4 text-center backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t("deals.locked.title")}
          </p>
          <Button asChild size="sm">
            <Link to={ctaHref}>{t("action.verifyToUnlock")}</Link>
          </Button>
        </div>
      )}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-muted">
          {logoSrc ? (
            <img
              src={logoSrc}
              alt={`${deal.brand} logo`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs font-semibold">
              {deal.brand.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {deal.brand}
          </p>
          <h3 className="line-clamp-2 text-sm font-semibold">
            {deal.title}
          </h3>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        <Badge variant="secondary" className="text-[10px]">
          {t(categoryLabelKeys[deal.category])}
        </Badge>
        {deal.verifiedOnly && (
          <Badge variant="warning" className="text-[10px]">
            {t("deals.verifiedOnly")}
          </Badge>
        )}
      </div>
      <div className="mt-3 overflow-hidden rounded-xl border border-border">
        {bannerSrc ? (
          <img
            src={bannerSrc}
            alt={`${deal.brand} promo`}
            className="h-16 w-full object-cover"
          />
        ) : (
          <div className="relative h-16 bg-gradient-to-r from-primary/10 via-accent/20 to-transparent" />
        )}
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{t("label.expires", { date: formatDate(deal.expiresAt) })}</span>
        <Button asChild size="sm" variant="outline" className="h-8 px-3">
          <Link to={viewHref}>{t("action.viewDeal")}</Link>
        </Button>
      </div>
    </Card>
  );
}
