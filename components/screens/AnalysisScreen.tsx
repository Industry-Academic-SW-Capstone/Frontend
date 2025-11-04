"use client";
import React from 'react';
import { ChartPieIcon } from '@/components/icons/Icons';

const AnalysisScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <ChartPieIcon className="w-16 h-16 text-primary mb-4" />
      <h1 className="text-2xl font-bold text-text-primary">AI 투자 분석</h1>
      <p className="text-text-secondary mt-2">
        나의 투자 성향과 포트폴리오를 AI가 분석해주는 기능이 곧 출시될 예정입니다.
      </p>
    </div>
  );
};

export default AnalysisScreen;
