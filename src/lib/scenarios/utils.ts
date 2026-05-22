import type { ScenarioStep, ScenarioStepAnswer } from "@/types/scenario";

export function calcPercent(correct: number, total: number) {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function buildScenarioAnswers(
  steps: ScenarioStep[],
  selections: Record<string, string>,
): ScenarioStepAnswer[] {
  return steps.map((step) => {
    const selectedOptionId = selections[step.id] ?? "";
    return {
      stepId: step.id,
      selectedOptionId,
      isCorrect: selectedOptionId === step.correctOptionId,
    };
  });
}
