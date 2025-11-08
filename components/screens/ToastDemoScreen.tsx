"use client";

import React from "react";
import { toast } from "@/lib/stores/useToastStore";
import * as Icons from "@/components/icons/Icons";

const ToastDemoScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg-primary p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Toast 시스템 데모
        </h1>
        <p className="text-text-secondary mb-8">
          다양한 Toast 알림을 테스트해보세요
        </p>

        {/* Basic Toasts */}
        <div className="bg-bg-secondary rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-text-primary mb-4">
            기본 Toast
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => toast.success("성공적으로 완료되었습니다!")}
              className="bg-positive text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Success
            </button>
            <button
              onClick={() => toast.error("오류가 발생했습니다.")}
              className="bg-negative text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Error
            </button>
            <button
              onClick={() => toast.warning("주의가 필요합니다.")}
              className="bg-accent text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Warning
            </button>
            <button
              onClick={() => toast.info("새로운 정보가 있습니다.")}
              className="bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Info
            </button>
          </div>
        </div>

        {/* Positions */}
        <div className="bg-bg-secondary rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-text-primary mb-4">
            위치 선택
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => toast.info("Top Left", { position: "top-left" })}
              className="bg-bg-primary border-2 border-border-color py-3 px-4 rounded-lg font-semibold hover:bg-border-color/50 transition-colors"
            >
              Top Left
            </button>
            <button
              onClick={() =>
                toast.info("Top Center", { position: "top-center" })
              }
              className="bg-bg-primary border-2 border-border-color py-3 px-4 rounded-lg font-semibold hover:bg-border-color/50 transition-colors"
            >
              Top Center
            </button>
            <button
              onClick={() => toast.info("Top Right", { position: "top-right" })}
              className="bg-bg-primary border-2 border-border-color py-3 px-4 rounded-lg font-semibold hover:bg-border-color/50 transition-colors"
            >
              Top Right
            </button>
            <button
              onClick={() =>
                toast.info("Bottom Left", { position: "bottom-left" })
              }
              className="bg-bg-primary border-2 border-border-color py-3 px-4 rounded-lg font-semibold hover:bg-border-color/50 transition-colors"
            >
              Bottom Left
            </button>
            <button
              onClick={() =>
                toast.info("Bottom Center", { position: "bottom-center" })
              }
              className="bg-bg-primary border-2 border-border-color py-3 px-4 rounded-lg font-semibold hover:bg-border-color/50 transition-colors"
            >
              Bottom Center
            </button>
            <button
              onClick={() =>
                toast.info("Bottom Right", { position: "bottom-right" })
              }
              className="bg-bg-primary border-2 border-border-color py-3 px-4 rounded-lg font-semibold hover:bg-border-color/50 transition-colors"
            >
              Bottom Right
            </button>
          </div>
        </div>

        {/* Advanced Examples */}
        <div className="bg-bg-secondary rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-text-primary mb-4">
            고급 예제
          </h2>
          <div className="space-y-3">
            <button
              onClick={() =>
                toast.success("이 메시지는 10초간 표시됩니다", {
                  duration: 10000,
                })
              }
              className="w-full bg-bg-primary border-2 border-border-color py-3 px-4 rounded-lg font-semibold hover:bg-border-color/50 transition-colors text-left"
            >
              긴 Duration (10초)
            </button>
            <button
              onClick={() =>
                toast.error("수동으로 닫아야 합니다", {
                  duration: 0,
                })
              }
              className="w-full bg-bg-primary border-2 border-border-color py-3 px-4 rounded-lg font-semibold hover:bg-border-color/50 transition-colors text-left"
            >
              자동 소멸 없음
            </button>
            <button
              onClick={() =>
                toast.info("닫기 버튼이 없습니다", {
                  dismissible: false,
                  duration: 2000,
                })
              }
              className="w-full bg-bg-primary border-2 border-border-color py-3 px-4 rounded-lg font-semibold hover:bg-border-color/50 transition-colors text-left"
            >
              Dismissible False
            </button>
            <button
              onClick={() =>
                toast.success("커스텀 아이콘!", {
                  icon: <Icons.SparklesIcon className="w-5 h-5 text-accent" />,
                })
              }
              className="w-full bg-bg-primary border-2 border-border-color py-3 px-4 rounded-lg font-semibold hover:bg-border-color/50 transition-colors text-left"
            >
              커스텀 아이콘
            </button>
          </div>
        </div>

        {/* Complex Content */}
        <div className="bg-bg-secondary rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-text-primary mb-4">
            복잡한 컨텐츠
          </h2>
          <div className="space-y-3">
            <button
              onClick={() =>
                toast.success(
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Icons.TrophyIcon className="w-5 h-5 text-accent" />
                      <span className="font-bold">새 업적 달성!</span>
                    </div>
                    <div className="text-xs text-text-secondary">
                      "첫 거래" 업적을 달성했습니다.
                    </div>
                    <div className="mt-1 px-3 py-1 bg-accent/20 rounded-lg text-xs font-semibold text-accent w-fit">
                      +100 포인트
                    </div>
                  </div>,
                  {
                    duration: 6000,
                    position: "top-right",
                  }
                )
              }
              className="w-full bg-bg-primary border-2 border-border-color py-3 px-4 rounded-lg font-semibold hover:bg-border-color/50 transition-colors text-left"
            >
              업적 달성 알림
            </button>
            <button
              onClick={() =>
                toast.info(
                  <div>
                    <div className="font-bold mb-1">주문 체결</div>
                    <div className="text-xs text-text-secondary">
                      삼성전자 10주가 체결되었습니다.
                    </div>
                    <div className="flex gap-2 mt-2 text-xs">
                      <span className="text-text-secondary">평균가:</span>
                      <span className="font-semibold text-positive">
                        ₩72,500
                      </span>
                    </div>
                  </div>,
                  { duration: 5000 }
                )
              }
              className="w-full bg-bg-primary border-2 border-border-color py-3 px-4 rounded-lg font-semibold hover:bg-border-color/50 transition-colors text-left"
            >
              주문 체결 알림
            </button>
            <button
              onClick={() =>
                toast.warning(
                  <div>
                    <div className="font-bold mb-1">⚠️ 랭킹 변동</div>
                    <div className="text-xs">
                      3위 → 5위로 하락했습니다. 분발하세요!
                    </div>
                  </div>,
                  {
                    duration: 4000,
                    position: "bottom-center",
                  }
                )
              }
              className="w-full bg-bg-primary border-2 border-border-color py-3 px-4 rounded-lg font-semibold hover:bg-border-color/50 transition-colors text-left"
            >
              랭킹 변동 알림
            </button>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="bg-bg-secondary rounded-xl p-6">
          <h2 className="text-xl font-bold text-text-primary mb-4">
            Toast 제어
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => {
                const id = toast.info("이 Toast는 5초 후 자동 삭제됩니다", {
                  duration: 5000,
                });
                setTimeout(() => {
                  toast.dismiss(id);
                  toast.success("Toast가 제거되었습니다!");
                }, 2000);
              }}
              className="flex-1 bg-bg-primary border-2 border-primary text-primary py-3 px-4 rounded-lg font-semibold hover:bg-primary hover:text-white transition-all"
            >
              Toast 제거 테스트
            </button>
            <button
              onClick={() => toast.dismissAll()}
              className="flex-1 bg-negative text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              모두 닫기
            </button>
          </div>
        </div>

        {/* Usage Example */}
        <div className="mt-8 bg-bg-secondary rounded-xl p-6">
          <h2 className="text-xl font-bold text-text-primary mb-4">
            사용 예제
          </h2>
          <div className="bg-bg-primary rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-text-secondary">
              {`import { toast } from "@/lib/stores/useToastStore";

// 기본 사용
toast.success("성공!");
toast.error("오류!");

// 옵션 사용
toast.info("알림", { 
  duration: 5000,
  position: "top-right" 
});

// ReactNode 사용
toast.success(
  <div>
    <div className="font-bold">제목</div>
    <div className="text-xs">내용</div>
  </div>
);`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToastDemoScreen;
