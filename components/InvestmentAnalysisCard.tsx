"use client";
import React, { useState } from "react";
import { PortfolioAnalysisResponse } from "@/lib/hooks/me/usePortfolioAnalysis";
import * as Icons from "@/components/icons/Icons";
import AnalysisDetailModal from "@/components/AnalysisDetailModal";

interface InvestmentAnalysisCardProps {
  analysis: PortfolioAnalysisResponse;
}

const InvestmentAnalysisCard: React.FC<InvestmentAnalysisCardProps> = ({
  analysis,
}) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    description: React.ReactNode;
  }>({
    isOpen: false,
    title: "",
    description: null,
  });

  const openModal = (title: string, description: React.ReactNode) => {
    setModalState({ isOpen: true, title, description });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const cleanText = (text: string) => {
    return text.replace(/[\[\]]/g, "");
  };

  const topPersona = analysis.personaMatch?.[0];

  return (
    <>
      <div className="space-y-6 animate-fadeInUp">
        {/* Header Section */}
        <div className="text-center space-y-2 mb-8">
          <h3 className="font-bold text-2xl text-text-primary">
            투자 분석 결과
          </h3>
          <p className="text-text-secondary text-sm">
            최근 거래 내역을 기반으로 분석했습니다.
          </p>
        </div>

        {/* Persona Section */}
        {topPersona && (
          <div className="bg-bg-secondary p-6 rounded-3xl border border-border-color shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-text-secondary text-sm font-medium">
                나의 투자 페르소나
              </span>
              <button
                onClick={() =>
                  openModal(
                    "나의 투자 페르소나",
                    <div className="space-y-4">
                      <p className="font-bold text-xl text-text-primary">
                        {topPersona.name}
                      </p>
                      <p>{topPersona.philosophy}</p>
                    </div>
                  )
                }
                className="text-text-secondary bg-bg-third rounded-full px-2 hover:text-primary transition-colors"
              >
                <span className="text-text-third text-sm">자세히 보기</span>
              </button>
            </div>

            <div className="text-center py-4">
              <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary mb-2">
                {topPersona.name}
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold">
                <Icons.SparklesIcon className="w-4 h-4" />
                <span>일치율 {Math.round(topPersona.percentage)}%</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {/* Style Breakdown */}
          <div className="bg-bg-secondary p-6 rounded-3xl border border-border-color shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-lg text-text-primary flex items-center gap-2">
                <span className="w-1 h-5 bg-secondary rounded-full" />
                투자 스타일 구성
              </h4>
              <button
                onClick={() =>
                  openModal(
                    "투자 스타일 구성",
                    "보유한 주식들의 시가총액, 성장성, 가치성 등을 종합하여 귀하의 투자 성향을 분석한 결과입니다."
                  )
                }
                className="text-text-secondary hover:text-primary transition-colors"
              >
                <Icons.InformationCircleIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {analysis.styleBreakdown?.map((style, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm text-text-primary font-medium">
                    <span>{cleanText(style.styleTag)}</span>
                    <span className="text-secondary font-bold">
                      {Math.round(style.percentage)}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-bg-primary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${style.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
              {(!analysis.styleBreakdown ||
                analysis.styleBreakdown.length === 0) && (
                <p className="text-text-secondary text-sm text-center py-4">
                  분석된 투자 스타일이 없습니다.
                </p>
              )}
            </div>
          </div>

          {/* Stock Details */}
          <div className="bg-bg-secondary p-6 rounded-3xl border border-border-color shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-lg text-text-primary flex items-center gap-2">
                <span className="w-1 h-5 bg-accent rounded-full" />
                주요 종목 분석
              </h4>
              <button
                onClick={() =>
                  openModal(
                    "주요 종목 분석",
                    "포트폴리오에서 비중이 높은 주요 종목들의 특징과 투자 포인트입니다."
                  )
                }
                className="text-text-secondary hover:text-primary transition-colors"
              >
                <Icons.InformationCircleIcon className="w-5 h-5" />
              </button>
            </div>

            <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
              {analysis.stockDetails?.map((stock, index) => (
                <li
                  key={index}
                  onClick={() =>
                    openModal(
                      stock.stockName,
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 bg-secondary/10 text-secondary text-xs rounded-lg font-bold">
                            {cleanText(stock.styleTag)}
                          </span>
                          <span className="text-text-secondary text-sm">
                            {stock.stockCode}
                          </span>
                        </div>
                        <p className="text-text-primary leading-relaxed">
                          {stock.description}
                        </p>
                      </div>
                    )
                  }
                  className="group p-4 bg-bg-primary rounded-2xl border border-border-color/50 hover:border-secondary/50 hover:shadow-md transition-all duration-300 cursor-pointer active:scale-98"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-text-primary block text-base mb-1 group-hover:text-secondary transition-colors">
                        {stock.stockName}
                      </span>
                      <span className="text-xs text-text-secondary bg-bg-secondary px-2 py-0.5 rounded text-opacity-80">
                        {cleanText(stock.styleTag)}
                      </span>
                    </div>
                    <Icons.ChevronRightIcon className="w-5 h-5 text-text-secondary/50 group-hover:text-secondary transition-colors" />
                  </div>
                </li>
              ))}
              {(!analysis.stockDetails ||
                analysis.stockDetails.length === 0) && (
                <li className="text-text-secondary text-sm p-4 text-center">
                  분석할 종목이 충분하지 않습니다.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <AnalysisDetailModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        description={modalState.description}
      />
    </>
  );
};

export default InvestmentAnalysisCard;
