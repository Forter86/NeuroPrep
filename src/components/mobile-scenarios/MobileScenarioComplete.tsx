"use client";

import type { ScenarioRunResult } from "@/types/scenario";

type MobileScenarioCompleteProps = {
  result: ScenarioRunResult;
  onDone: () => void;
};

export function MobileScenarioComplete({ result, onDone }: MobileScenarioCompleteProps) {
  const passed = result.percent >= 75;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white px-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
        <svg className="h-10 w-10 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M8 21h8M12 17v4M7 4h10l1 7H6l1-7zM7 4L5 8M17 4l2 4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 11h6M10 14h4" strokeLinecap="round" />
        </svg>
      </div>

      <h2 className="mt-6 text-center text-2xl font-bold text-slate-900">
        {passed ? "Отличная работа!" : "Сценарий завершён"}
      </h2>
      <p className="mt-3 text-center text-slate-600">
        Правильных решений: {result.correct} / {result.total}
      </p>
      <p className="mt-1 text-center text-slate-600">Результат: {result.percent}%</p>

      <button
        type="button"
        onClick={onDone}
        className="mt-10 w-full max-w-sm rounded-xl bg-blue-700 py-3.5 text-sm font-bold text-white"
      >
        К списку сценариев
      </button>
    </div>
  );
}
