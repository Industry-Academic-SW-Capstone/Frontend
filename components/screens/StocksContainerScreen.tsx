"use client";
import React, { useState } from "react";
import StocksBottomNavBar from "@/components/StocksBottomNavBar";
import StocksSwiper from "@/components/navigation/StocksSwiper";
import SlidingScreen from "@/components/navigation/SlidingScreen";
import StockDetailScreen from "./StockDetailScreen";

interface StocksContainerScreenProps {
  onExit: () => void;
  needHeader?: boolean;
}

import { useStockStore } from "@/lib/stores/useStockStore";

const StocksContainerScreen: React.FC<StocksContainerScreenProps> = ({
  onExit,
  needHeader = true,
}) => {
  const { stocksView: currentView, setStocksView: setCurrentView } =
    useStockStore();
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);

  const handleSelectStock = (ticker: string) => {
    setSelectedTicker(ticker);
  };

  const handleBack = () => {
    setSelectedTicker(null);
  };

  const getHeaderTitle = () => {
    switch (currentView) {
      case "portfolio":
        return "내 자산";
      case "explore":
        return "탐색";
      case "analysis":
        return "투자 분석";
      default:
        return "증권";
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-bg-primary/95 backdrop-blur-sm border-b border-border-color p-4">
        <h1 className="text-xl font-bold text-center text-text-primary">
          {getHeaderTitle()}
        </h1>
      </header>

      <div className="flex-1 overflow-hidden">
        <StocksSwiper
          currentView={currentView}
          onSlideChange={setCurrentView}
          onSelectStock={handleSelectStock}
        />
      </div>

      {needHeader && (
        <StocksBottomNavBar
          currentView={currentView}
          setCurrentView={setCurrentView}
          onExit={onExit}
        />
      )}

      {/* 종목 상세 화면 - 오른쪽에서 슬라이딩 */}
      <SlidingScreen isOpen={!!selectedTicker} onClose={handleBack}>
        {selectedTicker && (
          <StockDetailScreen ticker={selectedTicker} onBack={handleBack} />
        )}
      </SlidingScreen>
    </div>
  );
};

export default StocksContainerScreen;
