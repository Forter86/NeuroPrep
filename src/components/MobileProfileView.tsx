"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useAuthUser } from "@/lib/auth/useAuthUser";
import { clearChatSessions } from "@/lib/chatSessionsStorage";
import { UserAccountMenu } from "@/components/auth/UserAccountMenu";

export function MobileProfileView() {
  const user = useAuthUser();
  const { logout } = useAuth();
  const [cleared, setCleared] = useState(false);
  const label = user?.login ?? "Гость";
  const initial = label.charAt(0).toUpperCase();

  const handleClearChat = () => {
    const confirmed = window.confirm("Очистить всю историю переписок с ИИ? Действие нельзя отменить.");
    if (!confirmed) return;
    clearChatSessions();
    setCleared(true);
    window.setTimeout(() => setCleared(false), 2500);
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#f3f7fc]">
      <div className="shrink-0 px-4 pb-2 pt-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Профиль</h1>
        <p className="mt-0.5 text-sm text-slate-500">Ваш аккаунт</p>
      </div>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overflow-x-hidden overscroll-y-contain px-4 pb-6 pt-1">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm shadow-slate-900/5">
          <UserAccountMenu label={label} initial={initial} className="w-full" />
        </div>

        <section>
          <h2 className="px-1 text-xs font-bold uppercase tracking-wide text-slate-500">Настройки</h2>
          <div className="mt-3 space-y-3">
            <button
              type="button"
              onClick={handleClearChat}
              className="flex w-full items-center gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 text-left shadow-sm shadow-slate-900/5 transition hover:bg-slate-50 active:bg-slate-100"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13M10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-slate-900">Очистить историю чата</span>
                {cleared && <span className="mt-0.5 block text-xs font-medium text-emerald-600">История очищена</span>}
              </span>
              <svg className="h-5 w-5 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 text-left shadow-sm shadow-slate-900/5 transition hover:bg-slate-50 active:bg-slate-100"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="min-w-0 flex-1 text-[15px] font-semibold text-rose-600">Выйти</span>
              <svg className="h-5 w-5 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </section>

        <div className="px-2 pt-2 text-center">
          <p className="text-sm font-bold text-slate-800">Виртуальный преподаватель по охране труда</p>
          <p className="mx-auto mt-1.5 max-w-xs text-[13px] leading-relaxed text-slate-500">
            Обучающая платформа по охране труда для специалистов. Чат с ИИ, интерактивные тесты, тренажёры аварийных
            ситуаций, детальная аналитика прогресса.
          </p>
          <p className="mt-3 text-xs text-slate-400">Версия 1.0.0 · Powered by LabPro</p>
        </div>
      </div>
    </div>
  );
}
