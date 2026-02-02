import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DealCard } from "../../components/cards/DealCard";
import { DealFilters } from "../../features/deals/DealFilters";
import { useDeals } from "../../features/deals/useDeals";
import { filterDeals } from "../../features/deals/utils";
import { dealCategories, categoryLabelKeys } from "../../features/deals/constants";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { EmptyState } from "../../components/feedback/EmptyState";
import { Badge } from "../../components/ui/badge";
import { useT } from "../../i18n";

export function ExplorePage() {
  const { deals, loading } = useDeals();
  const [view, setView] = useState<"all" | "categories">("all");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    sort: "trending",
  });
  const t = useT();

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
      search: filters.search,
      category: "All",
      sort: filters.sort,
    });
  }, [deals, selectedCategory, filters]);

  const previewLimit = 9;
  const previewDeals = categoryDeals.slice(0, previewLimit);
  const allFiltered = useMemo(() => filterDeals(deals, filters), [deals, filters]);
  const allPreview = allFiltered.slice(0, previewLimit);

  const groupedByBrand = useMemo(() => {
    const grouped: Record<string, typeof previewDeals> = {};
    previewDeals.forEach((deal) => {
      if (!grouped[deal.brand]) grouped[deal.brand] = [];
      grouped[deal.brand].push(deal);
    });
    return grouped;
  }, [previewDeals]);

  return (
    <div className="container space-y-8 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {t("explore.tag")}
          </p>
          <h1 className="text-2xl font-semibold">{t("explore.title")}</h1>
        </div>
        <Button asChild variant="outline">
          <Link to="/auth">{t("explore.loginCta")}</Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={view === "all" ? "default" : "outline"}
          onClick={() => {
            setView("all");
            setSelectedCategory(null);
          }}
        >
          {t("action.allDeals")}
        </Button>
        <Button
          variant={view === "categories" ? "default" : "outline"}
          onClick={() => {
            setView("categories");
            setSelectedCategory(null);
          }}
        >
          {t("action.categories")}
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-40 w-full" />
          ))}
        </div>
      ) : view === "all" ? (
        <div className="space-y-6">
          <DealFilters filters={filters} onChange={setFilters} />
          {allPreview.length === 0 ? (
            <EmptyState
              title={t("explore.noDeals")}
              description={t("explore.tryAgain")}
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allPreview.map((deal) => (
                <DealCard key={deal.id} deal={deal} locked={deal.verifiedOnly} />
              ))}
            </div>
          )}
          {allFiltered.length > previewLimit && (
            <div className="rounded-2xl border border-border bg-muted/40 p-4 text-center text-sm">
              {t("explore.loginNotice")}
            </div>
          )}
        </div>
      ) : !selectedCategory ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categoriesWithCount.map((category) => (
            <button
              key={category.name}
              className="flex flex-col items-start gap-2 rounded-2xl border border-border bg-card p-5 text-left transition hover:-translate-y-1 hover:shadow-md"
              onClick={() => {
                setSelectedCategory(category.name);
                setFilters((prev) => ({ ...prev, search: "" }));
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
            <Button variant="outline" onClick={() => setSelectedCategory(null)}>
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
            filters={filters}
            onChange={setFilters}
            showCategory={false}
          />

          {previewDeals.length === 0 ? (
            <EmptyState
              title={t("explore.noDeals")}
              description={t("explore.tryAgain")}
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
                      <DealCard key={deal.id} deal={deal} locked={deal.verifiedOnly} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          {categoryDeals.length > previewLimit && (
            <div className="rounded-2xl border border-border bg-muted/40 p-4 text-center text-sm">
              {t("explore.loginNotice")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
