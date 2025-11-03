import { API_BASE_URL, STORAGE_KEYS } from "./constants";

interface FetchOptions extends RequestInit {
  token?: string;
}

class Fetcher {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { token, ...fetchOptions } = options;

    // Get token from Zustand persisted storage or old localStorage
    let authToken: string | undefined = token;

    if (!authToken && typeof window !== "undefined") {
      // Try to get from Zustand persisted state first
      const zustandAuth = localStorage.getItem("auth-storage");
      if (zustandAuth) {
        try {
          const parsed = JSON.parse(zustandAuth);
          authToken = parsed.state?.token || undefined;
        } catch (e) {
          console.error("Failed to parse auth storage:", e);
        }
      }

      // Fallback to old storage location
      if (!authToken) {
        authToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || undefined;
      }
    }

    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
        ...fetchOptions.headers,
      },
      ...fetchOptions,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Create a custom error with validation details
        const customError: any = new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );

        // Attach validation errors if they exist
        if (errorData.errors && Array.isArray(errorData.errors)) {
          customError.validationErrors = errorData.errors;
        } else if (errorData.errors && typeof errorData.errors === "object") {
          // Convert object to array format
          customError.validationErrors = Object.entries(errorData.errors).map(
            ([field, message]) => ({
              field,
              message: Array.isArray(message) ? message[0] : message,
            })
          );
        }

        throw customError;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    options?: FetchOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    options?: FetchOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

// Create a singleton instance
export const fetcher = new Fetcher();

// Helper function for authenticated requests
export const authenticatedFetch = async <T>(
  endpoint: string,
  options?: FetchOptions
): Promise<T> => {
  let token: string | null = null;

  if (typeof window !== "undefined") {
    // Try to get from Zustand persisted state first
    const zustandAuth = localStorage.getItem("auth-storage");
    if (zustandAuth) {
      try {
        const parsed = JSON.parse(zustandAuth);
        token = parsed.state?.token || null;
      } catch (e) {
        console.error("Failed to parse auth storage:", e);
      }
    }

    // Fallback to old storage location
    if (!token) {
      token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    }
  }

  if (!token) {
    throw new Error("No authentication token found");
  }

  return fetcher.request<T>(endpoint, { ...options, token });
};
