"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuthStore();
  const toast = useToastStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    // Basic validation
    if (!formData.email || !formData.password) {
      const newErrors: typeof errors = {};
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.password) newErrors.password = "Password is required";
      setErrors(newErrors);

      if (!formData.email || !formData.password) {
        toast.error("Please fill in all fields");
      }
      return;
    }

    const result = await login(formData);

    if (result.success) {
      toast.success("Welcome back! Redirecting...");
      router.push("/dashboard");
    } else {
      const newErrors: typeof errors = {};

      // Use validation errors from API if available
      if (
        (result as any).validationErrors &&
        Array.isArray((result as any).validationErrors)
      ) {
        (result as any).validationErrors.forEach((err: any) => {
          const field = err.field || err.path;
          if (field === "email") newErrors.email = err.message;
          if (field === "password") newErrors.password = err.message;
        });
      }

      // Fallback to parsing error message if no validation errors
      if (Object.keys(newErrors).length === 0) {
        const errorMessage = result.error || "Login failed";

        if (
          errorMessage.toLowerCase().includes("email") ||
          errorMessage.toLowerCase().includes("user not found") ||
          errorMessage.toLowerCase().includes("invalid email")
        ) {
          newErrors.email = "Invalid email address";
        }

        if (
          errorMessage.toLowerCase().includes("password") ||
          errorMessage.toLowerCase().includes("invalid credentials") ||
          errorMessage.toLowerCase().includes("incorrect password")
        ) {
          newErrors.password = "Incorrect password";
        }

        if (Object.keys(newErrors).length === 0) {
          newErrors.general = errorMessage;
        }
      }

      setErrors(newErrors);
      toast.error(result.error || "Login failed");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl mb-4 shadow-lg shadow-primary/20">
            <svg
              className="w-8 h-8 text-primary-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mt-2">
            Sign in to access your referral dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-card border border-border rounded-2xl shadow-xl p-8 animate-slide-in-up backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General error message */}
            {errors.general && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                {errors.general}
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
                className="h-12"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 shadow-lg shadow-primary/20 transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-primary font-medium hover:underline"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-2 gap-4 text-center animate-fade-in">
          <div className="p-4 bg-card/50 border border-border rounded-xl backdrop-blur-sm">
            <div className="text-2xl font-bold text-primary">2x</div>
            <div className="text-xs text-muted-foreground mt-1">
              Reward Credits
            </div>
          </div>
          <div className="p-4 bg-card/50 border border-border rounded-xl backdrop-blur-sm">
            <div className="text-2xl font-bold text-primary">∞</div>
            <div className="text-xs text-muted-foreground mt-1">
              Unlimited Referrals
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
