"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { ReferrerInfo } from "@/components/ReferrerInfo";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, isAuthenticated, isLoading } = useAuthStore();
  const toast = useToastStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    referralCode: searchParams.get("ref") || "",
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    referralCode?: string;
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
    if (
      !formData.email ||
      !formData.password ||
      !formData.firstName ||
      !formData.lastName
    ) {
      const newErrors: typeof errors = {};
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.password) newErrors.password = "Password is required";
      setErrors(newErrors);

      toast.error("Please fill in all required fields");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrors({ email: "Please enter a valid email address" });
      toast.error("Invalid email format");
      return;
    }

    // Password length validation
    if (formData.password.length < 6) {
      setErrors({ password: "Password must be at least 6 characters long" });
      toast.error("Password must be at least 6 characters");
      return;
    }

    // Prepare registration data - only include referralCode if it has a value
    const registerData: any = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
    };

    // Only include referralCode if user provided one
    if (formData.referralCode && formData.referralCode.trim()) {
      registerData.referralCode = formData.referralCode.trim();
    }

    const result = await register(registerData);

    if (result.success) {
      toast.success("Account created successfully! Redirecting...");
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
          const message = err.message;

          // Map validation field names to our form field names
          if (field === "email" || field?.toLowerCase().includes("email")) {
            newErrors.email = message || "Invalid email";
          } else if (
            field === "password" ||
            field?.toLowerCase().includes("password")
          ) {
            newErrors.password = message || "Invalid password";
          } else if (
            field === "firstName" ||
            field === "firstname" ||
            field === "first_name"
          ) {
            newErrors.firstName = message || "Invalid first name";
          } else if (
            field === "lastName" ||
            field === "lastname" ||
            field === "last_name"
          ) {
            newErrors.lastName = message || "Invalid last name";
          } else if (field === "referralCode" || field === "referral_code") {
            // Only show referral code error if user actually entered a value
            if (formData.referralCode && formData.referralCode.trim()) {
              newErrors.referralCode = message || "Invalid referral code";
            }
          }
        });
      }

      // Fallback to parsing error message if no validation errors
      if (Object.keys(newErrors).length === 0) {
        const errorMessage = result.error || "Registration failed";

        if (
          errorMessage.toLowerCase().includes("email") ||
          errorMessage.toLowerCase().includes("already exists") ||
          errorMessage.toLowerCase().includes("already registered") ||
          errorMessage.toLowerCase().includes("duplicate")
        ) {
          newErrors.email = "This email is already registered";
        }

        if (errorMessage.toLowerCase().includes("password")) {
          newErrors.password = "Invalid password";
        }

        // Only show referral code error if user actually entered a value
        if (
          (errorMessage.toLowerCase().includes("referral") ||
            errorMessage.toLowerCase().includes("invalid code")) &&
          formData.referralCode &&
          formData.referralCode.trim()
        ) {
          newErrors.referralCode = "Invalid referral code";
        }

        if (
          errorMessage.toLowerCase().includes("firstname") ||
          errorMessage.toLowerCase().includes("first name")
        ) {
          newErrors.firstName = "Invalid first name";
        }
        if (
          errorMessage.toLowerCase().includes("lastname") ||
          errorMessage.toLowerCase().includes("last name")
        ) {
          newErrors.lastName = "Invalid last name";
        }

        if (Object.keys(newErrors).length === 0) {
          newErrors.general = errorMessage;
        }
      }

      setErrors(newErrors);
      toast.error(result.error || "Registration failed");
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Join ReferralApp
          </h1>
          <p className="text-muted-foreground mt-2">
            Create your account and start earning rewards
          </p>
        </div>

        {/* Referrer Info */}
        {formData.referralCode && (
          <div className="mb-6 animate-slide-in-up">
            <ReferrerInfo referralCode={formData.referralCode} />
          </div>
        )}

        {/* Register Form */}
        <div className="bg-card border border-border rounded-2xl shadow-xl p-8 animate-slide-in-up backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* General error message */}
            {errors.general && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                {errors.general}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="firstName"
                  className="text-sm font-medium text-foreground"
                >
                  First Name
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="text-sm font-medium text-foreground"
                >
                  Last Name
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                  required
                  className="h-11"
                />
              </div>
            </div>

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
                className="h-11"
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
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="referralCode"
                className="text-sm font-medium text-foreground"
              >
                Referral Code{" "}
                <span className="text-muted-foreground">(Optional)</span>
              </label>
              <Input
                id="referralCode"
                name="referralCode"
                type="text"
                placeholder="Enter referral code"
                value={formData.referralCode}
                onChange={handleChange}
                error={errors.referralCode}
                className="h-11 uppercase"
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
                  Creating account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 p-6 bg-card/50 border border-border rounded-2xl backdrop-blur-sm animate-fade-in">
          <h3 className="text-sm font-semibold mb-3">What you'll get:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-green-500 flex-shrink-0"
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
              Unique referral link to share
            </li>
            <li className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-green-500 flex-shrink-0"
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
              2 credits when your referral makes a purchase
            </li>
            <li className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-green-500 flex-shrink-0"
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
              Track all your referrals in one place
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
