"use client";

import type { MaterialTestModule, TestAttemptRecord } from "@/types/materialTest";
import { TestCard } from "@/components/shared/TestCard";

type MobileTestsListProps = {
  modules: MaterialTestModule[];
  attempts: Record<string, TestAttemptRecord>;
  onOpen: (testId: string) => void;
};

export function MobileTestsList({ modules, attempts, onOpen }: MobileTestsListProps) {
  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#f3f7fc]">
      <div className="shrink-0 px-4 pb-2 pt-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Тесты</h1>
        <p className="mt-0.5 text-sm text-slate-500">Проверка знаний по охране труда</p>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overflow-x-hidden overscroll-y-contain px-4 pb-4">
        {modules.map((mod) => (
          <TestCard
            key={mod.id}
            module={mod}
            attempt={attempts[mod.id]}
            onOpen={() => onOpen(mod.id)}
            className="w-full"
          />
        ))}
      </div>
    </div>
  );
}
