"use client";

import type { MaterialQuestion, MaterialTestModule } from "@/types/materialTest";

type MobileTestQuizProps = {
  module: MaterialTestModule;
  questions: MaterialQuestion[];
  currentIndex: number;
  selections: Record<string, string[]>;
  onClose: () => void;
  onSelect: (questionId: string, optionId: string) => void;
  onBack: () => void;
  onNext: () => void;
  onFinish: () => void;
};

function OptionControl({ multiple, selected }: { multiple: boolean; selected: boolean }) {
  if (multiple) {
    return (
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 ${
          selected ? "border-blue-700 bg-blue-700" : "border-slate-300 bg-white"
        }`}
        aria-hidden
      >
        {selected && (
          <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
    );
  }

  return (
    <span
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
        selected ? "border-blue-700" : "border-slate-300"
      }`}
      aria-hidden
    >
      {selected && <span className="h-2.5 w-2.5 rounded-full bg-blue-700" />}
    </span>
  );
}

export function MobileTestQuiz({
  module,
  questions,
  currentIndex,
  selections,
  onClose,
  onSelect,
  onBack,
  onNext,
  onFinish,
}: MobileTestQuizProps) {
  const question = questions[currentIndex]!;
  const selected = selections[question.id] ?? [];
  const hasSelection = selected.length > 0;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === questions.length - 1;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <header className="shrink-0 px-4 pt-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="-ml-1 flex h-10 w-10 items-center justify-center rounded-full text-slate-600 active:bg-slate-100"
            aria-label="Закрыть тест"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
          <p className="text-sm font-semibold text-slate-700">
            {currentIndex + 1} / {questions.length}
          </p>
          <span className="w-10" aria-hidden />
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-blue-700 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 pb-4 pt-5">
        <p className="text-xs font-bold uppercase tracking-wide text-blue-700">{module.categoryTag}</p>
        <h2 className="mt-2 text-xl font-bold leading-snug text-slate-900">{question.prompt}</h2>

        {question.multiple && (
          <p className="mt-2 text-sm text-slate-500">Можно выбрать несколько вариантов ответа</p>
        )}

        <ul className="mt-5 space-y-3">
          {question.options.map((opt) => {
            const isSelected = selected.includes(opt.id);
            return (
              <li key={opt.id}>
                <button
                  type="button"
                  onClick={() => onSelect(question.id, opt.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition ${
                    isSelected
                      ? "border-blue-700 bg-blue-50/60"
                      : "border-slate-200 bg-white active:bg-slate-50"
                  }`}
                >
                  <OptionControl multiple={question.multiple} selected={isSelected} />
                  <span className="text-[15px] leading-snug text-slate-800">{opt.text}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {question.reference ? (
          <div className="mt-5 rounded-xl bg-slate-50 px-3 py-3">
            <p className="text-xs font-semibold text-slate-500">Ссылка на НТД</p>
            <p className="mt-1 text-sm leading-relaxed text-blue-800">{question.reference}</p>
          </div>
        ) : null}
      </div>

      <footer className="shrink-0 border-t border-slate-100 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {isLast ? (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onBack}
              disabled={isFirst}
              className="min-w-[5.5rem] rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 disabled:opacity-40"
            >
              Назад
            </button>
            <button
              type="button"
              onClick={onFinish}
              disabled={!hasSelection}
              className="flex-1 rounded-xl bg-blue-700 py-3 text-sm font-bold text-white disabled:bg-slate-300"
            >
              Завершить тест
            </button>
          </div>
        ) : isFirst ? (
          <button
            type="button"
            onClick={onNext}
            disabled={!hasSelection}
            className="w-full rounded-xl bg-blue-700 py-3.5 text-sm font-bold text-white disabled:bg-[#94a3d8]"
          >
            Далее
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onBack}
              className="min-w-[5.5rem] rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800"
            >
              Назад
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={!hasSelection}
              className="flex-1 rounded-xl bg-blue-700 py-3 text-sm font-bold text-white disabled:bg-[#94a3d8]"
            >
              Далее
            </button>
          </div>
        )}
      </footer>
    </div>
  );
}
