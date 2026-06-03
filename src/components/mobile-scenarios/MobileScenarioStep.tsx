"use client";

import type { ScenarioModule, ScenarioStep } from "@/types/scenario";

type MobileScenarioStepProps = {
  scenario: ScenarioModule;
  step: ScenarioStep;
  stepIndex: number;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
  onClose: () => void;
  onNext: () => void;
};

function OptionStatusIcon({ state }: { state: "correct" | "wrong" | "idle-correct" }) {
  if (state === "correct" || state === "idle-correct") {
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white" aria-hidden>
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }

  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500 text-white" aria-hidden>
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function MobileScenarioStep({
  scenario,
  step,
  stepIndex,
  selectedOptionId,
  onSelect,
  onClose,
  onNext,
}: MobileScenarioStepProps) {
  const total = scenario.steps.length;
  const revealed = selectedOptionId !== null;
  const isCorrect = selectedOptionId === step.correctOptionId;
  const isLast = stepIndex === total - 1;
  const progress = ((stepIndex + 1) / total) * 100;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <header className="shrink-0 px-4 pt-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">
            Шаг {stepIndex + 1} / {total}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 active:bg-slate-100"
            aria-label="Закрыть сценарий"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-blue-700 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 pb-4 pt-5">
        <h2 className="text-xl font-bold leading-snug text-slate-900">{step.prompt}</h2>

        <ul className="mt-5 space-y-3">
          {step.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            const isCorrectOption = opt.id === step.correctOptionId;

            let cardClass = "border-slate-200 bg-white";
            let showIcon: "correct" | "wrong" | "idle-correct" | null = null;

            if (revealed) {
              if (isCorrectOption) {
                cardClass = "border-emerald-500 bg-emerald-50";
                showIcon = isSelected ? "correct" : "idle-correct";
              } else if (isSelected) {
                cardClass = "border-red-400 bg-red-50";
                showIcon = "wrong";
              }
            }

            return (
              <li key={opt.id}>
                <button
                  type="button"
                  disabled={revealed}
                  onClick={() => onSelect(opt.id)}
                  className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left transition disabled:cursor-default ${cardClass}`}
                >
                  <span className="text-[15px] leading-snug text-slate-800">{opt.text}</span>
                  {showIcon ? <OptionStatusIcon state={showIcon} /> : null}
                </button>
              </li>
            );
          })}
        </ul>

        {revealed ? (
          <div
            className={`mt-5 rounded-2xl border px-4 py-3 ${
              isCorrect ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"
            }`}
          >
            <p className={`text-sm font-bold ${isCorrect ? "text-emerald-800" : "text-amber-900"}`}>
              {isCorrect ? "✓ Верное решение" : "⚠ Разберём ошибку"}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{step.feedback}</p>
          </div>
        ) : null}
      </div>

      <footer className="shrink-0 border-t border-slate-100 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={onNext}
          disabled={!revealed}
          className="w-full rounded-xl bg-blue-700 py-3.5 text-sm font-bold text-white disabled:bg-slate-300"
        >
          {isLast ? "Завершить" : "Дальше"}
        </button>
      </footer>
    </div>
  );
}
