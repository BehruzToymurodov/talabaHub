import { Bookmark, BookmarkCheck } from "lucide-react";
import { Link } from "react-router-dom";
import type { Deal } from "../../types";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { formatDate } from "../../utils/date";
import { useT } from "../../i18n";
import { categoryLabelKeys } from "../../features/deals/constants";
import { resolveAssetPath } from "../../utils/assets";
import { useLocaleStore } from "../../app/store/useLocaleStore";
import { getDealTitle } from "../../utils/dealText";

type Props = {
  deal: Deal;
  locked?: boolean;
  saved?: boolean;
  onToggleSave?: () => void;
  linkTo?: string;
};

export function DealCard({ deal, locked, saved, onToggleSave, linkTo }: Props) {
  const target = linkTo ?? `/deal/${deal.id}`;
  const t = useT();
  const locale = useLocaleStore((state) => state.locale);
  const logoSrc = resolveAssetPath(deal.image, "brands");
  const bannerSrc = resolveAssetPath(deal.bannerImage, "banners");
  const logoText = deal.image ?? deal.brand.slice(0, 2).toUpperCase();
  const title = getDealTitle(deal, locale);

  return (
    <Card className="relative flex h-full flex-col overflow-hidden border border-border bg-background transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      {locked && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-background/90 p-4 text-center backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t("deals.locked.title")}
          </p>
          <Button asChild size="sm">
            <Link to={target}>{t("action.verifyToUnlock")}</Link>
          </Button>
        </div>
      )}
      <div className="relative">
        <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted">
          {bannerSrc ? (
            <img
              src={bannerSrc}
              alt={`${deal.brand} promo`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/10 via-accent/20 to-transparent" />
          )}
        </div>
        <div className="absolute left-3 top-3 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm">
          {logoSrc ? (
            <img
              src={logoSrc}
              alt={`${deal.brand} logo`}
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-xs font-semibold">{logoText}</span>
          )}
        </div>
        {onToggleSave && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSave}
            aria-label={t("action.save")}
            className="absolute right-3 top-3 bg-white/90 shadow-sm"
          >
            {saved ? (
              <BookmarkCheck className="h-4 w-4" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      <div className="flex flex-1 flex-col space-y-1 px-4 pb-4 pt-3">
        <h3 className="line-clamp-2 text-lg font-semibold text-foreground">
          {title}
        </h3>
        <p className="text-sm uppercase tracking-widest text-muted-foreground">
          {deal.brand}
        </p>
        <p className="text-sm text-muted-foreground">
          {deal.verifiedOnly ? t("deals.verifiedOnly") : t(categoryLabelKeys[deal.category])}
          <span className="mx-1">•</span>
          {t("label.expires", { date: formatDate(deal.expiresAt) })}
        </p>
        <Button asChild size="sm" className="mt-auto w-full">
          <Link to={target}>{t("action.viewDeal")}</Link>
        </Button>
      </div>
    </Card>
  );
}
