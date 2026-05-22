"use client";

import Image from "next/image";
import type { ScenarioModule } from "@/types/scenario";

type MobileScenariosListProps = {
  scenarios: ScenarioModule[];
  onOpen: (scenarioId: string) => void;
};

function DifficultyBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-600/95 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2L2 22h20L12 2z" />
      </svg>
      {label}
    </span>
  );
}

export function MobileScenariosList({ scenarios, onOpen }: MobileScenariosListProps) {
  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#f3f7fc]">
      <div className="shrink-0 px-4 pb-2 pt-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Сценарии</h1>
        <p className="mt-0.5 text-sm text-slate-500">Отработка действий в реальных ситуациях</p>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overflow-x-hidden overscroll-y-contain px-4 pb-4">
        {scenarios.map((scenario) => (
          <article
            key={scenario.id}
            className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm shadow-slate-900/5"
          >
            <button type="button" onClick={() => onOpen(scenario.id)} className="block w-full text-left">
              <div className="relative h-44 w-full">
                <Image
                  src={scenario.imageSrc}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                <div className="absolute left-3 top-3">
                  <DifficultyBadge label={scenario.difficulty} />
                </div>
                <h2 className="absolute bottom-3 left-3 right-3 text-lg font-bold leading-snug text-white">
                  {scenario.title}
                </h2>
              </div>

              <div className="p-4">
                <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">{scenario.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" />
                    </svg>
                    {scenario.steps.length} шагов
                  </span>
                  <span className="text-sm font-semibold text-blue-700">Начать →</span>
                </div>
              </div>
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
