import { fetcher } from "@/utils/fetcher";
import { API_ENDPOINTS } from "@/utils/constants";
import {
  DashboardStats,
  DashboardSummary,
  ReferralLinkData,
  CreditHistory,
} from "@/types/api";

// Get complete dashboard stats
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await fetcher.get<{
    success: boolean;
    data: DashboardStats;
  }>(API_ENDPOINTS.DASHBOARD.STATS);

  if (!response.success) {
    throw new Error("Failed to fetch dashboard stats");
  }

  return response.data;
};

// Get lightweight dashboard summary (for mobile)
export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await fetcher.get<{
    success: boolean;
    data: DashboardSummary;
  }>(API_ENDPOINTS.DASHBOARD.SUMMARY);

  if (!response.success) {
    throw new Error("Failed to fetch dashboard summary");
  }

  return response.data;
};

// Get referral link with social share options
export const getReferralLink = async (): Promise<ReferralLinkData> => {
  const response = await fetcher.get<{
    success: boolean;
    data: ReferralLinkData;
  }>(API_ENDPOINTS.DASHBOARD.REFERRAL_LINK);

  if (!response.success) {
    throw new Error("Failed to fetch referral link");
  }

  return response.data;
};

// Get credit history
export const getCreditHistory = async (): Promise<CreditHistory> => {
  const response = await fetcher.get<{
    success: boolean;
    data: CreditHistory;
  }>(API_ENDPOINTS.DASHBOARD.CREDIT_HISTORY);

  if (!response.success) {
    throw new Error("Failed to fetch credit history");
  }

  return response.data;
};
