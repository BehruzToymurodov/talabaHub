import { useMemo } from "react";
import { DealCard } from "../../components/cards/DealCard";
import { EmptyState } from "../../components/feedback/EmptyState";
import { Skeleton } from "../../components/ui/skeleton";
import { useDeals } from "../../features/deals/useDeals";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "sonner";
import { useT } from "../../i18n";

export function SavedDealsPage() {
  const { deals, loading } = useDeals();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const t = useT();

  const savedDeals = useMemo(() => {
    if (!user) return [];
    return deals.filter((deal) => user.savedDealIds.includes(deal.id));
  }, [deals, user]);

  const toggleSave = async (dealId: string) => {
    if (!user) return;
    const next = user.savedDealIds.filter((id) => id !== dealId);
    try {
      await updateUser({ ...user, savedDealIds: next });
      toast(t("toast.removed"));
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="container space-y-6 py-10">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          {t("nav.saved")}
        </p>
        <h1 className="text-2xl font-semibold">{t("saved.title")}</h1>
      </div>
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-72 w-full" />
          ))}
        </div>
      ) : savedDeals.length === 0 ? (
        <EmptyState
          title={t("deals.savedEmptyTitle")}
          description={t("deals.savedEmptyDesc")}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedDeals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              locked={deal.verifiedOnly && user?.role !== "student_verified"}
              saved
              onToggleSave={() => toggleSave(deal.id)}
              linkTo={`/app/deal/${deal.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
