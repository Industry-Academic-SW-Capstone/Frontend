import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTutorialStore } from "@/lib/store/useTutorialStore";
import Portal from "../Portal";
import TutorialStep from "./TutorialStep";

const STOCK_DETAIL_TUTORIAL_STEPS = [
  {
    type: "coach-mark",
    title: "주식 상세 화면 가이드",
    description: "차트와 호가창을 활용하는 방법을 알려드릴게요.",
  },
  {
    targetId: "stock-tab-orderbook",
    title: "호가창 확인하기",
    description: "호가 탭을 눌러 매수/매도 대기 물량을 확인해보세요.",
    position: "bottom",
    action: "click",
  },
  {
    title: "호가창이 안나와요?",
    description:
      "호가는 국장이 열리는 오전 9시부터 오후 3시 30분 사이에만 볼 수 있어요.",
    position: "center",
  },
  {
    targetId: "stock-tab-chart",
    title: "차트로 돌아가기",
    description: "다시 차트 탭으로 돌아가볼까요?",
    position: "bottom",
    action: "click",
  },
  {
    targetId: "stock-buy-button",
    title: "구매하기",
    description: "이 버튼을 눌러 주식을 구매할 수 있어요.",
    position: "top",
  },
  {
    targetId: "stock-sell-button",
    title: "판매하기",
    description: "보유한 주식을 판매하려면 이 버튼을 누르세요.",
    position: "top",
  },
];

interface StockDetailTutorialOverlayProps {
  onComplete?: () => void;
}

export default function StockDetailTutorialOverlay({
  onComplete,
}: StockDetailTutorialOverlayProps) {
  const { isActive, activeTutorial, currentStep, nextStep, endTutorial } =
    useTutorialStore();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const stepData = STOCK_DETAIL_TUTORIAL_STEPS[currentStep];
  const isLastStep = currentStep === STOCK_DETAIL_TUTORIAL_STEPS.length - 1;
  const isCoachMark = stepData?.type === "coach-mark";

  const updateTargetRect = () => {
    if (isActive && activeTutorial === "stock-detail" && stepData?.targetId) {
      const element = document.getElementById(stepData.targetId);
      if (element) {
        setTargetRect(element.getBoundingClientRect());
      } else {
        setTargetRect(null);
      }
    } else {
      setTargetRect(null);
    }
  };

  useEffect(() => {
    updateTargetRect();
    window.addEventListener("resize", updateTargetRect);
    window.addEventListener("scroll", updateTargetRect);

    const observer = new MutationObserver(updateTargetRect);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("resize", updateTargetRect);
      window.removeEventListener("scroll", updateTargetRect);
      observer.disconnect();
    };
  }, [isActive, activeTutorial, currentStep, stepData]);

  const handleNext = () => {
    if (stepData?.action === "click" && stepData.targetId) {
      const element = document.getElementById(stepData.targetId);
      if (element) {
        element.click();
      }
    }
    if (isLastStep) {
      endTutorial();
      if (onComplete) {
        onComplete();
      }
    } else {
      nextStep();
    }
  };

  if (!isActive || activeTutorial !== "stock-detail") return null;

  return (
    <AnimatePresence>
      <Portal>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] overflow-hidden"
        >
          {/* Backdrop */}
          <div
            className={`absolute inset-0 transition-colors duration-500 ${
              targetRect ? "bg-transparent" : "bg-black/70"
            } ${!isCoachMark && !targetRect ? "backdrop-blur-sm" : ""}`}
          />

          {/* Spotlight Hole */}
          {targetRect && (
            <motion.div
              layoutId="spotlight-detail"
              className="absolute rounded-xl border-2 border-white/50 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] pointer-events-none"
              initial={false}
              animate={{
                top: targetRect.top - 8,
                left: targetRect.left - 8,
                width: targetRect.width + 16,
                height: targetRect.height + 16,
              }}
              transition={{ type: "spring", stiffness: 200, damping: 30 }}
            />
          )}

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 pointer-events-none">
            {isCoachMark ? (
              // Coach Mark UI
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] pointer-events-auto font-handwriting text-white"
              >
                {/* Swipe Back (Top Left) */}
                <div className="absolute top-20 left-4 flex flex-col items-start">
                  <svg
                    width="50"
                    height="50"
                    viewBox="0 0 50 50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 25 H40 M10 25 L20 15 M10 25 L20 35" />
                  </svg>
                  <p className="mt-2 font-bold font-sans text-lg">뒤로가기</p>
                </div>

                {/* Pinch Zoom (Center) */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 80 80"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M30 30 L20 20 M60 30 L70 20 M30 60 L20 70 M60 60 L70 70" />
                    <circle cx="45" cy="45" r="5" fill="currentColor" />
                  </svg>
                  <p className="mt-2 font-bold font-sans text-lg">확대/축소</p>
                </div>

                {/* Chart Interaction (Center Bottom) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-12 flex flex-col items-center">
                  <svg
                    width="60"
                    height="60"
                    viewBox="0 0 60 60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M30 10 V50 M10 30 H50" strokeDasharray="4 4" />
                    <circle cx="30" cy="30" r="20" />
                  </svg>
                  <p className="mt-2 font-bold font-sans text-lg">
                    터치하여 정보 확인
                  </p>
                </div>

                {/* Favorite (Top Right) */}
                <div className="absolute top-16 right-4 flex flex-col items-end">
                  <svg
                    width="50"
                    height="50"
                    viewBox="0 0 50 50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M25 10 L30 20 L40 20 L32 28 L35 40 L25 32 L15 40 L18 28 L10 20 L20 20 Z" />
                  </svg>
                  <p className="mt-2 font-bold font-sans text-lg">
                    관심종목 추가
                  </p>
                </div>

                {/* Next Button */}
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full flex justify-center">
                  <button
                    onClick={handleNext}
                    className="bg-white text-black px-10 py-3.5 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform active:scale-95 font-sans"
                  >
                    알겠어요
                  </button>
                </div>
              </motion.div>
            ) : (
              // Normal Step UI
              <div
                className="pointer-events-auto w-full max-w-xs transition-all duration-300"
                style={{
                  position: targetRect ? "absolute" : "relative",
                  top: targetRect
                    ? stepData.position === "top"
                      ? targetRect.top - 20
                      : targetRect.bottom + 20
                    : undefined,
                  left: targetRect
                    ? Math.min(
                        Math.max(
                          16,
                          targetRect.left + targetRect.width / 2 - 160
                        ),
                        window.innerWidth - 320 - 16
                      )
                    : undefined,
                  transform:
                    targetRect && stepData.position === "top"
                      ? "translateY(-100%)"
                      : "none",
                }}
              >
                <TutorialStep
                  title={stepData.title}
                  description={stepData.description}
                  currentStep={currentStep}
                  totalSteps={STOCK_DETAIL_TUTORIAL_STEPS.length}
                  onNext={handleNext}
                  onPrev={() => {}}
                  onSkip={endTutorial}
                  isLastStep={isLastStep}
                />
              </div>
            )}
          </div>
        </motion.div>
      </Portal>
    </AnimatePresence>
  );
}
