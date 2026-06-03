"use client";

import { useEffect } from "react";

const MOBILE_MQ = "(max-width: 767px)";

function syncViewportVars() {
  const vv = window.visualViewport;
  const height = vv?.height ?? window.innerHeight;
  const width = vv?.width ?? window.innerWidth;
  const offsetTop = vv?.offsetTop ?? 0;
  const offsetLeft = vv?.offsetLeft ?? 0;

  document.documentElement.style.setProperty("--app-height", `${height}px`);
  document.documentElement.style.setProperty("--app-width", `${width}px`);
  document.documentElement.style.setProperty("--app-offset-top", `${offsetTop}px`);
  document.documentElement.style.setProperty("--app-offset-left", `${offsetLeft}px`);
}

function clearViewportVars() {
  document.documentElement.style.removeProperty("--app-height");
  document.documentElement.style.removeProperty("--app-width");
  document.documentElement.style.removeProperty("--app-offset-top");
  document.documentElement.style.removeProperty("--app-offset-left");
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
      window.scrollTo(0, 0);
      window.setTimeout(() => {
        scheduleSync();
        window.scrollTo(0, 0);
      }, 120);
      window.setTimeout(() => {
        scheduleSync();
        window.scrollTo(0, 0);
      }, 320);
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
