import { apiRequest } from "./client";

type PageableResponse<T> = {
  content: T[];
  totalElements: number;
};

type BrandResponse = {
  id: string;
  name: string;
  logoUrl?: string;
  logo_url?: string;
  active?: boolean;
};

type CategoryResponse = {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  attachmentUrl?: string;
  attachment_url?: string;
  active?: boolean;
  activeDealsCount?: number;
  active_deals_count?: number;
  parentId?: string;
  parent_id?: string;
  parentName?: string;
  parent_name?: string;
};

export type BrandOption = {
  id: string;
  name: string;
  logoUrl?: string;
};

export type CategoryOption = {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  attachmentUrl?: string;
  activeDealsCount?: number;
  parentId?: string;
  parentName?: string;
};

function mapCategory(category: CategoryResponse): CategoryOption {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    icon: category.icon,
    attachmentUrl: category.attachmentUrl ?? category.attachment_url,
    activeDealsCount: category.activeDealsCount ?? category.active_deals_count ?? 0,
    parentId: category.parentId ?? category.parent_id,
    parentName: category.parentName ?? category.parent_name,
  };
}

export const catalogApi = {
  listBrands: async () => {
    const data = await apiRequest<PageableResponse<BrandResponse>>(
      "/api/v1/management/brands",
      {
        query: { page: 0, size: 200 },
        auth: true,
      }
    );
    return data.content.map((brand) => ({
      id: brand.id,
      name: brand.name,
      logoUrl: brand.logoUrl ?? brand.logo_url,
    }));
  },
  listCategories: async () => {
    const data = await apiRequest<PageableResponse<CategoryResponse>>(
      "/api/v1/management/categories",
      {
        query: { page: 0, size: 200 },
        auth: true,
      }
    );
    return data.content.map(mapCategory);
  },
  listPublicCategories: async () => {
    const data = await apiRequest<PageableResponse<CategoryResponse>>(
      "/api/v1/categories",
      {
        query: { page: 0, size: 200 },
      }
    );
    return data.content.map(mapCategory);
  },
};
