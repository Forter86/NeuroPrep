"use client";

import { useCallback, useMemo, useState } from "react";
import { SCENARIO_MODULES } from "@/data/scenarios";
import { buildScenarioAnswers, calcPercent } from "@/lib/scenarios/utils";
import { appendActivity } from "@/lib/analytics/activityStorage";
import type { ScenarioRunResult } from "@/types/scenario";
import { MobileScenarioComplete } from "@/components/mobile-scenarios/MobileScenarioComplete";
import { MobileScenarioIntro } from "@/components/mobile-scenarios/MobileScenarioIntro";
import { MobileScenarioStep } from "@/components/mobile-scenarios/MobileScenarioStep";
import { MobileScenariosList } from "@/components/mobile-scenarios/MobileScenariosList";

type Screen = "list" | "intro" | "step" | "complete";

export function MobileScenariosModule() {
  const [screen, setScreen] = useState<Screen>("list");
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ScenarioRunResult | null>(null);

  const activeScenario = useMemo(
    () => SCENARIO_MODULES.find((s) => s.id === activeScenarioId) ?? null,
    [activeScenarioId],
  );

  const activeStep = activeScenario?.steps[stepIndex] ?? null;
  const selectedOptionId = activeStep ? (selections[activeStep.id] ?? null) : null;

  const reset = useCallback(() => {
    setScreen("list");
    setActiveScenarioId(null);
    setStepIndex(0);
    setSelections({});
    setResult(null);
  }, []);

  const openIntro = useCallback((scenarioId: string) => {
    setActiveScenarioId(scenarioId);
    setStepIndex(0);
    setSelections({});
    setResult(null);
    setScreen("intro");
  }, []);

  const startScenario = useCallback(() => {
    setStepIndex(0);
    setSelections({});
    setScreen("step");
  }, []);

  const handleSelect = useCallback((optionId: string) => {
    if (!activeStep) return;
    setSelections((prev) => ({ ...prev, [activeStep.id]: optionId }));
  }, [activeStep]);

  const handleNext = useCallback(() => {
    if (!activeScenario) return;

    if (stepIndex < activeScenario.steps.length - 1) {
      setStepIndex((i) => i + 1);
      return;
    }

    const answers = buildScenarioAnswers(activeScenario.steps, selections);
    const correct = answers.filter((a) => a.isCorrect).length;
    const total = activeScenario.steps.length;
    const percent = calcPercent(correct, total);
    setResult({
      scenarioId: activeScenario.id,
      answers,
      correct,
      total,
      percent,
    });
    appendActivity({
      kind: "scenario",
      refId: activeScenario.id,
      title: activeScenario.title,
      correct,
      total,
      percent,
    });
    setScreen("complete");
  }, [activeScenario, stepIndex, selections]);

  if (screen === "complete" && result) {
    return <MobileScenarioComplete result={result} onDone={reset} />;
  }

  if (screen === "step" && activeScenario && activeStep) {
    return (
      <MobileScenarioStep
        scenario={activeScenario}
        step={activeStep}
        stepIndex={stepIndex}
        selectedOptionId={selectedOptionId}
        onSelect={handleSelect}
        onClose={reset}
        onNext={handleNext}
      />
    );
  }

  if (screen === "intro" && activeScenario) {
    return (
      <MobileScenarioIntro scenario={activeScenario} onBack={reset} onStart={startScenario} />
    );
  }

  return <MobileScenariosList scenarios={SCENARIO_MODULES} onOpen={openIntro} />;
}
