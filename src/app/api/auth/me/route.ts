import { getCurrentUser } from "@/lib/auth/server";
import { json, unauthorized } from "@/lib/api/response";

export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  return json({ user });
}
