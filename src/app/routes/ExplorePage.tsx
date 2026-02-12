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
import {
  GraduationCap,
  ShoppingBag,
  Soup,
  Phone,
  Bike,
  Dumbbell,
  Monitor,
  Plane,
} from "lucide-react";

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

  const categoryVisuals: Record<
    (typeof dealCategories)[number],
    { image?: string; icon: typeof GraduationCap; gradient: string }
  > = {
    "Food & Drink": {
      image: "/banners/fast_food.jpg",
      icon: Soup,
      gradient: "from-amber-200/60 via-blue-100 to-transparent",
    },
    Telecom: {
      image: "/banners/products.png",
      icon: Phone,
      gradient: "from-sky-200/60 via-indigo-100 to-transparent",
    },
    "Ride/Delivery": {
      image: "/banners/delivery.avif",
      icon: Bike,
      gradient: "from-lime-200/60 via-emerald-100 to-transparent",
    },
    Fashion: {
      image: "/banners/clothes.avif",
      icon: ShoppingBag,
      gradient: "from-pink-200/60 via-rose-100 to-transparent",
    },
    "Books & Education": {
      image: "/banners/books.webp",
      icon: GraduationCap,
      gradient: "from-violet-200/60 via-purple-100 to-transparent",
    },
    Fitness: {
      image: "/banners/products.png",
      icon: Dumbbell,
      gradient: "from-teal-200/60 via-cyan-100 to-transparent",
    },
    Electronics: {
      image: "/banners/electronics.jpg",
      icon: Monitor,
      gradient: "from-blue-200/60 via-sky-100 to-transparent",
    },
    Travel: {
      image: "/banners/products.png",
      icon: Plane,
      gradient: "from-emerald-200/60 via-teal-100 to-transparent",
    },
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
      search: filters.search,
      category: "All",
      sort: filters.sort,
    });
  }, [deals, selectedCategory, filters]);

  const previewLimit = 9;
  const previewDeals = categoryDeals.slice(0, previewLimit);
  const allFiltered = useMemo(
    () => filterDeals(deals, { ...filters }),
    [deals, filters]
  );
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
          {categoriesWithCount.map((category) => {
            const visual = categoryVisuals[category.name as (typeof dealCategories)[number]];
            const Icon = visual?.icon ?? ShoppingBag;
            return (
              <button
                key={category.name}
                className="group overflow-hidden rounded-2xl border border-border bg-card text-left transition hover:-translate-y-1 hover:shadow-md"
                onClick={() => {
                  setSelectedCategory(category.name);
                  setFilters((prev) => ({ ...prev, search: "" }));
                }}
                aria-label={t(
                  categoryLabelKeys[
                    category.name as keyof typeof categoryLabelKeys
                  ]
                )}
              >
                <div className="relative h-24 w-full overflow-hidden">
                  {visual?.image ? (
                    <img
                      src={visual.image}
                      alt=""
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className={`h-full w-full bg-gradient-to-br ${visual?.gradient ?? "from-muted/50 via-muted/20 to-transparent"}`}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                  <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-background/90 shadow-sm">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="space-y-1 p-5">
                  <p className="text-base font-semibold md:text-lg">
                    {t(
                      categoryLabelKeys[
                        category.name as keyof typeof categoryLabelKeys
                      ]
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground md:text-base">
                    {category.count} {t("nav.deals")}
                  </p>
                </div>
              </button>
            );
          })}
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
