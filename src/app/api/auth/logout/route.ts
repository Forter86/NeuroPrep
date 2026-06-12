import { revokeRefreshToken } from "@/lib/auth/refreshTokens";
import { clearAuthCookies, readRefreshCookie } from "@/lib/auth/cookies";
import { json, serverError } from "@/lib/api/response";

export const runtime = "nodejs";

export async function POST() {
  try {
    const raw = await readRefreshCookie();
    if (raw) await revokeRefreshToken(raw);
    await clearAuthCookies();
    return json({ ok: true });
  } catch (error) {
    console.error("[auth/logout]", error);
    return serverError();
  }
}
