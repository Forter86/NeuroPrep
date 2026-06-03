"use client";

import type { MaterialTestModule, TestAttemptRecord } from "@/types/materialTest";
import { TestCard } from "@/components/shared/TestCard";

type DesktopTestsListProps = {
  modules: MaterialTestModule[];
  attempts: Record<string, TestAttemptRecord>;
  onOpen: (testId: string) => void;
};

export function DesktopTestsList({ modules, attempts, onOpen }: DesktopTestsListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {modules.map((mod) => (
        <TestCard
          key={mod.id}
          module={mod}
          attempt={attempts[mod.id]}
          onOpen={() => onOpen(mod.id)}
          className="h-full"
        />
      ))}
    </div>
  );
}
