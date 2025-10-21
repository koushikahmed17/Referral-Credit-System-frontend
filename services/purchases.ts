import { fetcher } from "@/utils/fetcher";
import { API_ENDPOINTS } from "@/utils/constants";
import {
  Purchase,
  CreatePurchaseRequest,
  CreatePurchaseResponse,
  PurchaseStats,
  PurchaseListResponse,
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

// Get list of purchases for the authenticated user with pagination
export const getPurchasesList = async (
  page: number = 1,
  limit: number = 10
): Promise<PurchaseListResponse["data"]> => {
  const response = await fetcher.get<PurchaseListResponse>(
    `${API_ENDPOINTS.PURCHASES.LIST}?page=${page}&limit=${limit}`
  );

  if (!response.success) {
    throw new Error("Failed to fetch purchases");
  }

  return response.data;
};

// Get a specific purchase by ID
export const getPurchaseById = async (id: string): Promise<Purchase> => {
  const response = await fetcher.get<{
    success: boolean;
    data: { purchase: Purchase };
  }>(`${API_ENDPOINTS.PURCHASES.GET_BY_ID}/${id}`);

  if (!response.success) {
    throw new Error("Failed to fetch purchase");
  }

  return response.data.purchase;
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
