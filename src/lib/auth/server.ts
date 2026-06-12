import { readAccessCookie } from "@/lib/auth/cookies";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { claimsToUser, type AuthUser } from "@/lib/auth/types";

export class UnauthorizedError extends Error {
  constructor(message = "Не авторизован") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/** Текущий пользователь из access-cookie или null. Не делает refresh. */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = await readAccessCookie();
  if (!token) return null;

  const claims = await verifyAccessToken(token);
  if (!claims) return null;

  return claimsToUser(claims);
}

/** Как getCurrentUser, но бросает UnauthorizedError, если нет валидного пользователя. */
export async function requireUser(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) throw new UnauthorizedError();
  return user;
}
