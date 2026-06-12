/** Отправляет накопленные секунды активности на сервер. Надёжно работает и при закрытии вкладки. */
export function reportActiveSeconds(seconds: number) {
  const rounded = Math.round(seconds);
  if (rounded <= 0 || rounded > 3600) return;

  const body = JSON.stringify({ seconds: rounded });

  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/session-time", blob);
      return;
    }
  } catch {
    // fall through to fetch
  }

  fetch("/api/session-time", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    keepalive: true,
    body,
  }).catch(() => {});
}
