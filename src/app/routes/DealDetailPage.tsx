import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Lock, ExternalLink } from "lucide-react";
import type { Deal } from "../../types";
import { dealsApi } from "../../services/api/deals";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { formatDate } from "../../utils/date";
import { resolveAssetPath } from "../../utils/assets";
import { useT } from "../../i18n";
import { categoryLabelKeys } from "../../features/deals/constants";
import { brandStories } from "../../features/deals/brandCopy";
import { getRecommendations } from "../../features/deals/recommendations";
import { CompactDealCard } from "./home/CompactDealCard";
import { useDeals } from "../../features/deals/useDeals";

export function DealDetailPage() {
  const { id } = useParams();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const t = useT();
  const { deals } = useDeals();

  useEffect(() => {
    if (!id) return;
    dealsApi
      .getById(id)
      .then(setDeal)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container py-12">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="container py-12">
        <p className="text-sm text-muted-foreground">
          {t("dealDetails.dealNotFound")}
        </p>
      </div>
    );
  }

  const brandCopy = brandStories[deal.brand] ?? t("dealDetails.brandFallback");
  const bannerSrc = resolveAssetPath(deal.bannerImage, "banners");
  const sameBrand = deals.filter((item) => item.brand === deal.brand);
  const sameCategory = deals.filter((item) => item.category === deal.category);
  const recommendations = getRecommendations(deals, deal.id, deal.category);

  return (
    <div className="container grid gap-6 py-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
      {bannerSrc && (
        <div className="lg:col-span-2 overflow-hidden rounded-3xl border border-border bg-muted">
          <img
            src={bannerSrc}
            alt={`${deal.brand} banner`}
            className="h-48 w-full object-cover sm:h-64 lg:h-72"
          />
        </div>
      )}
      <div className="space-y-4">
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-muted">
              {deal.image ? (
                <img src={deal.image} alt={deal.brand} className="h-full w-full object-contain" />
              ) : (
                <span className="text-lg font-semibold">{deal.brand.slice(0, 2)}</span>
              )}
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">{deal.brand} {t("dealDetails.studentDiscounts")}</h2>
              <p className="text-sm text-muted-foreground">{brandCopy}</p>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span>{sameBrand.length} {t("dealDetails.brandDeals")}</span>
                <span>•</span>
                <span>{t(categoryLabelKeys[deal.category])}</span>
                <span>•</span>
                <span>{sameCategory.length} {t("dealDetails.similarDeals")}</span>
              </div>
            </div>
          </div>
        </section>
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {t("label.expiresShort")}
                </p>
                <p className="text-sm font-semibold">{formatDate(deal.expiresAt)}</p>
              </div>
              {deal.redemptionUrl && (
                <Button asChild variant="outline" size="sm">
                  <a href={deal.redemptionUrl} target="_blank" rel="noreferrer">
                    {t("dealDetails.visitSite")}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
            <div className="rounded-xl border border-dashed border-border bg-muted/40 p-4 text-xs text-muted-foreground">
              {deal.terms}
            </div>
            <Button asChild size="lg" className="w-full">
              <Link to="/auth">{t("dealDetails.loginUnlock")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {deal.brand}
          </p>
          <h1 className="text-3xl font-semibold">{deal.title}</h1>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{t(categoryLabelKeys[deal.category])}</Badge>
            {deal.verifiedOnly && (
              <Badge variant="warning">{t("deals.verifiedOnly")}</Badge>
            )}
          </div>
        </div>
        <Card>
          <CardContent className="space-y-4 p-6">
            <p className="text-sm text-muted-foreground">{deal.description}</p>
            <div className="rounded-xl border border-dashed border-border bg-muted/40 p-4 text-sm">
              <p className="font-semibold">{t("dealDetails.redemptionSteps")}</p>
              <ol className="mt-2 list-decimal space-y-1 pl-4 text-muted-foreground">
                <li>{t("dealDetails.step1")}</li>
                <li>{t("dealDetails.step2")}</li>
                <li>{t("dealDetails.step3")}</li>
              </ol>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              {deal.verifiedOnly ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        {t("label.promoCode")}
                      </p>
                      <p className="mt-1 text-lg font-semibold text-muted-foreground blur-sm">
                        {deal.code}
                      </p>
                    </div>
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {t("dealDetails.verifyHint")}
                  </p>
                </>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    {t("label.promoCode")}
                  </p>
                  <p className="text-lg font-semibold">{deal.code}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      {recommendations.length > 0 && (
        <section className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-semibold">{t("dealDetails.recommended")}</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recommendations.map((rec) => (
              <CompactDealCard
                key={rec.id}
                deal={rec}
                locked={rec.verifiedOnly}
                ctaHref="/auth"
                viewHref={`/deal/${rec.id}`}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
