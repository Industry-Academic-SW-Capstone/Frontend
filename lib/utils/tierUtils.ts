import { Tier } from "@/lib/types/stock";

export const parseTier = (tierString: string): Tier => {
  if (!tierString) return "Bronze";

  const upperTier = tierString.toUpperCase();
  if (upperTier.includes("LEGEND")) return "Legend";
  if (upperTier.includes("PLATINUM")) return "Platinum";
  if (upperTier.includes("GOLD")) return "Gold";
  if (upperTier.includes("SILVER")) return "Silver";

  return "Bronze";
};

export const calculateNextTierTarget = (
  currentScore: number,
  scoreToNext: number
): number => {
  return currentScore + scoreToNext;
};
