"use client";

import type { MaterialQuestion, MaterialTestModule, TestRunResult } from "@/types/materialTest";

type MobileTestResultsProps = {
  module: MaterialTestModule;
  questions: MaterialQuestion[];
  result: TestRunResult;
  onDone: () => void;
};

function formatAnswerText(question: MaterialQuestion, optionIds: string[]) {
  if (optionIds.length === 0) return "—";
  return optionIds
    .map((id) => question.options.find((o) => o.id === id)?.text)
    .filter(Boolean)
    .join(", ");
}

function formatCorrectText(question: MaterialQuestion) {
  return formatAnswerText(question, question.correctOptionIds);
}

export function MobileTestResults({ module, questions, result, onDone }: MobileTestResultsProps) {
  const passed = result.percent >= 80;
  const answerByQuestionId = new Map(result.answers.map((a) => [a.questionId, a]));

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f3f7fc]">
      <div className="shrink-0 px-4 pb-3 pt-6 text-center">
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
            passed ? "bg-emerald-100" : "bg-red-100"
          }`}
        >
          {passed ? (
            <svg className="h-8 w-8 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg className="h-8 w-8 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          )}
        </div>
        <h2 className="mt-4 text-2xl font-bold text-slate-900">
          {passed ? "Отличный результат!" : "Попробуйте ещё раз"}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {result.correct} / {result.total} правильно · {result.percent}%
        </p>
        <p className="mt-1 text-xs text-slate-400">{module.title}</p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4">
        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-800">Разбор ответов</h3>
        <ul className="mt-3 space-y-3 pb-4">
          {questions.map((q, idx) => {
            const answer = answerByQuestionId.get(q.id);
            const isCorrect = answer?.isCorrect ?? false;
            const userText = formatAnswerText(q, answer?.selectedOptionIds ?? []);
            const correctText = formatCorrectText(q);

            return (
              <li
                key={q.id}
                className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm shadow-slate-900/5"
              >
                <div className="flex gap-3">
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                    }`}
                    aria-hidden
                  >
                    {isCorrect ? (
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                      </svg>
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold leading-snug text-slate-900">
                      {idx + 1}. {q.prompt}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      Ваш ответ:{" "}
                      <span className={`font-bold ${isCorrect ? "text-emerald-700" : "text-red-600"}`}>{userText}</span>
                    </p>
                    {!isCorrect && (
                      <p className="mt-1 text-sm text-slate-600">
                        Правильно: <span className="font-bold text-emerald-700">{correctText}</span>
                      </p>
                    )}
                    {q.reference ? (
                      <p className="mt-2 text-sm italic leading-relaxed text-slate-500">{q.reference}</p>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <footer className="shrink-0 border-t border-slate-200/80 bg-[#f3f7fc] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={onDone}
          className="w-full rounded-xl bg-blue-700 py-3.5 text-sm font-bold text-white"
        >
          Завершить
        </button>
      </footer>
    </div>
  );
}
