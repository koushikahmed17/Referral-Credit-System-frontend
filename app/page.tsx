"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/Button";
import { Navbar } from "@/components/Navbar";

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  // Redirect to dashboard if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {};

  return (
    <>
      {user && <Navbar user={user} onLogout={handleLogout} />}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Welcome to <span className="text-primary">ReferralApp</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our referral program and start earning rewards by inviting
              friends. Get started today and unlock exclusive benefits.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => router.push("/register")}
              className="animate-fade-in"
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/login")}
              className="animate-fade-in"
            >
              Sign In
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center space-y-2 animate-slide-in">
              <div className="h-12 w-12 mx-auto rounded-lg bg-primary/10 flex items-center justify-center">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Refer Friends</h3>
              <p className="text-muted-foreground">
                Invite your friends and earn rewards for every successful
                referral.
              </p>
            </div>

            <div className="text-center space-y-2 animate-slide-in">
              <div className="h-12 w-12 mx-auto rounded-lg bg-primary/10 flex items-center justify-center">
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
              <h3 className="text-lg font-semibold">Track Earnings</h3>
              <p className="text-muted-foreground">
                Monitor your referral earnings and track your progress in
                real-time.
              </p>
            </div>

            <div className="text-center space-y-2 animate-slide-in">
              <div className="h-12 w-12 mx-auto rounded-lg bg-primary/10 flex items-center justify-center">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Secure & Reliable</h3>
              <p className="text-muted-foreground">
                Your data is protected with enterprise-grade security measures.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
