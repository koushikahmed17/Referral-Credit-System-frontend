import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetcher } from "@/utils/fetcher";
import { API_ENDPOINTS, STORAGE_KEYS } from "@/utils/constants";
import { User, AuthResponse, LoginRequest, RegisterRequest } from "@/types/api";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface LoginData extends LoginRequest {}

interface RegisterData extends RegisterRequest {}

export const useAuth = () => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);

        if (token && userData) {
          const user = JSON.parse(userData);
          setAuthState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initializeAuth();
  }, []);

  const login = async (loginData: LoginData) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      const response = await fetcher.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        loginData
      );

      if (!response.success) {
        throw new Error(response.message || "Login failed");
      }

      const { user, token } = response.data;

      // Store in localStorage
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true, user };
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      console.error("Login error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  };

  const register = async (registerData: RegisterData) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      const response = await fetcher.post<AuthResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        registerData
      );

      if (!response.success) {
        throw new Error(response.message || "Registration failed");
      }

      const { user, token } = response.data;

      // Store in localStorage
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true, user };
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      console.error("Registration error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Registration failed",
      };
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint if authenticated
      if (authState.token) {
        await fetcher.post(API_ENDPOINTS.AUTH.LOGOUT);
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Clear localStorage
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);

      // Reset auth state
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });

      // Redirect to home page
      router.push("/");
    }
  };

  const refreshUser = async () => {
    try {
      if (!authState.token) return;

      const response = await fetcher.get<{ success: boolean; data: { user: User } }>(
        API_ENDPOINTS.AUTH.PROFILE
      );

      if (!response.success) {
        throw new Error("Failed to fetch profile");
      }

      const user = response.data.user;

      // Update localStorage
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

      setAuthState((prev) => ({
        ...prev,
        user,
      }));

      return user;
    } catch (error) {
      console.error("Error refreshing user:", error);
      // If refresh fails, logout user
      logout();
    }
  };

  return {
    ...authState,
    login,
    register,
    logout,
    refreshUser,
  };
};
