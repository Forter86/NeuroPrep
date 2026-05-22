import type { AnsweredQuestion, MaterialQuestion } from "@/types/materialTest";

export const QUESTIONS_PER_RUN = 5;

export function pickRandomQuestions(questions: MaterialQuestion[], count = QUESTIONS_PER_RUN) {
  const pool = [...questions];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j]!, pool[i]!];
  }
  return pool.slice(0, Math.min(count, pool.length));
}

export function gradeAnswer(question: MaterialQuestion, selectedOptionIds: string[]): boolean {
  const selected = new Set(selectedOptionIds);
  const correct = new Set(question.correctOptionIds);
  if (selected.size !== correct.size) return false;
  for (const id of correct) {
    if (!selected.has(id)) return false;
  }
  return true;
}

export function buildAnsweredQuestions(
  questions: MaterialQuestion[],
  selections: Record<string, string[]>,
): AnsweredQuestion[] {
  return questions.map((q) => {
    const selectedOptionIds = selections[q.id] ?? [];
    return {
      questionId: q.id,
      selectedOptionIds,
      isCorrect: gradeAnswer(q, selectedOptionIds),
    };
  });
}

export function calcPercent(correct: number, total: number) {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}
