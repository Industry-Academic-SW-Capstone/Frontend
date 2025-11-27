"use client";
import React from "react";
import { ChevronLeftIcon } from "@/components/icons/Icons";

interface EventDescriptionScreenProps {
  onClose: () => void;
}

const EventDescriptionScreen: React.FC<EventDescriptionScreenProps> = ({
  onClose,
}) => {
  return (
    <div className="flex flex-col h-full bg-[#f2f4f6] dark:bg-bg-primary overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#f2f4f6]/95 dark:bg-bg-primary/95 backdrop-blur-sm p-4 flex items-center gap-4">
        <button
          onClick={onClose}
          className="p-2 -ml-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
        >
          <ChevronLeftIcon className="w-6 h-6 text-text-primary" />
        </button>
      </div>

      {/* Hero Section - Blue Background like reference */}
      <div className="bg-blue-500 text-white px-6 pb-12 pt-2 flex flex-col items-center text-center relative overflow-hidden">
        <div className="relative z-10">
          <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
            기간 한정 이벤트
          </span>
          <h1 className="text-3xl font-bold leading-tight mb-2">
            스톡잇 투자 왕중왕전
          </h1>
          <p className="text-blue-100 text-lg font-medium">
            총 자본금 1억으로 시작하는
            <br />
            실전 모의투자
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400 rounded-full blur-2xl opacity-50"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-600 rounded-full blur-2xl opacity-50"></div>
      </div>

      {/* Content Container - Overlapping the hero */}
      <div className="-mt-6 px-5 pb-10 space-y-6">
        {/* Prizes Card */}
        <div className="bg-white dark:bg-bg-secondary rounded-3xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-text-primary mb-6">
            총 3분께
            <br />
            선물을 드려요
          </h3>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-blue-500 font-bold text-sm block mb-1">
                  수익률 1위
                </span>
                <span className="text-text-primary font-bold text-lg">
                  BHC 치킨 세트
                </span>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                🍗
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-gray-500 font-bold text-sm block mb-1">
                  수익률 2위
                </span>
                <span className="text-text-primary font-bold text-lg">
                  올리브영 2만원권
                </span>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                💄
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-gray-500 font-bold text-sm block mb-1">
                  수익률 3위
                </span>
                <span className="text-text-primary font-bold text-lg">
                  배달의민족 1만원권
                </span>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                🛵
              </div>
            </div>
          </div>
        </div>

        {/* Special Prize Card */}
        <div className="bg-white dark:bg-bg-secondary rounded-3xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-bold text-text-primary">
              특별상도
              <br />
              준비했어요
            </h3>
            <span className="text-2xl">👻</span>
          </div>
          <div className="bg-gray-50 dark:bg-bg-third rounded-2xl p-4">
            <h4 className="font-bold text-text-primary mb-1">창의적 망함상</h4>
            <p className="text-text-secondary text-sm leading-relaxed">
              수익률이 낮더라도 포트폴리오가 가장 창의적인 분께 드려요. (GRIT팀
              선정)
            </p>
          </div>
        </div>

        {/* Rules Section - Simple List */}
        <div className="px-2">
          <h3 className="text-lg font-bold text-text-primary mb-4">
            참여 방법
          </h3>
          <ul className="space-y-4 relative border-l-2 border-gray-200 dark:border-gray-700 ml-2 pl-6 py-2">
            <li className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-[#f2f4f6] dark:border-bg-primary"></span>
              <p className="font-bold text-text-primary mb-1">자동 참여</p>
              <p className="text-text-secondary text-sm">
                별도 신청 없이 대회 기간 내 1회 이상 거래하면 참여 완료
              </p>
            </li>
            <li className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 border-4 border-[#f2f4f6] dark:border-bg-primary"></span>
              <p className="font-bold text-text-primary mb-1">자본금 1억</p>
              <p className="text-text-secondary text-sm">
                가상 자본금으로 부담 없이 투자하세요
              </p>
            </li>
            <li className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 border-4 border-[#f2f4f6] dark:border-bg-primary"></span>
              <p className="font-bold text-text-primary mb-1">카카오톡 연동</p>
              <p className="text-text-secondary text-sm">
                상품 발송을 위해 카카오톡 로그인이 필요해요
              </p>
            </li>
          </ul>
        </div>

        {/* Footer Note - Dark background like reference */}
        <div className="mt-8 py-8 border-t border-gray-200 dark:border-gray-800">
          <h4 className="font-bold text-gray-500 text-sm mb-3">유의사항</h4>
          <ul className="text-xs text-gray-400 space-y-2 leading-relaxed">
            <li>
              • 본 이벤트는 당사 사정에 따라 사전 고지 없이 변경되거나 조기
              종료될 수 있습니다.
            </li>
            <li>
              • 부정한 방법(어뷰징 등)으로 참여 시 당첨이 취소될 수 있습니다.
            </li>
            <li>
              • 상품 발송을 위해 개인정보(이메일) 활용 동의가 필요할 수
              있습니다.
            </li>
            <li>• 5만원 초과 경품의 제세공과금은 당사 부담입니다.</li>
          </ul>
        </div>

        {/* Action Button */}
        <div className="pb-4">
          <button
            onClick={onClose}
            className="w-full py-4 bg-blue-500 text-white font-bold rounded-2xl text-lg hover:bg-blue-600 active:scale-95 transition-all"
          >
            지금 참여하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDescriptionScreen;
