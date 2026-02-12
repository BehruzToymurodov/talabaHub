import { create } from "zustand";
import type { User } from "../../types";
import { authApi } from "../../services/api/auth";

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  bootstrap: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    age: number;
    universityName: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  setUser: (user: User | null) => void;
};

// Zustand keeps auth state simple and scoped without extra providers.
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  bootstrap: async () => {
    set({ loading: true, error: null });
    try {
      const response = await authApi.getMe();
      set({ user: response?.user ?? null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await authApi.login(email, password);
      set({ user: response.user });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const response = await authApi.register(payload);
      set({ user: response.user });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  logout: async () => {
    set({ loading: true, error: null });
    try {
      await authApi.logout();
      set({ user: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  updateUser: async (user) => {
    set({ loading: true, error: null });
    try {
      const updated = await authApi.updateUser(user);
      set({ user: updated });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  setUser: (user) => set({ user }),
}));
