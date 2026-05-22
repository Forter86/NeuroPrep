import type { TestAttemptRecord } from "@/types/materialTest";

const STORAGE_KEY = "neuroprep:test-attempts:v1";

function readAll(): Record<string, TestAttemptRecord> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, TestAttemptRecord>;
  } catch {
    return {};
  }
}

function writeAll(data: Record<string, TestAttemptRecord>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getLatestAttempt(testId: string): TestAttemptRecord | null {
  return readAll()[testId] ?? null;
}

export function getAllLatestAttempts(): Record<string, TestAttemptRecord> {
  return readAll();
}

export function saveLatestAttempt(record: TestAttemptRecord) {
  const all = readAll();
  all[record.testId] = record;
  writeAll(all);
}
