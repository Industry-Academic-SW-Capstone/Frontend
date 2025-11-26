import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTutorialStore } from "@/lib/store/useTutorialStore";
import TutorialStep from "./TutorialStep";
import Confetti from "../ui/Confetti";
import Portal from "../Portal";

interface StepData {
  targetId?: string;
  title: string;
  description: string;
  position?: "top" | "bottom" | "center";
  type?: "default" | "overview";
  action?: "click"; // If defined, the "Next" button will trigger a click on the target
}

const TUTORIAL_STEPS: StepData[] = [
  {
    title: "스톡잇에 오신 것을 환영해요!",
    description:
      "주식 투자가 처음이신가요? 걱정 마세요. \n스톡잇과 함께라면 쉽고 재미있게 배울 수 있어요.",
    position: "center",
  },
  {
    title: "한눈에 보는 스톡잇 사용법",
    description: "화면의 주요 기능들을 알려드릴게요.",
    position: "center",
    type: "overview",
  },
  {
    targetId: "total-assets-card",
    title: "내 자산을 한눈에",
    description: "현재 보유한 총 자산과 수익률을 실시간으로 확인할 수 있어요.",
    position: "bottom",
  },
  {
    targetId: "mission-card",
    title: "매일매일 미션 달성!",
    description: "미션을 수행하고 보상을 받아보세요. \n한번 들어가볼까요?",
    position: "top",
    action: "click", // Click to enter mission panel
  },
  {
    targetId: "mission-attendance-button",
    title: "출석체크 잊지 마세요!",
    description: "매일 출석만 해도 보상을 받을 수 있어요.",
    position: "bottom",
  },
  {
    targetId: "mission-daily-list",
    title: "오늘의 미션 확인",
    description: "일일미션을 통해 보상을 모아보세요.",
    position: "top",
  },
  {
    targetId: "mission-close-button",
    title: "이제 나가볼까요?",
    description: "미션 창을 닫고 메인 화면으로 돌아갑니다.",
    position: "bottom",
    action: "click", // Click to close mission panel
  },
  {
    targetId: "bottom-nav-stocks",
    title: "주식 거래하러 가기",
    description: "여기서 투자와 관련된 활동들을 할 수 있어요.",
    position: "top",
  },
  {
    targetId: "bottom-nav-competitions",
    title: "대회 참여하러 가기",
    description: "대회에 참가하거나, 대회를 새로 만들 수 있어요.",
    position: "top",
  },
  {
    targetId: "bottom-nav-rankings",
    title: "랭킹 확인하기",
    description: "다른 투자자들과 실력을 겨뤄보세요.",
    position: "top",
  },
  {
    targetId: "bottom-nav-profile",
    title: "프로필 확인하기",
    description: "프로필을 확인하고 수정하거나, 설정을 변경할 수 있어요.",
    position: "top",
  },
  {
    title: "이제 시작해볼까요?",
    description:
      "준비되셨나요? 모의투자의 세계로 떠나보세요! \n튜토리얼은 프로필 창에서 언제든지 다시 할 수 있어요.",
    position: "center",
  },
];

interface TutorialOverlayProps {
  onComplete?: () => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onComplete }) => {
  const {
    isActive,
    activeTutorial,
    currentStep,
    nextStep,
    prevStep,
    endTutorial,
  } = useTutorialStore();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  const stepData = TUTORIAL_STEPS[currentStep];
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;
  const isOverviewStep = stepData.type === "overview";

  // Function to find and update target rect
  const updateTargetRect = () => {
    if (isActive && activeTutorial === "home" && stepData.targetId) {
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

    const observer = new MutationObserver(updateTargetRect);
    observer.observe(document.body, { childList: true, subtree: true });
    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [isActive, activeTutorial, currentStep, stepData]);

  // Handle window resize/scroll
  useEffect(() => {
    window.addEventListener("resize", updateTargetRect);
    window.addEventListener("scroll", updateTargetRect);
    return () => {
      window.removeEventListener("resize", updateTargetRect);
      window.removeEventListener("scroll", updateTargetRect);
    };
  }, [isActive, activeTutorial, stepData]);

  const handleNext = () => {
    if (stepData.action === "click" && stepData.targetId) {
      const element = document.getElementById(stepData.targetId);
      if (element) {
        element.click();
      }
    }
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      nextStep();
    } else {
      endTutorial();
      if (onComplete) {
        onComplete();
      }
    }
  };

  if (!isActive || activeTutorial !== "home") return null;

  return (
    <AnimatePresence>
      {isActive && (
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
                targetRect ? "bg-transparent" : "bg-bg-secondary/70"
              } ${!isOverviewStep && !targetRect ? "backdrop-blur-sm" : ""} `}
            />

            {/* Confetti on last step */}
            {isLastStep && <Confetti />}
            {/* Spotlight Hole (Visual only) */}
            {targetRect && (
              <motion.div
                layoutId="spotlight"
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

            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col justify-center items-center p-6 pointer-events-none">
              {isOverviewStep ? (
                // Coach Mark Overlay UI
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[9999] pointer-events-auto max-w-md mx-auto w-full left-0 right-0 font-handwriting"
                >
                  {/* Account Switcher - Top Right */}
                  <div className="absolute top-12 right-8 text-text-primary text-center flex flex-col items-center">
                    <div className="relative">
                      {/* Hand-drawn arrow pointing up */}
                      <svg
                        width="50"
                        height="50"
                        viewBox="0 0 50 50"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mb-2"
                      >
                        <path d="M25 45 C25 35 28 15 25 5 M15 15 C20 10 25 5 25 5 C25 5 30 10 35 15" />
                      </svg>
                    </div>
                    <p className="text-xl font-bold whitespace-nowrap font-sans">
                      계좌 변경
                    </p>
                  </div>

                  {/* Notification - Top Right (Left of Account) */}
                  <div className="absolute top-12 right-34 text-text-primary text-center flex flex-col items-center">
                    <div className="relative">
                      {/* Hand-drawn arrow pointing up-right */}
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 50 50"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mb-2"
                      >
                        <path d="M20 45 C20 35 20 25 35 10 M25 10 C30 10 35 10 35 10 C35 10 35 15 35 20" />
                      </svg>
                    </div>
                    <p className="text-lg font-bold whitespace-nowrap font-sans">
                      알림
                    </p>
                  </div>

                  {/* Pull to Refresh - Center Top */}
                  <div className="absolute top-44 left-1/2 -translate-x-1/2 text-text-primary text-center opacity-90">
                    <div className="flex flex-col items-center">
                      {/* Hand-drawn arrow pointing down */}
                      <svg
                        width="40"
                        height="60"
                        viewBox="0 0 40 60"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 5 C22 25 18 45 20 55 M10 45 C15 50 20 55 20 55 C20 55 25 50 30 45" />
                      </svg>
                      <p className="text-lg font-bold whitespace-nowrap font-sans">
                        당겨서 새로고침
                      </p>
                    </div>
                  </div>

                  {/* Swipe - Center */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center items-center">
                    <div className="text-text-primary text-center opacity-90 flex flex-col items-center">
                      {/* Hand-drawn swipe icon */}
                      <svg
                        width="100"
                        height="60"
                        viewBox="0 0 100 60"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mb-4"
                      >
                        {/* Horizontal double arrow */}
                        <path d="M10 30 C30 28 70 32 90 30" />
                        <path d="M20 20 C15 25 10 30 10 30 C10 30 15 35 20 40" />
                        <path d="M80 20 C85 25 90 30 90 30 C90 30 85 35 80 40" />

                        {/* Hand icon hint (simple finger) */}
                        <path
                          d="M50 45 C50 45 45 55 50 55 C55 55 55 45 50 45"
                          strokeOpacity="0.5"
                        />
                      </svg>
                      <p className="text-lg font-bold font-sans">
                        좌우로 스와이프하여 이동
                      </p>
                    </div>
                  </div>

                  {/* Next Button */}
                  <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full flex justify-center">
                    <button
                      onClick={handleNext}
                      className="bg-white text-black px-10 py-3.5 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform active:scale-95 font-sans"
                    >
                      다음으로
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
                    totalSteps={TUTORIAL_STEPS.length}
                    onNext={handleNext}
                    onPrev={prevStep}
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
      )}
    </AnimatePresence>
  );
};

export default TutorialOverlay;
