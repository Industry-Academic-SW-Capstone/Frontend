"use client";

import React from "react";
import dynamic from "next/dynamic";
import { FadeIn } from "@/components/about/ui/Motion";

const AppDemoVisual = dynamic(
  () => import("./AppDemoVisual").then((mod) => mod.AppDemoVisual),
  {
    loading: () => (
      <div className="lg:w-1/2 h-[600px] flex items-center justify-center bg-gray-100 rounded-[2.5rem]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    ),
    ssr: false, // Disable SSR for the demo visual as it's heavy and interactive
  }
);

export const AppDemo: React.FC = () => {
  return (
    <section id="demo" className=" bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Side: Text */}
          <FadeIn
            direction="right"
            className="lg:w-1/2 space-y-8"
            duration={0.8}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
              손안에서 펼쳐지는 <br />
              <span className="text-blue-600">실전 투자 경험</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              스톡잇은 실제와 동일한 시장 환경을 제공합니다. 신뢰성 있는 서버와
              빠르고 반응성 높은 인터페이스를 통해 언제 어디서나 시장 상황을
              확인하고 포트폴리오를 관리하세요.
            </p>

            <ul className="space-y-4">
              {[
                "실시간 시세 반영 및 차트 분석",
                "나만의 포트폴리오 분석 리포트",
                "친구들과 함께하는 랭킹 시스템",
                "미션을 통해 배우는 금융 지식",
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 text-gray-700 font-medium"
                >
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </FadeIn>

          {/* Right Side: Phone Demo */}
          <FadeIn
            direction="left"
            className="lg:w-1/2 w-full"
            delay={0.2}
            duration={0.8}
          >
            <AppDemoVisual />
          </FadeIn>
        </div>
      </div>
    </section>
  );
};
