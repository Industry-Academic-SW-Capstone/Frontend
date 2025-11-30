import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

/**
 * Read-Only API for Frontend
 * Returns the latest insight snapshot
 * Frontend cannot trigger generation, only read existing data
 */
export async function GET() {
  try {
    const supabase = createClient();

    const { data: snapshot, error } = await supabase
      .from("insight_snapshots")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      // No snapshots found
      if (error.code === "PGRST116") {
        return NextResponse.json({
          data: null,
          message:
            "No insights available yet. Please wait for scheduled generation.",
        });
      }
      throw error;
    }

    // Fetch associated news
    if (snapshot.fact_sheet_id) {
      const { data: newsItems } = await supabase
        .from("insight_news")
        .select("title, link, press, time")
        .eq("fact_sheet_id", snapshot.fact_sheet_id);

      // Inject into NewsBrief widget if it exists in the payload
      if (
        newsItems &&
        newsItems.length > 0 &&
        snapshot.payload?.widgets?.NewsBrief
      ) {
        snapshot.payload.widgets.NewsBrief = {
          ...snapshot.payload.widgets.NewsBrief,
          items: newsItems,
        };
      }
    }

    return NextResponse.json({ data: snapshot });
  } catch (error: any) {
    console.error("Failed to fetch latest insight:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch insight",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
