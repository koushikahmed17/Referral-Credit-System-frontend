// API-specific type definitions

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  createdAt: string;
  updatedAt: string;
  isEmailVerified: boolean;
  profilePicture?: string;
}

export interface UserProfile extends User {
  totalReferrals: number;
  successfulReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  lastLoginAt: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  referralCode?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Referral types
export interface Referral {
  id: string;
  referrerId: string;
  refereeId: string;
  referralCode: string;
  status: ReferralStatus;
  rewardAmount: number;
  createdAt: string;
  completedAt?: string;
}

export type ReferralStatus = "pending" | "completed" | "cancelled" | "expired";

export interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  conversionRate: number;
  averageRewardAmount: number;
}

export interface ReferralLink {
  userId: string;
  referralCode: string;
  url: string;
  qrCode: string;
}

// Purchase types
export interface Purchase {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  description: string;
  status: PurchaseStatus;
  referralId?: string;
  createdAt: string;
  updatedAt: string;
}

export type PurchaseStatus = "pending" | "completed" | "failed" | "refunded";

export interface CreatePurchaseRequest {
  amount: number;
  description: string;
  currency?: string;
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
