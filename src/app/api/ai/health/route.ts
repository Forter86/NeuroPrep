import { NextResponse } from "next/server";
import { getGatewayMeta } from "@/lib/aiGateway";

export const runtime = "nodejs";

export async function GET() {
  const meta = getGatewayMeta();
  return NextResponse.json({
    ok: true,
    service: "neuroprep-ai-gateway",
    ...meta,
    now: new Date().toISOString(),
  });
}
