import Image from "next/image";
import type { ScenarioModule } from "@/types/scenario";

type ScenarioCardProps = {
  scenario: ScenarioModule;
  onOpen: () => void;
  className?: string;
};

export function ScenarioCard({ scenario, onOpen, className = "" }: ScenarioCardProps) {
  return (
    <article className={`overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm shadow-slate-900/5 transition hover:shadow-md ${className}`}>
      <button type="button" onClick={onOpen} className="block w-full text-left">
        <div className="relative h-44 w-full">
          <Image
            src={scenario.imageSrc}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 360px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
          <h2 className="absolute bottom-3 left-3 right-3 text-lg font-bold leading-snug text-white">{scenario.title}</h2>
        </div>

        <div className="p-4">
          <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">{scenario.description}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" />
              </svg>
              {scenario.steps.length} шагов
            </span>
            <span className="text-sm font-semibold text-blue-700">Начать →</span>
          </div>
        </div>
      </button>
    </article>
  );
}
