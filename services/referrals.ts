import { fetcher } from "@/utils/fetcher";
import { API_ENDPOINTS } from "@/utils/constants";
import {
  ReferralStats,
  ReferralListResponse,
  ReferralDetailsResponse,
} from "@/types/api";

// Get referral stats for the authenticated user
export const getReferralStats = async (): Promise<ReferralStats> => {
  const response = await fetcher.get<{
    success: boolean;
    data: ReferralStats;
  }>(API_ENDPOINTS.REFERRALS.STATS);

  if (!response.success) {
    throw new Error("Failed to fetch referral stats");
  }

  return response.data;
};

// Get list of referrals with pagination
export const getReferralsList = async (
  page: number = 1,
  limit: number = 10
): Promise<ReferralListResponse["data"]> => {
  const response = await fetcher.get<ReferralListResponse>(
    `${API_ENDPOINTS.REFERRALS.LIST}?page=${page}&limit=${limit}`
  );

  if (!response.success) {
    throw new Error("Failed to fetch referrals list");
  }

  return response.data;
};

// Validate a referral code
export const validateReferralCode = async (
  code: string
): Promise<{ isValid: boolean; message?: string }> => {
  try {
    const response = await fetcher.get<{
      success: boolean;
      data: { isValid: boolean };
      message?: string;
    }>(`${API_ENDPOINTS.REFERRALS.VALIDATE}/${code}`);

    return {
      isValid: response.data.isValid,
      message: response.message,
    };
  } catch (error) {
    return {
      isValid: false,
      message: error instanceof Error ? error.message : "Invalid code",
    };
  }
};

// Get referral code details (public endpoint)
export const getReferralDetails = async (
  code: string
): Promise<ReferralDetailsResponse["data"]> => {
  const response = await fetcher.get<ReferralDetailsResponse>(
    `${API_ENDPOINTS.REFERRALS.DETAILS}/${code}`
  );

  if (!response.success) {
    throw new Error("Failed to fetch referral details");
  }

  return response.data;
};
