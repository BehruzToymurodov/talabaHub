import { Lock, Bookmark, BookmarkCheck } from "lucide-react";
import { Link } from "react-router-dom";
import type { Deal } from "../../types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { cn } from "../../utils/cn";
import { formatDate, daysUntil } from "../../utils/date";
import { useT } from "../../i18n";
import { categoryLabelKeys } from "../../features/deals/constants";
import { resolveAssetPath } from "../../utils/assets";

type Props = {
  deal: Deal;
  locked?: boolean;
  saved?: boolean;
  onToggleSave?: () => void;
  linkTo?: string;
};

export function DealCard({ deal, locked, saved, onToggleSave, linkTo }: Props) {
  const expiringSoon = daysUntil(deal.expiresAt) <= 14;
  const target = linkTo ?? `/deal/${deal.id}`;
  const t = useT();
  const logoSrc = resolveAssetPath(deal.image, "brands");
  const bannerSrc = resolveAssetPath(deal.bannerImage, "banners");
  const logoText = deal.image ?? deal.brand.slice(0, 2).toUpperCase();

  return (
    <Card className={cn("relative overflow-hidden transition hover:-translate-y-1 hover:shadow-lg")}> 
      {locked && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-background/90 text-center backdrop-blur">
          <Lock className="h-5 w-5 text-muted-foreground" />
          <p className="text-sm font-semibold">{t("deals.locked.title")}</p>
          <p className="text-xs text-muted-foreground">
            {t("deals.locked.subtitle")}
          </p>
        </div>
      )}
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-muted text-sm font-semibold">
              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt={`${deal.brand} logo`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{logoText}</span>
              )}
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {deal.brand}
              </p>
              <h3 className="text-lg font-semibold">{deal.title}</h3>
            </div>
          </div>
          {onToggleSave && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSave}
              aria-label={t("action.save")}
            >
              {saved ? (
                <BookmarkCheck className="h-5 w-5" />
              ) : (
                <Bookmark className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{t(categoryLabelKeys[deal.category])}</Badge>
          {deal.verifiedOnly && (
            <Badge variant="warning">{t("deals.verifiedOnly")}</Badge>
          )}
          {expiringSoon && (
            <Badge variant="outline">
              {t("deals.expires", { date: formatDate(deal.expiresAt) })}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{deal.description}</p>
        <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-3 text-xs text-muted-foreground">
          {deal.terms}
        </div>
        <div className="overflow-hidden rounded-2xl border border-border">
          {bannerSrc ? (
            <img
              src={bannerSrc}
              alt={`${deal.brand} promo`}
              className="h-24 w-full object-cover"
            />
          ) : (
            <div className="relative h-24 bg-gradient-to-r from-primary/15 via-accent/20 to-transparent">
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/20 blur-xl" />
              <div className="absolute left-6 bottom-2 h-14 w-14 rounded-full bg-accent/30 blur-lg" />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          {t("deals.expiresAt", { date: formatDate(deal.expiresAt) })}
        </div>
        <Button asChild size="sm">
          <Link to={target}>{t("action.viewDeal")}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
