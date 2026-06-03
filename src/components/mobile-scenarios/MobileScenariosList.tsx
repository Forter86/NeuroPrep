"use client";

import type { ScenarioModule } from "@/types/scenario";
import { ScenarioCard } from "@/components/shared/ScenarioCard";

type MobileScenariosListProps = {
  scenarios: ScenarioModule[];
  onOpen: (scenarioId: string) => void;
};

export function MobileScenariosList({ scenarios, onOpen }: MobileScenariosListProps) {
  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#f3f7fc]">
      <div className="shrink-0 px-4 pb-2 pt-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Сценарии</h1>
        <p className="mt-0.5 text-sm text-slate-500">Отработка действий в реальных ситуациях</p>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overflow-x-hidden overscroll-y-contain px-4 pb-4">
        {scenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            onOpen={() => onOpen(scenario.id)}
            className="w-full"
          />
        ))}
      </div>
    </div>
  );
}
