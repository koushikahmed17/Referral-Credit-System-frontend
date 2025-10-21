import { fetcher } from "@/utils/fetcher";
import { API_ENDPOINTS } from "@/utils/constants";
import {
  Purchase,
  CreatePurchaseRequest,
  CreatePurchaseResponse,
  PurchaseStats,
} from "@/types/api";

// Create a new purchase
export const createPurchase = async (
  purchaseData: CreatePurchaseRequest
): Promise<CreatePurchaseResponse> => {
  const response = await fetcher.post<CreatePurchaseResponse>(
    API_ENDPOINTS.PURCHASES.CREATE,
    purchaseData
  );

  if (!response.success) {
    throw new Error(response.message || "Failed to create purchase");
  }

  return response;
};

// Get list of purchases for the authenticated user
export const getPurchasesList = async (): Promise<Purchase[]> => {
  const response = await fetcher.get<{
    success: boolean;
    data: {
      purchases: Purchase[];
    };
  }>(API_ENDPOINTS.PURCHASES.LIST);

  if (!response.success) {
    throw new Error("Failed to fetch purchases");
  }

  return response.data.purchases;
};

// Get purchase stats for the authenticated user
export const getPurchaseStats = async (): Promise<PurchaseStats> => {
  const response = await fetcher.get<{
    success: boolean;
    data: PurchaseStats;
  }>(API_ENDPOINTS.PURCHASES.STATS);

  if (!response.success) {
    throw new Error("Failed to fetch purchase stats");
  }

  return response.data;
};

