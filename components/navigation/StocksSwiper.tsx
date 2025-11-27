"use client";
import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { StocksView } from "@/components/StocksBottomNavBar";

// Swiper styles
import "swiper/css";
import "swiper/css/effect-creative";

// Swiper modules
import { EffectCreative } from "swiper/modules";

import PortfolioScreen from "@/components/screens/PortfolioScreen";
import ExploreScreen from "@/components/screens/ExploreScreen";
import AnalysisScreen from "@/components/screens/AnalysisScreen";
import { useHistoryStore } from "@/lib/stores/useHistoryStore";

interface StocksSwiperProps {
  currentView: StocksView;
  onSlideChange: (view: StocksView) => void;
  onSelectStock: (ticker: string) => void;
  selectedTicker: string;
}

// StocksView 순서 정의
const viewOrder: StocksView[] = ["portfolio", "explore", "analysis"];

const StocksSwiper: React.FC<StocksSwiperProps> = ({
  currentView,
  onSlideChange,
  onSelectStock,
  selectedTicker,
}) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const { pushStep, getCurrentDepth } = useHistoryStore();

  // currentView가 변경될 때 해당 슬라이드로 이동
  useEffect(() => {
    if (swiperRef.current) {
      const index = viewOrder.indexOf(currentView);
      if (index !== -1 && swiperRef.current.activeIndex !== index) {
        swiperRef.current.slideTo(index);
      }
    }
  }, [currentView]);

  const handleSlideChange = (swiper: SwiperType) => {
    const newView = viewOrder[swiper.activeIndex];
    const newIndex = swiper.activeIndex;

    if (newView !== currentView) {
      // 사용자가 슬라이드를 변경한 경우 히스토리에 기록
      const currentDepth = getCurrentDepth();
      if (currentDepth?.depthId === "stocks") {
        pushStep(newIndex);
      }
      onSlideChange(newView);
    }
  };

  return (
    <Swiper
      modules={[EffectCreative]}
      effect="creative"
      creativeEffect={{
        prev: {
          translate: ["-10px", 0, 0],
          opacity: 0,
        },
        next: {
          translate: ["10px", 0, 0],
          opacity: 0,
        },
      }}
      speed={350}
      allowTouchMove={true}
      noSwipingClass="swiper-no-swiping"
      onSwiper={(swiper) => {
        swiperRef.current = swiper;
      }}
      onSlideChange={handleSlideChange}
      initialSlide={viewOrder.indexOf(currentView)}
      className="h-full w-full"
    >
      <SwiperSlide>
        <div className="h-full overflow-y-auto px-4 pb-24">
          {currentView === "portfolio" ? (
            <PortfolioScreen
              isActive={currentView === "portfolio"}
              onSelectStock={onSelectStock}
              onNavigateToExplore={() => onSlideChange("explore")}
            />
          ) : null}
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="h-full overflow-y-auto px-4 pb-24">
          {currentView === "explore" ? (
            <ExploreScreen
              isActive={currentView === "explore"}
              onSelectStock={onSelectStock}
              selectedTicker={selectedTicker}
            />
          ) : null}
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="h-full overflow-y-auto px-4 pb-24">
          {currentView === "analysis" ? (
            <AnalysisScreen isActive={currentView === "analysis"} />
          ) : null}
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default StocksSwiper;
