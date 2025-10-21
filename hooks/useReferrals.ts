import { useState, useEffect } from "react";
import {
  getReferralStats,
  getReferralsList,
  validateReferralCode,
  getReferralDetails,
} from "@/services/referrals";
import { ReferralStats, Referral } from "@/types/api";

// Hook to fetch referral stats
export const useReferralStats = () => {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReferralStats();
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

// Hook to fetch referrals list
export const useReferralsList = (page: number = 1, limit: number = 10) => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReferralsList(page, limit);
      setReferrals(data.referrals);
      setPagination(data.pagination);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch referrals")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, [page, limit]);

  return { referrals, pagination, loading, error, refetch: fetchReferrals };
};

// Hook to validate referral code
export const useValidateReferralCode = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const validate = async (code: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await validateReferralCode(code);
      return result;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to validate code");
      setError(error);
      return { isValid: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  return { validate, loading, error };
};

// Hook to get referral details
export const useReferralDetails = (code: string | null) => {
  const [details, setDetails] = useState<{
    referralCode: string;
    isValid: boolean;
    referrerName?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!code) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getReferralDetails(code);
        setDetails(data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch details")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [code]);

  return { details, loading, error };
};
