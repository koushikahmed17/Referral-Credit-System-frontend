"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Loader } from "@/components/Loader";
import { useAuth } from "@/hooks/useAuth";
import { useCreditHistory } from "@/hooks/useDashboard";

export default function CreditsPage() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    logout,
    refreshUser,
  } = useAuth();
  const {
    creditHistory,
    loading,
    error,
    refetch: refetchCreditHistory,
  } = useCreditHistory();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

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

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case "referral":
        return "bg-green-100 text-green-800";
      case "purchase":
        return "bg-blue-100 text-blue-800";
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "promotion":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "earned":
        return (
          <svg
            className="h-5 w-5 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "spent":
        return (
          <svg
            className="h-5 w-5 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return (
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
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
        );
    }
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Credit History</h1>
            <p className="text-muted-foreground">
              Track your credit earnings and transactions
            </p>
          </div>

          {/* Credit Balance Card */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : error ? (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">
              Failed to load credit history. Please try again later.
            </div>
          ) : creditHistory ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card rounded-lg border p-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
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
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Current Balance
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        {creditHistory.currentBalance} credits
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg border p-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <svg
                        className="h-6 w-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Earned
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {creditHistory.totalEarned} credits
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg border p-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg
                        className="h-6 w-6 text-blue-600"
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
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Transactions
                      </p>
                      <p className="text-2xl font-bold">
                        {creditHistory.history.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction History */}
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-6">
                  Transaction History
                </h2>

                {creditHistory.history.length > 0 ? (
                  <div className="space-y-3">
                    {creditHistory.history.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex-shrink-0">
                            {getTypeIcon(transaction.type)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">
                              {transaction.description}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${getSourceBadgeColor(
                                  transaction.source
                                )}`}
                              >
                                {transaction.source}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(
                                  transaction.createdAt
                                ).toLocaleDateString()}{" "}
                                at{" "}
                                {new Date(
                                  transaction.createdAt
                                ).toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Balance: {transaction.balanceBefore} →{" "}
                              {transaction.balanceAfter}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-lg font-bold ${
                              transaction.type === "earned"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {transaction.type === "earned" ? "+" : "-"}
                            {transaction.amount}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No transactions yet</p>
                    <p className="text-sm mt-2">
                      Start referring friends to earn credits!
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </main>
    </>
  );
}
