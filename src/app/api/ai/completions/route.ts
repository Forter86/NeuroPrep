import { handleChatRequest } from "@/lib/aiGateway";

export const runtime = "nodejs";

export async function POST(req: Request) {
  // Для совместимости: часть провайдеров использует путь /completions.
  return handleChatRequest(req, { endpointPath: "/completions" });
}
