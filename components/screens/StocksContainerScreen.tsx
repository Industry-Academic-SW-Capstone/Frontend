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
import { useFetchInfo, usePutInfo } from "@/lib/hooks/me/useInfo";
import { useTutorialStore } from "@/lib/store/useTutorialStore";
import { useHistoryStore } from "@/lib/stores/useHistoryStore";

const StocksContainerScreen: React.FC<StocksContainerScreenProps> = ({
  onExit,
  needHeader = true,
}) => {
  const { stocksView: currentView, setStocksView: setCurrentView } =
    useStockStore();
  const { startStocksTutorial } = useTutorialStore();
  const { data: userInfo } = useFetchInfo();
  const { mutate: updateInfo } = usePutInfo();
  const { pushDepth } = useHistoryStore();
  const isInitialized = React.useRef(false);

  const handleTutorialComplete = () => {
    updateInfo({ securitiesDepthTutorialCompleted: true });
  };

  // 초기 렌더링 시 Stocks Depth 초기화
  React.useEffect(() => {
    if (!isInitialized.current) {
      const viewOrder = ["portfolio", "explore", "analysis"];
      const initialIndex = viewOrder.indexOf(currentView);
      pushDepth("stocks", initialIndex);
      isInitialized.current = true;
    }
  }, []);

  // Trigger tutorial on mount
  React.useEffect(() => {
    if (userInfo && !userInfo.securitiesDepthTutorialCompleted) {
      // Small delay to ensure UI is ready
      const timer = setTimeout(() => {
        startStocksTutorial();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [userInfo, startStocksTutorial]);

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
          selectedTicker={selectedTicker || ""}
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
      <SlidingScreen
        isOpen={!!selectedTicker}
        onClose={handleBack}
        depthId={selectedTicker ? `detail_stock_${selectedTicker}` : undefined}
      >
        {selectedTicker && (
          <StockDetailScreen ticker={selectedTicker} onBack={handleBack} />
        )}
      </SlidingScreen>

      {/* <StocksTutorialOverlay onComplete={handleTutorialComplete} /> */}
    </div>
  );
};

export default StocksContainerScreen;
