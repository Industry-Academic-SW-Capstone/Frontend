const apiKey = process.env.GEMINI_API_KEY;

export async function generateDailyReport(newsItems: any[]) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  // Using the new SDK format if possible, or fallback to standard REST if SDK has breaking changes.
  // The package.json has "@google/genai": "^1.28.0", which usually exports GoogleGenerativeAI.
  // Wait, the import in the previous file was `import { GoogleGenerativeAI } from "@google/genai";`
  // but standard google-generative-ai package is `@google/generative-ai`.
  // `@google/genai` might be the new one. Let's assume standard usage or check docs if it fails.
  // Actually, let's use the standard `fetch` approach if I'm unsure, but I should try to use the installed package.
  // Let's try to import it as `import { GoogleGenerativeAI } from "@google/generative-ai"` usually, but here it is `@google/genai`.
  // Let's check the package.json again. It says `"@google/genai": "^1.28.0"`.
  // I will assume it works similar to the standard one or I will use a direct fetch to be safe if I can't verify the SDK API.
  // Actually, `@google/genai` is likely the Google Cloud Vertex AI or similar?
  // Let's try to use a simple fetch to the Gemini API endpoint to avoid SDK version issues,
  // OR just use the SDK if I am confident.
  // Given I can't check docs, I'll use the standard REST API for safety if I can.
  // BUT, I should use the installed package.
  // Let's try to use the package. If it fails, I'll fix it.

  // Wait, I'll use the standard `google-generative-ai` pattern but with the import I saw.
  // If `@google/genai` is the package, it might be the new Google Gen AI SDK.

  // Let's write a safe implementation using fetch for now to avoid "Module not found" or API mismatch if I guess wrong.
  // Actually, the user said "AI는 Gemini로 진행하고".

  const prompt = `
    다음은 오늘/어제의 한국 증시 주요 뉴스 헤드라인입니다:
    ${JSON.stringify(newsItems)}

    주식 투자자를 위한 "오늘의 증시 리포트"를 작성해주세요.
    **핵심 요구사항**:
    1. 반드시 **한국어**로 작성하세요.
    2. **철저하게 한국 주식 시장(코스피, 코스닥) 중심**으로 분석하세요.
    3. 미국/해외 증시 내용은 **한국 시장에 미치는 구체적인 영향**이 있을 때만 짧게 언급하고, 독자적인 항목으로 다루지 마세요.
    
    다음 내용을 포함해주세요:
    1. **시장 브리핑 (marketOverview)**: 전체적인 시장 분위기와 주요 이슈를 요약해주세요.
    2. **주요 섹터 및 테마 (sectorAnalysis)**: 주목받은 섹터나 테마, 관련 종목을 언급해주세요.
    3. **한줄 요약 (oneLineBriefing)**: 바쁜 투자자를 위한 임팩트 있는 한 문장 요약.

    결과는 다음 JSON 형식으로만 응답해주세요:
    {
      "marketOverview": "string",
      "sectorAnalysis": ["string", "string", ...],
      "oneLineBriefing": "string"
    }
  `;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error("Gemini API Error:", JSON.stringify(data.error, null, 2));
      return null;
    }

    if (!data.candidates || data.candidates.length === 0) {
      console.error(
        "Gemini API returned no candidates:",
        JSON.stringify(data, null, 2)
      );
      return null;
    }

    const text = data.candidates[0].content.parts[0].text;

    // Clean up markdown code blocks if present
    const jsonString = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Gemini generation failed:", error);
    return null;
  }
}
