"use client";
import React from "react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  children?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = "neutral",
  children,
}) => {
  const changeColor =
    changeType === "positive"
      ? "text-positive"
      : changeType === "negative"
      ? "text-negative"
      : "text-text-secondary";

  return (
    <div className="bg-bg-secondary p-5 rounded-2xl shadow-md border border-border-color flex flex-col items-center justify-center text-center card-hover cursor-pointer group overflow-hidden relative">
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer pointer-events-none" />

      {children && (
        <div className="mb-3 transform transition-transform duration-300 group-hover:scale-110">
          {children}
        </div>
      )}

      <p className="text-text-secondary text-sm font-medium mb-1 transition-colors duration-300 group-hover:text-primary">
        {title}
      </p>

      <p className="text-text-primary text-2xl font-bold my-1 transition-all duration-300 group-hover:scale-110">
        {value}
      </p>

      {change && (
        <p
          className={`text-sm font-semibold ${changeColor} transition-all duration-300 group-hover:scale-105`}
        >
          {change}
        </p>
      )}

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

export default StatCard;
