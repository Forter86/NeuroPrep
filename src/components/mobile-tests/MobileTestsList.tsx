"use client";

import type { MaterialTestModule, TestAttemptRecord } from "@/types/materialTest";
import { QUESTIONS_PER_RUN } from "@/lib/materialTests/utils";

type MobileTestsListProps = {
  modules: MaterialTestModule[];
  attempts: Record<string, TestAttemptRecord>;
  onOpen: (testId: string) => void;
};

function SuccessBadge({ percent }: { percent: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {percent}%
    </span>
  );
}

export function MobileTestsList({ modules, attempts, onOpen }: MobileTestsListProps) {
  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#f3f7fc]">
      <div className="shrink-0 px-4 pb-2 pt-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Тесты</h1>
        <p className="mt-0.5 text-sm text-slate-500">Проверка знаний по охране труда</p>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overflow-x-hidden overscroll-y-contain px-4 pb-4">
        {modules.map((mod) => {
          const attempt = attempts[mod.id];
          return (
            <button
              key={mod.id}
              type="button"
              onClick={() => onOpen(mod.id)}
              className="w-full rounded-2xl border border-slate-200/90 bg-white p-4 text-left shadow-sm shadow-slate-900/5 transition active:scale-[0.99]"
            >
              <div className="flex justify-end">
                {attempt ? <SuccessBadge percent={attempt.percent} /> : null}
              </div>

              <h2 className="mt-2 text-lg font-bold leading-snug text-slate-900">{mod.title}</h2>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">{mod.description}</p>

              <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-[10px] font-semibold">
                    ?
                  </span>
                  {QUESTIONS_PER_RUN} вопросов
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M5 4h14a1 1 0 0 1 1 1v14l-4-3-4 3-4-3-4 3V5a1 1 0 0 1 1-1z" />
                  </svg>
                  {mod.categoryTag}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
