"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MATERIAL_TEST_MODULES } from "@/data/materialTests";
import { getAllLatestAttempts, saveLatestAttempt } from "@/lib/materialTests/attemptStorage";
import {
  buildAnsweredQuestions,
  calcPercent,
  pickRandomQuestions,
} from "@/lib/materialTests/utils";
import type { MaterialQuestion, TestAttemptRecord, TestRunResult } from "@/types/materialTest";
import { appendActivity } from "@/lib/analytics/activityStorage";
import { DesktopTestsList } from "@/components/desktop-tests/DesktopTestsList";
import { MobileTestQuiz } from "@/components/mobile-tests/MobileTestQuiz";
import { MobileTestResults } from "@/components/mobile-tests/MobileTestResults";

type Screen = "list" | "quiz" | "results";

export function DesktopTestsModule() {
  const [screen, setScreen] = useState<Screen>("list");
  const [attempts, setAttempts] = useState<Record<string, TestAttemptRecord>>({});
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [runQuestions, setRunQuestions] = useState<MaterialQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [result, setResult] = useState<TestRunResult | null>(null);

  useEffect(() => {
    setAttempts(getAllLatestAttempts());
  }, []);

  const activeModule = useMemo(
    () => MATERIAL_TEST_MODULES.find((m) => m.id === activeTestId) ?? null,
    [activeTestId],
  );

  const refreshAttempts = useCallback(() => {
    setAttempts(getAllLatestAttempts());
  }, []);

  const resetRun = useCallback(() => {
    setActiveTestId(null);
    setRunQuestions([]);
    setCurrentIndex(0);
    setSelections({});
    setResult(null);
    setScreen("list");
  }, []);

  const openTest = useCallback((testId: string) => {
    const mod = MATERIAL_TEST_MODULES.find((m) => m.id === testId);
    if (!mod) return;
    setActiveTestId(testId);
    setRunQuestions(pickRandomQuestions(mod.questions));
    setCurrentIndex(0);
    setSelections({});
    setResult(null);
    setScreen("quiz");
  }, []);

  const handleSelect = useCallback(
    (questionId: string, optionId: string) => {
      const question = runQuestions.find((q) => q.id === questionId);
      if (!question) return;

      setSelections((prev) => {
        const current = prev[questionId] ?? [];
        if (question.multiple) {
          const next = current.includes(optionId)
            ? current.filter((id) => id !== optionId)
            : [...current, optionId];
          return { ...prev, [questionId]: next };
        }
        const next = current[0] === optionId ? [] : [optionId];
        return { ...prev, [questionId]: next };
      });
    },
    [runQuestions],
  );

  const finishTest = useCallback(() => {
    if (!activeTestId) return;
    const answers = buildAnsweredQuestions(runQuestions, selections);
    const correct = answers.filter((a) => a.isCorrect).length;
    const total = runQuestions.length;
    const percent = calcPercent(correct, total);
    const runResult: TestRunResult = {
      testId: activeTestId,
      answers,
      correct,
      total,
      percent,
    };
    saveLatestAttempt({
      testId: activeTestId,
      correct,
      total,
      percent,
      completedAt: new Date().toISOString(),
    });
    appendActivity({
      kind: "test",
      refId: activeTestId,
      title: activeModule?.title ?? activeTestId,
      correct,
      total,
      percent,
    });
    refreshAttempts();
    setResult(runResult);
    setScreen("results");
  }, [activeTestId, activeModule, runQuestions, selections, refreshAttempts]);

  if (screen === "quiz" && activeModule && runQuestions.length > 0) {
    return (
      <MobileTestQuiz
        module={activeModule}
        questions={runQuestions}
        currentIndex={currentIndex}
        selections={selections}
        onClose={resetRun}
        onSelect={handleSelect}
        onBack={() => setCurrentIndex((i) => Math.max(0, i - 1))}
        onNext={() => setCurrentIndex((i) => Math.min(runQuestions.length - 1, i + 1))}
        onFinish={finishTest}
      />
    );
  }

  if (screen === "results" && activeModule && result) {
    return (
      <MobileTestResults
        module={activeModule}
        questions={runQuestions}
        result={result}
        onDone={resetRun}
      />
    );
  }

  return <DesktopTestsList modules={MATERIAL_TEST_MODULES} attempts={attempts} onOpen={openTest} />;
}
