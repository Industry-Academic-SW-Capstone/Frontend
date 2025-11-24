"use client";
import React from "react";
import { PortfolioAnalysisResponse } from "@/lib/hooks/me/usePortfolioAnalysis";
import RadarChart from "./RadarChart";

interface InvestmentAnalysisCardProps {
  analysis: PortfolioAnalysisResponse;
}

const InvestmentAnalysisCard: React.FC<InvestmentAnalysisCardProps> = ({
  analysis,
}) => {
  // Transform summary for RadarChart (assuming values are 0-1)
  const radarChartData = analysis.summary
    ? Object.entries(analysis.summary).map(([key, value]) => ({
        label: key,
        value: value * 100,
      }))
    : [];

  const topPersona = analysis.persona_match?.[0];

  return (
    <div className="bg-bg-secondary p-8 rounded-3xl border border-border-color shadow-lg animate-fadeInUp space-y-10">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h3 className="font-bold text-2xl text-text-primary">투자 분석 결과</h3>
        <p className="text-text-secondary text-sm">
          최근 거래 내역을 기반으로 분석했습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Left Column: Radar Chart & Persona */}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative w-full max-w-[280px] aspect-square">
            <RadarChart data={radarChartData} />
          </div>

          {topPersona && (
            <div className="text-center p-6 bg-bg-primary rounded-2xl w-full border border-border-color/50 shadow-sm">
              <p className="text-text-secondary text-sm mb-2">
                나의 투자 페르소나
              </p>
              <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary mb-2">
                {topPersona.name}
              </p>
              <p className="text-sm text-text-secondary mb-4">
                일치율{" "}
                <span className="font-bold text-secondary">
                  {Math.round(topPersona.percentage * 100)}%
                </span>
              </p>
              <p className="text-text-secondary text-sm leading-relaxed bg-bg-secondary/50 p-3 rounded-xl">
                "{topPersona.philosophy}"
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Style Breakdown & Stock Details */}
        <div className="space-y-8">
          {/* Style Breakdown */}
          <div className="animate-fadeIn delay-100">
            <h4 className="font-bold text-lg text-text-primary mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-secondary rounded-full" />
              투자 스타일 구성
            </h4>
            <div className="space-y-4">
              {analysis.style_breakdown?.map((style, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm text-text-primary">
                    <span>{style.style_tag}</span>
                    <span className="font-bold">
                      {Math.round(style.percentage * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-bg-primary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${style.percentage * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              {(!analysis.style_breakdown ||
                analysis.style_breakdown.length === 0) && (
                <p className="text-text-secondary text-sm">
                  분석된 투자 스타일이 없습니다.
                </p>
              )}
            </div>
          </div>

          {/* Stock Details */}
          <div className="animate-fadeIn delay-200">
            <h4 className="font-bold text-lg text-text-primary mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-accent rounded-full" />
              주요 종목 분석
            </h4>
            <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {analysis.stock_details?.map((stock, index) => (
                <li
                  key={index}
                  className="p-4 bg-bg-primary rounded-xl border border-border-color/30 hover:border-secondary/30 transition-colors duration-300"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold text-text-primary block">
                        {stock.stock_name}
                      </span>
                      <span className="text-xs text-text-secondary">
                        {stock.stock_code}
                      </span>
                    </div>
                    <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-lg font-medium">
                      {stock.style_tag}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {stock.description}
                  </p>
                </li>
              ))}
              {(!analysis.stock_details ||
                analysis.stock_details.length === 0) && (
                <li className="text-text-secondary text-sm p-4 bg-bg-primary rounded-xl border border-border-color/30 text-center">
                  분석할 종목이 충분하지 않습니다.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentAnalysisCard;
