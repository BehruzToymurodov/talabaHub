import type { Deal, DealCategory } from "../../types";
import { readStorage, writeStorage } from "../storage/storage";
import { apiRequest } from "./client";

const knownCategories: DealCategory[] = [
  "Food & Drink",
  "Telecom",
  "Ride/Delivery",
  "Fashion",
  "Books & Education",
  "Fitness",
  "Electronics",
  "Travel",
];

const FEATURED_STORAGE_KEY = "dealFeatured";

function readFeaturedMap() {
  return readStorage<Record<string, boolean>>(FEATURED_STORAGE_KEY, {});
}

function writeFeaturedMap(map: Record<string, boolean>) {
  writeStorage(FEATURED_STORAGE_KEY, map);
}

function applyFeatured(deals: Deal[]) {
  const featuredMap = readFeaturedMap();
  return deals.map((deal, index) => ({
    ...deal,
    featured: typeof featuredMap[deal.id] === "boolean" ? featuredMap[deal.id] : index < 3,
  }));
}

function persistFeatured(dealId: string, featured: boolean | undefined) {
  if (typeof featured !== "boolean") return;
  const featuredMap = readFeaturedMap();
  featuredMap[dealId] = featured;
  writeFeaturedMap(featuredMap);
}

function mapCategory(name?: string): DealCategory {
  if (!name) return "Food & Drink";
  const match = knownCategories.find((category) => category === name);
  return match ?? "Food & Drink";
}

type PageableResponse<T> = {
  content: T[];
  totalElements: number;
};

type ApiBrandListing = {
  id: string;
  name: string;
  logoUrl?: string;
  logo_url?: string;
};

type ApiCategory = {
  id: string;
  name: string;
};

type DealPublicListingResponse = {
  id: string;
  title: string;
  brand: ApiBrandListing;
  category: ApiCategory;
  imageUrl?: string;
  image_url?: string;
  expiryDate?: string;
  expiry_date?: string;
};

type DealDetailResponse = {
  id: string;
  title: string;
  brand: ApiBrandListing;
  category: ApiCategory;
  description?: string;
  promoCode?: string;
  promo_code?: string;
  expiryDate?: string;
  expiry_date?: string;
  terms?: string;
  usageSteps?: string;
  usage_steps?: string;
};

type ManagementDealListResponse = {
  id: string;
  title: string;
  brand: ApiBrandListing;
  category: ApiCategory;
  imageUrl?: string;
  image_url?: string;
  expiryDate?: string;
  expiry_date?: string;
  verifiedOnly?: boolean;
  verified_only?: boolean;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
};

type ManagementDealDetailResponse = {
  id: string;
  title: string;
  brand: ApiBrandListing;
  category: ApiCategory;
  description?: string;
  promoCode?: string;
  promo_code?: string;
  expiryDate?: string;
  expiry_date?: string;
  terms?: string;
  usageSteps?: string;
  usage_steps?: string;
  verifiedOnly?: boolean;
  verified_only?: boolean;
  imageUrl?: string;
  image_url?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
};

type ManagementDealRequest = {
  brandId: string;
  categoryId: string;
  title: string;
  description?: string;
  promoCode?: string;
  expiryDate?: string;
  terms?: string;
  usageSteps?: string;
  verifiedOnly: boolean;
  attachmentId?: string;
};

function getBrandLogo(brand?: ApiBrandListing) {
  return brand?.logoUrl ?? brand?.logo_url ?? "";
}

function getImageUrl(value?: { imageUrl?: string; image_url?: string }) {
  return value?.imageUrl ?? value?.image_url ?? "";
}

function getExpiry(value?: { expiryDate?: string; expiry_date?: string }) {
  return value?.expiryDate ?? value?.expiry_date ?? "";
}

function getPromoCode(value?: { promoCode?: string; promo_code?: string }) {
  return value?.promoCode ?? value?.promo_code ?? "";
}

function getUsageSteps(value?: { usageSteps?: string; usage_steps?: string }) {
  return value?.usageSteps ?? value?.usage_steps ?? "";
}

function getVerifiedOnly(value?: { verifiedOnly?: boolean; verified_only?: boolean }) {
  return value?.verifiedOnly ?? value?.verified_only ?? false;
}

function getCreatedAt(value?: { createdAt?: string; created_at?: string }) {
  return value?.createdAt ?? value?.created_at ?? "";
}

function mapPublicListing(deal: DealPublicListingResponse): Deal {
  const expiresAt = getExpiry(deal);
  const logo = getBrandLogo(deal.brand);
  const imageUrl = getImageUrl(deal);
  return {
    id: deal.id,
    brandId: deal.brand?.id,
    brand: deal.brand?.name ?? "",
    categoryId: deal.category?.id,
    category: mapCategory(deal.category?.name),
    title: deal.title ?? "",
    description: "",
    terms: "",
    code: "",
    expiresAt,
    verifiedOnly: false,
    featured: false,
    createdAt: expiresAt,
    image: logo,
    bannerImage: imageUrl || logo,
  };
}

function mapPublicDetail(deal: DealDetailResponse): Deal {
  const expiresAt = getExpiry(deal);
  const logo = getBrandLogo(deal.brand);
  return {
    id: deal.id,
    brandId: deal.brand?.id,
    brand: deal.brand?.name ?? "",
    categoryId: deal.category?.id,
    category: mapCategory(deal.category?.name),
    title: deal.title ?? "",
    description: deal.description ?? "",
    terms: deal.terms ?? "",
    code: getPromoCode(deal),
    expiresAt,
    verifiedOnly: false,
    featured: false,
    createdAt: expiresAt,
    image: logo,
    bannerImage: logo,
    usageSteps: getUsageSteps(deal) || undefined,
  };
}

function mapAdminList(deal: ManagementDealListResponse): Deal {
  const expiresAt = getExpiry(deal);
  const logo = getBrandLogo(deal.brand);
  const imageUrl = getImageUrl(deal);
  return {
    id: deal.id,
    brandId: deal.brand?.id,
    brand: deal.brand?.name ?? "",
    categoryId: deal.category?.id,
    category: mapCategory(deal.category?.name),
    title: deal.title ?? "",
    description: "",
    terms: "",
    code: "",
    expiresAt,
    verifiedOnly: getVerifiedOnly(deal),
    featured: false,
    createdAt: getCreatedAt(deal) || expiresAt,
    image: logo,
    bannerImage: imageUrl || logo,
  };
}

function mapAdminDetail(deal: ManagementDealDetailResponse): Deal {
  const expiresAt = getExpiry(deal);
  const logo = getBrandLogo(deal.brand);
  const imageUrl = getImageUrl(deal);
  return {
    id: deal.id,
    brandId: deal.brand?.id,
    brand: deal.brand?.name ?? "",
    categoryId: deal.category?.id,
    category: mapCategory(deal.category?.name),
    title: deal.title ?? "",
    description: deal.description ?? "",
    terms: deal.terms ?? "",
    code: getPromoCode(deal),
    expiresAt,
    verifiedOnly: getVerifiedOnly(deal),
    featured: false,
    createdAt: getCreatedAt(deal) || expiresAt,
    image: logo,
    bannerImage: imageUrl || logo,
    usageSteps: getUsageSteps(deal) || undefined,
  };
}

function mapDealToManagementRequest(deal: Deal): ManagementDealRequest {
  if (!deal.brandId || !deal.categoryId) {
    throw new Error("Brand and category are required for this action");
  }
  return {
    brandId: deal.brandId,
    categoryId: deal.categoryId,
    title: deal.title,
    description: deal.description,
    promoCode: deal.code,
    expiryDate: deal.expiresAt || undefined,
    terms: deal.terms,
    verifiedOnly: deal.verifiedOnly,
  };
}

export const dealsApi = {
  list: async () => {
    const data = await apiRequest<PageableResponse<DealPublicListingResponse>>(
      "/api/v1/deals",
      { query: { page: 0, size: 100 } }
    );
    const mapped = data.content.map(mapPublicListing);
    return applyFeatured(mapped);
  },
  getById: async (id: string) => {
    const data = await apiRequest<DealDetailResponse>(`/api/v1/deals/${id}`);
    return mapPublicDetail(data);
  },
  listAdmin: async () => {
    const data = await apiRequest<PageableResponse<ManagementDealListResponse>>(
      "/api/v1/management/deals",
      { query: { page: 0, size: 100 }, auth: true }
    );
    return applyFeatured(data.content.map(mapAdminList));
  },
  getAdminById: async (id: string) => {
    const data = await apiRequest<ManagementDealDetailResponse>(
      `/api/v1/management/deals/${id}`,
      { auth: true }
    );
    return mapAdminDetail(data);
  },
  create: async (payload: Deal) => {
    const requestBody = mapDealToManagementRequest(payload);
    const data = await apiRequest<ManagementDealDetailResponse>(
      "/api/v1/management/deals",
      {
        method: "POST",
        body: requestBody,
        auth: true,
      }
    );
    const mapped = mapAdminDetail(data);
    persistFeatured(mapped.id, payload.featured);
    return mapped;
  },
  update: async (payload: Deal) => {
    const requestBody = mapDealToManagementRequest(payload);
    const data = await apiRequest<ManagementDealDetailResponse>(
      `/api/v1/management/deals/${payload.id}`,
      {
        method: "PUT",
        body: requestBody,
        auth: true,
      }
    );
    const mapped = mapAdminDetail(data);
    persistFeatured(mapped.id, payload.featured);
    return mapped;
  },
  remove: async (id: string) => {
    await apiRequest(`/api/v1/management/deals/${id}`,
      { method: "DELETE", auth: true }
    );
    const featuredMap = readFeaturedMap();
    if (featuredMap[id] !== undefined) {
      delete featuredMap[id];
      writeFeaturedMap(featuredMap);
    }
    return true;
  },
};
