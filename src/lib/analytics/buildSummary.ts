import type { AnalyticsSummary, AnalyticsTopic, ActivityRecord } from "@/types/analytics";
import { getActivityRecords } from "@/lib/analytics/activityStorage";
import { getActiveSeconds } from "@/lib/analytics/sessionTimeStorage";
import { countAiMessages } from "@/lib/analytics/aiMessages";

function average(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, v) => acc + v, 0);
  return Math.round(sum / values.length);
}

function sortByDateDesc(records: ActivityRecord[]): ActivityRecord[] {
  return [...records].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
  );
}

function buildTopics(testRecords: ActivityRecord[]): AnalyticsTopic[] {
  const byRef = new Map<string, ActivityRecord[]>();
  for (const record of testRecords) {
    const arr = byRef.get(record.refId) ?? [];
    arr.push(record);
    byRef.set(record.refId, arr);
  }

  const topics: AnalyticsTopic[] = [];
  for (const [refId, records] of byRef) {
    const sorted = sortByDateDesc(records);
    const latest = sorted[0]!;
    const bestPercent = Math.max(...records.map((r) => r.percent));
    topics.push({
      refId,
      title: latest.title,
      latestPercent: latest.percent,
      bestPercent,
      attempts: records.length,
    });
  }

  return topics.sort((a, b) => a.title.localeCompare(b.title, "ru"));
}

export function buildAnalyticsSummary(): AnalyticsSummary {
  const records = getActivityRecords();
  const testRecords = records.filter((r) => r.kind === "test");
  const scenarioRecords = records.filter((r) => r.kind === "scenario");

  const topics = buildTopics(testRecords);
  const averageTestScore = average(topics.map((t) => t.latestPercent));
  const successRate = average(records.map((r) => r.percent));

  return {
    activeSeconds: getActiveSeconds(),
    averageTestScore,
    completedTests: testRecords.length,
    completedScenarios: scenarioRecords.length,
    aiMessages: countAiMessages(),
    successRate,
    topics,
    history: sortByDateDesc(records),
  };
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
