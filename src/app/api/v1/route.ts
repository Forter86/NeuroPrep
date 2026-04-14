import { NextResponse } from "next/server";
import { buildV1Discovery } from "@/lib/apiV1";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(buildV1Discovery());
}
