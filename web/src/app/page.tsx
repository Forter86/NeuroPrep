import { ChatPanel } from "@/components/ChatPanel";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(245,158,11,0.18),transparent)] dark:bg-[radial-gradient(ellipse_120%_80%_at_50%-20%,rgba(180,83,9,0.22),transparent)]">
      <header className="border-b border-amber-900/10 bg-white/70 backdrop-blur dark:border-amber-500/10 dark:bg-zinc-950/70">
        <div className="mx-auto flex max-w-3xl flex-col gap-1 px-4 py-6 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            NeuroPrep
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Виртуальный преподаватель по технике безопасности
          </h1>
          <p className="max-w-xl text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
            Задавай вопросы по охране труда — когда будет готов API нейросети, ответы пойдут с бэкенда. Пока без{" "}
            <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-sm text-amber-950 dark:bg-amber-950/50 dark:text-amber-100">
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
