import { motion } from "framer-motion";

interface TutorialStepProps {
  title: string;
  description: string;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  isLastStep: boolean;
}

export default function TutorialStep({
  title,
  description,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
  isLastStep,
}: TutorialStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl max-w-xs w-full mx-auto relative z-[12000]"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= currentStep
                  ? i == currentStep
                    ? "w-6 bg-blue-500"
                    : "w-1.5 bg-blue-500"
                  : "w-1.5 bg-gray-200 dark:bg-gray-700"
              }`}
            />
          ))}
        </div>
        <button
          onClick={onSkip}
          className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          건너뛰기
        </button>
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
        {description}
      </p>

      <div className="flex gap-3">
        {currentStep > 0 && (
          <button
            onClick={onPrev}
            className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            이전
          </button>
        )}
        <button
          onClick={onNext}
          className="flex-1 py-3 rounded-xl bg-blue-500 text-white font-semibold text-sm hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"
        >
          {isLastStep ? "시작하기" : "다음"}
        </button>
      </div>
    </motion.div>
  );
}
