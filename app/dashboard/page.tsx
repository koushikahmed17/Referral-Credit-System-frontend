"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { StatCard } from "@/components/StatCard";
import { CopyButton } from "@/components/CopyButton";
import { Navbar } from "@/components/Navbar";
import { Loader } from "@/components/Loader";
import { SocialShare } from "@/components/SocialShare";
import { useAuth } from "@/hooks/useAuth";
import { useReferralStats, useReferralsList } from "@/hooks/useReferrals";
import { useReferralLink } from "@/hooks/useDashboard";

export default function DashboardPage() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    logout,
    refreshUser,
  } = useAuth();
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
  };

  // Show loader while checking authentication
  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">
              Welcome, {user.firstName || ""} {user.lastName || ""}!
            </h1>
            <p className="text-muted-foreground">
              Track your referral performance and earnings
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">
                Your Credits:{" "}
                <strong className="text-primary">{user.credits ?? 0}</strong>
              </span>
              <span className="text-muted-foreground">
                Referral Code:{" "}
                <strong className="text-primary">
                  {user.referralCode || ""}
                </strong>
              </span>
              <button
                onClick={async () => {
                  if (isRefreshing) return;
                  setIsRefreshing(true);
                  try {
                    await Promise.all([
                      refreshUser(),
                      refetchStats(),
                      refetchReferrals(),
                    ]);
                  } catch (error) {
                    console.error("Error refreshing data:", error);
                  } finally {
                    setIsRefreshing(false);
                  }
                }}
                disabled={isRefreshing}
                className={`text-xs ${
                  isRefreshing
                    ? "text-muted-foreground cursor-not-allowed"
                    : "text-primary hover:text-primary/80"
                } underline`}
              >
                {isRefreshing ? "Refreshing..." : "Refresh Data"}
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Always show credits - uses user data */}
            <StatCard
              title="Total Credits"
              value={user.credits ?? 0}
              description="Your current balance"
              icon={
                <svg
                  className="h-4 w-4"
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
            />

            {/* Referral stats - show loading/error states */}
            {statsLoading ? (
              <>
                <div className="bg-card rounded-lg border p-6 flex items-center justify-center">
                  <Loader />
                </div>
                <div className="bg-card rounded-lg border p-6 flex items-center justify-center">
                  <Loader />
                </div>
                <div className="bg-card rounded-lg border p-6 flex items-center justify-center">
                  <Loader />
                </div>
              </>
            ) : statsError ? (
              <>
                <div className="bg-card rounded-lg border p-6">
                  <p className="text-sm text-destructive">Failed to load</p>
                </div>
                <div className="bg-card rounded-lg border p-6">
                  <p className="text-sm text-destructive">Failed to load</p>
                </div>
                <div className="bg-card rounded-lg border p-6">
                  <p className="text-sm text-destructive">Failed to load</p>
                </div>
              </>
            ) : stats ? (
              <>
                <StatCard
                  title="Total Referrals"
                  value={stats.totalReferred}
                  description="People you've referred"
                  icon={
                    <svg
                      className="h-4 w-4"
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
                  title="Converted Referrals"
                  value={stats.converted}
                  description="Made a purchase"
                  icon={
                    <svg
                      className="h-4 w-4"
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
                />

                <StatCard
                  title="Pending Referrals"
                  value={stats.pending}
                  description="Awaiting first purchase"
                  icon={
                    <svg
                      className="h-4 w-4"
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
            ) : null}
          </div>

          {/* Referral Link Section */}
          <div className="bg-card rounded-lg border p-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Your Referral Link</h2>
              <p className="text-muted-foreground">
                Share this link with friends to start earning rewards
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 p-3 bg-muted rounded-md border">
                <code className="text-sm break-all">{displayReferralLink}</code>
              </div>
              <CopyButton text={displayReferralLink} />
            </div>

            {/* Social Share Buttons */}
            {referralLink && referralLink.socialShare && (
              <div className="border-t pt-6">
                <SocialShare
                  socialShare={referralLink.socialShare}
                  shareableMessage={referralLink.shareableMessage}
                />
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg border p-6 space-y-4">
              <h3 className="text-lg font-semibold">Recent Referrals</h3>
              {referralsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader />
                </div>
              ) : referrals.length > 0 ? (
                <>
                  <div className="space-y-3">
                    {referrals.map((referral) => (
                      <div
                        key={referral.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-md"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {referral.referredUser?.firstName?.[0] || "?"}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {referral.referredUser
                                ? `${referral.referredUser.firstName} ${referral.referredUser.lastName}`
                                : "User"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(
                                referral.createdAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              referral.status === "CONFIRMED"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {referral.status}
                          </span>
                          {referral.status === "CONFIRMED" && (
                            <span className="text-sm font-medium text-green-600">
                              +{referral.rewardAmount} credits
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/referrals")}
                  >
                    View All Referrals
                  </Button>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No referrals yet</p>
                  <p className="text-sm mt-2">
                    Share your referral link to get started!
                  </p>
                </div>
              )}
            </div>

            <div className="bg-card rounded-lg border p-6 space-y-4">
              <h3 className="text-lg font-semibold">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  Share on Social Media
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Send Email Invites
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Download QR Code
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
