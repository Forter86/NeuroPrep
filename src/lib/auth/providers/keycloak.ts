import { prisma } from "@/lib/db/prisma";
import { authConfig } from "@/lib/auth/config";
import type { AuthUser } from "@/lib/auth/types";
import type { AuthProvider } from "@/lib/auth/providers/types";

/**
 * Заготовка под Keycloak (OIDC).
 *
 * Полноценная интеграция Keycloak — это редирект-флоу Authorization Code:
 *   1) фронт уводит пользователя на ${KEYCLOAK_ISSUER}/protocol/openid-connect/auth
 *   2) Keycloak возвращает code на наш callback
 *   3) меняем code на токены через /token endpoint
 *   4) провижионим пользователя в БД по `sub` (externalId)
 *
 * Метод authenticate(login, password) реализует упрощённый grant
 * Resource Owner Password Credentials (ROPC) — на случай, если в Keycloak
 * он включён. Для прод-флоу редиректа добавятся отдельные роуты
 * /api/auth/keycloak/login и /api/auth/keycloak/callback.
 */
export class KeycloakAuthProvider implements AuthProvider {
  readonly kind = "keycloak" as const;

  async authenticate(login: string, password: string): Promise<AuthUser | null> {
    const { issuer, clientId, clientSecret } = authConfig.keycloak;
    if (!issuer || !clientId) {
      throw new Error("Keycloak is not configured (KEYCLOAK_ISSUER / KEYCLOAK_CLIENT_ID)");
    }

    const body = new URLSearchParams({
      grant_type: "password",
      client_id: clientId,
      username: login,
      password,
    });
    if (clientSecret) body.set("client_secret", clientSecret);

    const res = await fetch(`${issuer}/protocol/openid-connect/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) return null;

    const tokens = (await res.json()) as { access_token?: string };
    if (!tokens.access_token) return null;

    const claims = decodeJwtPayload(tokens.access_token);
    if (!claims?.sub) return null;

    return this.provisionUser(claims);
  }

  /** Upsert пользователя из Keycloak по `sub` (externalId). */
  private async provisionUser(claims: KeycloakClaims): Promise<AuthUser> {
    const roles = claims.realm_access?.roles ?? [];
    const role = roles.includes("admin") ? "admin" : "user";
    const login = claims.preferred_username ?? claims.sub;
    const displayName = claims.name ?? login;

    const user = await prisma.user.upsert({
      where: { externalId: claims.sub },
      update: { displayName, role, email: claims.email ?? null },
      create: {
        login,
        displayName,
        email: claims.email ?? null,
        role,
        provider: "keycloak",
        externalId: claims.sub,
      },
    });

    return { id: user.id, login: user.login, displayName: user.displayName, role: user.role };
  }
}

type KeycloakClaims = {
  sub: string;
  preferred_username?: string;
  name?: string;
  email?: string;
  realm_access?: { roles?: string[] };
};

function decodeJwtPayload(token: string): KeycloakClaims | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const json = Buffer.from(part, "base64url").toString("utf8");
    return JSON.parse(json) as KeycloakClaims;
  } catch {
    return null;
  }
}
