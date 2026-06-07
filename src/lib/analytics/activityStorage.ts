import type { ActivityKind, ActivityRecord } from "@/types/analytics";

const STORAGE_KEY = "neuroprep:activity:v1";
const MAX_RECORDS = 500;

function genId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `a-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getActivityRecords(): ActivityRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ActivityRecord[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function writeActivityRecords(records: ActivityRecord[]) {
  if (typeof window === "undefined") return;
  try {
    const trimmed = records.slice(-MAX_RECORDS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // ignore quota / private mode
  }
}

export function appendActivity(input: {
  kind: ActivityKind;
  refId: string;
  title: string;
  correct: number;
  total: number;
  percent: number;
}) {
  const records = getActivityRecords();
  records.push({
    id: genId(),
    kind: input.kind,
    refId: input.refId,
    title: input.title,
    correct: input.correct,
    total: input.total,
    percent: input.percent,
    completedAt: new Date().toISOString(),
  });
  writeActivityRecords(records);
}
