"use client";
import React from 'react';
import { InvestmentStyleAnalysis } from '@/lib/types';
import RadarChart from './RadarChart';
import { CheckCircleIcon } from './icons/Icons';

interface InvestmentAnalysisCardProps {
    analysis: InvestmentStyleAnalysis;
}

const InvestmentAnalysisCard: React.FC<InvestmentAnalysisCardProps> = ({ analysis }) => {
    return (
        <div className="bg-bg-secondary p-6 rounded-2xl border border-border-color">
            <h3 className="font-bold text-xl text-text-primary text-center">AI 투자 스타일 분석</h3>

            <div className="text-center p-4 bg-bg-primary rounded-xl my-4">
                <p className="text-text-secondary text-sm">나의 투자 스타일은</p>
                <p className="text-xl font-bold text-secondary">{analysis.personaName}</p>
                <p className="text-sm text-text-secondary mt-1">유형과 <span className="font-bold text-secondary">{analysis.similarity}%</span> 유사합니다.</p>
            </div>
            
            <RadarChart data={analysis.radarChartData} />
            
            <div className="mt-6 space-y-4">
                <div>
                    <h4 className="font-bold text-text-primary mb-2">분석 결과</h4>
                    <p className="text-sm text-text-secondary">{analysis.description}</p>
                </div>
                <div>
                    <h4 className="font-bold text-text-primary mb-2">AI 투자 조언</h4>
                    <ul className="space-y-2">
                        {analysis.tips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                                <CheckCircleIcon className="w-5 h-5 text-positive mt-0.5 flex-shrink-0" />
                                <span className="text-text-secondary">{tip}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default InvestmentAnalysisCard;
