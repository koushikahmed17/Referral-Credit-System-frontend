// API Configuration
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// App Configuration
export const APP_NAME = "ReferralApp";
export const APP_DESCRIPTION = "A modern referral system built with Next.js";

// Referral Configuration
export const REFERRAL_REWARD_AMOUNT = 2.0; // Both users get 2 credits each
export const REFERRAL_MINIMUM_PURCHASE = 0.01; // Minimum for first purchase

// Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  PURCHASES: "/purchases",
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_DATA: "user_data",
  THEME: "theme",
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    PROFILE: "/auth/profile",
  },
  REFERRALS: {
    STATS: "/referrals/stats",
    LIST: "/referrals/list",
    VALIDATE: "/referrals/validate",
    DETAILS: "/referrals/details",
  },
  PURCHASES: {
    CREATE: "/purchases",
    LIST: "/purchases",
    STATS: "/purchases/stats",
    GET_BY_ID: "/purchases",
  },
  DASHBOARD: {
    STATS: "/dashboard/stats",
    SUMMARY: "/dashboard/summary",
    REFERRAL_LINK: "/dashboard/referral-link",
    CREDIT_HISTORY: "/dashboard/credit-history",
  },
} as const;
