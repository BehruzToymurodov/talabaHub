import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Separator } from "../../components/ui/separator";
import { Skeleton } from "../../components/ui/skeleton";
import { useDeals } from "../../features/deals/useDeals";
import { useAuthStore } from "../store/useAuthStore";
import { useT } from "../../i18n";
import type { Deal, DealCategory } from "../../types";
import { categoryLabelKeys } from "../../features/deals/constants";
import { HomeHero } from "./home/HomeHero";
import { PromoTiles, type PromoTile } from "./home/PromoTiles";
import { HomeEmptyState, HomeSection } from "./home/HomeSection";
import { StatusBanner } from "../../components/feedback/StatusBanner";

const SECTION_CATEGORIES: DealCategory[] = [
  "Food & Drink",
  "Telecom",
  "Ride/Delivery",
  "Fashion",
  "Electronics",
  "Books & Education",
];

const promoTiles: PromoTile[] = [
  {
    category: "Food & Drink",
    descriptionKey: "home.promo.food",
    accentClass: "bg-gradient-to-br from-amber-500/10 via-transparent to-blue-500/10",
  },
  {
    category: "Fashion",
    descriptionKey: "home.promo.style",
    accentClass: "bg-gradient-to-br from-rose-500/10 via-transparent to-fuchsia-500/10",
  },
  {
    category: "Electronics",
    descriptionKey: "home.promo.tech",
    accentClass: "bg-gradient-to-br from-blue-500/10 via-transparent to-sky-500/10",
  },
];

function sortDeals(list: Deal[]) {
  return [...list].sort((a, b) => {
    const featuredDiff = Number(b.featured) - Number(a.featured);
    if (featuredDiff !== 0) return featuredDiff;
    return b.createdAt.localeCompare(a.createdAt);
  });
}

function SectionSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="mt-4 flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-48 w-64 lg:h-56 lg:w-72" />
        ))}
      </div>
    </div>
  );
}

export function HomePage() {
  const { deals, loading } = useDeals();
  const user = useAuthStore((state) => state.user);
  const t = useT();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const normalizedSearch = search.trim().toLowerCase();
  const filteredDeals = useMemo(() => {
    if (!normalizedSearch) return deals;
    return deals.filter(
      (deal) => deal.brand.toLowerCase().includes(normalizedSearch)
    );
  }, [deals, normalizedSearch]);

  const isVerified = user?.role === "student_verified";
  const verifyHref = user ? "/app/verify" : "/auth";
  const viewDealPrefix = user ? "/app/deal/" : "/deal/";
  const sectionLimit = isVerified ? 16 : 12;

  const bannerCopy = useMemo(() => {
    if (!user || user.role === "admin" || isVerified) return null;
    const status = user.verificationStatus ?? "unverified";
    if (status === "pending") {
      return {
        title: t("status.banner.pending.title"),
        description: t("status.banner.pending.desc"),
        statusLabel: t("status.pending"),
      };
    }
    if (status === "rejected") {
      return {
        title: t("status.banner.rejected.title"),
        description:
          user.verification?.reviewReason ?? t("status.banner.rejected.desc"),
        statusLabel: t("status.rejected"),
        actionLabel: t("action.resubmit"),
      };
    }
    return {
      title: t("status.banner.unverified.title"),
      description: t("status.banner.unverified.desc"),
      statusLabel: t("status.unverified"),
      actionLabel: t("action.startVerification"),
    };
  }, [isVerified, t, user]);

  const lockedDeals = useMemo(() => {
    if (isVerified) return new Set<string>();
    return new Set(
      filteredDeals
        .filter((deal) => deal.verifiedOnly)
        .map((deal) => deal.id)
    );
  }, [filteredDeals, isVerified]);

  const sections = useMemo(() => {
    return SECTION_CATEGORIES.map((category) => {
      const sectionDeals = sortDeals(
        filteredDeals.filter((deal) => deal.category === category)
      ).slice(0, sectionLimit);
      return {
        category,
        deals: sectionDeals,
      };
    });
  }, [filteredDeals, sectionLimit]);

  return (
    <div className="space-y-5 pb-8">
      <HomeHero
        search={search}
        onSearchChange={setSearch}
        showVerifyCta={!isVerified}
        verifyHref={verifyHref}
      />

      {bannerCopy && (
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <StatusBanner
            title={bannerCopy.title}
            description={bannerCopy.description}
            statusLabel={bannerCopy.statusLabel}
            actionLabel={bannerCopy.actionLabel}
            onAction={bannerCopy.actionLabel ? () => navigate(verifyHref) : undefined}
          />
        </div>
      )}

      {normalizedSearch && filteredDeals.length === 0 && (
        <HomeEmptyState onClear={() => setSearch("")} />
      )}

      <PromoTiles tiles={promoTiles} deals={filteredDeals} />

      <Separator className="mx-auto max-w-7xl" />

      {loading
        ? SECTION_CATEGORIES.map((category) => (
            <SectionSkeleton key={category} />
          ))
        : sections.map((section) => (
            <HomeSection
              key={section.category}
              title={t(categoryLabelKeys[section.category])}
              subtitle={t("home.sectionSubtitle", {
                category: t(categoryLabelKeys[section.category]),
              })}
              deals={section.deals}
              lockedDeals={lockedDeals}
              viewMoreHref={`/deals?category=${encodeURIComponent(
                section.category
              )}`}
              verifyHref={verifyHref}
              viewDealPrefix={viewDealPrefix}
            />
          ))}
    </div>
  );
}
