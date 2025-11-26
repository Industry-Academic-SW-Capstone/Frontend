import { NextResponse } from "next/server";
import { DEPLOYMENT_TIMESTAMP } from "@/lib/deployment";

export async function GET() {
  return NextResponse.json({ timestamp: DEPLOYMENT_TIMESTAMP });
}
