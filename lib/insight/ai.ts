import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT_MAIN, SYSTEM_PROMPT_SUB } from "./prompts";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Sub LLM (Flash 2.5) - For preprocessing/summarization
const flashModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    temperature: 0.1, // Lower temperature for factual extraction
  },
});

// Main LLM (Pro 2.5) - For analysis and layout generation
const proModel = genAI.getGenerativeModel({
  model: "gemini-2.5-pro",
  generationConfig: {
    temperature: 0.7, // Higher for creative insights
    responseMimeType: "application/json",
  },
});

/**
 * Step 1: Preprocess raw text (news, DART notices) using Flash
 * This reduces token count for the main Pro analysis
 */
export async function preprocessText(rawText: string): Promise<string> {
  try {
    const result = await flashModel.generateContent({
      contents: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT_SUB }] },
        { role: "user", parts: [{ text: rawText }] },
      ],
    });

    return result.response.text();
  } catch (error) {
    console.error("Flash preprocessing failed:", error);
    // Fallback: return truncated raw text
    return rawText.substring(0, 500);
  }
}

/**
 * Step 2: Analyze preprocessed fact sheet using Pro
 * Generates widget layout and content
 */
export async function analyzeMarket(factSheet: string, structuredData?: any) {
  try {
    const result = await proModel.generateContent({
      contents: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT_MAIN }] },
        {
          role: "user",
          parts: [{ text: `[Market Fact Sheet]\n${factSheet}` }],
        },
      ],
    });

    const response = result.response;
    const text = response.text();
    const aiOutput = JSON.parse(text);

    // Merge structured data into the output for widgets that need raw numbers
    // This allows the frontend to use precise data (e.g. charts) while using AI for narrative
    if (structuredData) {
      aiOutput.raw_data = structuredData;

      // Auto-hydrate specific widgets if they exist in layout
      if (aiOutput.widgets) {
        if (aiOutput.widgets.SupplyTrend) {
          aiOutput.widgets.SupplyTrend.raw = structuredData.supply;
        }
        if (aiOutput.widgets.MarketGauge) {
          // Calculate simple fear/greed index from market data if needed, or just pass raw
          aiOutput.widgets.MarketGauge.raw = structuredData.market;
        }
      }
    }

    return aiOutput;
  } catch (error) {
    console.error("Pro analysis failed:", error);
    throw error;
  }
}
