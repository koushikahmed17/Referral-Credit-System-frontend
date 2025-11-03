"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";
import { Button } from "@/components/Button";
import { StatCard } from "@/components/StatCard";
import { Navbar } from "@/components/Navbar";
import { StatCardSkeleton } from "@/components/Skeleton";
import {
  usePurchaseStats,
  usePurchasesList,
  useCreatePurchase,
} from "@/hooks/usePurchases";

// Predefined packages
const PACKAGES = [
  {
    id: "basic",
    name: "Basic Package",
    description: "Perfect for getting started",
    price: 9.99,
    features: [
      "Access to basic features",
      "Email support",
      "1 GB storage",
      "Valid for 1 month",
    ],
    popular: false,
    icon: "📦",
  },
  {
    id: "premium",
    name: "Premium Package",
    description: "Most popular choice",
    price: 29.99,
    features: [
      "All basic features",
      "Priority support",
      "10 GB storage",
      "Advanced analytics",
      "Valid for 3 months",
    ],
    popular: true,
    icon: "⭐",
  },
  {
    id: "pro",
    name: "Pro Package",
    description: "For power users",
    price: 49.99,
    features: [
      "All premium features",
      "24/7 dedicated support",
      "Unlimited storage",
      "Custom integrations",
      "API access",
      "Valid for 6 months",
    ],
    popular: false,
    icon: "💎",
  },
  {
    id: "enterprise",
    name: "Enterprise Package",
    description: "For large teams",
    price: 99.99,
    features: [
      "All pro features",
      "Dedicated account manager",
      "Custom solutions",
      "SLA guarantee",
      "Training included",
      "Valid for 1 year",
    ],
    popular: false,
    icon: "🏢",
  },
];

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

  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

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

  const handlePurchase = async (pkg: (typeof PACKAGES)[0]) => {
    setSelectedPackage(pkg.id);

    const result = await createPurchase({
      amount: pkg.price,
      description: `${pkg.name} - ${pkg.description}`,
      productId: pkg.id,
    });

    if (result.success && result.data) {
      const { referralReward } = result.data;

      if (referralReward?.awarded) {
        toast.success(
          `🎉 ${pkg.name} purchased! ${referralReward.message}`,
          5000
        );
      } else {
        toast.success(`✅ ${pkg.name} purchased successfully!`);
      }

      // Refresh data
      refreshUser();
      refetchStats();
      refetchPurchases();
    } else {
      toast.error(result.error || "Failed to complete purchase");
    }

    setSelectedPackage(null);
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
              💳 Purchase Packages
            </h1>
            <p className="text-muted-foreground">
              Choose the perfect package for your needs
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

          {/* Packages Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Available Packages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative bg-gradient-to-br from-card via-card to-primary/5 rounded-2xl border-2 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col ${
                    pkg.popular
                      ? "border-primary shadow-primary/20"
                      : "border-border"
                  }`}
                >
                  {/* Popular Badge */}
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-primary to-purple-600 text-primary-foreground text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  {/* Package Icon */}
                  <div className="text-center mb-4">
                    <div className="text-5xl mb-3">{pkg.icon}</div>
                    <h3 className="text-xl font-bold">{pkg.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {pkg.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="flex items-end justify-center gap-1">
                      <span className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        ${pkg.price}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6 flex-grow">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <svg
                          className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Purchase Button */}
                  <div className="mt-auto">
                    <Button
                      onClick={() => handlePurchase(pkg)}
                      disabled={creating && selectedPackage === pkg.id}
                      className={`w-full h-12 ${
                        pkg.popular
                          ? "bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-primary-foreground shadow-lg shadow-primary/20"
                          : "bg-gradient-to-r from-primary/80 to-purple-600/80 hover:from-primary hover:to-purple-600 text-primary-foreground"
                      }`}
                    >
                      {creating && selectedPackage === pkg.id ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        <>
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
                              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          Buy Package
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Purchases List */}
          <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-lg">
            <h2 className="text-xl font-semibold mb-6">Purchase History</h2>
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
                <p className="text-muted-foreground font-medium">
                  No purchases yet
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Choose a package above to get started!
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
                          {new Date(purchase.createdAt).toLocaleDateString()}
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
