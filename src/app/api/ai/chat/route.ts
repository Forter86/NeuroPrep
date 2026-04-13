import { handleChatRequest } from "@/lib/aiGateway";

export const runtime = "nodejs";

export async function POST(req: Request) {
  return handleChatRequest(req);
}
