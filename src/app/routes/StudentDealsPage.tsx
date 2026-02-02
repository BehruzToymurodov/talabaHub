import { useMemo, useState } from "react";
import { toast } from "sonner";
import { DealCard } from "../../components/cards/DealCard";
import { DealFilters } from "../../features/deals/DealFilters";
import { useDeals } from "../../features/deals/useDeals";
import { filterDeals } from "../../features/deals/utils";
import { Skeleton } from "../../components/ui/skeleton";
import { EmptyState } from "../../components/feedback/EmptyState";
import { useAuthStore } from "../store/useAuthStore";
import { dealCategories, categoryLabelKeys } from "../../features/deals/constants";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import { useT } from "../../i18n";

export function StudentDealsPage() {
  const { deals, loading } = useDeals();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [view, setView] = useState<"categories" | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    sort: "trending",
  });
  const [categoryFilters, setCategoryFilters] = useState({
    search: "",
    category: "All",
    sort: "trending",
  });
  const [page, setPage] = useState(1);
  const t = useT();

  const toggleSave = async (dealId: string) => {
    if (!user) return;
    const saved = user.savedDealIds.includes(dealId);
    const next = saved
      ? user.savedDealIds.filter((id) => id !== dealId)
      : [...user.savedDealIds, dealId];
    try {
      await updateUser({ ...user, savedDealIds: next });
      toast(saved ? t("toast.removed") : t("toast.saved"));
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const categoriesWithCount = useMemo(() => {
    return dealCategories.map((category) => ({
      name: category,
      count: deals.filter((deal) => deal.category === category).length,
    }));
  }, [deals]);

  const categoryDeals = useMemo(() => {
    if (!selectedCategory) return [];
    const scoped = deals.filter((deal) => deal.category === selectedCategory);
    return filterDeals(scoped, {
      search: categoryFilters.search,
      category: "All",
      sort: categoryFilters.sort,
    });
  }, [deals, selectedCategory, categoryFilters]);

  const groupedByBrand = useMemo(() => {
    const grouped: Record<string, typeof categoryDeals> = {};
    categoryDeals.forEach((deal) => {
      if (!grouped[deal.brand]) grouped[deal.brand] = [];
      grouped[deal.brand].push(deal);
    });
    return grouped;
  }, [categoryDeals]);

  const pageSize = 9;
  const allFiltered = useMemo(() => filterDeals(deals, filters), [deals, filters]);
  const totalPages = Math.max(1, Math.ceil(allFiltered.length / pageSize));
  const paged = allFiltered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="container space-y-6 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {t("explore.tag")}
          </p>
          <h1 className="text-2xl font-semibold">{t("explore.latest")}</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === "categories" ? "default" : "outline"}
            onClick={() => {
              setView("categories");
              setSelectedCategory(null);
            }}
          >
            {t("action.categories")}
          </Button>
          <Button
            variant={view === "all" ? "default" : "outline"}
            onClick={() => {
              setView("all");
              setPage(1);
            }}
          >
            {t("action.allDeals")}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-72 w-full" />
          ))}
        </div>
      ) : view === "categories" ? (
        !selectedCategory ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoriesWithCount.map((category) => (
              <button
                key={category.name}
                className="flex flex-col items-start gap-2 rounded-2xl border border-border bg-card p-5 text-left transition hover:-translate-y-1 hover:shadow-md"
                onClick={() => {
                  setSelectedCategory(category.name);
                  setCategoryFilters((prev) => ({ ...prev, search: "" }));
                }}
              >
                <p className="text-sm font-semibold">
                  {t(categoryLabelKeys[category.name as keyof typeof categoryLabelKeys])}
                </p>
                <p className="text-xs text-muted-foreground">
                  {category.count} {t("nav.deals")}
                </p>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedCategory(null)}
              >
                {t("action.backToCategories")}
              </Button>
              <Badge variant="secondary">
                {selectedCategory
                  ? t(
                      categoryLabelKeys[
                        selectedCategory as keyof typeof categoryLabelKeys
                      ]
                    )
                  : null}
              </Badge>
            </div>

            <DealFilters
              filters={categoryFilters}
              onChange={setCategoryFilters}
              showCategory={false}
            />

            {categoryDeals.length === 0 ? (
              <EmptyState
                title={t("deals.noResultsTitle")}
                description={t("deals.noResultsDesc")}
              />
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedByBrand).map(([brand, brandDeals]) => (
                  <section key={brand} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold">{brand}</h2>
                      <Badge variant="outline">
                        {brandDeals.length} {t("nav.deals")}
                      </Badge>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {brandDeals.map((deal) => (
                        <DealCard
                          key={deal.id}
                          deal={deal}
                          locked={deal.verifiedOnly && user?.role !== "student_verified"}
                          saved={user?.savedDealIds.includes(deal.id)}
                          onToggleSave={() => toggleSave(deal.id)}
                          linkTo={`/app/deal/${deal.id}`}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        )
      ) : (
        <div className="space-y-6">
          <DealFilters
            filters={filters}
            onChange={(next) => {
              setFilters(next);
              setPage(1);
            }}
          />
          {allFiltered.length === 0 ? (
            <EmptyState
              title={t("deals.noResultsTitle")}
              description={t("deals.noResultsDesc")}
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paged.map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  locked={deal.verifiedOnly && user?.role !== "student_verified"}
                  saved={user?.savedDealIds.includes(deal.id)}
                  onToggleSave={() => toggleSave(deal.id)}
                  linkTo={`/app/deal/${deal.id}`}
                />
              ))}
            </div>
          )}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    {t("action.prev")}
                  </PaginationPrevious>
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        onClick={() => setPage(pageNumber)}
                        isActive={pageNumber === page}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                  >
                    {t("action.next")}
                  </PaginationNext>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  );
}
