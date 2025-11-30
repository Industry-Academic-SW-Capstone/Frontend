import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { analyzeMarket } from "@/lib/insight/ai";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    // 1. Get latest Fact Sheet
    const { data: factSheet, error: fetchError } = await supabase
      .from("market_fact_sheets")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !factSheet) {
      return NextResponse.json(
        { success: false, error: "No Fact Sheet found" },
        { status: 404 }
      );
    }

    // 2. Analyze with AI
    const analysisResult = await analyzeMarket(factSheet.raw_content);

    // 3. Save Snapshot
    const { data: snapshot, error: saveError } = await supabase
      .from("insight_snapshots")
      .insert({
        mode_type: analysisResult.mode_type || "active",
        payload: analysisResult,
        fact_sheet_id: factSheet.id,
      })
      .select()
      .single();

    if (saveError) throw saveError;

    return NextResponse.json({ success: true, snapshot_id: snapshot.id });
  } catch (error) {
    console.error("Analysis failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to analyze market" },
      { status: 500 }
    );
  }
}
