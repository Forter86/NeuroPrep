import type { ChatSession } from "@/types/chatSession";
import { normalizeStoredSessions } from "@/lib/normalizeChatSessions";

/** Загружает чаты пользователя с сервера. null — если запрос не удался. */
export async function loadChatSessions(): Promise<ChatSession[] | null> {
  try {
    const res = await fetch("/api/chat/sessions", { credentials: "include", cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as { sessions?: unknown };
    return normalizeStoredSessions(data.sessions ?? []);
  } catch {
    return null;
  }
}

/** Сохраняет весь набор чатов пользователя (replace-all). */
export async function saveChatSessions(sessions: ChatSession[]): Promise<void> {
  try {
    await fetch("/api/chat/sessions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ sessions }),
    });
  } catch {
    // ignore — повторим при следующем изменении
  }
}

export async function clearChatSessions(): Promise<void> {
  await saveChatSessions([]);
}
