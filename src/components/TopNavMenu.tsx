"use client";

import { useMemo, useState } from "react";

type MenuItem = {
  id: "chat" | "learning" | "analytics";
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

export function TopNavMenu() {
  const [open, setOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<MenuItem["id"]>("chat");

  const hoveredItem = useMemo(
    () => ITEMS.find((item) => item.id === hoveredId) ?? ITEMS[0],
    [hoveredId],
  );

  return (
    <div className="absolute left-4 top-4 z-30 sm:left-6 sm:top-6">
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="top-nav-menu-dropdown"
          className="group flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300/80 bg-white/90 shadow-sm shadow-slate-900/10 backdrop-blur transition hover:border-blue-400/70 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700/80 dark:bg-slate-900/90 dark:hover:border-blue-500/60 dark:hover:bg-slate-800"
        >
          <span className="sr-only">Открыть меню</span>
          <span className="flex w-5 flex-col gap-1">
            <span className="h-0.5 rounded bg-slate-700 transition group-hover:bg-blue-600 dark:bg-slate-200 dark:group-hover:bg-blue-400" />
            <span className="h-0.5 rounded bg-slate-700 transition group-hover:bg-blue-600 dark:bg-slate-200 dark:group-hover:bg-blue-400" />
            <span className="h-0.5 rounded bg-slate-700 transition group-hover:bg-blue-600 dark:bg-slate-200 dark:group-hover:bg-blue-400" />
          </span>
        </button>

        {open && (
          <div
            id="top-nav-menu-dropdown"
            className="mt-2 grid w-[min(90vw,620px)] grid-cols-1 gap-2 rounded-2xl border border-slate-300/80 bg-white/95 p-2 shadow-lg shadow-slate-900/10 backdrop-blur sm:grid-cols-[220px_1fr] dark:border-slate-700/80 dark:bg-slate-900/95"
          >
            <ul className="space-y-1">
              {ITEMS.map((item) => {
                const active = hoveredItem.id === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setHoveredId(item.id)}
                      onFocus={() => setHoveredId(item.id)}
                      className={`w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                        active
                          ? "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-100"
                          : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/80"
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-700 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200">
              {hoveredItem.description}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
