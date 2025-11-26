import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTutorialStore } from "@/lib/store/useTutorialStore";
import TutorialStep from "./TutorialStep";

const STOCKS_TUTORIAL_STEPS = [
  {
    type: "coach-mark",
    title: "주식 화면 사용법",
    description: "스와이프로 탭을 이동하고 뒤로 갈 수 있어요.",
  },
  {
    targetId: "stock-tab-explore",
    title: "탐색 탭",
    description: "다양한 주식을 탐색하고 인기 종목을 확인해보세요.",
    position: "bottom",
  },
  {
    targetId: "popular-stock-1",
    title: "인기 종목 확인",
    description: "현재 가장 인기 있는 종목을 눌러 상세 정보를 확인해보세요.",
    position: "bottom",
    action: "click",
  },
];

interface StocksTutorialOverlayProps {
  onComplete?: () => void;
}

export default function StocksTutorialOverlay({
  onComplete,
}: StocksTutorialOverlayProps) {
  const { isActive, activeTutorial, currentStep, nextStep, endTutorial } =
    useTutorialStore();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const stepData = STOCKS_TUTORIAL_STEPS[currentStep];
  const isLastStep = currentStep === STOCKS_TUTORIAL_STEPS.length - 1;
  const isCoachMark = stepData?.type === "coach-mark";

  const updateTargetRect = () => {
    if (isActive && activeTutorial === "stocks" && stepData?.targetId) {
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

    // Observer for dynamic content
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

  if (!isActive || activeTutorial !== "stocks") return null;

  return (
    <AnimatePresence>
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
            layoutId="spotlight-stocks"
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
          <div className="w-full h-full relative">
            {isCoachMark ? (
              // Coach Mark UI
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] pointer-events-auto font-handwriting text-white"
              >
                {/* Swipe to Exit (Left Edge) */}
                <div className="absolute top-1/2 left-8 -translate-y-1/2 flex flex-col items-center">
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
                    <path d="M10 30 H50 M10 30 L25 15 M10 30 L25 45" />
                  </svg>
                  <p className="mt-2 font-bold font-sans text-lg">나가기</p>
                </div>

                {/* Swipe Tabs (Center) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <svg
                    width="100"
                    height="60"
                    viewBox="0 0 100 60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 30 C30 20 70 40 90 30" />
                    <path d="M80 20 L90 30 L80 40" />
                    <path d="M20 20 L10 30 L20 40" />
                  </svg>
                  <p className="mt-4 font-bold font-sans text-xl">탭 이동</p>
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
                className="pointer-events-auto w-full max-w-xs transition-all duration-300 z-[9999]"
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
                  totalSteps={STOCKS_TUTORIAL_STEPS.length}
                  onNext={handleNext}
                  onPrev={() => {}} // No prev for now
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
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
