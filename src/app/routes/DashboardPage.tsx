import { Link, useNavigate } from "react-router-dom";
import { useDeals } from "../../features/deals/useDeals";
import { DealCard } from "../../components/cards/DealCard";
import { Button } from "../../components/ui/button";
import { StatusBanner } from "../../components/feedback/StatusBanner";
import { useAuthStore } from "../store/useAuthStore";
import { Skeleton } from "../../components/ui/skeleton";
import { useT } from "../../i18n";

export function DashboardPage() {
  const { deals, loading } = useDeals();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const featured = deals.filter((deal) => deal.featured).slice(0, 3);
  const t = useT();

  const status = user?.verificationStatus ?? "unverified";
  const statusCopy = {
    unverified: {
      title: t("status.banner.unverified.title"),
      description: t("status.banner.unverified.desc"),
      statusLabel: t("status.unverified"),
      action: () => navigate("/app/verify"),
      actionLabel: t("action.startVerification"),
    },
    pending: {
      title: t("status.banner.pending.title"),
      description: t("status.banner.pending.desc"),
      statusLabel: t("status.pending"),
    },
    verified: {
      title: t("status.banner.verified.title"),
      description: t("status.banner.verified.desc"),
      statusLabel: t("status.verified"),
    },
    rejected: {
      title: t("status.banner.rejected.title"),
      description:
        user?.verification?.reviewReason ?? t("status.banner.rejected.desc"),
      statusLabel: t("status.rejected"),
      action: () => navigate("/app/verify"),
      actionLabel: t("action.resubmit"),
    },
  }[status];

  return (
    <div className="container space-y-8 py-10">
      {statusCopy && (
        <StatusBanner
          title={statusCopy.title}
          description={statusCopy.description}
          statusLabel={statusCopy.statusLabel}
          actionLabel={statusCopy.actionLabel}
          onAction={statusCopy.action}
        />
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {t("dashboard.tag")}
            </p>
            <h2 className="text-2xl font-semibold">{t("dashboard.title")}</h2>
          </div>
          <Button asChild variant="ghost">
            <Link to="/app/deals">{t("dashboard.exploreAll")}</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-72 w-full" />
              ))
            : featured.map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  locked={deal.verifiedOnly && user?.role !== "student_verified"}
                  linkTo={`/app/deal/${deal.id}`}
                />
              ))}
        </div>
      </section>
    </div>
  );
}
