"use client";

import Image from "next/image";
import type { ScenarioModule } from "@/types/scenario";

type MobileScenarioIntroProps = {
  scenario: ScenarioModule;
  onBack: () => void;
  onStart: () => void;
};

export function MobileScenarioIntro({ scenario, onBack, onStart }: MobileScenarioIntroProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-white">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
        <div className="relative h-52 w-full shrink-0">
          <button
            type="button"
            onClick={onBack}
            className="absolute left-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm"
            aria-label="Назад"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <Image src={scenario.imageSrc} alt="" fill className="object-cover" sizes="100vw" priority />
        </div>

        <div className="px-4 pb-28 pt-4">
          <p className="text-xs font-bold uppercase tracking-wide text-red-600">
            {scenario.difficulty} · {scenario.categoryTag}
          </p>
          <h1 className="mt-2 text-2xl font-bold leading-snug text-slate-900">{scenario.title}</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{scenario.description}</p>

          <div className="mt-5 flex gap-3 rounded-2xl bg-blue-50 px-4 py-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">
              i
            </span>
            <p className="text-sm leading-relaxed text-slate-700">
              В сценарии {scenario.steps.length} шагов. Выбирайте лучшее решение на каждом этапе.
            </p>
          </div>
        </div>
      </div>

      <footer className="shrink-0 border-t border-slate-100 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={onStart}
          className="w-full rounded-xl bg-blue-700 py-3.5 text-sm font-bold text-white"
        >
          Начать сценарий
        </button>
      </footer>
    </div>
  );
}
