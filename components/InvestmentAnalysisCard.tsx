"use client";
import React from "react";
import { InvestmentStyleAnalysis } from "@/lib/types/stock";
import RadarChart from "./RadarChart";
import { CheckCircleIcon, SparklesIcon } from "./icons/Icons";

interface InvestmentAnalysisCardProps {
  analysis: InvestmentStyleAnalysis;
}

const InvestmentAnalysisCard: React.FC<InvestmentAnalysisCardProps> = ({
  analysis,
}) => {
  return (
    <div className="bg-bg-secondary p-8 rounded-3xl border border-border-color shadow-lg animate-fadeInUp">
      <div className="flex items-center justify-center gap-2 mb-6">
        <h3 className="font-bold text-2xl text-text-primary text-center">
          투자 분석 결과
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Column: Chart & Persona */}
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-[280px] aspect-square mb-6">
            <RadarChart data={analysis.radarChartData} />
          </div>

          <div className="text-center p-6 bg-bg-primary rounded-2xl w-full border border-border-color/50 shadow-sm">
            <p className="text-text-secondary text-sm mb-2">
              나의 투자 페르소나
            </p>
            <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary mb-2">
              {analysis.personaName}
            </p>
            <p className="text-sm text-text-secondary">
              유형과{" "}
              <span className="font-bold text-secondary">
                {analysis.similarity}%
              </span>{" "}
              일치합니다
            </p>
          </div>
        </div>

        {/* Right Column: Description & Tips */}
        <div className="space-y-6">
          <div className="animate-fadeIn delay-100">
            <h4 className="font-bold text-lg text-text-primary mb-3 flex items-center gap-2">
              <span className="w-1 h-6 bg-secondary rounded-full" />
              분석 결과
            </h4>
            <p className="text-text-secondary leading-relaxed bg-bg-primary/50 p-4 rounded-xl border border-border-color/30">
              {analysis.description}
            </p>
          </div>

          <div className="animate-fadeIn delay-200">
            <h4 className="font-bold text-lg text-text-primary mb-3 flex items-center gap-2">
              <span className="w-1 h-6 bg-accent rounded-full" />
              AI 투자 조언
            </h4>
            <ul className="space-y-3">
              {analysis.tips.map((tip, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-sm p-3 bg-bg-primary rounded-xl border border-border-color/30 hover:border-secondary/30 transition-colors duration-300"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <div className="p-1 bg-positive/10 rounded-full mt-0.5 shrink-0">
                    <CheckCircleIcon className="w-4 h-4 text-positive" />
                  </div>
                  <span className="text-text-secondary leading-relaxed">
                    {tip}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentAnalysisCard;
