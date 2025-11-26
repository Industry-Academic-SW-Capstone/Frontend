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
    targetId: "stock-favorite-button",
    title: "관심종목",
    description: "이 종목을 관심종목으로 등록하려면 이 버튼을 누르세요.",
    position: "bottom",
  },
  {
    targetId: "stock-chart",
    title: "차트 팁",
    description:
      "차트는 터치해서 자세한 정보를 보거나 두 손가락으로 확대할 수 있어요.",
    position: "bottom",
  },
  {
    targetId: "stock-period-mode-controls",
    title: "차트 팁",
    description: "이 버튼을 눌러서 차트의 기간과 스타일을 변경할 수 있어요.",
    position: "bottom",
  },
  {
    targetId: "stock-tab-orderbook",
    title: "호가창 확인하기",
    description: "호가 탭을 눌러 매수/매도 대기 물량을 확인해보세요.",
    position: "bottom",
    action: "click",
  },
  {
    title: "호가가 안나오나요?",
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
                <div className="absolute top-1/2 -left-[2px] flex flex-row items-center">
                  <svg
                    width="60"
                    height="60"
                    viewBox="0 0 60 60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-90"
                  >
                    {/* Hand-drawn arrow from left to right */}
                    <path d="M5 30 C 15 28, 35 32, 45 30" />
                    <path d="M35 20 C 38 22, 42 28, 45 30" />
                    <path d="M35 40 C 38 38, 42 32, 45 30" />
                  </svg>
                  <p className=" font-bold font-sans text-lg">
                    당겨서 뒤로가기
                  </p>
                </div>

                {/* Pinch Zoom (Center) */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <svg
                    width="100"
                    height="60"
                    viewBox="0 0 100 60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-90"
                  >
                    {/* Left Arrow */}
                    <path d="M40 30 C 35 28, 25 32, 15 30" />
                    <path d="M25 20 C 22 22, 18 28, 15 30" />
                    <path d="M25 40 C 22 38, 18 32, 15 30" />

                    {/* Right Arrow */}
                    <path d="M60 30 C 65 32, 75 28, 85 30" />
                    <path d="M75 20 C 78 22, 82 28, 85 30" />
                    <path d="M75 40 C 78 38, 82 32, 85 30" />
                  </svg>
                  <p className="mt-2 font-bold font-sans text-lg">확대/축소</p>
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
                  onSkip={() => {
                    endTutorial();
                    if (onComplete) {
                      onComplete();
                    }
                  }}
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
