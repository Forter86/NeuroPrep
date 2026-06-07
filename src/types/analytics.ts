export type ActivityKind = "test" | "scenario";

export type ActivityRecord = {
  id: string;
  kind: ActivityKind;
  refId: string;
  title: string;
  correct: number;
  total: number;
  percent: number;
  completedAt: string;
};

export type AnalyticsTopic = {
  refId: string;
  title: string;
  latestPercent: number;
  bestPercent: number;
  attempts: number;
};

export type AnalyticsSummary = {
  activeSeconds: number;
  averageTestScore: number;
  completedTests: number;
  completedScenarios: number;
  aiMessages: number;
  successRate: number;
  topics: AnalyticsTopic[];
  history: ActivityRecord[];
};
