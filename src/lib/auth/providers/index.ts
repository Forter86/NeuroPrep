import { authConfig } from "@/lib/auth/config";
import { LocalAuthProvider } from "@/lib/auth/providers/local";
import { KeycloakAuthProvider } from "@/lib/auth/providers/keycloak";
import type { AuthProvider } from "@/lib/auth/providers/types";

let provider: AuthProvider | null = null;

export function getAuthProvider(): AuthProvider {
  if (!provider) {
    provider = authConfig.mode === "keycloak" ? new KeycloakAuthProvider() : new LocalAuthProvider();
  }
  return provider;
}
