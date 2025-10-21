"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";
import { Button } from "@/components/Button";
import { StatCard } from "@/components/StatCard";
import { CopyButton } from "@/components/CopyButton";
import { Navbar } from "@/components/Navbar";
import { SocialShare } from "@/components/SocialShare";
import { StatCardSkeleton, ReferralCardSkeleton } from "@/components/Skeleton";
import { useReferralStats, useReferralsList } from "@/hooks/useReferrals";
import { useReferralLink } from "@/hooks/useDashboard";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    logout,
    refreshUser,
  } = useAuthStore();
  const toast = useToastStore();

  const {
    stats,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useReferralStats();
  
  const {
    referrals,
    loading: referralsLoading,
    refetch: refetchReferrals,
  } = useReferralsList(1, 5);
  
  const { referralLink, loading: linkLoading } = useReferralLink();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // Always construct referral link using frontend URL (not backend URL)
  const displayReferralLink =
    typeof window !== "undefined" && user && user.referralCode
      ? `${window.location.origin}/register?ref=${user.referralCode}`
      : "";

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await Promise.all([refreshUser(), refetchStats(), refetchReferrals()]);
      toast.success("Data refreshed successfully!");
    } catch (error) {
      toast.error("Failed to refresh data");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Show loader while checking authentication
  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Welcome back, {user.firstName}! 👋
                </h1>
                <p className="text-muted-foreground mt-2">
                  Track your referral performance and earnings
                </p>
              </div>
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="outline"
                className="w-full sm:w-auto"
              >
                {isRefreshing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                    Refreshing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Refresh Data
                  </div>
                )}
              </Button>
            </div>

            {/* Quick Stats Pills */}
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="px-4 py-2 bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-full flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-primary"
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
                <span className="font-semibold text-primary">
                  {user.credits ?? 0} Credits
                </span>
              </div>
              <div className="px-4 py-2 bg-muted/50 border border-border rounded-full flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                <span className="text-muted-foreground">
                  Code: <strong className="text-foreground">{user.referralCode}</strong>
                </span>
              </div>
            </div>
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
                <p className="text-destructive">Failed to load stats. Please try refreshing.</p>
              </div>
            ) : (
              <>
                <StatCard
                  title="Total Credits"
                  value={user.credits ?? 0}
                  description="Your current balance"
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
              </>
            )}
          </div>

          {/* Referral Link Section */}
          <div className="bg-gradient-to-br from-card via-card to-primary/5 rounded-2xl border border-border p-6 sm:p-8 shadow-xl space-y-6 animate-slide-in-up">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
                <span className="text-2xl">🔗</span>
                Your Referral Link
              </h2>
              <p className="text-muted-foreground">
                Share this link with friends to start earning rewards
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 p-4 bg-background/50 border border-border rounded-xl backdrop-blur-sm">
                <code className="text-sm break-all text-primary font-mono">
                  {displayReferralLink}
                </code>
              </div>
              <CopyButton text={displayReferralLink} />
            </div>

            {/* Social Share Buttons */}
            {referralLink && referralLink.socialShare && (
              <div className="pt-6 border-t border-border">
                <SocialShare
                  socialShare={referralLink.socialShare}
                  shareableMessage={referralLink.shareableMessage}
                />
              </div>
            )}
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Referrals */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-lg space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-primary"
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
                Recent Referrals
              </h3>
              {referralsLoading ? (
                <div className="space-y-3">
                  <ReferralCardSkeleton />
                  <ReferralCardSkeleton />
                  <ReferralCardSkeleton />
                </div>
              ) : referrals.length > 0 ? (
                <>
                  <div className="space-y-3">
                    {referrals.map((referral) => (
                      <div
                        key={referral.id}
                        className="flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 rounded-xl transition-colors border border-transparent hover:border-border"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-primary-foreground font-semibold shadow-lg">
                            {referral.referredUser?.firstName?.[0] || "?"}
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {referral.referredUser
                                ? `${referral.referredUser.firstName} ${referral.referredUser.lastName}`
                                : "User"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(referral.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-medium ${
                              referral.status === "CONFIRMED"
                                ? "bg-green-500/10 text-green-600 border border-green-500/20"
                                : "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20"
                            }`}
                          >
                            {referral.status}
                          </span>
                          {referral.status === "CONFIRMED" && (
                            <span className="text-sm font-semibold text-green-600">
                              +{referral.rewardAmount}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link href="/referrals">
                    <Button variant="outline" className="w-full">
                      View All Referrals
                    </Button>
                  </Link>
                </>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 opacity-50"
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
                  <p className="font-medium">No referrals yet</p>
                  <p className="text-sm mt-2">
                    Share your referral link to get started!
                  </p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-lg space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link href="/purchases" className="block">
                  <Button variant="outline" className="w-full justify-start h-12 text-left group hover:bg-primary/5 hover:border-primary/20 transition-all">
                    <svg
                      className="mr-3 h-5 w-5 text-primary group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <div>
                      <div className="font-medium">Make a Purchase</div>
                      <div className="text-xs text-muted-foreground">Create a new purchase</div>
                    </div>
                  </Button>
                </Link>
                <Link href="/credits" className="block">
                  <Button variant="outline" className="w-full justify-start h-12 text-left group hover:bg-primary/5 hover:border-primary/20 transition-all">
                    <svg
                      className="mr-3 h-5 w-5 text-primary group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <div>
                      <div className="font-medium">Credit History</div>
                      <div className="text-xs text-muted-foreground">View all transactions</div>
                    </div>
                  </Button>
                </Link>
                <Link href="/referrals" className="block">
                  <Button variant="outline" className="w-full justify-start h-12 text-left group hover:bg-primary/5 hover:border-primary/20 transition-all">
                    <svg
                      className="mr-3 h-5 w-5 text-primary group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <div>
                      <div className="font-medium">Referral Stats</div>
                      <div className="text-xs text-muted-foreground">Detailed analytics</div>
                    </div>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
