"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { sortSessionsByPinAndRecency } from "@/lib/sortChatSessions";
import type { ChatSession } from "@/types/chatSession";

type DateGroup = "Сегодня" | "Вчера" | "Позавчера" | string;

function startOfLocalDay(ts: number) {
  const d = new Date(ts);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function dateGroupLabel(createdAtIso: string): DateGroup {
  const created = new Date(createdAtIso).getTime();
  const t0 = startOfLocalDay(Date.now());
  const t1 = startOfLocalDay(Date.now() - 86400000);
  const t2 = startOfLocalDay(Date.now() - 2 * 86400000);
  const c0 = startOfLocalDay(created);
  if (c0 === t0) return "Сегодня";
  if (c0 === t1) return "Вчера";
  if (c0 === t2) return "Позавчера";
  return new Date(createdAtIso).toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
}

function maxUpdatedAt(list: ChatSession[]) {
  return Math.max(...list.map((s) => new Date(s.updatedAt).getTime()));
}

type ChatSidebarProps = {
  variant?: "inline" | "drawer";
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

export function ChatSidebar({
  variant = "inline",
  sessions,
  activeId,
  search,
  onSearchChange,
  onNewChat,
  onSelect,
  onRename,
  onTogglePin,
  onDelete,
}: ChatSidebarProps) {
  const isDrawer = variant === "drawer";
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const [portalReady, setPortalReady] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!openMenuId) return;
    const close = () => {
      setOpenMenuId(null);
      setMenuPos(null);
    };
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (menuRef.current?.contains(t)) return;
      if ((t as Element).closest?.("[data-chat-row-menu]")) return;
      close();
    };
    const onScroll = () => close();
    document.addEventListener("mousedown", onDown);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", close);
    };
  }, [openMenuId]);

  const menuSession = openMenuId ? sessions.find((x) => x.id === openMenuId) : null;

  useEffect(() => {
    if (openMenuId && !sessions.some((x) => x.id === openMenuId)) {
      setOpenMenuId(null);
      setMenuPos(null);
    }
  }, [openMenuId, sessions]);

  const q = search.trim().toLowerCase();
  const filtered = q
    ? sessions.filter((s) => {
        const haystack = [s.title, ...s.messages.map((m) => m.content)].join(" ").toLowerCase();
        return haystack.includes(q);
      })
    : sessions;

  const sorted = [...filtered].sort(sortSessionsByPinAndRecency);

  const groups = new Map<DateGroup, ChatSession[]>();
  for (const s of sorted) {
    const label = dateGroupLabel(s.createdAt);
    const arr = groups.get(label) ?? [];
    arr.push(s);
    groups.set(label, arr);
  }

  const orderedLabels = Array.from(groups.keys()).sort(
    (a, b) => maxUpdatedAt(groups.get(b)!) - maxUpdatedAt(groups.get(a)!),
  );

  const menuWidth = 176;

  return (
    <>
    <aside
      className={
        isDrawer
          ? "flex h-full min-h-0 w-full flex-col overflow-hidden p-4"
          : "flex h-full min-h-0 max-h-full w-full max-w-full flex-shrink-0 flex-col self-stretch overflow-hidden rounded-2xl border border-slate-300/70 bg-white/90 p-3 shadow-md shadow-slate-900/5 backdrop-blur max-sm:max-h-[42vh] sm:h-full sm:max-h-none sm:w-80 sm:min-w-[20rem] md:w-[22.5rem] md:min-w-[22.5rem] md:p-4"
      }
    >
      <button
        type="button"
        onClick={onNewChat}
        className="flex w-full shrink-0 items-center gap-2 rounded-xl px-2 py-2.5 text-left text-[15px] font-medium text-slate-900 transition hover:bg-slate-100"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300/80 text-lg leading-none text-slate-700">
          +
        </span>
        Новый чат
      </button>

      <div className="mt-2 flex shrink-0 items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 py-2">
        <span className="text-slate-400" aria-hidden>
          ⌕
        </span>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Поиск в чатах"
          className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
          autoComplete="off"
        />
      </div>

      <div className="mt-3 flex shrink-0 items-center justify-between px-1 text-xs text-slate-500">
        <span>Все задачи</span>
        <span className="text-slate-400" title="Сначала закреплённые, затем новые">
          ↓
        </span>
      </div>

      <div className="mt-2 min-h-0 flex-1 space-y-4 overflow-y-auto overflow-x-hidden overscroll-y-contain pr-0.5">
        {orderedLabels.length === 0 && (
          <p className="px-1 text-sm text-slate-500">Нет чатов по запросу</p>
        )}
        {orderedLabels.map((label) => (
          <div key={label}>
            <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              {label}
            </p>
            <ul className="space-y-1">
              {groups.get(label)!.map((s) => {
                const active = s.id === activeId;
                const menuOpen = openMenuId === s.id;
                return (
                  <li key={s.id} className="flex gap-0.5">
                    <button
                      type="button"
                      onClick={() => onSelect(s.id)}
                      className={`min-w-0 flex-1 rounded-xl py-2.5 pl-3 pr-2 text-left transition ${
                        active
                          ? "bg-indigo-100/90 text-indigo-950"
                          : "text-slate-800 hover:bg-slate-100"
                      }`}
                    >
                      <span className="line-clamp-2 text-sm font-medium">{s.title}</span>
                      <span className="mt-0.5 block text-[11px] text-slate-500">
                        NeuroPrep / main
                      </span>
                    </button>

                    <div className="flex shrink-0 flex-col items-center pt-1.5">
                      <button
                        type="button"
                        data-chat-row-menu
                        aria-expanded={menuOpen}
                        aria-haspopup="menu"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (openMenuId === s.id) {
                            setOpenMenuId(null);
                            setMenuPos(null);
                            return;
                          }
                          const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                          const menuApproxH = 148;
                          const left = Math.max(8, Math.min(r.right - menuWidth, window.innerWidth - menuWidth - 8));
                          let top = r.bottom + 4;
                          if (top + menuApproxH > window.innerHeight - 8) {
                            top = Math.max(8, r.top - menuApproxH - 4);
                          }
                          setOpenMenuId(s.id);
                          setMenuPos({ top, left });
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-200/80 hover:text-slate-800"
                        title="Действия"
                      >
                        <span className="text-lg leading-none">⋯</span>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-3 flex shrink-0 items-center gap-3 border-t border-slate-200/80 pt-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-600 text-sm font-semibold text-white">
          Г
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-900">Гость</p>
        </div>
      </div>
    </aside>

    {portalReady &&
      menuSession &&
      menuPos &&
      createPortal(
        <div
          ref={menuRef}
          role="menu"
          style={{ top: menuPos.top, left: menuPos.left }}
          className="fixed z-[100] w-44 rounded-xl border border-slate-200/90 bg-white py-1 shadow-lg shadow-slate-900/20"
        >
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-800 hover:bg-slate-100"
            onClick={() => {
              const next = window.prompt("Новое название чата", menuSession.title);
              setOpenMenuId(null);
              setMenuPos(null);
              if (next === null) return;
              onRename(menuSession.id, next);
            }}
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            Переименовать
          </button>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-800 hover:bg-slate-100"
            onClick={() => {
              onTogglePin(menuSession.id);
              setOpenMenuId(null);
              setMenuPos(null);
            }}
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11z" />
              <circle cx="12" cy="10" r="2" fill="currentColor" stroke="none" />
            </svg>
            {menuSession.pinned ? "Открепить" : "Закрепить"}
          </button>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            onClick={() => {
              onDelete(menuSession.id);
              setOpenMenuId(null);
              setMenuPos(null);
            }}
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M3 6h18M8 6V4h8v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6" />
            </svg>
            Удалить
          </button>
        </div>,
        document.body,
      )}
    </>
  );
}
