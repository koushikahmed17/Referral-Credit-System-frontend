"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { StatCard } from "@/components/StatCard";
import { Navbar } from "@/components/Navbar";

export default function PurchasesPage() {
  const router = useRouter();

  // Mock data
  const user = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
  };

  const purchaseStats = {
    totalPurchases: 15,
    totalSpent: 1250.75,
    averageOrderValue: 83.38,
    lastPurchase: "3 days ago",
  };

  const recentPurchases = [
    {
      id: 1,
      item: "Premium Plan",
      amount: 99.99,
      date: "2024-01-15",
      status: "completed",
    },
    {
      id: 2,
      item: "Add-on Feature",
      amount: 49.99,
      date: "2024-01-10",
      status: "completed",
    },
    {
      id: 3,
      item: "Storage Upgrade",
      amount: 29.99,
      date: "2024-01-05",
      status: "completed",
    },
  ];

  const handleLogout = () => {
    // TODO: Implement logout logic
    router.push("/");
  };

  const handlePurchase = async (item: string, amount: number) => {
    // TODO: Implement actual purchase logic
    console.log(`Simulating purchase: ${item} for $${amount}`);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Show success message or redirect
    alert(`Successfully purchased ${item} for $${amount}!`);
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Purchases</h1>
            <p className="text-muted-foreground">
              Manage your purchases and simulate new ones for testing
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Purchases"
              value={purchaseStats.totalPurchases}
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
              value={`$${purchaseStats.totalSpent}`}
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
              title="Average Order"
              value={`$${purchaseStats.averageOrderValue}`}
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              }
            />

            <StatCard
              title="Last Purchase"
              value={purchaseStats.lastPurchase}
              description="Most recent order"
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

          {/* Simulate Purchase Section */}
          <div className="bg-card rounded-lg border p-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Simulate Purchase</h2>
              <p className="text-muted-foreground">
                Test the referral system by simulating purchases
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
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Purchases */}
          <div className="bg-card rounded-lg border p-6 space-y-4">
            <h3 className="text-lg font-semibold">Recent Purchases</h3>
            <div className="space-y-3">
              {recentPurchases.map((purchase) => (
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
                      <p className="font-medium">{purchase.item}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(purchase.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${purchase.amount}</p>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        purchase.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {purchase.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
