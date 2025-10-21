import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "rectangular",
}) => {
  const baseClasses = "animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted";
  const sizeClass = "bg-[length:1000px_100%]";

  const variantClasses = {
    text: "h-4 w-full rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  return (
    <div
      className={`${baseClasses} ${sizeClass} ${variantClasses[variant]} ${className}`}
    />
  );
};

export const StatCardSkeleton: React.FC = () => {
  return (
    <div className="bg-card rounded-xl border p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton variant="circular" className="h-10 w-10" />
        <Skeleton variant="text" className="h-4 w-16" />
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" className="h-8 w-20" />
        <Skeleton variant="text" className="h-3 w-32" />
      </div>
    </div>
  );
};

export const ReferralCardSkeleton: React.FC = () => {
  return (
    <div className="bg-muted rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton variant="text" className="h-4 w-32" />
            <Skeleton variant="text" className="h-3 w-24" />
          </div>
        </div>
        <Skeleton variant="text" className="h-6 w-20" />
      </div>
    </div>
  );
};

