"use client";

import React, { useState } from "react";
import { PhoneFrame } from "../ui/PhoneFrame";
import { Home, PieChart, User } from "lucide-react";
import { DemoHomeScreen } from "../demos/DemoHomeScreen";
import { DemoStockDetailScreen } from "../demos/DemoStockDetailScreen";

type ScreenType = "home" | "stock-detail" | "portfolio" | "profile";

export const AppDemoVisual: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("home");
  const [selectedStock, setSelectedStock] = useState<string | null>(null);

  const handleNavigate = (screen: string) => {
    if (screen.startsWith("stock/")) {
      const stockCode = screen.split("/")[1];
      setSelectedStock(stockCode);
      setCurrentScreen("stock-detail");
    } else if (screen === "home") {
      setCurrentScreen("home");
      setSelectedStock(null);
    } else {
      // For other screens, we can just stay on home or show a placeholder
      // For now, let's just log it and maybe show home
      console.log("Navigate to:", screen);
      if (screen === "portfolio" || screen === "profile") {
        // Optional: Implement these screens later
        setCurrentScreen("home");
      }
    }
  };

  const handleBack = () => {
    setCurrentScreen("home");
    setSelectedStock(null);
  };

  return (
    <div className="w-full flex justify-center">
      <PhoneFrame>
        {/* Screen Content */}
        <div className="h-full bg-gray-50 relative flex flex-col">
          {/* Main Content Area */}
          <div
            className="flex-1 overflow-y-auto scrollbar-hide pt-6 pb-16"
            data-lenis-prevent
          >
            {currentScreen === "home" && (
              <DemoHomeScreen onNavigate={handleNavigate} />
            )}
            {currentScreen === "stock-detail" && selectedStock && (
              <DemoStockDetailScreen
                stockCode={selectedStock}
                onBack={handleBack}
              />
            )}
          </div>

          {/* Simulated Bottom Nav - Only visible on Home */}
          {currentScreen === "home" && (
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-3 px-6 flex justify-between items-center text-gray-400 z-20">
              <button
                onClick={() => setCurrentScreen("home")}
                className={`flex flex-col items-center gap-1 ${
                  currentScreen === "home"
                    ? "text-blue-600"
                    : "hover:text-blue-600"
                } transition-colors`}
              >
                <Home size={20} />
                <span className="text-[10px] font-medium">홈</span>
              </button>
              <button className="flex flex-col items-center gap-1 hover:text-blue-600 transition-colors">
                <PieChart size={20} />
                <span className="text-[10px] font-medium">투자</span>
              </button>
              <button className="flex flex-col items-center gap-1 hover:text-blue-600 transition-colors">
                <User size={20} />
                <span className="text-[10px] font-medium">내 정보</span>
              </button>
            </div>
          )}
        </div>
      </PhoneFrame>
    </div>
  );
};
