"use client";
import React, { useState } from "react";
import { MOCK_TRANSACTIONS, MOCK_ANALYSIS_RESULT } from "@/lib/constants";
import { InvestmentStyleAnalysis } from "@/lib/types";
import { analyzeInvestmentStyle } from "@/lib/services/geminiService";
import * as Icons from "@/components/icons/Icons";
import InvestmentAnalysisCard from "@/components/InvestmentAnalysisCard";

const AnalysisScreen: React.FC = () => {
  const [analysis, setAnalysis] = useState<InvestmentStyleAnalysis | null>(
    MOCK_ANALYSIS_RESULT
  );
  const [analysisError, setAnalysisError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setAnalysisError("");
    setAnalysis(null);
    const result = await analyzeInvestmentStyle(MOCK_TRANSACTIONS);
    if (typeof result === "string") {
      setAnalysisError(result);
    } else {
      setAnalysis(result);
    }
    setIsLoading(false);
  };

  return (
    <div className="pt-4 space-y-6 animate-fadeInUp">
      {/* AI Analysis Section */}
      {analysis ? (
        <InvestmentAnalysisCard analysis={analysis} />
      ) : (
        <div className="bg-bg-secondary p-6 rounded-3xl border border-border-color shadow-lg card-hover overflow-hidden relative group">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer" />

          <div className="flex items-center gap-3 mb-5 relative z-10">
            <div className="p-3 bg-secondary/10 rounded-xl">
              <Icons.ChartPieIcon className="w-7 h-7 text-secondary" />
            </div>
            <h3 className="font-bold text-xl text-text-primary">
              투자 스타일 분석
            </h3>
          </div>

          {analysisError && (
            <p className="text-negative text-center mb-4 font-medium animate-fadeIn">
              {analysisError}
            </p>
          )}

          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="w-full bg-secondary text-white font-bold py-4 px-6 rounded-xl disabled:opacity-50 hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <span className="relative z-10">
              {isLoading ? "분석 중..." : "내 투자 스타일 분석하기"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AnalysisScreen;
