import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetcher } from "@/utils/fetcher";
import { API_ENDPOINTS, STORAGE_KEYS } from "@/utils/constants";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  referralCode: string;
  credits: number;
  referredBy?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    user?: any;
    token: string;
    userId?: string;
    email?: string;
  };
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  referralCode?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (data: LoginData) => Promise<{ success: boolean; error?: string }>;
  register: (
    data: RegisterData
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
  setLoading: (loading: boolean) => void;
}

// Helper function to extract user from nested response
const extractUser = (responseData: any): User => {
  if (responseData.user) {
    // Check for double-nested structure
    if (responseData.user.user) {
      // Double nested: response.data.user.user has the actual data
      return {
        id: responseData.user.userId || responseData.user.user.id,
        email: responseData.user.email || responseData.user.user.email,
        ...responseData.user.user,
      };
    } else {
      // Single nested: response.data.user has the data
      return {
        id: responseData.userId || responseData.user.id,
        email: responseData.email || responseData.user.email,
        ...responseData.user,
      };
    }
  } else {
    // Flat structure
    const { token: _, ...userData } = responseData;
    return userData as User;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      login: async (loginData: LoginData) => {
        try {
          set({ isLoading: true });

          const response = await fetcher.post<AuthResponse>(
            API_ENDPOINTS.AUTH.LOGIN,
            loginData
          );

          if (!response.success) {
            throw new Error(response.message || "Login failed");
          }

          const user = extractUser(response.data);
          const token = response.data.token;

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return {
            success: false,
            error: error instanceof Error ? error.message : "Login failed",
          };
        }
      },

      register: async (registerData: RegisterData) => {
        try {
          set({ isLoading: true });

          const response = await fetcher.post<AuthResponse>(
            API_ENDPOINTS.AUTH.REGISTER,
            registerData
          );

          if (!response.success) {
            throw new Error(response.message || "Registration failed");
          }

          const user = extractUser(response.data);
          const token = response.data.token;

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return {
            success: false,
            error:
              error instanceof Error ? error.message : "Registration failed",
          };
        }
      },

      logout: async () => {
        try {
          const { token } = get();
          if (token) {
            await fetcher.post(API_ENDPOINTS.AUTH.LOGOUT);
          }
        } catch (error) {
          console.error("Logout API error:", error);
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      refreshUser: async () => {
        try {
          const { token } = get();
          if (!token) {
            return null;
          }

          const response = await fetcher.get<any>(
            API_ENDPOINTS.AUTH.PROFILE
          );

          if (!response || !response.success) {
            return null;
          }

          const user = extractUser(response.data);

          if (!user || !user.email) {
            console.error("Failed to extract valid user from response");
            return null;
          }

          set({ user });
          return user;
        } catch (error) {
          console.error("Error refreshing user:", error);
          return null;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

