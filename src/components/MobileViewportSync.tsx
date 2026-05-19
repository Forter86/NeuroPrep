"use client";

import { useEffect } from "react";

const MOBILE_MQ = "(max-width: 767px)";

function syncViewportVars() {
  const vv = window.visualViewport;
  const height = vv?.height ?? window.innerHeight;
  const offsetTop = vv?.offsetTop ?? 0;

  document.documentElement.style.setProperty("--app-height", `${height}px`);
  document.documentElement.style.setProperty("--app-offset-top", `${offsetTop}px`);
}

function clearViewportVars() {
  document.documentElement.style.removeProperty("--app-height");
  document.documentElement.style.removeProperty("--app-offset-top");
}

export function MobileViewportSync() {
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);

    const enable = () => {
      syncViewportVars();
    };

    const disable = () => {
      clearViewportVars();
    };

    const onChange = () => {
      if (mq.matches) enable();
      else disable();
    };

    const scheduleSync = () => {
      syncViewportVars();
      requestAnimationFrame(syncViewportVars);
    };

    const onKeyboardLikelyClosed = () => {
      scheduleSync();
      window.setTimeout(scheduleSync, 120);
      window.setTimeout(scheduleSync, 320);
    };

    onChange();

    const vv = window.visualViewport;
    vv?.addEventListener("resize", scheduleSync);
    vv?.addEventListener("scroll", scheduleSync);
    window.addEventListener("resize", scheduleSync);
    window.addEventListener("orientationchange", onKeyboardLikelyClosed);
    window.addEventListener("focusin", scheduleSync);
    window.addEventListener("focusout", onKeyboardLikelyClosed);
    mq.addEventListener("change", onChange);

    return () => {
      vv?.removeEventListener("resize", scheduleSync);
      vv?.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
      window.removeEventListener("orientationchange", onKeyboardLikelyClosed);
      window.removeEventListener("focusin", scheduleSync);
      window.removeEventListener("focusout", onKeyboardLikelyClosed);
      mq.removeEventListener("change", onChange);
      clearViewportVars();
    };
  }, []);

  return null;
}
