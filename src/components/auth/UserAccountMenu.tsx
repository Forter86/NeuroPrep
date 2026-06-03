"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/lib/auth/AuthContext";

type UserAccountMenuProps = {
  label: string;
  initial: string;
  className?: string;
};

export function UserAccountMenu({ label, initial, className = "" }: UserAccountMenuProps) {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const [portalReady, setPortalReady] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const close = () => setOpen(false);

    const onDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      close();
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const openMenu = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const menuWidth = 240;
    const menuHeight = 52;
    const left = Math.min(Math.max(12, rect.left), window.innerWidth - menuWidth - 12);
    const openUp = rect.top > menuHeight + 16;
    const top = openUp ? rect.top - menuHeight - 8 : rect.bottom + 8;

    setMenuPos({ top, left });
    setOpen(true);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openMenu}
        className={`flex min-w-0 items-center gap-3 rounded-xl text-left transition hover:bg-slate-100/80 active:bg-slate-100 ${className}`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-600 text-sm font-semibold text-white">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-900">{label}</p>
        </div>
      </button>

      {portalReady &&
        open &&
        menuPos &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{ top: menuPos.top, left: menuPos.left }}
            className="fixed z-[120] w-60 rounded-2xl border border-slate-200/90 bg-white py-1.5 shadow-xl shadow-slate-900/15"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-800 transition hover:bg-slate-100"
            >
              <svg className="h-4 w-4 shrink-0 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Выйти из системы
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}
