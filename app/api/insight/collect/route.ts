import { NextResponse } from "next/server";
import {
  fetchMarketIndices,
  fetchSupplyData,
  fetchTopNews,
  fetchDartNotices,
} from "@/lib/insight/fetchers";
import { generateFactSheet } from "@/lib/insight/processor";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  try {
    // 1. Parallel Fetching
    const [market, supply, news, notices] = await Promise.all([
      fetchMarketIndices(),
      fetchSupplyData(),
      fetchTopNews(),
      fetchDartNotices(process.env.OPENDART_API_KEY || ""),
    ]);

    // 2. Generate Fact Sheet
    const factSheetContent = generateFactSheet(market, supply, news, notices);

    // 3. Save to Supabase
    const supabase = await createClient();
    const { data: factSheet, error: factSheetError } = await supabase
      .from("market_fact_sheets")
      .insert({ raw_content: factSheetContent })
      .select()
      .single();

    if (factSheetError) throw factSheetError;

    // 3.1 Save News to DB
    if (news.length > 0) {
      const newsToInsert = news.map((n) => ({
        title: n.title,
        link: n.link,
        press: n.press,
        time: n.time,
        fact_sheet_id: factSheet.id,
      }));

      const { error: newsError } = await supabase
        .from("insight_news")
        .insert(newsToInsert);

      if (newsError) {
        console.error("Failed to save news:", newsError);
        // Don't fail the whole process, just log it
      }
    }

    return NextResponse.json({ success: true, fact_sheet_id: factSheet.id });
  } catch (error) {
    console.error("Data collection failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to collect data" },
      { status: 500 }
    );
  }
}
