"use client";
import React from "react";
import { DemoHeader } from "./components/DemoHeader";
import { DemoGreeting } from "./components/DemoGreeting";
import { DemoAssetSummary } from "./components/DemoAssetSummary";
import { DemoMissionSummary } from "./components/DemoMissionSummary";
import { DemoFavorites } from "./components/DemoFavorites";
import { DemoPendingOrders } from "./components/DemoPendingOrders";
import { DemoRankings } from "./components/DemoRankings";
import { DemoBottomNav } from "./components/DemoBottomNav";

interface DemoHomeScreenProps {
  onNavigate: (screen: string) => void;
}

export const DemoHomeScreen: React.FC<DemoHomeScreenProps> = ({
  onNavigate,
}) => {
  return (
    <div className="relative min-h-screen-safe bg-bg-primary overflow-hidden">
      <DemoHeader />

      <div className="space-y-3 p-4 pt-20 pb-24 relative min-h-full">
        {/* Greeting Section */}
        <div onClick={() => onNavigate("profile")}>
          <DemoGreeting />
        </div>

        {/* Total Assets Section */}
        <div onClick={() => onNavigate("portfolio")}>
          <DemoAssetSummary />
        </div>

        {/* Featured Competition */}
        {/* <div className="transition-opacity duration-500">
          <div onClick={() => onNavigate("competitions")}>
            <DemoFeaturedCompetition />
          </div>
        </div> */}

        {/* Mission Summary */}
        <div className="transition-opacity duration-500">
          <div onClick={() => onNavigate("competitions")}>
            <DemoMissionSummary />
          </div>
        </div>

        {/* Favorites Section */}
        <DemoFavorites />

        {/* Pending Orders Section */}
        <DemoPendingOrders />

        {/* Rankings Preview */}
        <DemoRankings />
      </div>

      <DemoBottomNav />
    </div>
  );
};
