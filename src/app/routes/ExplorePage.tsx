import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { DealCard } from "../../components/cards/DealCard";
import { DealFilters } from "../../features/deals/DealFilters";
import { useDeals } from "../../features/deals/useDeals";
import { filterDeals } from "../../features/deals/utils";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { EmptyState } from "../../components/feedback/EmptyState";
import { Badge } from "../../components/ui/badge";
import { useT } from "../../i18n";
import {
  buildCategoryTree,
  getDealsForCategorySelection,
  type CategoryTreeItem,
} from "../../features/deals/categoryTree";
import { useCategories } from "../../features/deals/useCategories";
import { resolveAssetPath } from "../../utils/assets";

export function ExplorePage() {
  const { deals, loading: dealsLoading } = useDeals();
  const { categories, loading: categoriesLoading } = useCategories();
  const [view, setView] = useState<"all" | "categories">("all");
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    sort: "trending",
  });
  const t = useT();

  const categoryTree = useMemo(
    () => buildCategoryTree(categories, deals),
    [categories, deals]
  );

  const selectedParent = useMemo(
    () => categoryTree.find((category) => category.id === selectedParentId) ?? null,
    [categoryTree, selectedParentId]
  );

  const selectedChild = useMemo(
    () =>
      selectedParent?.children.find((category) => category.id === selectedChildId) ??
      null,
    [selectedParent, selectedChildId]
  );

  const activeCategory = selectedChild ?? selectedParent;
  const scopedDeals = useMemo(
    () => getDealsForCategorySelection(deals, activeCategory),
    [deals, activeCategory]
  );
  const categoryDeals = useMemo(
    () =>
      filterDeals(scopedDeals, {
        search: filters.search,
        category: "All",
        sort: filters.sort,
      }),
    [filters, scopedDeals]
  );

  const previewLimit = 9;
  const previewDeals = categoryDeals.slice(0, previewLimit);
  const allFiltered = useMemo(
    () => filterDeals(deals, { ...filters }),
    [deals, filters]
  );
  const allPreview = allFiltered.slice(0, previewLimit);
  const isLoading = dealsLoading || categoriesLoading;

  const groupedByBrand = useMemo(() => {
    const grouped: Record<string, typeof previewDeals> = {};
    previewDeals.forEach((deal) => {
      if (!grouped[deal.brand]) grouped[deal.brand] = [];
      grouped[deal.brand].push(deal);
    });
    return grouped;
  }, [previewDeals]);

  const renderParentCard = (category: CategoryTreeItem) => {
    const image = resolveAssetPath(category.attachmentUrl, "banners");
    return (
      <button
        key={category.id}
        className="group relative min-h-[220px] overflow-hidden rounded-[28px] border border-border text-left text-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
        onClick={() => {
          setSelectedParentId(category.id);
          setSelectedChildId(null);
          setFilters((prev) => ({ ...prev, search: "" }));
        }}
      >
        {image ? (
          <img
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <div className="absolute inset-x-0 bottom-0 space-y-2 p-6">
          <Badge variant="secondary" className="bg-white/90 text-slate-900">
            {category.count} {t("nav.deals")}
          </Badge>
          <h2 className="text-2xl font-semibold">{category.name}</h2>
          {category.children.length > 0 ? (
            <p className="text-sm text-white/80">
              {category.children.length} subcategories
            </p>
          ) : null}
        </div>
      </button>
    );
  };

  const renderChildCard = (category: CategoryTreeItem) => {
    const image = resolveAssetPath(category.attachmentUrl, "banners");
    const isActive = selectedChild?.id === category.id;
    return (
      <button
        key={category.id}
        className={`group relative min-h-[150px] overflow-hidden rounded-2xl border text-left transition ${
          isActive
            ? "border-primary shadow-lg"
            : "border-border shadow-sm hover:-translate-y-1 hover:shadow-md"
        }`}
        onClick={() => {
          setSelectedChildId(category.id);
          setFilters((prev) => ({ ...prev, search: "" }));
        }}
      >
        {image ? (
          <img
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/15" />
        <div className="relative flex h-full flex-col justify-end gap-2 p-5">
          <p className="text-lg font-semibold">{category.name}</p>
          <p className="text-sm text-muted-foreground">
            {category.count} {t("nav.deals")}
          </p>
        </div>
      </button>
    );
  };

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
            setSelectedParentId(null);
            setSelectedChildId(null);
          }}
        >
          {t("action.allDeals")}
        </Button>
        <Button
          variant={view === "categories" ? "default" : "outline"}
          onClick={() => {
            setView("categories");
            setSelectedParentId(null);
            setSelectedChildId(null);
          }}
        >
          {t("action.categories")}
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-40 w-full rounded-[28px]" />
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
      ) : !selectedParent ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {categoryTree.map(renderParentCard)}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-[32px] border border-border">
            {resolveAssetPath(selectedParent.attachmentUrl, "banners") ? (
              <img
                src={resolveAssetPath(selectedParent.attachmentUrl, "banners") ?? ""}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/15" />
            <div className="relative flex min-h-[240px] flex-col justify-between gap-6 p-6 text-white md:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="secondary"
                  className="bg-white/90 text-slate-900 hover:bg-white"
                  onClick={() => {
                    setSelectedParentId(null);
                    setSelectedChildId(null);
                  }}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t("action.backToCategories")}
                </Button>
                {selectedChild ? (
                  <Button
                    variant="secondary"
                    className="bg-white/15 text-white hover:bg-white/25"
                    onClick={() => setSelectedChildId(null)}
                  >
                    {selectedParent.name}
                  </Button>
                ) : null}
              </div>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="secondary" className="bg-white/90 text-slate-900">
                    {(activeCategory ?? selectedParent).count} {t("nav.deals")}
                  </Badge>
                  {selectedChild ? (
                    <Badge variant="secondary" className="bg-white/15 text-white">
                      {selectedChild.name}
                    </Badge>
                  ) : null}
                </div>
                <h2 className="max-w-2xl text-3xl font-semibold md:text-4xl">
                  {(activeCategory ?? selectedParent).name}
                </h2>
                <p className="max-w-2xl text-sm text-white/80 md:text-base">
                  {selectedChild
                    ? `Preview deals in ${selectedChild.name}.`
                    : `Open a subcategory or preview the latest ${selectedParent.name.toLowerCase()} offers below.`}
                </p>
              </div>
            </div>
          </div>

          {selectedParent.children.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold">Subcategories</h3>
                {selectedChild ? (
                  <Button variant="ghost" onClick={() => setSelectedChildId(null)}>
                    Show all
                  </Button>
                ) : null}
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {selectedParent.children.map(renderChildCard)}
              </div>
            </div>
          ) : null}

          <DealFilters filters={filters} onChange={setFilters} showCategory={false} />

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
