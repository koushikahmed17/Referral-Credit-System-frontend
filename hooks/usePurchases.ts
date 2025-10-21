import { useState, useEffect } from "react";
import {
  createPurchase as createPurchaseService,
  getPurchasesList,
  getPurchaseStats,
} from "@/services/purchases";
import { Purchase, PurchaseStats, CreatePurchaseRequest } from "@/types/api";

// Hook to fetch purchase stats
export const usePurchaseStats = () => {
  const [stats, setStats] = useState<PurchaseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPurchaseStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch stats"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
};

// Hook to fetch purchases list with pagination
export const usePurchasesList = (page: number = 1, limit: number = 10) => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPurchasesList(page, limit);
      setPurchases(data.purchases);
      setPagination(data.pagination);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch purchases")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [page, limit]);

  return { purchases, pagination, loading, error, refetch: fetchPurchases };
};

// Hook to create a purchase
export const useCreatePurchase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createPurchase = async (purchaseData: CreatePurchaseRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await createPurchaseService(purchaseData);
      return {
        success: true,
        data: response.data,
        message: response.message,
      };
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to create purchase");
      setError(error);
      return {
        success: false,
        error: error.message,
      };
    } finally {
      setLoading(false);
    }
  };

  return { createPurchase, loading, error };
};
