import { NextResponse } from "next/server";
import { getGatewayMeta } from "@/lib/aiGateway";

export const runtime = "nodejs";

export async function GET() {
  const meta = getGatewayMeta();
  return NextResponse.json({
    ok: true,
    mode: meta.mode,
    models: meta.models,
  });
}
