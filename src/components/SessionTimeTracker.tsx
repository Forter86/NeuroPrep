"use client";

import { useEffect, useRef } from "react";
import { addActiveSeconds } from "@/lib/analytics/sessionTimeStorage";

const FLUSH_INTERVAL_MS = 10_000;

export function SessionTimeTracker() {
  const lastTickRef = useRef<number>(Date.now());

  useEffect(() => {
    lastTickRef.current = Date.now();

    const flush = () => {
      if (document.visibilityState !== "visible") return;
      const now = Date.now();
      const elapsed = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;
      if (elapsed > 0 && elapsed < 3600) {
        addActiveSeconds(elapsed);
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        lastTickRef.current = Date.now();
      } else {
        flush();
      }
    };

    const interval = window.setInterval(flush, FLUSH_INTERVAL_MS);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", flush);
    window.addEventListener("beforeunload", flush);

    return () => {
      flush();
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", flush);
      window.removeEventListener("beforeunload", flush);
    };
  }, []);

  return null;
}
