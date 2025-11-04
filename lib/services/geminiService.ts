import { Transaction, InvestmentStyleAnalysis } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_API_KEY || '' });

export const analyzeInvestmentStyle = async (transactions: Transaction[]): Promise<InvestmentStyleAnalysis | string> => {
    console.log("Analyzing transactions:", transactions);

    const prompt = `Based on the following transactions, analyze the user's investment style in Korean.
    1.  Compare it to a famous investor persona (e.g., Warren Buffett, George Soros, Peter Lynch).
    2.  Provide a percentage similarity to the closest match and a brief description.
    3.  Generate a list of 3 actionable investment tips based on this analysis.
    4.  Create data for a radar chart with 6 metrics (안정성, 성장성, 수익성, 가치, 모멘텀, 분산). Each metric should have a value from 0 to 100.
    
    Transactions: ${JSON.stringify(transactions, null, 2)}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        personaName: { type: Type.STRING, description: "The name of the investor persona in Korean." },
                        description: { type: Type.STRING, description: "A brief analysis of the user's investment style in Korean." },
                        similarity: { type: Type.NUMBER, description: "A percentage similarity to the persona." },
                        tips: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "A list of 3 investment tips in Korean."
                        },
                        radarChartData: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    label: { type: Type.STRING, description: "The name of the metric for the radar chart in Korean." },
                                    value: { type: Type.NUMBER, description: "The score for the metric (0-100)." }
                                },
                                required: ["label", "value"]
                            }
                        }
                    },
                    required: ["personaName", "description", "similarity", "tips", "radarChartData"]
                }
            }
        });
        if (!response.text) {
            return "분석 결과를 받을 수 없습니다.";
        }
        const result = JSON.parse(response.text.trim());
        return result as InvestmentStyleAnalysis;
    } catch (error) {
        console.error("Error analyzing investment style:", error);
        return "분석 중 오류가 발생했습니다.";
    }
};
