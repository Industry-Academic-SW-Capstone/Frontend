"use client";
import React from "react";
import * as Icons from "@/components/icons/Icons";
import InvestmentAnalysisCard from "@/components/InvestmentAnalysisCard";
import { usePortfolioAnalysis } from "@/lib/hooks/me/usePortfolioAnalysis";
import { useAccountStore } from "@/lib/store/useAccountStore";

const AnalysisScreen: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const { selectedAccount } = useAccountStore();
  const {
    data: analysis,
    isLoading,
    isError,
    refetch,
    error,
  } = usePortfolioAnalysis(selectedAccount?.id.toString() || null, {
    enabled: false, // Don't fetch automatically on mount, wait for user action or if we want auto fetch?
    // User said "API 요청은 훅의 형태로...". Usually analysis is triggered by user or auto.
    // The original code had "handleAnalyze".
    // Let's keep the "analyze" button behavior for now, or maybe fetch on mount if account exists?
    // The original code had a "Start Analysis" state.
    // If I look at the mock, it starts with a "Start Analysis" screen.
    // Let's keep the manual trigger for the "first time" feel, or maybe just fetch if we have data?
    // Actually, if we have data, we show it.
    // Let's make it so that if we don't have analysis, we show the start screen.
    // But the API fetches existing analysis? Or triggers a new one?
    // GET /api/portfolio/analyze usually implies fetching existing analysis or calculating it.
    // Let's assume it fetches the analysis.
  });

  // If we want to trigger analysis on button click:
  const handleAnalyze = () => {
    refetch();
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

              {isError && (
                <div className="bg-negative/10 text-negative px-4 py-3 rounded-xl mb-6 text-sm font-medium animate-fadeIn flex items-center justify-center gap-2">
                  <Icons.ExclamationCircleIcon className="w-5 h-5" />
                  {error instanceof Error
                    ? error.message
                    : "분석 중 오류가 발생했습니다."}
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={isLoading || !selectedAccount}
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
