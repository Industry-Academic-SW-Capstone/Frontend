"use client";
import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Screen, Account, User } from "@/lib/types/stock";
import { useHistoryStore } from "@/lib/stores/useHistoryStore";

// Swiper styles
import "swiper/css";
import "swiper/css/effect-creative";

// Swiper modules
import { EffectCreative } from "swiper/modules";

import HomeScreen from "@/components/screens/HomeScreen";
import CompetitionsScreen from "@/components/screens/CompetitionsScreen";
import RankingsScreen from "@/components/screens/RankingsScreen";
import ProfileScreen from "@/components/screens/ProfileScreen";

interface MainSwiperProps {
  selectedAccount: Account;
  user: User;
  currentScreen: Screen;
  onSlideChange: (screen: Screen) => void;
  isStockContainerActive: boolean;
}

// Screen 순서 정의
const screenOrder: Screen[] = ["home", "competitions", "rankings", "profile"];

const MainSwiper: React.FC<MainSwiperProps> = ({
  selectedAccount,
  user,
  currentScreen,
  onSlideChange,
  isStockContainerActive,
}) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const { pushDepth, pushStep, getCurrentDepth } = useHistoryStore();
  const isInitialized = useRef(false);

  // 초기 렌더링 시 Main Depth 초기화
  useEffect(() => {
    if (!isInitialized.current) {
      const initialIndex = screenOrder.indexOf(currentScreen);
      pushDepth("main", initialIndex);
      isInitialized.current = true;
    }
  }, []);

  // currentScreen이 변경될 때 해당 슬라이드로 이동 (외부에서 변경된 경우)
  useEffect(() => {
    if (swiperRef.current && currentScreen !== "stocks") {
      const index = screenOrder.indexOf(currentScreen);
      if (index !== -1 && swiperRef.current.activeIndex !== index) {
        swiperRef.current.slideTo(index);
      }
    }
  }, [currentScreen]);

  const handleSlideChange = (swiper: SwiperType) => {
    const newScreen = screenOrder[swiper.activeIndex];
    const newIndex = swiper.activeIndex;

    if (newScreen !== currentScreen) {
      // 사용자가 슬라이드를 변경한 경우 히스토리에 기록
      pushStep(newIndex);
      onSlideChange(newScreen);
    }
  };

  return (
    <Swiper
      modules={[EffectCreative]}
      effect="creative"
      creativeEffect={{
        prev: {
          translate: ["-15px", 0, 0],
          opacity: 0,
        },
        next: {
          translate: ["15px", 0, 0],
          opacity: 0,
        },
      }}
      speed={250}
      allowTouchMove={true}
      onSwiper={(swiper) => {
        swiperRef.current = swiper;
      }}
      onSlideChange={handleSlideChange}
      initialSlide={screenOrder.indexOf(currentScreen)}
      className="h-full w-full"
    >
      <SwiperSlide>
        <div className="h-full px-4 pb-28 overflow-y-auto">
          <HomeScreen
            selectedAccount={selectedAccount}
            isActive={currentScreen === "home" && !isStockContainerActive}
            onNavigate={onSlideChange}
          />
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="h-full px-4 pb-28 overflow-y-auto">
          {currentScreen === "competitions" ? <CompetitionsScreen /> : null}
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="h-full px-4 pb-28 overflow-y-auto">
          {currentScreen === "rankings" ? (
            <RankingsScreen selectedAccount={selectedAccount} user={user} />
          ) : null}
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="h-full px-4 pb-28 overflow-y-auto">
          {currentScreen === "profile" ? (
            <ProfileScreen user={user} onNavigate={onSlideChange} />
          ) : null}
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default MainSwiper;
