import type { ChatMessage } from "@/types/chat";
import type { ChatSession } from "@/types/chatSession";

export function normalizeStoredSessions(raw: unknown): ChatSession[] | null {
  if (!Array.isArray(raw)) return null;
  const out: ChatSession[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const s = item as Record<string, unknown>;
    if (typeof s.id !== "string") continue;
    const messages = Array.isArray(s.messages) ? (s.messages as ChatMessage[]) : [];
    const pinned = Boolean(s.pinned);
    const updatedAt = typeof s.updatedAt === "string" ? s.updatedAt : new Date().toISOString();
    const pinnedAt =
      pinned && typeof s.pinnedAt === "string"
        ? s.pinnedAt
        : pinned
          ? updatedAt
          : null;
    out.push({
      id: s.id,
      title: typeof s.title === "string" && s.title.trim() ? s.title : "Новый чат",
      createdAt: typeof s.createdAt === "string" ? s.createdAt : updatedAt,
      updatedAt,
      pinned,
      pinnedAt,
      titleManuallySet: Boolean(s.titleManuallySet),
      messages,
    });
  }
  return out.length ? out : null;
}
