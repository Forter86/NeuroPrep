import { createHash, randomBytes } from "crypto";
import { prisma } from "@/lib/db/prisma";
import { authConfig } from "@/lib/auth/config";

function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

function expiryDate(): Date {
  const ms = authConfig.refreshTtlDays * 24 * 60 * 60 * 1000;
  return new Date(Date.now() + ms);
}

/** Создаёт новый refresh-токен в БД, возвращает «сырое» значение для cookie. */
export async function issueRefreshToken(userId: string, userAgent?: string | null): Promise<string> {
  const raw = randomBytes(48).toString("hex");
  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: hashToken(raw),
      expiresAt: expiryDate(),
      userAgent: userAgent ?? null,
    },
  });
  return raw;
}

/**
 * Проверяет refresh-токен и ротирует его: старый помечается revoked,
 * выдаётся новый. Возвращает userId + новый «сырой» токен, либо null.
 */
export async function rotateRefreshToken(
  raw: string,
  userAgent?: string | null,
): Promise<{ userId: string; token: string } | null> {
  const tokenHash = hashToken(raw);
  const existing = await prisma.refreshToken.findUnique({ where: { tokenHash } });

  if (!existing || existing.revoked || existing.expiresAt.getTime() < Date.now()) {
    return null;
  }

  const newRaw = randomBytes(48).toString("hex");

  await prisma.$transaction([
    prisma.refreshToken.update({
      where: { id: existing.id },
      data: { revoked: true },
    }),
    prisma.refreshToken.create({
      data: {
        userId: existing.userId,
        tokenHash: hashToken(newRaw),
        expiresAt: expiryDate(),
        userAgent: userAgent ?? existing.userAgent,
      },
    }),
  ]);

  return { userId: existing.userId, token: newRaw };
}

export async function revokeRefreshToken(raw: string): Promise<void> {
  const tokenHash = hashToken(raw);
  await prisma.refreshToken.updateMany({
    where: { tokenHash },
    data: { revoked: true },
  });
}

/** Отозвать все refresh-токены пользователя (logout со всех устройств). */
export async function revokeAllUserTokens(userId: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { userId, revoked: false },
    data: { revoked: true },
  });
}
