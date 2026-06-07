const STORAGE_KEY = "neuroprep:active-time:v1";

export function getActiveSeconds(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    const value = Number(JSON.parse(raw));
    return Number.isFinite(value) ? value : 0;
  } catch {
    return 0;
  }
}

export function addActiveSeconds(seconds: number) {
  if (typeof window === "undefined" || seconds <= 0) return;
  try {
    const next = getActiveSeconds() + seconds;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Math.round(next)));
  } catch {
    // ignore quota / private mode
  }
}
