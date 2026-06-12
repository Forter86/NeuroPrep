export type UserRole = "user" | "admin";

export type AuthUser = {
  id: string;
  login: string;
  displayName: string;
  role: UserRole;
};

/** Claims нашего access-токена, совместимые по форме с OIDC/Keycloak. */
export type AccessTokenClaims = {
  sub: string;
  preferred_username: string;
  name: string;
  role: UserRole;
  realm_access: { roles: string[] };
};

export function claimsToUser(claims: AccessTokenClaims): AuthUser {
  return {
    id: claims.sub,
    login: claims.preferred_username,
    displayName: claims.name,
    role: claims.role,
  };
}
