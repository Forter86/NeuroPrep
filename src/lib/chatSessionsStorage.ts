import type { ChatSession } from "@/types/chatSession";
import { normalizeStoredSessions } from "@/lib/normalizeChatSessions";

const STORAGE_KEY = "neuroprep-chat-sessions-v1";

export function loadChatSessions(): ChatSession[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return normalizeStoredSessions(parsed);
  } catch {
    return null;
  }
}

export function saveChatSessions(sessions: ChatSession[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // ignore quota / private mode
  }
}
