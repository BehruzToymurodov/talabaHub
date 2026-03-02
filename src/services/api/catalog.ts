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
  active?: boolean;
};

export type BrandOption = {
  id: string;
  name: string;
  logoUrl?: string;
};

export type CategoryOption = {
  id: string;
  name: string;
};

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
    return data.content.map((category) => ({
      id: category.id,
      name: category.name,
    }));
  },
};
