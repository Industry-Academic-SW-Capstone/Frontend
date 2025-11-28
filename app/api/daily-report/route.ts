import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { scrapeStockNews } from "@/lib/utils/newsScraper";
import { generateDailyReport } from "@/lib/services/gemini";

export async function GET() {
  try {
    // 1. Check Cache (Supabase) - Last 6 hours
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();

    const { data: cachedReports, error: fetchError } = await supabase
      .from("daily_reports")
      .select("*")
      .gt("created_at", sixHoursAgo)
      .order("created_at", { ascending: false })
      .limit(1);

    if (fetchError) {
      console.error("Supabase fetch error:", fetchError);
      // Continue to generate new report if cache fetch fails
    }

    if (cachedReports && cachedReports.length > 0) {
      const cachedContent = cachedReports[0].content;
      // Check if cache is in new format (has marketOverview)
      if (cachedContent.marketOverview) {
        return NextResponse.json(cachedContent);
      }
      // If old format, ignore cache and regenerate
    }

    // 2. Scrape News
    const newsItems = await scrapeStockNews();
    if (!newsItems || newsItems.length === 0) {
      return NextResponse.json(
        { error: "Failed to fetch news" },
        { status: 500 }
      );
    }

    // 3. Generate AI Report
    const aiReport = await generateDailyReport(newsItems);
    if (!aiReport) {
      return NextResponse.json(
        { error: "Failed to generate AI report" },
        { status: 500 }
      );
    }

    const fullReport = {
      ...aiReport,
      news: newsItems,
      date: new Date().toISOString(),
    };

    // 4. Save to Cache (Supabase)
    const { error: insertError } = await supabase
      .from("daily_reports")
      .insert([{ content: fullReport }]);

    if (insertError) {
      console.error("Supabase insert error:", insertError);
    }

    return NextResponse.json(fullReport);
  } catch (error) {
    console.error("Daily Report API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
