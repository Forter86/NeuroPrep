import type { TestAttemptRecord } from "@/types/materialTest";

export async function fetchLatestAttempts(): Promise<Record<string, TestAttemptRecord>> {
  try {
    const res = await fetch("/api/attempts", { credentials: "include", cache: "no-store" });
    if (!res.ok) return {};
    const data = (await res.json()) as { attempts?: Record<string, TestAttemptRecord> };
    return data.attempts ?? {};
  } catch {
    return {};
  }
}

export async function recordTestAttempt(input: {
  testId: string;
  correct: number;
  total: number;
  percent: number;
}): Promise<void> {
  try {
    await fetch("/api/attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(input),
    });
  } catch {
    // ignore — попытка уже показана пользователю
  }
}
