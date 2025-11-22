"use client";
import React, { useState } from "react";
import { MOCK_ANALYSIS_RESULT } from "@/lib/constants";
import { InvestmentStyleAnalysis } from "@/lib/types/stock";
import * as Icons from "@/components/icons/Icons";
import InvestmentAnalysisCard from "@/components/InvestmentAnalysisCard";

const AnalysisScreen: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [analysis, setAnalysis] = useState<InvestmentStyleAnalysis | null>(
    MOCK_ANALYSIS_RESULT
  );
  const [analysisError, setAnalysisError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAnalyze = async () => {
    // setIsLoading(true);
    // setAnalysisError("");
    // setAnalysis(null);
    // const result = await analyzeInvestmentStyle(MOCK_TRANSACTIONS);
    // if (typeof result === "string") {
    //   setAnalysisError(result);
    // } else {
    //   setAnalysis(result);
    // }
    // setIsLoading(false);
  };

  return (
    <div className="pt-4 space-y-8 animate-fadeInUp max-w-4xl mx-auto">
      {/* Main Content Area */}
      <div className="transition-all duration-500 ease-in-out">
        {analysis ? (
          <div className="animate-fadeIn">
            <InvestmentAnalysisCard analysis={analysis} />
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="text-secondary font-medium hover:text-secondary/80 transition-colors flex items-center gap-2 text-sm"
              >
                <Icons.ArrowPathIcon
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                />
                다시 분석하기
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-bg-secondary p-10 rounded-3xl border border-border-color shadow-lg card-hover overflow-hidden relative group text-center min-h-[400px] flex flex-col justify-center items-center">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer pointer-events-none" />

            <div className="relative z-10 max-w-md w-full">
              <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Icons.SparklesIcon className="w-10 h-10 text-secondary" />
              </div>

              <h3 className="font-bold text-2xl text-text-primary mb-3">
                나의 투자 스타일은 무엇일까요?
              </h3>
              <p className="text-text-secondary mb-8 leading-relaxed">
                최근 거래 내역을 바탕으로 AI가 당신의 투자 패턴을 분석하고,
                <br />
                맞춤형 조언을 제공해드립니다.
              </p>

              {analysisError && (
                <div className="bg-negative/10 text-negative px-4 py-3 rounded-xl mb-6 text-sm font-medium animate-fadeIn flex items-center justify-center gap-2">
                  <Icons.ExclamationCircleIcon className="w-5 h-5" />
                  {analysisError}
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full bg-secondary text-white font-bold py-4 px-8 rounded-xl disabled:opacity-50 hover:shadow-lg hover:shadow-secondary/20 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 active:scale-95 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Icons.ArrowPathIcon className="w-5 h-5 animate-spin" />
                    <span>분석 중입니다...</span>
                  </>
                ) : (
                  <>
                    <span>내 투자 스타일 분석하기</span>
                    <Icons.ArrowRightIcon className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisScreen;
