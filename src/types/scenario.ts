export type ScenarioOption = {
  id: string;
  text: string;
};

export type ScenarioStep = {
  id: string;
  prompt: string;
  options: ScenarioOption[];
  correctOptionId: string;
  feedback: string;
};

export type ScenarioModule = {
  id: string;
  title: string;
  description: string;
  difficulty: "Средний" | "Высокий" | "Начальный";
  categoryTag: string;
  imageSrc: string;
  steps: ScenarioStep[];
};

export type ScenarioStepAnswer = {
  stepId: string;
  selectedOptionId: string;
  isCorrect: boolean;
};

export type ScenarioRunResult = {
  scenarioId: string;
  answers: ScenarioStepAnswer[];
  correct: number;
  total: number;
  percent: number;
};
