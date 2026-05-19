"use client";

import { useState } from "react";

import type { DesktopModuleView } from "@/types/appTab";

export type ModuleView = DesktopModuleView;

type MenuItem = {
  id: ModuleView;
  label: string;
  description: string;
};

const ITEMS: MenuItem[] = [
  {
    id: "chat",
    label: "Чат",
    description:
      "Место, где ты можешь спросить интересующий тебя вопрос в сфере техники безопасности и получить разбор по шагам.",
  },
  {
    id: "learning",
    label: "Обучающий модуль",
    description:
      "Место, где ты получишь индивидуальный план для проверки и прокачки знаний в сфере техники безопасности.",
  },
  {
    id: "analytics",
    label: "Модуль аналитики",
    description:
      "Посмотри на свои успехи в учебе в сфере техники безопасности: динамику, сильные стороны и зоны роста.",
  },
];

type TopNavMenuProps = {
  currentView: ModuleView;
  onSelect: (view: ModuleView) => void;
};

export function TopNavMenu({ currentView, onSelect }: TopNavMenuProps) {
  const [open, setOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<ModuleView | null>(null);
  const hoveredItem = hoveredId ? ITEMS.find((item) => item.id === hoveredId) : null;

  return (
    <div className="absolute left-4 top-4 z-30 sm:left-6 sm:top-6">
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="top-nav-menu-dropdown"
          className="group flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300/80 bg-white/90 shadow-sm shadow-slate-900/10 backdrop-blur transition hover:border-blue-400/70 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        >
          <span className="sr-only">Открыть меню</span>
          <span className="flex w-5 flex-col gap-1">
            <span className="h-0.5 rounded bg-slate-700 transition group-hover:bg-blue-600" />
            <span className="h-0.5 rounded bg-slate-700 transition group-hover:bg-blue-600" />
            <span className="h-0.5 rounded bg-slate-700 transition group-hover:bg-blue-600" />
          </span>
        </button>

        {open && (
          <div
            id="top-nav-menu-dropdown"
            className={`mt-2 grid gap-2 rounded-2xl border border-slate-300/80 bg-white/95 p-2 shadow-lg shadow-slate-900/10 backdrop-blur ${
              hoveredItem
                ? "w-[min(90vw,620px)] grid-cols-1 sm:grid-cols-[220px_1fr]"
                : "w-[min(90vw,240px)] grid-cols-1"
            }`}
          >
            <ul className="space-y-1" onMouseLeave={() => setHoveredId(null)}>
              {ITEMS.map((item) => {
                const active = hoveredItem?.id === item.id;
                const selected = currentView === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(item.id);
                        setOpen(false);
                      }}
                      onMouseEnter={() => setHoveredId(item.id)}
                      onFocus={() => setHoveredId(item.id)}
                      className={`w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                        active || selected
                          ? "bg-blue-100 text-blue-900"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>

            {hoveredItem && (
              <div className="rounded-xl border border-slate-200/70 bg-slate-100/60 px-4 py-3 text-sm leading-relaxed text-slate-700 backdrop-blur-sm">
                {hoveredItem.description}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
