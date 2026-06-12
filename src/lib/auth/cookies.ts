import { cookies } from "next/headers";
import { ACCESS_COOKIE, REFRESH_COOKIE, authConfig } from "@/lib/auth/config";

const isProd = process.env.NODE_ENV === "production";
// Позволяет работать по http на VPS до настройки TLS: COOKIE_SECURE=0
const secure = isProd && process.env.COOKIE_SECURE !== "0";

export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const store = await cookies();

  store.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1ч; реальный срок задаёт exp JWT
  });

  store.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: authConfig.refreshTtlDays * 24 * 60 * 60,
  });
}

export async function clearAuthCookies() {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
}

export async function readAccessCookie(): Promise<string | null> {
  const store = await cookies();
  return store.get(ACCESS_COOKIE)?.value ?? null;
}

export async function readRefreshCookie(): Promise<string | null> {
  const store = await cookies();
  return store.get(REFRESH_COOKIE)?.value ?? null;
}
