import React from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  description: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  className = "",
}) => {
  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-muted-foreground",
  };

  const trendIcon = {
    up: (
      <svg
        className="w-4 h-4"
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
    ),
    down: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
        />
      </svg>
    ),
    neutral: null,
  };

  return (
    <div
      className={`bg-gradient-to-br from-card via-card to-primary/5 rounded-2xl border border-border p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        {icon && (
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-xl text-primary group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        )}
        {trend && (
          <div className={`flex items-center gap-1 ${trendColors[trend]}`}>
            {trendIcon[trend]}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          {value}
        </p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};
