"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { AnalyticsSummary } from "@/types/analytics";
import { buildAnalyticsSummary, formatActiveTime, formatActivityDate } from "@/lib/analytics/buildSummary";

type StatTone = "blue" | "green" | "purple" | "orange" | "violet" | "red";

const TONE_CLASSES: Record<StatTone, string> = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-emerald-50 text-emerald-600",
  purple: "bg-indigo-50 text-indigo-600",
  orange: "bg-amber-50 text-amber-600",
  violet: "bg-violet-50 text-violet-600",
  red: "bg-rose-50 text-rose-600",
};

function StatCard({
  icon,
  tone,
  value,
  label,
}: {
  icon: ReactNode;
  tone: StatTone;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-3 shadow-sm shadow-slate-900/5">
      <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${TONE_CLASSES[tone]}`}>{icon}</span>
      <p className="mt-3 text-lg font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

function percentColor(percent: number) {
  return percent >= 60 ? "text-emerald-600" : "text-rose-600";
}

function ClockIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M8 21h8M12 17v4M7 4h10l-.5 6a4.5 4.5 0 0 1-9 0L7 4zM7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M7 3h7l5 5v13a0 0 0 0 1 0 0H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 3v5h5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HelmetIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M2.5 17.5h19" strokeLinecap="round" />
      <path d="M5 17.5v-2.5a7 7 0 0 1 14 0v2.5" strokeLinejoin="round" />
      <path d="M10 8.6V7.2a2 2 0 0 1 4 0v1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M21 12a8 8 0 0 1-11.5 7.2L4 20l1-4.3A8 8 0 1 1 21 12z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MedalIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="15" r="6" />
      <path d="M12 13l1 2 2 .2-1.5 1.4.4 2-1.9-1-1.9 1 .4-2L9 15.2l2-.2 1-2zM8 3l2 6M16 3l-2 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MobileAnalyticsView() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);

  useEffect(() => {
    const update = () => setSummary(buildAnalyticsSummary());
    update();
    const interval = window.setInterval(update, 5000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#f3f7fc]">
      <div className="shrink-0 px-4 pb-2 pt-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Аналитика</h1>
        <p className="mt-0.5 text-sm text-slate-500">Ваш прогресс обучения</p>
      </div>

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overflow-x-hidden overscroll-y-contain px-4 pb-6 pt-2">
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={<ClockIcon />}
            tone="blue"
            value={summary ? formatActiveTime(summary.activeSeconds) : "0ч 0м"}
            label="Время"
          />
          <StatCard
            icon={<TrophyIcon />}
            tone="green"
            value={`${summary?.averageTestScore ?? 0}%`}
            label="Средний балл"
          />
          <StatCard
            icon={<DocIcon />}
            tone="purple"
            value={`${summary?.completedTests ?? 0}`}
            label="Тесты"
          />
          <StatCard
            icon={<HelmetIcon />}
            tone="orange"
            value={`${summary?.completedScenarios ?? 0}`}
            label="Сценарии"
          />
          <StatCard
            icon={<ChatIcon />}
            tone="violet"
            value={`${summary?.aiMessages ?? 0}`}
            label="Сообщений ИИ"
          />
          <StatCard
            icon={<MedalIcon />}
            tone="red"
            value={`${summary?.successRate ?? 0}%`}
            label="Успешность"
          />
        </div>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-wide text-slate-800">Прогресс по темам</h2>
          {summary && summary.topics.length > 0 ? (
            <div className="mt-3 space-y-3">
              {summary.topics.map((topic) => (
                <div
                  key={topic.refId}
                  className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm shadow-slate-900/5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[15px] font-bold leading-snug text-slate-900">{topic.title}</h3>
                    <span className={`text-lg font-bold ${percentColor(topic.latestPercent)}`}>
                      {topic.latestPercent}%
                    </span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${topic.latestPercent}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span>Попыток: {topic.attempts}</span>
                    <span>Лучший: {topic.bestPercent}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 rounded-2xl border border-slate-200/90 bg-white p-4 text-sm text-slate-500">
              Пройдите тест, чтобы увидеть прогресс по темам.
            </p>
          )}
        </section>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-wide text-slate-800">История активности</h2>
          {summary && summary.history.length > 0 ? (
            <div className="mt-3 divide-y divide-slate-100 rounded-2xl border border-slate-200/90 bg-white px-4 shadow-sm shadow-slate-900/5">
              {summary.history.map((record) => (
                <div key={record.id} className="flex items-start gap-3 py-3">
                  <span
                    className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                      record.percent >= 60 ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold leading-snug text-slate-900">{record.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {record.kind === "test" ? "Тест" : "Сценарий"} · {formatActivityDate(record.completedAt)}
                    </p>
                  </div>
                  <span className={`shrink-0 text-base font-bold ${percentColor(record.percent)}`}>
                    {record.percent}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 rounded-2xl border border-slate-200/90 bg-white p-4 text-sm text-slate-500">
              Завершённых попыток пока нет.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
