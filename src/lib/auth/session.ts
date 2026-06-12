import { prisma } from "@/lib/db/prisma";
import { signAccessToken } from "@/lib/auth/jwt";
import { issueRefreshToken } from "@/lib/auth/refreshTokens";
import { setAuthCookies } from "@/lib/auth/cookies";
import type { AuthUser } from "@/lib/auth/types";

/** Выдаёт новую пару токенов и кладёт их в httpOnly cookie. */
export async function establishSession(user: AuthUser, userAgent?: string | null) {
  const accessToken = await signAccessToken(user);
  const refreshToken = await issueRefreshToken(user.id, userAgent);
  await setAuthCookies(accessToken, refreshToken);
}

export async function getUserById(userId: string): Promise<AuthUser | null> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;
  return { id: user.id, login: user.login, displayName: user.displayName, role: user.role };
}
