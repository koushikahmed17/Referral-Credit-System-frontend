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

      // Handle nested user structure
      let user: User;
      const token = response.data.token;

      if (response.data.user) {
        // Check for double-nested structure
        if (response.data.user.user) {
          // Double nested: response.data.user.user has the actual data
          user = {
            id: response.data.user.userId || response.data.user.user.id,
            email: response.data.user.email || response.data.user.user.email,
            ...response.data.user.user,
          } as User;
        } else {
          // Single nested: response.data.user has the data
          user = {
            id: response.data.userId || response.data.user.id,
            email: response.data.email || response.data.user.email,
            ...response.data.user,
          } as User;
        }
      } else {
        // Flat structure: { success: true, data: { firstName, lastName, ..., token } }
        const { token: _, ...userData } = response.data;
        user = userData as User;
      }

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

      // Handle nested user structure
      let user: User;
      const token = response.data.token;

      if (response.data.user) {
        // Check for double-nested structure
        if (response.data.user.user) {
          // Double nested: response.data.user.user has the actual data
          user = {
            id: response.data.user.userId || response.data.user.user.id,
            email: response.data.user.email || response.data.user.user.email,
            ...response.data.user.user,
          } as User;
        } else {
          // Single nested: response.data.user has the data
          user = {
            id: response.data.userId || response.data.user.id,
            email: response.data.email || response.data.user.email,
            ...response.data.user,
          } as User;
        }
      } else {
        // Flat structure: { success: true, data: { firstName, lastName, ..., token } }
        const { token: _, ...userData } = response.data;
        user = userData as User;
      }

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
      if (!authState.token) {
        return null;
      }

      const response = await fetcher.get<any>(API_ENDPOINTS.AUTH.PROFILE);

      // Handle different response structures
      let user: User | null = null;

      if (response && response.success === true) {
        // Backend structure: { success: true, data: { user: { userId, email, user: {...} } } }
        if (response.data && response.data.user) {
          // Check if there's a double-nested user object
          if (response.data.user.user) {
            // Double nested: response.data.user.user has the actual data
            user = {
              id: response.data.user.userId || response.data.user.user.id,
              email: response.data.user.email || response.data.user.user.email,
              ...response.data.user.user, // Spread the INNER user object
            } as User;
          } else {
            // Single nested: response.data.user has the data
            user = {
              id: response.data.userId || response.data.user.id,
              email: response.data.email || response.data.user.email,
              ...response.data.user,
            } as User;
          }
        }
        // Alternative: { success: true, data: { firstName, lastName, ... } }
        else if (
          response.data &&
          response.data.email &&
          response.data.firstName
        ) {
          user = response.data as User;
        }
        // Alternative: { success: true, user: {...} }
        else if (response.user) {
          user = response.user;
        }
      }
      // Alternative: direct user object
      else if (response && response.id && response.email) {
        user = response as User;
      }

      if (!user || !user.email) {
        console.error("Failed to extract valid user from response");
        return null;
      }

      // Update localStorage
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

      // Update state
      setAuthState((prev) => ({
        ...prev,
        user,
      }));

      return user;
    } catch (error) {
      console.error("Error refreshing user:", error);
      // Don't modify state on error - keep existing user data
      return null;
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
