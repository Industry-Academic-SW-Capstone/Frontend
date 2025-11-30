import { NextResponse } from "next/server";
import {
  fetchMarketIndices,
  fetchSupplyData,
  fetchTopNews,
  fetchDartNotices,
} from "@/lib/insight/fetchers";
import { generateFactSheet } from "@/lib/insight/processor";
import { preprocessText, analyzeMarket } from "@/lib/insight/ai";
import { createServiceClient } from "@/utils/supabase/service";

/**
 * Full Insight Generation Pipeline (Cron-triggered)
 * Steps:
 * 1. Collect raw data from multiple sources
 * 2. Generate Fact Sheet
 * 3. Preprocess with Flash (Sub LLM)
 * 4. Analyze with Pro (Main LLM)
 * 5. Save snapshot to Supabase
 *
 * This endpoint is designed to be called by Vercel Cron only.
 * Frontend should use GET /api/insight/latest instead.
 */
export async function GET(request: Request) {
  try {
    // Verify this is a Cron request (optional security check)
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // If CRON_SECRET is not set, allow all requests (development mode)
      if (process.env.CRON_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    console.log("[Cron] Starting insight generation...");

    // Step 1: Parallel data fetching
    const [market, supply, newsRaw, notices] = await Promise.all([
      fetchMarketIndices(),
      fetchSupplyData(),
      fetchTopNews(),
      fetchDartNotices(process.env.OPENDART_API_KEY || ""),
    ]);

    // Step 2: Generate base Fact Sheet
    let factSheetContent = generateFactSheet(market, supply, [], notices);

    // Step 3: Preprocess news with Flash (Sub LLM) to save tokens
    if (newsRaw.length > 0) {
      const newsText = newsRaw.join("\n\n");
      const preprocessedNews = await preprocessText(newsText);
      factSheetContent += `\n\n[Preprocessed News]\n${preprocessedNews}`;
    }

    // Step 4: Save Fact Sheet (using service role to bypass RLS)
    const structuredData = {
      market,
      supply,
      news: newsRaw,
      notices,
    };

    const supabase = createServiceClient();
    const { data: factSheet, error: factError } = await supabase
      .from("market_fact_sheets")
      .insert({
        raw_content: factSheetContent,
        structured_data: structuredData,
      })
      .select()
      .single();

    if (factError || !factSheet) {
      throw new Error("Failed to save fact sheet: " + factError?.message);
    }

    console.log("[Cron] Fact sheet saved:", factSheet.id);

    // Step 5: Analyze with Pro (Main LLM)
    const analysisResult = await analyzeMarket(
      factSheetContent,
      structuredData
    );

    // Step 6: Save snapshot
    const { data: snapshot, error: snapError } = await supabase
      .from("insight_snapshots")
      .insert({
        mode_type: analysisResult.mode_type || "active",
        payload: analysisResult,
        fact_sheet_id: factSheet.id,
      })
      .select()
      .single();

    if (snapError) throw snapError;

    console.log("[Cron] Snapshot saved:", snapshot.id);

    return NextResponse.json({
      success: true,
      snapshot_id: snapshot.id,
      fact_sheet_id: factSheet.id,
    });
  } catch (error: any) {
    console.error("[Cron] Generation failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
