import { NextResponse } from "next/server";
import { collectMarketData } from "@/lib/insight/processor";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    // 1. Collect Data
    const factSheet = await collectMarketData();

    // 2. Save to DB
    const { data, error } = await supabase
      .from("market_fact_sheets")
      .insert({
        raw_content: factSheet.rawContent,
        structured_data: factSheet.structuredData,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Fact Sheet Generation Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
