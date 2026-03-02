import { apiRequest } from "./client";

type PageableResponse<T> = {
  content: T[];
  totalElements: number;
};

type UserListItemResponse = {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: "STUDENT" | "MODERATOR" | "ADMIN";
  studentStatusVerified?: boolean;
  enabled?: boolean;
  createdDate?: string;
};

export type AdminUserSummary = {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: "STUDENT" | "MODERATOR" | "ADMIN";
  studentStatusVerified?: boolean;
  createdDate?: string;
};

export const usersApi = {
  list: async () => {
    const data = await apiRequest<PageableResponse<UserListItemResponse>>(
      "/api/v1/management/users",
      {
        query: { page: 0, size: 200 },
        auth: true,
      }
    );
    return {
      total: data.totalElements,
      users: data.content.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        studentStatusVerified: user.studentStatusVerified,
        createdDate: user.createdDate,
      })),
    };
  },
};
