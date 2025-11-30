import { NextResponse } from "next/server";
import { createServiceClient } from "@/utils/supabase/service";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  PERSONAS,
  SYSTEM_PROMPT_REPORT_INTRO,
  SYSTEM_PROMPT_REPORT_BODY,
} from "@/lib/insight/personas";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Pro Model for Intro (Creative)
const proModel = genAI.getGenerativeModel({
  model: "gemini-1.5-pro-latest",
  generationConfig: { temperature: 0.8, responseMimeType: "application/json" },
});

// Flash Model for Body (Long context, efficient)
const flashModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  generationConfig: { temperature: 0.7 },
});

export async function POST(request: Request) {
  try {
    const { personaId } = await request.json();
    const persona = PERSONAS.find((p) => p.id === personaId);

    if (!persona) {
      return NextResponse.json(
        { error: "Invalid persona ID" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // 1. Get latest Fact Sheet
    const { data: factSheetData, error: factError } = await supabase
      .from("market_fact_sheets")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (factError || !factSheetData) {
      return NextResponse.json(
        { error: "No market data available" },
        { status: 404 }
      );
    }

    const factSheetContent = factSheetData.raw_content;

    // 2. Generate Intro (Title + Summary) using Pro
    const introResult = await proModel.generateContent({
      contents: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT_REPORT_INTRO }] },
        {
          role: "user",
          parts: [{ text: `[Persona: ${persona.name}]\n${persona.prompt}` }],
        },
        {
          role: "user",
          parts: [{ text: `[Market Fact Sheet]\n${factSheetContent}` }],
        },
      ],
    });
    const introJson = JSON.parse(introResult.response.text());

    // 3. Generate Full Body using Flash
    const bodyResult = await flashModel.generateContent({
      contents: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT_REPORT_BODY }] },
        {
          role: "user",
          parts: [{ text: `[Persona: ${persona.name}]\n${persona.prompt}` }],
        },
        {
          role: "user",
          parts: [{ text: `[Market Fact Sheet]\n${factSheetContent}` }],
        },
        {
          role: "user",
          parts: [{ text: `[Report Title]\n${introJson.title}` }],
        },
      ],
    });
    const fullContent = bodyResult.response.text();

    // 4. Save to Database
    const { data: report, error: saveError } = await supabase
      .from("research_reports")
      .insert({
        persona_id: personaId,
        title: introJson.title,
        summary: introJson.summary,
        full_content: fullContent,
        fact_sheet_id: factSheetData.id,
      })
      .select()
      .single();

    if (saveError) throw saveError;

    return NextResponse.json({ success: true, data: report });
  } catch (error: any) {
    console.error("Report generation failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
