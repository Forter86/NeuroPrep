"use client";

import { useEffect, useState } from "react";
import type { AnalyticsSummary } from "@/types/analytics";
import { buildAnalyticsSummary, formatActiveTime, formatActivityDate } from "@/lib/analytics/buildSummary";
import {
  ChatIcon,
  ClockIcon,
  DocIcon,
  HelmetIcon,
  MedalIcon,
  StatCard,
  TrophyIcon,
  percentDotClass,
  percentTextClass,
} from "@/components/analytics/AnalyticsParts";

export function DesktopAnalyticsView() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);

  useEffect(() => {
    const update = () => setSummary(buildAnalyticsSummary());
    update();
    const interval = window.setInterval(update, 5000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard
          size="lg"
          icon={<ClockIcon />}
          tone="blue"
          value={summary ? formatActiveTime(summary.activeSeconds) : "0ч 0м"}
          label="Время"
        />
        <StatCard
          size="lg"
          icon={<TrophyIcon />}
          tone="green"
          value={`${summary?.averageTestScore ?? 0}%`}
          label="Средний балл"
        />
        <StatCard
          size="lg"
          icon={<DocIcon />}
          tone="purple"
          value={`${summary?.completedTests ?? 0}`}
          label="Тесты"
        />
        <StatCard
          size="lg"
          icon={<HelmetIcon />}
          tone="orange"
          value={`${summary?.completedScenarios ?? 0}`}
          label="Сценарии"
        />
        <StatCard
          size="lg"
          icon={<ChatIcon />}
          tone="violet"
          value={`${summary?.aiMessages ?? 0}`}
          label="Сообщений ИИ"
        />
        <StatCard
          size="lg"
          icon={<MedalIcon />}
          tone="red"
          value={`${summary?.successRate ?? 0}%`}
          label="Успешность"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <section className="lg:col-span-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-800">Прогресс по темам</h2>
          {summary && summary.topics.length > 0 ? (
            <div className="mt-3 grid grid-cols-1 gap-4 xl:grid-cols-2">
              {summary.topics.map((topic) => (
                <div
                  key={topic.refId}
                  className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm shadow-slate-900/5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[15px] font-bold leading-snug text-slate-900">{topic.title}</h3>
                    <span className={`text-lg font-bold ${percentTextClass(topic.latestPercent)}`}>
                      {topic.latestPercent}%
                    </span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-blue-600" style={{ width: `${topic.latestPercent}%` }} />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span>Попыток: {topic.attempts}</span>
                    <span>Лучший: {topic.bestPercent}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 rounded-2xl border border-slate-200/90 bg-white p-5 text-sm text-slate-500">
              Пройдите тест, чтобы увидеть прогресс по темам.
            </p>
          )}
        </section>

        <section className="lg:col-span-2">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-800">История активности</h2>
          {summary && summary.history.length > 0 ? (
            <div className="mt-3 max-h-[28rem] divide-y divide-slate-100 overflow-y-auto rounded-2xl border border-slate-200/90 bg-white px-4 shadow-sm shadow-slate-900/5">
              {summary.history.map((record) => (
                <div key={record.id} className="flex items-start gap-3 py-3">
                  <span
                    className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${percentDotClass(record.percent)}`}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold leading-snug text-slate-900">{record.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {record.kind === "test" ? "Тест" : "Сценарий"} · {formatActivityDate(record.completedAt)}
                    </p>
                  </div>
                  <span className={`shrink-0 text-base font-bold ${percentTextClass(record.percent)}`}>
                    {record.percent}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 rounded-2xl border border-slate-200/90 bg-white p-5 text-sm text-slate-500">
              Завершённых попыток пока нет.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
