"use client";

import { useMemo, useState } from "react";
import { ChatWorkspace } from "@/components/ChatWorkspace";
import { LearningPathSelector } from "@/components/LearningPathSelector";
import { TopNavMenu, type ModuleView } from "@/components/TopNavMenu";

export default function Home() {
  const [view, setView] = useState<ModuleView>("chat");

  const titleByView = useMemo(
    () => ({
      chat: "Виртуальный преподаватель по технике безопасности",
      learning: "Обучающий модуль по технике безопасности",
      analytics: "Модуль аналитики прогресса",
    }),
    [],
  );

  const subtitleByView = useMemo(
    () => ({
      chat: "Задавай вопросы по охране труда и технике безопасности: нормы, СИЗ, действия в нештатных ситуациях — разберём по шагам.",
      learning: "Выбери формат обучения: адаптивные тесты или практические сценарии на реальных ситуациях.",
      analytics: "Отслеживай прогресс, слабые места и динамику знаний в сфере ТБ.",
    }),
    [],
  );

  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(59,130,246,0.17),transparent)] dark:bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(37,99,235,0.22),transparent)]">
      <TopNavMenu currentView={view} onSelect={setView} />
      <header className="shrink-0 border-b border-slate-300/70 bg-slate-50/80 backdrop-blur dark:border-slate-700/70 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-3xl flex-col gap-1 px-4 py-6 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">
            NeuroPrep
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            {titleByView[view]}
          </h1>
          <p className="max-w-xl text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
            {subtitleByView[view]}
          </p>
        </div>
      </header>

      <main
        className={
          view === "chat"
            ? "flex min-h-0 w-full flex-1 flex-col overflow-hidden pt-3 pb-4 pl-2 pr-4 sm:pt-4 sm:pb-5 sm:pl-3 sm:pr-8 md:pr-10"
            : "mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6"
        }
      >
        {view === "chat" && <ChatWorkspace />}
        {view === "learning" && <LearningPathSelector />}
        {view === "analytics" && (
          <section className="mx-auto w-full max-w-4xl rounded-3xl border border-slate-300/70 bg-white/80 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/80">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Аналитика обучения</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              Здесь будет дашборд с результатами: процент правильных ответов, темы с рисками и персональные рекомендации.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
