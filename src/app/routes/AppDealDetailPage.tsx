import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { Check, Copy, ExternalLink, Lock } from "lucide-react";
import type { Deal } from "../../types";
import { dealsApi } from "../../services/api/deals";
import { useAuthStore } from "../store/useAuthStore";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { formatDate } from "../../utils/date";
import { useT } from "../../i18n";
import { categoryLabelKeys } from "../../features/deals/constants";

export function AppDealDetailPage() {
  const { id } = useParams();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const user = useAuthStore((state) => state.user);
  const t = useT();

  const isVerified = user?.role === "student_verified";

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

  const showLocked = deal.verifiedOnly && !isVerified;

  return (
    <div className="container grid gap-8 py-12 lg:grid-cols-[1.6fr_1fr]">
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
              {showLocked ? (
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
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        {t("label.promoCode")}
                      </p>
                      <p className="mt-1 text-lg font-semibold">
                        {revealed ? deal.code : "••••••"}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={async () => {
                        await navigator.clipboard.writeText(deal.code);
                        toast(t("toast.copied"));
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setRevealed(true);
                      toast.success(t("toast.codeRevealed"));
                    }}
                  >
                    {revealed ? (
                      <span className="inline-flex items-center gap-2">
                        <Check className="h-4 w-4" /> {t("action.codeVisible")}
                      </span>
                    ) : (
                      t("action.revealCode")
                    )}
                  </Button>
                </div>
              )}
              {showLocked && (
                <p className="mt-3 text-xs text-muted-foreground">
                  {t("dealDetails.verifyHint")}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-4">
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
            {showLocked ? (
              <Button asChild size="lg" className="w-full">
                <Link to="/app/verify">{t("action.verifyToUnlock")}</Link>
              </Button>
            ) : (
              <Button variant="outline" size="lg" className="w-full">
                {t("action.useDeal")}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
