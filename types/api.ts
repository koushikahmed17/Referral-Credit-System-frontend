// API-specific type definitions

// User types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  referralCode: string;
  credits: number;
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfile extends User {
  totalReferrals?: number;
  successfulReferrals?: number;
  totalEarnings?: number;
  pendingEarnings?: number;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  referralCode?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

// Referral types
export interface Referral {
  id: string;
  referrerId: string;
  referredUserId: string;
  referralCode: string;
  status: ReferralStatus;
  rewardAmount: number;
  createdAt: string;
  updatedAt?: string;
  referredUser?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export type ReferralStatus = "PENDING" | "CONFIRMED" | "EXPIRED";

export interface ReferralStats {
  totalReferrals: number;
  confirmedReferrals: number;
  pendingReferrals: number;
  totalCreditsEarned: number;
  referralCode: string;
}

export interface ReferralListResponse {
  success: boolean;
  data: {
    referrals: Referral[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface ReferralDetailsResponse {
  success: boolean;
  data: {
    referralCode: string;
    isValid: boolean;
    referrerName?: string;
  };
}

// Purchase types
export interface Purchase {
  id: string;
  userId: string;
  amount: number;
  description: string;
  isFirstPurchase: boolean;
  referralRewarded: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreatePurchaseRequest {
  amount: number;
  description: string;
}

export interface CreatePurchaseResponse {
  success: boolean;
  message: string;
  data: {
    purchase: Purchase;
    referralReward?: {
      credited: boolean;
      amount: number;
      referrerId?: string;
    };
  };
}

export interface PurchaseStats {
  totalPurchases: number;
  totalSpent: number;
  firstPurchaseDate?: string;
  lastPurchaseDate?: string;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  data?: Record<string, any>;
  createdAt: string;
}

export type NotificationType =
  | "referral_success"
  | "referral_reward"
  | "purchase_complete"
  | "system_update"
  | "promotion";

// Dashboard types
export interface DashboardStats {
  user: UserProfile;
  referrals: ReferralStats;
  recentReferrals: Referral[];
  recentPurchases: Purchase[];
  notifications: Notification[];
}

// Error types
export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, any>;
}

export interface ValidationError extends ApiError {
  field: string;
  value: any;
}

// Search and filter types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ReferralFilters extends PaginationParams {
  status?: ReferralStatus;
  dateFrom?: string;
  dateTo?: string;
}

export interface PurchaseFilters extends PaginationParams {
  status?: PurchaseStatus;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}
