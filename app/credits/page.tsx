"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";
import { Navbar } from "@/components/Navbar";
import { StatCard } from "@/components/StatCard";
import { StatCardSkeleton } from "@/components/Skeleton";
import { useCreditHistory } from "@/hooks/useDashboard";

export default function CreditsPage() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    logout,
  } = useAuthStore();
  const toast = useToastStore();

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
              💰 Credit History
            </h1>
            <p className="text-muted-foreground">
              Track your credit balance and transaction history
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {loading ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : error ? (
              <div className="col-span-full p-6 bg-destructive/10 border border-destructive/20 rounded-xl text-center">
                <p className="text-destructive">Failed to load credit history</p>
              </div>
            ) : (
              <>
                <StatCard
                  title="Current Balance"
                  value={creditHistory?.currentBalance ?? user.credits ?? 0}
                  description="Available credits"
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
                  title="Total Earned"
                  value={creditHistory?.totalEarned ?? 0}
                  description="Lifetime earnings"
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
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  }
                  trend="up"
                />
              </>
            )}
          </div>

          {/* Transaction History */}
          <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-lg">
            <h2 className="text-xl font-semibold mb-6">Transaction History</h2>
            {loading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading history...</p>
              </div>
            ) : !creditHistory || creditHistory.history.length === 0 ? (
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p className="text-muted-foreground font-medium">No transactions yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Your credit history will appear here once you earn credits
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {creditHistory.history.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 rounded-xl transition-all border border-transparent hover:border-border group"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-xl group-hover:scale-105 transition-transform ${
                          item.type === "EARNED"
                            ? "bg-green-500/10 text-green-600"
                            : "bg-red-500/10 text-red-600"
                        }`}
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {item.type === "EARNED" ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 12H4"
                            />
                          )}
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">{item.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(item.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${
                          item.type === "EARNED"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {item.type === "EARNED" ? "+" : "-"}
                        {item.amount}
                      </p>
                      <p className="text-xs text-muted-foreground">credits</p>
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
