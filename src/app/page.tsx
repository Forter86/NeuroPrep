"use client";

import { useMemo, useState } from "react";
import { ChatWorkspace } from "@/components/ChatWorkspace";
import { DesktopScenariosModule } from "@/components/desktop-scenarios/DesktopScenariosModule";
import { DesktopTestsModule } from "@/components/desktop-tests/DesktopTestsModule";
import { MobileAnalyticsView } from "@/components/mobile-analytics/MobileAnalyticsView";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { MobileProfileView } from "@/components/MobileProfileView";
import { MobileScenariosModule } from "@/components/mobile-scenarios/MobileScenariosModule";
import { MobileTestsModule } from "@/components/mobile-tests/MobileTestsModule";
import { SessionTimeTracker } from "@/components/SessionTimeTracker";
import { TopNavMenu } from "@/components/TopNavMenu";
import type { AppTab, DesktopModuleView } from "@/types/appTab";

export default function Home() {
  const [mobileTab, setMobileTab] = useState<AppTab>("chat");
  const [desktopView, setDesktopView] = useState<DesktopModuleView>("chat");

  const titleByView = useMemo(
    () => ({
      chat: "Виртуальный преподаватель по технике безопасности",
      tests: "Тесты",
      scenarios: "Сценарии",
      analytics: "Модуль аналитики прогресса",
    }),
    [],
  );

  const subtitleByView = useMemo(
    () => ({
      chat: "Задавай вопросы по охране труда и технике безопасности: нормы, СИЗ, действия в нештатных ситуациях — разберём по шагам.",
      tests: "Проверка знаний по охране труда",
      scenarios: "Отработка действий в реальных ситуациях",
      analytics: "Отслеживай прогресс, слабые места и динамику знаний в сфере ТБ.",
    }),
    [],
  );

  return (
    <>
      <SessionTimeTracker />
      {/* Desktop */}
      <div className="desktop-app-shell relative hidden min-h-0 flex-1 flex-col bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(59,130,246,0.17),transparent)] md:flex">
        <TopNavMenu currentView={desktopView} onSelect={setDesktopView} />
        <header className="shrink-0 border-b border-slate-300/70 bg-slate-50/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">NeuroPrep</p>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              {titleByView[desktopView]}
            </h1>
            <p className="max-w-xl text-[15px] leading-relaxed text-zinc-600">{subtitleByView[desktopView]}</p>
          </div>
        </header>

        <main
          className={
            desktopView === "chat"
              ? "flex min-h-0 w-full flex-1 flex-col overflow-hidden pt-3 pb-4 pl-2 pr-4 sm:pt-4 sm:pb-5 sm:pl-3 sm:pr-8 md:pr-10"
              : "mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col overflow-y-auto px-4 py-8 sm:px-6"
          }
        >
          {desktopView === "chat" && <ChatWorkspace layout="desktop" />}
          {desktopView === "tests" && <DesktopTestsModule />}
          {desktopView === "scenarios" && <DesktopScenariosModule />}
          {desktopView === "analytics" && (
            <section className="mx-auto w-full max-w-4xl rounded-3xl border border-slate-300/70 bg-white/80 p-6 shadow-lg shadow-slate-900/5 backdrop-blur">
              <h2 className="text-2xl font-semibold text-slate-900">Аналитика обучения</h2>
              <p className="mt-3 text-slate-600">
                Здесь будет дашборд с результатами: процент правильных ответов, темы с рисками и персональные
                рекомендации.
              </p>
            </section>
          )}
        </main>
      </div>

      {/* Mobile */}
      <div className="mobile-app-shell fixed z-0 flex w-full max-w-full flex-col overflow-hidden bg-[#f3f7fc] md:hidden">
        <main className="min-h-0 w-full max-w-full flex-1 overflow-hidden overflow-x-clip">
          {mobileTab === "chat" && <ChatWorkspace layout="mobile" />}
          {mobileTab === "tests" && <MobileTestsModule />}
          {mobileTab === "scenarios" && <MobileScenariosModule />}
          {mobileTab === "analytics" && <MobileAnalyticsView />}
          {mobileTab === "profile" && <MobileProfileView />}
        </main>
        <MobileBottomNav current={mobileTab} onSelect={setMobileTab} />
      </div>
    </>
  );
}
