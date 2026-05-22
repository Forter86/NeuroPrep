export type TestOption = {
  id: string;
  text: string;
};

export type MaterialQuestion = {
  id: string;
  prompt: string;
  options: TestOption[];
  correctOptionIds: string[];
  multiple: boolean;
  reference: string;
};

export type MaterialTestModule = {
  id: string;
  title: string;
  description: string;
  categoryTag: string;
  totalQuestions: number;
  questions: MaterialQuestion[];
};

export type TestAttemptRecord = {
  testId: string;
  correct: number;
  total: number;
  percent: number;
  completedAt: string;
};

export type AnsweredQuestion = {
  questionId: string;
  selectedOptionIds: string[];
  isCorrect: boolean;
};

export type TestRunResult = {
  testId: string;
  answers: AnsweredQuestion[];
  correct: number;
  total: number;
  percent: number;
};
