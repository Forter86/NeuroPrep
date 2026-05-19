"use client";

import { useState } from "react";

type LearningMode = "tests" | "scenarios";

export function LearningPathSelector() {
  const [selected, setSelected] = useState<LearningMode>("tests");

  return (
    <section className="mx-auto w-full max-w-4xl rounded-3xl border border-slate-300/70 bg-white/80 p-5 shadow-lg shadow-slate-900/5 backdrop-blur sm:p-7">
      <h2 className="mb-6 text-center text-3xl font-semibold tracking-tight text-slate-900">
        Выбери свой путь
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        <button
          type="button"
          onClick={() => setSelected("tests")}
          className={`group relative min-h-[280px] rounded-l-3xl rounded-r-2xl border px-6 py-7 text-left transition ${
            selected === "tests"
              ? "border-blue-400 bg-blue-600/90 text-white shadow-md shadow-blue-500/20"
              : "border-slate-300/80 bg-blue-500/75 text-white hover:bg-blue-500/85"
          }`}
        >
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
              ? "border-blue-400 bg-slate-700/95 text-white shadow-md shadow-slate-500/20"
              : "border-slate-300/80 bg-slate-600/85 text-white hover:bg-slate-600/95"
          }`}
        >
          <h3 className="text-4xl font-semibold">Сценарии</h3>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/90">
            Обучающие сценарии на реальных ситуациях, которые научат правильно действовать и принимать решения в ТБ.
          </p>
        </button>
      </div>

      <p className="mt-5 text-center text-sm text-slate-600">
        Текущий выбор:{" "}
        <span className="font-semibold text-blue-700">
          {selected === "tests" ? "Тесты" : "Сценарии"}
        </span>
      </p>
    </section>
  );
}
