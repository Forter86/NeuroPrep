import type { AnalyticsSummary, AnalyticsTopic, ActivityRecord, ActivityKind } from "@/types/analytics";
import { MATERIAL_TEST_MODULES } from "@/data/materialTests";
import { SCENARIO_MODULES } from "@/data/scenarios";

const TEST_TITLES = new Map(MATERIAL_TEST_MODULES.map((m) => [m.id, m.title]));
const SCENARIO_TITLES = new Map(SCENARIO_MODULES.map((s) => [s.id, s.title]));

function titleFor(kind: ActivityKind, refId: string): string {
  const map = kind === "test" ? TEST_TITLES : SCENARIO_TITLES;
  return map.get(refId) ?? refId;
}

type ApiSummary = {
  activeSeconds: number;
  completedTests: number;
  completedScenarios: number;
  aiMessages: number;
  averageTestScore: number;
  successRate: number;
  topics: Array<{ refId: string; latestPercent: number; bestPercent: number; attempts: number }>;
  history: Array<{ id: string; kind: ActivityKind; refId: string; percent: number; completedAt: string }>;
};

export const EMPTY_SUMMARY: AnalyticsSummary = {
  activeSeconds: 0,
  averageTestScore: 0,
  completedTests: 0,
  completedScenarios: 0,
  aiMessages: 0,
  successRate: 0,
  topics: [],
  history: [],
};

export async function fetchAnalyticsSummary(): Promise<AnalyticsSummary> {
  try {
    const res = await fetch("/api/analytics", { credentials: "include", cache: "no-store" });
    if (!res.ok) return EMPTY_SUMMARY;
    const data = (await res.json()) as ApiSummary;

    const topics: AnalyticsTopic[] = data.topics
      .map((t) => ({
        refId: t.refId,
        title: titleFor("test", t.refId),
        latestPercent: t.latestPercent,
        bestPercent: t.bestPercent,
        attempts: t.attempts,
      }))
      .sort((a, b) => a.title.localeCompare(b.title, "ru"));

    const history: ActivityRecord[] = data.history.map((h) => ({
      id: h.id,
      kind: h.kind,
      refId: h.refId,
      title: titleFor(h.kind, h.refId),
      percent: h.percent,
      completedAt: h.completedAt,
    }));

    return {
      activeSeconds: data.activeSeconds,
      averageTestScore: data.averageTestScore,
      completedTests: data.completedTests,
      completedScenarios: data.completedScenarios,
      aiMessages: data.aiMessages,
      successRate: data.successRate,
      topics,
      history,
    };
  } catch {
    return EMPTY_SUMMARY;
  }
}

export function formatActiveTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;
  return `${hours}ч ${restMinutes}м`;
}

export function formatActivityDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
