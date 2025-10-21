// API Configuration
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// App Configuration
export const APP_NAME = "ReferralApp";
export const APP_DESCRIPTION = "A modern referral system built with Next.js";

// Referral Configuration
export const REFERRAL_REWARD_AMOUNT = 10.0;
export const REFERRAL_MINIMUM_PURCHASE = 25.0;

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
    REFRESH: "/auth/refresh",
  },
  USER: {
    PROFILE: "/user/profile",
    UPDATE_PROFILE: "/user/profile",
  },
  REFERRAL: {
    STATS: "/referral/stats",
    LINK: "/referral/link",
    HISTORY: "/referral/history",
  },
  PURCHASE: {
    CREATE: "/purchase/create",
    HISTORY: "/purchase/history",
  },
} as const;
