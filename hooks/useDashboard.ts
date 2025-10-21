import { useState, useEffect } from "react";
import {
  getDashboardStats,
  getDashboardSummary,
  getReferralLink,
  getCreditHistory,
} from "@/services/dashboard";
import {
  DashboardStats,
  DashboardSummary,
  ReferralLinkData,
  CreditHistory,
} from "@/types/api";

// Hook to fetch complete dashboard stats
export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDashboardStats();
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

// Hook to fetch dashboard summary (lightweight)
export const useDashboardSummary = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDashboardSummary();
      setSummary(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch summary")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return { summary, loading, error, refetch: fetchSummary };
};

// Hook to fetch referral link with social share
export const useReferralLink = () => {
  const [referralLink, setReferralLink] = useState<ReferralLinkData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchReferralLink = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReferralLink();
      setReferralLink(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch referral link")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralLink();
  }, []);

  return { referralLink, loading, error, refetch: fetchReferralLink };
};

// Hook to fetch credit history
export const useCreditHistory = () => {
  const [creditHistory, setCreditHistory] = useState<CreditHistory | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCreditHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCreditHistory();
      setCreditHistory(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch credit history")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreditHistory();
  }, []);

  return { creditHistory, loading, error, refetch: fetchCreditHistory };
};
