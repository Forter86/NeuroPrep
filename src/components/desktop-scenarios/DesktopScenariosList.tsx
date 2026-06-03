"use client";

import type { ScenarioModule } from "@/types/scenario";
import { ScenarioCard } from "@/components/shared/ScenarioCard";

type DesktopScenariosListProps = {
  scenarios: ScenarioModule[];
  onOpen: (scenarioId: string) => void;
};

export function DesktopScenariosList({ scenarios, onOpen }: DesktopScenariosListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {scenarios.map((scenario) => (
        <ScenarioCard
          key={scenario.id}
          scenario={scenario}
          onOpen={() => onOpen(scenario.id)}
          className="max-w-md"
        />
      ))}
    </div>
  );
}
