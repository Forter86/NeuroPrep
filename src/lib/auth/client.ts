import type { AuthUser } from "@/lib/auth/types";

async function readUser(res: Response): Promise<AuthUser | null> {
  if (!res.ok) return null;
  try {
    const data = (await res.json()) as { user?: AuthUser };
    return data.user ?? null;
  } catch {
    return null;
  }
}

export async function apiMe(): Promise<AuthUser | null> {
  const res = await fetch("/api/auth/me", { credentials: "include", cache: "no-store" });
  return readUser(res);
}

export async function apiRefresh(): Promise<AuthUser | null> {
  const res = await fetch("/api/auth/refresh", { method: "POST", credentials: "include" });
  return readUser(res);
}

export type LoginResult =
  | { ok: true; user: AuthUser }
  | { ok: false; error: string };

export async function apiLogin(login: string, password: string): Promise<LoginResult> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ login, password }),
  });

  if (res.ok) {
    const user = await readUser(res);
    if (user) return { ok: true, user };
    return { ok: false, error: "Не удалось войти" };
  }

  let message = "Неверный логин или пароль";
  try {
    const data = (await res.json()) as { error?: string };
    if (data.error) message = data.error;
  } catch {
    // ignore
  }
  return { ok: false, error: message };
}

export async function apiLogout(): Promise<void> {
  try {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  } catch {
    // ignore network errors on logout
  }
}
