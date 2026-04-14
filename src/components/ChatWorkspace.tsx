"use client";

import { useCallback, useEffect, useMemo, useState, type SetStateAction } from "react";
import { CHAT_INTRO_MESSAGE } from "@/constants/chatIntro";
import { loadChatSessions, saveChatSessions } from "@/lib/chatSessionsStorage";
import { sortSessionsByPinAndRecency } from "@/lib/sortChatSessions";
import { ChatPanel } from "@/components/ChatPanel";
import { ChatSidebar } from "@/components/ChatSidebar";
import type { ChatMessage } from "@/types/chat";
import type { ChatSession } from "@/types/chatSession";

function newSession(): ChatSession {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: "Новый чат",
    createdAt: now,
    updatedAt: now,
    pinned: false,
    pinnedAt: null,
    titleManuallySet: false,
    messages: [CHAT_INTRO_MESSAGE],
  };
}

function titleFromMessages(messages: ChatMessage[]): string {
  const firstUser = messages.find((m) => m.role === "user");
  if (!firstUser) return "Новый чат";
  const t = firstUser.content.trim().replace(/\s+/g, " ");
  if (!t) return "Новый чат";
  return t.length > 40 ? `${t.slice(0, 37)}…` : t;
}

export function ChatWorkspace() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadChatSessions();
    if (stored && stored.length > 0) {
      const sorted = [...stored].sort(sortSessionsByPinAndRecency);
      setSessions(stored);
      setActiveId(sorted[0]!.id);
    } else {
      const s = newSession();
      setSessions([s]);
      setActiveId(s.id);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || sessions.length === 0) return;
    saveChatSessions(sessions);
  }, [sessions, hydrated]);

  useEffect(() => {
    if (!hydrated || sessions.length === 0) return;
    if (!sessions.some((s) => s.id === activeId)) {
      const sorted = [...sessions].sort(sortSessionsByPinAndRecency);
      setActiveId(sorted[0]!.id);
    }
  }, [sessions, activeId, hydrated]);

  const activeSession = useMemo(
    () => sessions.find((s) => s.id === activeId) ?? null,
    [sessions, activeId],
  );

  const setActiveMessages = useCallback(
    (updater: SetStateAction<ChatMessage[]>) => {
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== activeId) return s;
          const next = typeof updater === "function" ? updater(s.messages) : updater;
          const now = new Date().toISOString();
          return {
            ...s,
            messages: next,
            updatedAt: now,
            title: s.titleManuallySet ? s.title : titleFromMessages(next),
          };
        }),
      );
    },
    [activeId],
  );

  const handleNewChat = useCallback(() => {
    const s = newSession();
    setSessions((prev) => [s, ...prev]);
    setActiveId(s.id);
    setSearch("");
  }, []);

  const handleRename = useCallback((id: string, title: string) => {
    const t = title.trim();
    if (!t) return;
    setSessions((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, title: t.slice(0, 120), titleManuallySet: true } : s,
      ),
    );
  }, []);

  const handleTogglePin = useCallback((id: string) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const nextPinned = !s.pinned;
        return {
          ...s,
          pinned: nextPinned,
          pinnedAt: nextPinned ? new Date().toISOString() : null,
        };
      }),
    );
  }, []);

  const handleDelete = useCallback((id: string) => {
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      if (next.length === 0) return [newSession()];
      return next;
    });
  }, []);

  if (!hydrated || !activeSession) {
    return (
      <div className="flex h-full min-h-0 flex-1 items-center justify-center text-sm text-slate-500 dark:text-slate-400">
        Загрузка…
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col gap-4 overflow-hidden sm:flex-row sm:items-stretch md:gap-5">
      <ChatSidebar
        sessions={sessions}
        activeId={activeId}
        search={search}
        onSearchChange={setSearch}
        onNewChat={handleNewChat}
        onSelect={setActiveId}
        onRename={handleRename}
        onTogglePin={handleTogglePin}
        onDelete={handleDelete}
      />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <ChatPanel key={activeSession.id} messages={activeSession.messages} setMessages={setActiveMessages} />
      </div>
    </div>
  );
}
