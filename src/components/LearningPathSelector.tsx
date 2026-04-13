"use client";

import { useState } from "react";

type LearningMode = "tests" | "scenarios";

export function LearningPathSelector() {
  const [selected, setSelected] = useState<LearningMode>("tests");

  return (
    <section className="mx-auto w-full max-w-4xl rounded-3xl border border-slate-300/70 bg-white/80 p-5 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/80 sm:p-7">
      <h2 className="mb-6 text-center text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        Выбери свой путь
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        <button
          type="button"
          onClick={() => setSelected("tests")}
          className={`group relative min-h-[280px] rounded-l-3xl rounded-r-2xl border px-6 py-7 text-left transition ${
            selected === "tests"
              ? "border-blue-400 bg-cyan-500/90 text-white shadow-md shadow-blue-500/20 dark:border-blue-400 dark:bg-cyan-600/90"
              : "border-slate-300/80 bg-cyan-500/75 text-white hover:bg-cyan-500/85 dark:border-slate-700 dark:bg-cyan-700/70"
          }`}
        >
          <span className="absolute -right-8 top-1/3 hidden h-20 w-16 rounded-r-full border-r border-y border-slate-300/60 bg-cyan-500/90 md:block dark:border-slate-700/60 dark:bg-cyan-600/90" />
          <h3 className="text-4xl font-semibold">Тесты</h3>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/90">
            Тесты, подогнанные под тебя: проверка знаний, адаптивная сложность и быстрый фидбек по темам ТБ.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setSelected("scenarios")}
          className={`group relative min-h-[280px] rounded-r-3xl rounded-l-2xl border px-6 py-7 text-left transition ${
            selected === "scenarios"
              ? "border-blue-400 bg-fuchsia-600/90 text-white shadow-md shadow-blue-500/20 dark:border-blue-400 dark:bg-fuchsia-600/90"
              : "border-slate-300/80 bg-fuchsia-600/80 text-white hover:bg-fuchsia-600/90 dark:border-slate-700 dark:bg-fuchsia-700/75"
          }`}
        >
          <span className="absolute -left-8 top-2/3 hidden h-20 w-16 rounded-l-full border-l border-y border-slate-300/60 bg-fuchsia-600/90 md:block dark:border-slate-700/60 dark:bg-fuchsia-600/90" />
          <h3 className="text-4xl font-semibold">Сценарии</h3>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/90">
            Обучающие сценарии на реальных ситуациях, которые научат правильно действовать и принимать решения в ТБ.
          </p>
        </button>
      </div>

      <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-300">
        Текущий выбор:{" "}
        <span className="font-semibold text-blue-700 dark:text-blue-300">
          {selected === "tests" ? "Тесты" : "Сценарии"}
        </span>
      </p>
    </section>
  );
}
