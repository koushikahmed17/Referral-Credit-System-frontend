import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "@/components/Toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Referral App - Earn Rewards",
  description:
    "A modern referral system built with Next.js - Share, Earn, Succeed",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
          {children}
          <ToastContainer />
        </div>
      </body>
    </html>
  );
}
