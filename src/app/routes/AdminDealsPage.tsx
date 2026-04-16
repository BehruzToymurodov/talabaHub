import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import type { Deal } from "../../types";
import { dealsApi } from "../../services/api/deals";
import { catalogApi, type BrandOption, type CategoryOption } from "../../services/api/catalog";
import { categoryLabelKeys } from "../../features/deals/constants";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { EmptyState } from "../../components/feedback/EmptyState";
import { useT } from "../../i18n";
import { useLocaleStore } from "../store/useLocaleStore";
import { getDealTitle } from "../../utils/dealText";
import { resolveAssetPath } from "../../utils/assets";
import { getCategoryDealCategory } from "../../features/deals/categoryTree";

const emptyDeal: Deal = {
  id: "",
  brandId: "",
  brand: "",
  categoryId: "",
  category: "Food & Drink",
  title: "",
  description: "",
  terms: "",
  code: "",
  expiresAt: "",
  verifiedOnly: false,
  featured: false,
  createdAt: "",
  redemptionUrl: "",
  image: "",
  bannerImage: "",
};

export function AdminDealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Deal>(emptyDeal);
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const isEditing = deals.some((deal) => deal.id === draft.id);
  const t = useT();
  const locale = useLocaleStore((state) => state.locale);

  const getCategoryDisplayName = (category: CategoryOption) =>
    category.parentName ? `${category.parentName} / ${category.name}` : category.name;

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const data = await dealsApi.listAdmin();
      setDeals(data);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const [brandData, categoryData] = await Promise.all([
          catalogApi.listBrands(),
          catalogApi.listCategories(),
        ]);
        setBrands(brandData);
        setCategories(categoryData);
      } catch (error) {
        toast.error((error as Error).message);
      }
    };

    fetchCatalog();
  }, []);

  const startCreate = () => {
    const defaultBrand = brands[0];
    const defaultCategory = categories[0];
    setDraft({
      ...emptyDeal,
      id: `deal_${Math.random().toString(36).slice(2)}`,
      createdAt: new Date().toISOString(),
      brandId: defaultBrand?.id ?? "",
      brand: defaultBrand?.name ?? "",
      categoryId: defaultCategory?.id ?? "",
      category: defaultCategory ? getCategoryDealCategory(defaultCategory) : "Food & Drink",
      categoryName: defaultCategory?.name ?? "",
      image: defaultBrand?.logoUrl ?? "",
    });
    setOpen(true);
  };

  const startEdit = (deal: Deal) => {
    setDraft(deal);
    setOpen(true);
    dealsApi
      .getAdminById(deal.id)
      .then((detail) => setDraft(detail))
      .catch((error) => toast.error((error as Error).message));
  };

  const handleSave = async () => {
    try {
      if (!draft.brandId || !draft.categoryId) {
        toast.error(t("toast.completeFields"));
        return;
      }
      const exists = deals.some((deal) => deal.id === draft.id);
      if (exists) {
        await dealsApi.update(draft);
        toast.success(t("toast.dealUpdated"));
      } else {
        await dealsApi.create(draft);
        toast.success(t("toast.dealCreated"));
      }
      setOpen(false);
      fetchDeals();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleDelete = async (dealId: string) => {
    try {
      await dealsApi.remove(dealId);
      toast(t("toast.dealDeleted"));
      fetchDeals();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const sortedDeals = useMemo(() => {
    return [...deals].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [deals]);

  return (
    <div className="container space-y-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {t("admin.tag")}
          </p>
          <h1 className="text-2xl font-semibold">{t("admin.manageDeals")}</h1>
        </div>
        <Button onClick={startCreate} className="gap-2">
          <Plus className="h-4 w-4" /> {t("admin.newDeal")}
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">{t("label.loading")}</p>
      ) : sortedDeals.length === 0 ? (
        <EmptyState
          title={t("admin.noDealsTitle")}
          description={t("admin.noDealsDesc")}
          actionLabel={t("admin.newDeal")}
          onAction={startCreate}
        />
      ) : (
        <div className="grid gap-4">
          {sortedDeals.map((deal) => (
            <Card key={deal.id}>
              <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold">{getDealTitle(deal, locale)}</p>
                  <p className="text-xs text-muted-foreground">
                    {deal.brand} · {t(categoryLabelKeys[deal.category])} ·{" "}
                    {t("label.expiresAt", { date: deal.expiresAt })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => startEdit(deal)}>
                    {t("action.edit")}
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(deal.id)}>
                    {t("action.delete")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[calc(100vh-3rem)] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? t("admin.editDeal") : t("admin.newDeal")}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_280px]">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t("label.brand")}</Label>
                <Select
                  value={draft.brandId ?? ""}
                  onValueChange={(value) => {
                    const selected = brands.find((brand) => brand.id === value);
                    setDraft({
                      ...draft,
                      brandId: value,
                      brand: selected?.name ?? "",
                      image: selected?.logoUrl ?? draft.image,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("label.brand")} />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("label.category")}</Label>
                <Select
                  value={draft.categoryId ?? ""}
                  onValueChange={(value) => {
                    const selected = categories.find((category) => category.id === value);
                    setDraft({
                      ...draft,
                      categoryId: value,
                      category: selected
                        ? getCategoryDealCategory(selected)
                        : draft.category,
                      categoryName: selected?.name ?? draft.categoryName,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("label.category")} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {getCategoryDisplayName(category)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>{t("label.title")}</Label>
                <Input
                  value={draft.title}
                  onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>{t("label.description")}</Label>
                <Input
                  value={draft.description}
                  onChange={(event) =>
                    setDraft({ ...draft, description: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>{t("label.terms")}</Label>
                <Input
                  value={draft.terms}
                  onChange={(event) => setDraft({ ...draft, terms: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("label.code")}</Label>
                <Input
                  value={draft.code}
                  onChange={(event) => setDraft({ ...draft, code: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("label.expiry")}</Label>
                <Input
                  value={draft.expiresAt}
                  onChange={(event) =>
                    setDraft({ ...draft, expiresAt: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>{t("label.featured")}</Label>
                <Select
                  value={draft.featured ? "yes" : "no"}
                  onValueChange={(value) =>
                    setDraft({ ...draft, featured: value === "yes" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">{t("label.yes")}</SelectItem>
                    <SelectItem value="no">{t("label.no")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("label.verifiedOnly")}</Label>
                <Select
                  value={draft.verifiedOnly ? "yes" : "no"}
                  onValueChange={(value) =>
                    setDraft({ ...draft, verifiedOnly: value === "yes" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">{t("label.yes")}</SelectItem>
                    <SelectItem value="no">{t("label.no")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("label.redemptionUrl")}</Label>
                <Input
                  value={draft.redemptionUrl ?? ""}
                  onChange={(event) =>
                    setDraft({ ...draft, redemptionUrl: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>{t("label.logo")}</Label>
                <Input
                  value={draft.image ?? ""}
                  onChange={(event) => setDraft({ ...draft, image: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("label.bannerImage")}</Label>
                <Input
                  value={draft.bannerImage ?? ""}
                  onChange={(event) =>
                    setDraft({ ...draft, bannerImage: event.target.value })
                  }
                />
              </div>
            </div>
            <Card className="h-fit">
              <CardContent className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {t("label.preview")}
                </p>
                <div className="overflow-hidden rounded-xl border border-border bg-muted/30">
                  {resolveAssetPath(draft.bannerImage, "banners") ? (
                    <img
                      src={resolveAssetPath(draft.bannerImage, "banners") ?? ""}
                      alt={draft.title || t("label.bannerImage")}
                      className="h-32 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-32 items-center justify-center text-xs text-muted-foreground">
                      {t("label.bannerImage")}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-sm font-semibold">
                    {resolveAssetPath(draft.image, "brands") ? (
                      <img
                        src={resolveAssetPath(draft.image, "brands") ?? ""}
                        alt={draft.brand || t("label.logo")}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>{(draft.brand || "BR").slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-base font-semibold">
                      {draft.title?.trim() || t("admin.previewTitle")}
                    </p>
                    <p className="text-xs text-muted-foreground">{draft.brand}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {draft.description?.trim() || t("admin.previewDescription")}
                </p>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {t("label.terms")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {draft.terms?.trim() || t("admin.previewTerms")}
                  </p>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>
                    {t("label.verifiedOnly")}: {draft.verifiedOnly ? t("label.yes") : t("label.no")}
                  </p>
                  <p>
                    {t("label.expiry")}: {draft.expiresAt?.trim() || t("label.no")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t("action.cancel")}
            </Button>
            <Button onClick={handleSave}>{t("action.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
