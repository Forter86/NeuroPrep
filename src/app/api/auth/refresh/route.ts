import { signAccessToken } from "@/lib/auth/jwt";
import { rotateRefreshToken } from "@/lib/auth/refreshTokens";
import { clearAuthCookies, readRefreshCookie, setAuthCookies } from "@/lib/auth/cookies";
import { getUserById } from "@/lib/auth/session";
import { json, serverError, unauthorized } from "@/lib/api/response";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const raw = await readRefreshCookie();
    if (!raw) return unauthorized();

    const rotated = await rotateRefreshToken(raw, req.headers.get("user-agent"));
    if (!rotated) {
      await clearAuthCookies();
      return unauthorized("Сессия истекла");
    }

    const user = await getUserById(rotated.userId);
    if (!user) {
      await clearAuthCookies();
      return unauthorized();
    }

    const accessToken = await signAccessToken(user);
    await setAuthCookies(accessToken, rotated.token);
    return json({ user });
  } catch (error) {
    console.error("[auth/refresh]", error);
    return serverError();
  }
}
