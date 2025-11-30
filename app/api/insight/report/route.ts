import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const personaId = searchParams.get("personaId");

  const supabase = createClient();
  let query = supabase
    .from("research_reports")
    .select("*")
    .order("created_at", { ascending: false });

  if (personaId) {
    query = query.eq("persona_id", personaId).limit(1);
  } else {
    // If no persona specified, maybe get latest for each?
    // For now, just get latest 10
    query = query.limit(10);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
