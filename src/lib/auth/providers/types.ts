import type { AuthUser } from "@/lib/auth/types";

/**
 * Единый интерфейс провайдера аутентификации.
 * Сейчас реализован LocalAuthProvider (проверка по БД).
 * Позже подключается KeycloakAuthProvider за тем же интерфейсом —
 * остальной код (выдача JWT, cookie, guard) не меняется.
 */
export interface AuthProvider {
  readonly kind: "local" | "keycloak";
  authenticate(login: string, password: string): Promise<AuthUser | null>;
}
