"use client";
import React, { useState } from "react";
import {
  ArrowLeftIcon,
  XMarkIcon,
  PencilSquareIcon,
  ShieldCheckIcon,
  FlagIcon,
  CheckCircleIcon,
  BanknotesIcon,
  ClockIcon,
} from "@/components/icons/Icons";
import { CreateCompetitionRequest } from "@/lib/types/stock";
import { useCreateContest } from "@/lib/hooks/useContest";

interface CreateCompetitionScreenProps {
  onBack: () => void;
}

const StepIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => {
  const steps = [
    { id: 1, name: "기본 정보", icon: PencilSquareIcon },
    { id: 2, name: "자금 규칙", icon: BanknotesIcon },
    { id: 3, name: "거래 제한", icon: ShieldCheckIcon },
    { id: 4, name: "기간 설정", icon: FlagIcon },
  ];
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center justify-between w-full">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className="relative flex flex-col items-center">
            {currentStep > step.id ? (
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white">
                <CheckCircleIcon className="w-6 h-6" />
              </div>
            ) : currentStep === step.id ? (
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary bg-bg-primary text-primary">
                <step.icon className="w-5 h-5" />
              </div>
            ) : (
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-bg-secondary text-text-secondary">
                <step.icon className="w-5 h-5" />
              </div>
            )}
            <span
              className={`mt-2 text-xs font-semibold ${
                currentStep >= step.id ? "text-primary" : "text-text-secondary"
              }`}
            >
              {step.name}
            </span>
            {stepIdx !== steps.length - 1 && (
              <div
                className={`absolute top-5 left-1/2 w-full h-0.5 -z-10 ${
                  currentStep > step.id ? "bg-primary" : "bg-border-color"
                }`}
                style={{ width: "calc(100% + 2rem)", left: "50%" }}
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

const CreateCompetitionScreen: React.FC<CreateCompetitionScreenProps> = ({
  onBack,
}) => {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);

  const [formData, setFormData] = useState<CreateCompetitionRequest>({
    contestName: "",
    startDate: new Date().toISOString().split("T")[0] + "T09:00:00",
    endDate:
      new Date(new Date().setDate(new Date().getDate() + 30))
        .toISOString()
        .split("T")[0] + "T18:00:00",
    seedMoney: 10000000,
    commissionRate: 0.0015,
    minMarketCap: 1000000000,
    maxMarketCap: 100000000000,
    dailyTradeLimit: 10,
    maxHoldingsCount: 5,
    buyCooldownMinutes: 5,
    sellCooldownMinutes: 5,
  });

  const { mutate: create, isPending } = useCreateContest();

  // Auto-close effect
  React.useEffect(() => {
    if (step === 5) {
      // Start progress animation
      const progressTimer = setTimeout(() => setProgress(100), 100);

      // Close after 3 seconds
      const closeTimer = setTimeout(() => {
        onBack();
      }, 3000);

      return () => {
        clearTimeout(progressTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [step, onBack]);

  // Wrap create call to handle success/error locally if needed, or rely on hook's behavior
  const handleCreate = () => {
    create(formData, {
      onSuccess: () => {
        setStep(5); // Success step
      },
      onError: (error) => {
        console.error("Failed to create contest:", error);
        alert("대회 생성에 실패했습니다. 다시 시도해주세요.");
      },
    });
  };

  const handleNext = () => setStep((s) => Math.min(s + 1, 5));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const handleChange = (field: keyof CreateCompetitionRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-fadeInUp">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                대회 이름
              </label>
              <input
                type="text"
                value={formData.contestName}
                onChange={(e) => handleChange("contestName", e.target.value)}
                placeholder="예: 2025년 신년 수익률 대회"
                className="w-full bg-bg-secondary border border-border-color rounded-xl p-4 text-lg focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
              <h3 className="font-bold text-primary mb-2 flex items-center gap-2">
                <FlagIcon className="w-5 h-5" />
                대회 팁
              </h3>
              <p className="text-sm text-text-secondary">
                매력적인 대회 이름은 더 많은 참가자를 모을 수 있습니다!
                <br />
                명확하고 흥미로운 이름을 지어보세요.
              </p>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8 animate-fadeInUp">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                초기 자본금 (Seed Money)
              </label>
              <div className="text-3xl font-bold text-primary mb-4 text-center">
                {formData.seedMoney.toLocaleString()}원
              </div>
              <input
                type="range"
                min="1000000"
                max="100000000"
                step="1000000"
                value={formData.seedMoney}
                onChange={(e) =>
                  handleChange("seedMoney", parseInt(e.target.value))
                }
                className="w-full h-2 bg-border-color rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-text-secondary mt-2">
                <span>100만원</span>
                <span>1억원</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                매매 수수료율
              </label>
              <div className="flex items-center gap-4 bg-bg-secondary p-4 rounded-xl border border-border-color">
                <BanknotesIcon className="w-6 h-6 text-text-secondary" />
                <input
                  type="number"
                  step="0.0001"
                  value={formData.commissionRate}
                  onChange={(e) =>
                    handleChange("commissionRate", parseFloat(e.target.value))
                  }
                  className="bg-transparent w-full outline-none font-bold text-lg"
                />
                <span className="text-text-secondary font-bold">%</span>
              </div>
              <p className="text-xs text-text-secondary mt-2">
                일반적인 증권사 수수료는 약 0.015% 입니다.
              </p>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-fadeInUp">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  최소 시가총액
                </label>
                <input
                  type="number"
                  value={formData.minMarketCap}
                  onChange={(e) =>
                    handleChange("minMarketCap", parseInt(e.target.value))
                  }
                  className="w-full bg-bg-secondary border border-border-color rounded-xl p-3 outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  최대 시가총액
                </label>
                <input
                  type="number"
                  value={formData.maxMarketCap}
                  onChange={(e) =>
                    handleChange("maxMarketCap", parseInt(e.target.value))
                  }
                  className="w-full bg-bg-secondary border border-border-color rounded-xl p-3 outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2 justify-between">
                  일일 매매 제한 횟수
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() =>
                      handleChange(
                        "dailyTradeLimit",
                        Math.max(1, formData.dailyTradeLimit - 1)
                      )
                    }
                    className="w-10 h-10 rounded-full bg-bg-secondary flex items-center justify-center text-xl font-bold hover:bg-border-color"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold w-10 text-center">
                    {formData.dailyTradeLimit}
                  </span>
                  <button
                    onClick={() =>
                      handleChange(
                        "dailyTradeLimit",
                        formData.dailyTradeLimit + 1
                      )
                    }
                    className="w-10 h-10 rounded-full bg-bg-secondary flex items-center justify-center text-xl font-bold hover:bg-border-color"
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2">
                  최대 보유 종목 수
                </label>
                <div className="flex items-center gap-4 justify-between">
                  <button
                    onClick={() =>
                      handleChange(
                        "maxHoldingsCount",
                        Math.max(1, formData.maxHoldingsCount - 1)
                      )
                    }
                    className="w-10 h-10 rounded-full bg-bg-secondary flex items-center justify-center text-xl font-bold hover:bg-border-color"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold w-10 text-center">
                    {formData.maxHoldingsCount}
                  </span>
                  <button
                    onClick={() =>
                      handleChange(
                        "maxHoldingsCount",
                        formData.maxHoldingsCount + 1
                      )
                    }
                    className="w-10 h-10 rounded-full bg-bg-secondary flex items-center justify-center text-xl font-bold hover:bg-border-color"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  매수 쿨타임 (분)
                </label>
                <div className="relative">
                  <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input
                    type="number"
                    value={formData.buyCooldownMinutes}
                    onChange={(e) =>
                      handleChange(
                        "buyCooldownMinutes",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full bg-bg-secondary border border-border-color rounded-xl p-3 pl-9 outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  매도 쿨타임 (분)
                </label>
                <div className="relative">
                  <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input
                    type="number"
                    value={formData.sellCooldownMinutes}
                    onChange={(e) =>
                      handleChange(
                        "sellCooldownMinutes",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full bg-bg-secondary border border-border-color rounded-xl p-3 pl-9 outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-fadeInUp">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                시작일
              </label>
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="w-full bg-bg-secondary border border-border-color rounded-xl p-4 outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                종료일
              </label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                className="w-full bg-bg-secondary border border-border-color rounded-xl p-4 outline-none focus:border-primary"
              />
            </div>
            <div className="p-4 bg-bg-secondary rounded-xl border border-border-color">
              <h4 className="font-bold text-text-primary mb-2">설정 요약</h4>
              <ul className="space-y-1 text-sm text-text-secondary">
                <li>• 초기 자본금: {formData.seedMoney.toLocaleString()}원</li>
                <li>• 수수료: {formData.commissionRate}%</li>
                <li>• 일일 거래 제한: {formData.dailyTradeLimit}회</li>
              </ul>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="flex flex-col items-center justify-center h-full animate-fadeInUp">
            <div className="w-24 h-24 bg-positive/10 rounded-full flex items-center justify-center mb-8 animate-bounce">
              <CheckCircleIcon className="w-12 h-12 text-positive" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              대회가 생성되었습니다!
            </h2>
            <p className="text-text-secondary text-center mb-12">
              잠시 후 목록으로 이동합니다...
            </p>

            {/* Progress Bar */}
            {/* <div className="w-64 h-1.5 bg-bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all ease-linear duration-[3000ms]"
                style={{ width: `${progress}%` }}
              />
            </div> */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full z-30 bg-bg-primary flex flex-col">
      {step < 5 && (
        <header className="flex items-center justify-between p-4 border-b border-border-color">
          {step > 1 ? (
            <button
              onClick={handlePrev}
              className="p-2 hover:bg-bg-secondary rounded-full transition-colors"
            >
              <ArrowLeftIcon className="w-6 h-6 text-text-primary" />
            </button>
          ) : (
            <div className="w-10" />
          )}
          <h1 className="text-lg font-bold text-text-primary">대회 만들기</h1>
          <button
            onClick={onBack}
            className="p-2 hover:bg-bg-secondary rounded-full transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-text-primary" />
          </button>
        </header>
      )}

      {step < 5 && (
        <div className="px-6 py-6">
          <StepIndicator currentStep={step} />
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-6 pb-6">{renderStep()}</div>

      {step < 5 && (
        <div className="p-4 border-t border-border-color bg-bg-primary safe-area-bottom">
          <button
            onClick={step === 4 ? handleCreate : handleNext}
            disabled={isPending || (step === 1 && !formData.contestName)}
            className={`w-full font-bold py-4 rounded-xl transition-all ${
              step === 1 && !formData.contestName
                ? "bg-bg-secondary text-text-secondary cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary/90 active:scale-[0.98]"
            }`}
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                생성 중...
              </span>
            ) : step === 4 ? (
              "대회 생성하기"
            ) : (
              "다음"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateCompetitionScreen;
