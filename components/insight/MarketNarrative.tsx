"use client";
import React from "react";

interface MarketNarrativeProps {
  data: {
    content: string;
  };
}

const MarketNarrative: React.FC<MarketNarrativeProps> = ({ data }) => {
  return (
    <div className="p-5 bg-bg-secondary rounded-2xl mb-4">
      <h3 className="text-lg font-bold text-text-primary mb-3">시장 브리핑</h3>
      <p className="text-text-secondary leading-relaxed whitespace-pre-line text-sm">
        {data.content}
      </p>
    </div>
  );
};

export default MarketNarrative;
