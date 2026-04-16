import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { DealCard } from "../../components/cards/DealCard";
import { DealFilters } from "../../features/deals/DealFilters";
import { useDeals } from "../../features/deals/useDeals";
import { filterDeals } from "../../features/deals/utils";
import { Skeleton } from "../../components/ui/skeleton";
import { EmptyState } from "../../components/feedback/EmptyState";
import { useAuthStore } from "../store/useAuthStore";
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
import {
  buildCategoryTree,
  getDealsForCategorySelection,
  type CategoryTreeItem,
} from "../../features/deals/categoryTree";
import { useCategories } from "../../features/deals/useCategories";
import { resolveAssetPath } from "../../utils/assets";

export function StudentDealsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { deals, loading: dealsLoading } = useDeals();
  const { categories, loading: categoriesLoading } = useCategories();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [view, setView] = useState<"categories" | "all">("all");
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
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

  useEffect(() => {
    const nextView = searchParams.get("view");
    if (nextView === "categories") {
      setView("categories");
      setSelectedParentId(null);
      setSelectedChildId(null);
    } else {
      setView("all");
      setPage(1);
    }
  }, [searchParams]);

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

  const categoryDeals = useMemo(() => {
    const scoped = getDealsForCategorySelection(deals, activeCategory);
    return filterDeals(scoped, {
      search: categoryFilters.search,
      category: "All",
      sort: categoryFilters.sort,
    });
  }, [deals, activeCategory, categoryFilters]);

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
  const isLoading = dealsLoading || categoriesLoading;

  const renderParentCard = (category: CategoryTreeItem) => {
    const image = resolveAssetPath(category.attachmentUrl, "banners");
    return (
      <button
        key={category.id}
        className="group relative min-h-[220px] overflow-hidden rounded-[28px] border border-border text-left text-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
        onClick={() => {
          setSelectedParentId(category.id);
          setSelectedChildId(null);
          setCategoryFilters((prev) => ({ ...prev, search: "" }));
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
          setCategoryFilters((prev) => ({ ...prev, search: "" }));
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
              setSelectedParentId(null);
              setSelectedChildId(null);
              setSearchParams({ view: "categories" });
            }}
          >
            {t("action.categories")}
          </Button>
          <Button
            variant={view === "all" ? "default" : "outline"}
            onClick={() => {
              setView("all");
              setPage(1);
              setSearchParams({ view: "all" });
            }}
          >
            {t("action.allDeals")}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-72 w-full rounded-[28px]" />
          ))}
        </div>
      ) : view === "categories" ? (
        !selectedParent ? (
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
                      ? `Offers in ${selectedChild.name}`
                      : `Browse ${selectedParent.name.toLowerCase()} offers by subcategory or see everything below.`}
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
