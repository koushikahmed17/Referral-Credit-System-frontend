"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { StatCard } from "@/components/StatCard";
import { Navbar } from "@/components/Navbar";
import { Loader } from "@/components/Loader";
import { useAuth } from "@/hooks/useAuth";
import {
  usePurchaseStats,
  usePurchasesList,
  useCreatePurchase,
} from "@/hooks/usePurchases";

export default function PurchasesPage() {
  const router = useRouter();
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
    refetch: refetchStats,
  } = usePurchaseStats();
  const {
    purchases,
    loading: purchasesLoading,
    refetch: refetchPurchases,
  } = usePurchasesList();
  const { createPurchase, loading: creating } = useCreatePurchase();

  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleLogout = async () => {
    await logout();
  };

  const handlePurchase = async (description: string, amount: number) => {
    setSuccessMessage("");
    setErrorMessage("");

    const result = await createPurchase({ amount, description });

    if (result.success && result.data) {
      const { purchase, referralReward } = result.data;

      let message = `Successfully purchased ${description} for $${amount}!`;

      if (referralReward?.awarded) {
        message += ` 🎉 ${referralReward.message}`;
      }

      setSuccessMessage(message);

      // Immediately refetch data to show updated stats
      refreshUser();
      refetchStats();
      refetchPurchases();
    } else {
      setErrorMessage(result.error || "Failed to create purchase");
    }
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
            <h1 className="text-3xl font-bold">Purchases</h1>
            <p className="text-muted-foreground">
              Manage your purchases and make new ones
            </p>
            <div className="text-sm text-muted-foreground">
              Current Credits:{" "}
              <strong className="text-primary">{user.credits}</strong>
            </div>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">
              {errorMessage}
            </div>
          )}

          {/* Stats Grid */}
          {statsLoading ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Purchases"
                value={stats.totalPurchases}
                description="All time purchases"
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
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                }
              />

              <StatCard
                title="Total Spent"
                value={`$${(stats.totalAmount || 0).toFixed(2)}`}
                description="Lifetime spending"
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

              <StatCard
                title="Completed Purchases"
                value={stats.completedPurchases || 0}
                description="Successfully completed"
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                }
              />

              <StatCard
                title="Average Amount"
                value={`$${(stats.averageAmount || 0).toFixed(2)}`}
                description="Per purchase"
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
            </div>
          ) : null}

          {/* Create Purchase Section */}
          <div className="bg-card rounded-lg border p-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Make a Purchase</h2>
              <p className="text-muted-foreground">
                Purchase items and earn rewards through referrals
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 space-y-3">
                <div className="space-y-1">
                  <h3 className="font-medium">Premium Plan</h3>
                  <p className="text-sm text-muted-foreground">
                    Full access to all features
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">$99.99</span>
                  <Button
                    size="sm"
                    onClick={() => handlePurchase("Premium Plan", 99.99)}
                    loading={creating}
                    disabled={creating}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg p-4 space-y-3">
                <div className="space-y-1">
                  <h3 className="font-medium">Add-on Feature</h3>
                  <p className="text-sm text-muted-foreground">
                    Extra functionality
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">$49.99</span>
                  <Button
                    size="sm"
                    onClick={() => handlePurchase("Add-on Feature", 49.99)}
                    loading={creating}
                    disabled={creating}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg p-4 space-y-3">
                <div className="space-y-1">
                  <h3 className="font-medium">Storage Upgrade</h3>
                  <p className="text-sm text-muted-foreground">
                    Additional storage space
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">$29.99</span>
                  <Button
                    size="sm"
                    onClick={() => handlePurchase("Storage Upgrade", 29.99)}
                    loading={creating}
                    disabled={creating}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Purchases */}
          <div className="bg-card rounded-lg border p-6 space-y-4">
            <h3 className="text-lg font-semibold">Purchase History</h3>
            {purchasesLoading ? (
              <div className="flex justify-center py-8">
                <Loader />
              </div>
            ) : purchases.length > 0 ? (
              <div className="space-y-3">
                {purchases.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-md"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <svg
                          className="h-5 w-5 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">{purchase.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(purchase.createdAt).toLocaleDateString()}
                        </p>
                        {purchase.isFirstPurchase && (
                          <span className="text-xs text-primary font-medium">
                            First Purchase 🎉
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${(purchase.amount || 0).toFixed(2)}
                      </p>
                      {purchase.referralRewarded && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Referral Rewarded
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No purchases yet</p>
                <p className="text-sm mt-2">
                  Make your first purchase to get started!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
