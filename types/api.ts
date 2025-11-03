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
  totalReferred: number;
  converted: number;
  pending: number;
  totalCredits: number;
  referralLink: string;
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
    referrerName: string;
    referrerEmail: string;
    isValid: boolean;
  };
}

// Purchase types
export type PurchaseStatus = "PENDING" | "COMPLETED" | "CANCELLED";

export interface Purchase {
  id: string;
  userId: string;
  amount: number;
  description: string;
  productId?: string;
  metadata?: Record<string, any>;
  isFirstPurchase: boolean;
  referralRewarded: boolean;
  status?: PurchaseStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface CreatePurchaseRequest {
  amount: number;
  description: string;
  productId?: string;
  metadata?: Record<string, any>;
}

export interface CreatePurchaseResponse {
  success: boolean;
  message: string;
  data: {
    purchase: Purchase;
    referralReward?: {
      awarded: boolean;
      creditsEarned: number;
      message: string;
    };
  };
}

export interface PurchaseStats {
  totalPurchases: number;
  totalAmount: number;
  completedPurchases: number;
  averageAmount: number;
}

export interface PurchaseListResponse {
  success: boolean;
  data: {
    purchases: Purchase[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
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
  user: User;
  referralStats: ReferralStats;
  purchaseStats: PurchaseStats;
  recentReferrals: Referral[];
  recentPurchases: Purchase[];
  creditsHistory: CreditHistoryItem[];
}

export interface DashboardSummary {
  totalReferred: number;
  converted: number;
  totalCredits: number;
  recentActivity: Array<{
    type: "referral" | "purchase" | "credit";
    message: string;
    date: string;
  }>;
}

export interface ReferralLinkData {
  referralCode: string;
  referralLink: string;
  shareableMessage: string;
  socialShare: {
    twitter: string;
    facebook: string;
    whatsapp: string;
    email: string;
  };
}

export interface CreditHistoryItem {
  id: string;
  userId: string;
  amount: number;
  type: "earned" | "spent" | "bonus";
  source: "referral" | "purchase" | "admin" | "promotion";
  description: string;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: string;
}

export interface CreditHistory {
  currentBalance: number;
  totalEarned: number;
  history: CreditHistoryItem[];
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
