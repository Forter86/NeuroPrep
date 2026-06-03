import type { AuthUser } from "@/lib/auth/users";

const STORAGE_KEY = "neuroprep:auth:v1";

export function getSessionUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function saveSessionUser(user: AuthUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function clearSessionUser() {
  localStorage.removeItem(STORAGE_KEY);
}
