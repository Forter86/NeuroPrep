import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/password";
import type { AuthUser } from "@/lib/auth/types";
import type { AuthProvider } from "@/lib/auth/providers/types";

export class LocalAuthProvider implements AuthProvider {
  readonly kind = "local" as const;

  async authenticate(login: string, password: string): Promise<AuthUser | null> {
    const identifier = login.trim();
    if (!identifier || !password) return null;

    // Сравнение логина/email — без учёта регистра (collation utf8mb4_unicode_ci).
    const user = await prisma.user.findFirst({
      where: {
        provider: "local",
        OR: [{ login: identifier }, { email: identifier }],
      },
    });

    if (!user || !user.passwordHash) return null;

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return null;

    return {
      id: user.id,
      login: user.login,
      displayName: user.displayName,
      role: user.role,
    };
  }
}
