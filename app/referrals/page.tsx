"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";
import { Navbar } from "@/components/Navbar";
import { StatCard } from "@/components/StatCard";
import { StatCardSkeleton, ReferralCardSkeleton } from "@/components/Skeleton";
import { useReferralStats, useReferralsList } from "@/hooks/useReferrals";

export default function ReferralsPage() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    logout,
  } = useAuthStore();
  const toast = useToastStore();

  const {
    stats,
    loading: statsLoading,
    error: statsError,
  } = useReferralStats();

  const {
    referrals,
    pagination,
    loading: referralsLoading,
  } = useReferralsList(1, 20);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              👥 My Referrals
            </h1>
            <p className="text-muted-foreground">
              Track all your referrals and their conversion status
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {statsLoading ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : statsError ? (
              <div className="col-span-full p-6 bg-destructive/10 border border-destructive/20 rounded-xl text-center">
                <p className="text-destructive">Failed to load stats</p>
              </div>
            ) : (
              <>
                <StatCard
                  title="Total Referrals"
                  value={stats?.totalReferred ?? 0}
                  description="People you've referred"
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  }
                />
                <StatCard
                  title="Converted"
                  value={stats?.converted ?? 0}
                  description="Made a purchase"
                  icon={
                    <svg
                      className="h-5 w-5"
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
                  }
                  trend="up"
                />
                <StatCard
                  title="Pending"
                  value={stats?.pending ?? 0}
                  description="Awaiting first purchase"
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  }
                />
                <StatCard
                  title="Total Credits"
                  value={stats?.totalCredits ?? 0}
                  description="Earned from referrals"
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  }
                  trend="up"
                />
              </>
            )}
          </div>

          {/* Referrals List */}
          <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">All Referrals</h2>
              {pagination && pagination.total > 0 && (
                <span className="text-sm text-muted-foreground">
                  {pagination.total} total
                </span>
              )}
            </div>

            {referralsLoading ? (
              <div className="space-y-3">
                <ReferralCardSkeleton />
                <ReferralCardSkeleton />
                <ReferralCardSkeleton />
              </div>
            ) : referrals.length === 0 ? (
              <div className="text-center py-16">
                <svg
                  className="w-20 h-20 mx-auto mb-4 text-muted-foreground/50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <p className="text-muted-foreground font-medium text-lg">No referrals yet</p>
                <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                  Share your referral link from the dashboard to start earning credits when your friends make their first purchase!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {referrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="flex items-center justify-between p-5 bg-muted/30 hover:bg-muted/50 rounded-xl transition-all border border-transparent hover:border-border group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg group-hover:scale-105 transition-transform">
                        {referral.referredUser?.firstName?.[0] || "?"}
                        {referral.referredUser?.lastName?.[0] || ""}
                      </div>
                      <div>
                        <p className="font-semibold text-lg">
                          {referral.referredUser
                            ? `${referral.referredUser.firstName} ${referral.referredUser.lastName}`
                            : "User"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {referral.referredUser?.email || "No email"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Joined {new Date(referral.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span
                          className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                            referral.status === "CONFIRMED"
                              ? "bg-green-500/10 text-green-600 border border-green-500/20"
                              : "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20"
                          }`}
                        >
                          {referral.status}
                        </span>
                        {referral.status === "CONFIRMED" && (
                          <p className="text-sm font-bold text-green-600 mt-2">
                            +{referral.rewardAmount} credits
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

