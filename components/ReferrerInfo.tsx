import React, { useEffect, useState } from "react";
import { getReferralDetails } from "@/services/referrals";
import { Loader } from "./Loader";

interface ReferrerInfoProps {
  referralCode: string;
}

export const ReferrerInfo: React.FC<ReferrerInfoProps> = ({ referralCode }) => {
  const [loading, setLoading] = useState(true);
  const [referrerData, setReferrerData] = useState<{
    referrerName: string;
    referrerEmail: string;
    isValid: boolean;
  } | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchReferrerInfo = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getReferralDetails(referralCode);
        setReferrerData(data);
      } catch (err) {
        setError("Invalid or expired referral code");
        setReferrerData(null);
      } finally {
        setLoading(false);
      }
    };

    if (referralCode) {
      fetchReferrerInfo();
    } else {
      setLoading(false);
    }
  }, [referralCode]);

  if (!referralCode) return null;

  if (loading) {
    return (
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
        <div className="flex items-center justify-center gap-2">
          <Loader />
          <span className="text-sm text-primary">
            Validating referral code...
          </span>
        </div>
      </div>
    );
  }

  if (error || !referrerData?.isValid) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-destructive"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm text-destructive font-medium">
            {error || "Invalid referral code"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <svg
            className="h-6 w-6 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-primary">
              Referred by {referrerData.referrerName}
            </h3>
            <svg
              className="h-4 w-4 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            {referrerData.referrerEmail}
          </p>
          <div className="bg-background rounded-md px-3 py-2">
            <p className="text-xs text-primary font-medium">
              🎉 You&apos;ll both earn 2 credits when you make your first
              purchase!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
