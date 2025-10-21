import React, { useState, useCallback, useEffect } from "react";
import { fetcher, authenticatedFetch } from "@/utils/fetcher";

interface UseFetchOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface UseFetchReturn<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export const useFetch = <T = any>(
  fetchFn: (...args: any[]) => Promise<T>,
  options: UseFetchOptions = {}
): UseFetchReturn<T> => {
  const { immediate = false, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);

        const result = await fetchFn(...args);
        setData(result);

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("An error occurred");
        setError(error);

        if (onError) {
          onError(error);
        }

        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchFn, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    data,
    error,
    loading,
    execute,
    reset,
  };
};

// Hook for authenticated API calls
export const useAuthenticatedFetch = <T = any>(
  fetchFn: (...args: any[]) => Promise<T>,
  options: UseFetchOptions = {}
): UseFetchReturn<T> => {
  return useFetch(fetchFn, options);
};

// Common fetch functions
export const useApiGet = <T = any>(
  endpoint: string,
  options: UseFetchOptions = {}
) => {
  return useFetch<T>(() => fetcher.get<T>(endpoint), options);
};

export const useApiPost = <T = any>(
  endpoint: string,
  options: UseFetchOptions = {}
) => {
  return useFetch<T>((data: any) => fetcher.post<T>(endpoint, data), options);
};

export const useAuthenticatedApiGet = <T = any>(
  endpoint: string,
  options: UseFetchOptions = {}
) => {
  return useFetch<T>(() => authenticatedFetch<T>(endpoint), options);
};

export const useAuthenticatedApiPost = <T = any>(
  endpoint: string,
  options: UseFetchOptions = {}
) => {
  return useFetch<T>(
    (data: any) =>
      authenticatedFetch<T>(endpoint, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    options
  );
};
