"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { StatCard } from "@/components/StatCard";
import { Navbar } from "@/components/Navbar";
import { StatCardSkeleton } from "@/components/Skeleton";
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
  } = useAuthStore();
  const toast = useToastStore();

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

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
  });
  const [showForm, setShowForm] = useState(false);

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

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description || !formData.amount) {
      toast.error("Please fill in all fields");
      return;
    }

    const result = await createPurchase({
      amount: parseFloat(formData.amount),
      description: formData.description,
    });

    if (result.success && result.data) {
      const { referralReward } = result.data;

      if (referralReward?.awarded) {
        toast.success(
          `🎉 Purchase created! ${referralReward.message}`,
          5000
        );
      } else {
        toast.success("Purchase created successfully!");
      }

      setFormData({ description: "", amount: "" });
      setShowForm(false);

      // Refresh data
      refreshUser();
      refetchStats();
      refetchPurchases();
    } else {
      toast.error(result.error || "Failed to create purchase");
    }
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                💳 Purchases
              </h1>
              <p className="text-muted-foreground mt-2">
                Track and manage all your purchases
              </p>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 shadow-lg shadow-primary/20"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              New Purchase
            </Button>
          </div>

          {/* Purchase Form */}
          {showForm && (
            <div className="bg-gradient-to-br from-card via-card to-primary/5 rounded-2xl border border-border p-6 sm:p-8 shadow-xl animate-slide-in-up">
              <h2 className="text-xl font-semibold mb-6">Create New Purchase</h2>
              <form onSubmit={handlePurchase} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Input
                      placeholder="What did you purchase?"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Amount ($)</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          amount: e.target.value,
                        }))
                      }
                      required
                      className="h-12"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={creating}
                    className="flex-1 h-12 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
                  >
                    {creating ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating...
                      </div>
                    ) : (
                      "Create Purchase"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="px-8"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {statsLoading ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <>
                <StatCard
                  title="Total Purchases"
                  value={stats?.totalPurchases ?? 0}
                  description="All-time purchases"
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
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  }
                />
                <StatCard
                  title="Total Spent"
                  value={`$${(stats?.totalAmount || 0).toFixed(2)}`}
                  description="Lifetime spending"
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
                  title="Completed"
                  value={stats?.completedPurchases ?? 0}
                  description="Successful purchases"
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
                  title="Average"
                  value={`$${(stats?.averageAmount || 0).toFixed(2)}`}
                  description="Per purchase"
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
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  }
                />
              </>
            )}
          </div>

          {/* Purchases List */}
          <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-lg">
            <h2 className="text-xl font-semibold mb-6">Recent Purchases</h2>
            {purchasesLoading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading purchases...</p>
              </div>
            ) : purchases.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <p className="text-muted-foreground font-medium">No purchases yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Create your first purchase to get started!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {purchases.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 rounded-xl transition-all border border-transparent hover:border-border group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-xl text-primary group-hover:scale-105 transition-transform">
                        <svg
                          className="w-6 h-6"
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
                          {new Date(purchase.createdAt).toLocaleDateString()} •{" "}
                          <span
                            className={`font-medium ${
                              purchase.status === "COMPLETED"
                                ? "text-green-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {purchase.status}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        ${(purchase.amount || 0).toFixed(2)}
                      </p>
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
