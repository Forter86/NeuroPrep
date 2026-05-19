"use client";

import { ChatSidebar } from "@/components/ChatSidebar";
import type { ChatSession } from "@/types/chatSession";

type ChatDrawerProps = {
  open: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  activeId: string;
  search: string;
  onSearchChange: (q: string) => void;
  onNewChat: () => void;
  onSelect: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
};

export function ChatDrawer({
  open,
  onClose,
  sessions,
  activeId,
  search,
  onSearchChange,
  onNewChat,
  onSelect,
  onRename,
  onTogglePin,
  onDelete,
}: ChatDrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Меню чатов">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        aria-label="Закрыть меню"
        onClick={onClose}
      />
      <div
        className="absolute inset-y-0 left-0 flex w-[min(88vw,20rem)] flex-col bg-white shadow-2xl"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <ChatSidebar
          variant="drawer"
          sessions={sessions}
          activeId={activeId}
          search={search}
          onSearchChange={onSearchChange}
          onNewChat={() => {
            onNewChat();
            onClose();
          }}
          onSelect={(id) => {
            onSelect(id);
            onClose();
          }}
          onRename={onRename}
          onTogglePin={onTogglePin}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}
