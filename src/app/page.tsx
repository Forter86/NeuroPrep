import { ChatPanel } from "@/components/ChatPanel";
import { TopNavMenu } from "@/components/TopNavMenu";

export default function Home() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(59,130,246,0.17),transparent)] dark:bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(37,99,235,0.22),transparent)]">
      <TopNavMenu />
      <header className="border-b border-slate-300/70 bg-slate-50/80 backdrop-blur dark:border-slate-700/70 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-3xl flex-col gap-1 px-4 py-6 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">
            NeuroPrep
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Виртуальный преподаватель по технике безопасности
          </h1>
          <p className="max-w-xl text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
            Задавай вопросы по охране труда — когда будет готов API нейросети, ответы пойдут с бэкенда. Пока без{" "}
            <code className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-sm text-blue-950 dark:bg-blue-950/60 dark:text-blue-100">
              NEUROPREP_API_URL
            </code>{" "}
            работает демо-режим.
          </p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8 sm:px-6">
        <ChatPanel />
      </main>
    </div>
  );
}
