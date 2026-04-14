import type { ChatSession } from "@/types/chatSession";

/** Сначала закреплённые (новее закреп — выше), затем остальные по updatedAt */
export function sortSessionsByPinAndRecency(a: ChatSession, b: ChatSession): number {
  if (a.pinned && b.pinned) {
    const pa = a.pinnedAt ? new Date(a.pinnedAt).getTime() : 0;
    const pb = b.pinnedAt ? new Date(b.pinnedAt).getTime() : 0;
    return pb - pa;
  }
  if (a.pinned && !b.pinned) return -1;
  if (!a.pinned && b.pinned) return 1;
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
}
