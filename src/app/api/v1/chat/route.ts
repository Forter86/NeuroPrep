import { handleChatRequest } from "@/lib/aiGateway";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return handleChatRequest(req);
}
