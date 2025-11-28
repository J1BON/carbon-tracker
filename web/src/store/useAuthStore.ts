import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@carbon-tracker/shared-types";
import api from "@/lib/api";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  setToken: (token: string) => void;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user) =>
        set({ user, isAuthenticated: true }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      setToken: (token) => {
        localStorage.setItem("auth_token", token);
        set({ token });
      },
      refreshUser: async () => {
        const token = get().token || localStorage.getItem("auth_token");
        if (!token) {
          return;
        }
        try {
          const response = await api.get("/api/v1/auth/me");
          set({ user: response.data, isAuthenticated: true });
        } catch (error) {
          console.error("Failed to refresh user data:", error);
          // If refresh fails (e.g., token expired), logout
          get().logout();
        }
      },
      logout: () => {
        localStorage.removeItem("auth_token");
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

