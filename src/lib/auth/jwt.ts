import { SignJWT, jwtVerify, createRemoteJWKSet, type JWTPayload } from "jose";
import { authConfig } from "@/lib/auth/config";
import type { AccessTokenClaims, AuthUser } from "@/lib/auth/types";

export async function signAccessToken(user: AuthUser): Promise<string> {
  const claims: AccessTokenClaims = {
    sub: user.id,
    preferred_username: user.login,
    name: user.displayName,
    role: user.role,
    realm_access: { roles: [user.role] },
  };

  return new SignJWT(claims as unknown as JWTPayload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setIssuer(authConfig.issuer)
    .setAudience(authConfig.audience)
    .setExpirationTime(authConfig.accessTtl)
    .sign(authConfig.jwtSecret);
}

let keycloakJwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getKeycloakJwks() {
  if (!authConfig.keycloak.issuer) {
    throw new Error("KEYCLOAK_ISSUER is not configured");
  }
  if (!keycloakJwks) {
    keycloakJwks = createRemoteJWKSet(
      new URL(`${authConfig.keycloak.issuer}/protocol/openid-connect/certs`),
    );
  }
  return keycloakJwks;
}

/**
 * Проверяет access-токен. В local-режиме — наш HS256 secret,
 * в keycloak-режиме — RS256 по JWKS издателя. Возвращает claims или null.
 */
export async function verifyAccessToken(token: string): Promise<AccessTokenClaims | null> {
  try {
    if (authConfig.mode === "keycloak") {
      const { payload } = await jwtVerify(token, getKeycloakJwks(), {
        issuer: authConfig.keycloak.issuer,
      });
      return normalizeClaims(payload);
    }

    const { payload } = await jwtVerify(token, authConfig.jwtSecret, {
      issuer: authConfig.issuer,
      audience: authConfig.audience,
    });
    return normalizeClaims(payload);
  } catch {
    return null;
  }
}

function normalizeClaims(payload: JWTPayload): AccessTokenClaims | null {
  const sub = payload.sub;
  if (!sub) return null;

  const realmAccess = (payload as { realm_access?: { roles?: string[] } }).realm_access;
  const roles = realmAccess?.roles ?? [];
  const role = roles.includes("admin")
    ? "admin"
    : ((payload as { role?: string }).role === "admin" ? "admin" : "user");

  return {
    sub,
    preferred_username:
      (payload as { preferred_username?: string }).preferred_username ?? sub,
    name: (payload as { name?: string }).name ?? sub,
    role,
    realm_access: { roles: roles.length ? roles : [role] },
  };
}
