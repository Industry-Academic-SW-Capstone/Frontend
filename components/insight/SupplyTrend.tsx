"use client";
import React from "react";

interface SupplyTrendProps {
  data: {
    // AI generated summary if any
    summary?: string;
  };
  rawData?: any;
}

const SupplyTrend: React.FC<SupplyTrendProps> = ({ data, rawData }) => {
  // Use rawData if available, otherwise fallback to empty strings or handle gracefully
  const foreigner = rawData?.supply?.foreigner || "0";
  const institution = rawData?.supply?.institution || "0";

  return (
    <div className="bg-bg-secondary rounded-3xl p-6 mb-4">
      <h3 className="text-xl font-bold text-text-primary mb-6 px-1">
        수급 트렌드
      </h3>

      <div className="flex gap-8 mb-6 px-2">
        <div className="flex-1">
          <p className="text-sm text-text-secondary mb-2 font-medium">외국인</p>
          <p
            className={`text-2xl font-bold tracking-tight ${
              foreigner.includes("-") ? "text-toss-blue" : "text-toss-red"
            }`}
          >
            {foreigner}
          </p>
        </div>
        <div className="w-px bg-border-color my-1" />
        <div className="flex-1">
          <p className="text-sm text-text-secondary mb-2 font-medium">기관</p>
          <p
            className={`text-2xl font-bold tracking-tight ${
              institution.includes("-") ? "text-toss-blue" : "text-toss-red"
            }`}
          >
            {institution}
          </p>
        </div>
      </div>

      {data.summary && (
        <div className="bg-bg-third rounded-2xl p-5">
          <p className="text-sm text-text-secondary leading-relaxed">
            {data.summary}
          </p>
        </div>
      )}
    </div>
  );
};

export default SupplyTrend;
