import { apiRequest } from "./client";

export type University = {
  id: string;
  name: string;
};

type UniversityPageResponse = {
  content: University[];
  page?: number;
  size?: number;
  totalPages?: number;
  totalElements?: number;
};

const DEFAULT_PAGE_SIZE = 50;

export const universitiesApi = {
  list: async (params: { search?: string; page?: number; size?: number } = {}) => {
    const trimmedSearch = params.search?.trim();
    return apiRequest<UniversityPageResponse>("/api/v1/universities", {
      query: {
        search: trimmedSearch ? trimmedSearch : undefined,
        page: params.page ?? 0,
        size: params.size ?? DEFAULT_PAGE_SIZE,
      },
    });
  },
  pageSize: DEFAULT_PAGE_SIZE,
};
