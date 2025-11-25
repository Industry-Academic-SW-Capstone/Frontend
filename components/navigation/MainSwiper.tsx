"use client";
import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Screen, Account, User } from "@/lib/types/stock";

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
}

// Screen 순서 정의
const screenOrder: Screen[] = ["home", "competitions", "rankings", "profile"];

const MainSwiper: React.FC<MainSwiperProps> = ({
  selectedAccount,
  user,
  currentScreen,
  onSlideChange,
}) => {
  const swiperRef = useRef<SwiperType | null>(null);

  // currentScreen이 변경될 때 해당 슬라이드로 이동
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
    if (newScreen !== currentScreen) {
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
