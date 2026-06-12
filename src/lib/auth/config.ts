export type AuthMode = "local" | "keycloak";

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const authConfig = {
  get mode(): AuthMode {
    return process.env.AUTH_MODE === "keycloak" ? "keycloak" : "local";
  },
  get jwtSecret(): Uint8Array {
    return new TextEncoder().encode(required("JWT_SECRET", process.env.JWT_SECRET));
  },
  get accessTtl(): string {
    return process.env.ACCESS_TOKEN_TTL || "15m";
  },
  get refreshTtlDays(): number {
    const raw = Number(process.env.REFRESH_TOKEN_TTL_DAYS);
    return Number.isFinite(raw) && raw > 0 ? raw : 30;
  },
  get issuer(): string {
    return process.env.JWT_ISSUER || "neuroprep";
  },
  get audience(): string {
    return process.env.JWT_AUDIENCE || "neuroprep-app";
  },
  keycloak: {
    get issuer(): string {
      return process.env.KEYCLOAK_ISSUER || "";
    },
    get clientId(): string {
      return process.env.KEYCLOAK_CLIENT_ID || "";
    },
    get clientSecret(): string {
      return process.env.KEYCLOAK_CLIENT_SECRET || "";
    },
  },
};

export const ACCESS_COOKIE = "np_access";
export const REFRESH_COOKIE = "np_refresh";
