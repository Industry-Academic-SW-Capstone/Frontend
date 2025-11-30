"use client";
import React from "react";
import { motion } from "framer-motion";

interface HeroHeaderProps {
  data: {
    title: string;
    subTitle: string;
    mood: "bull" | "bear" | "neutral";
  };
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({ data }) => {
  const { title, subTitle, mood } = data;

  // Gradient styles based on mood
  const bgGradient =
    mood === "bull"
      ? "bg-gradient-to-br from-[#FF4B4B] to-[#FF8E8E]" // Red for Bull (Korean style)
      : mood === "bear"
      ? "bg-gradient-to-br from-[#3182F6] to-[#68A5FF]" // Blue for Bear
      : "bg-gradient-to-br from-[#333D4B] to-[#4E5968]"; // Dark Gray for Neutral

  const emoji = mood === "bull" ? "🔥" : mood === "bear" ? "🥶" : "👀";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-7 rounded-3xl bg-linear-to-br border-none ${bgGradient} mb-6 shadow-lg`}
    >
      <h2 className="text-2xl font-bold text-white mb-2 leading-tight drop-shadow-sm">
        {data.title}
      </h2>
      <p className="text-white/90 text-sm font-medium leading-relaxed">
        {data.subTitle}
      </p>
    </motion.div>
  );
};

export default HeroHeader;
