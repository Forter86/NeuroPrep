import type { ReactNode } from "react";

export type StatTone = "blue" | "green" | "purple" | "orange" | "violet" | "red";

const TONE_CLASSES: Record<StatTone, string> = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-emerald-50 text-emerald-600",
  purple: "bg-indigo-50 text-indigo-600",
  orange: "bg-amber-50 text-amber-600",
  violet: "bg-violet-50 text-violet-600",
  red: "bg-rose-50 text-rose-600",
};

export function percentTextClass(percent: number) {
  return percent >= 60 ? "text-emerald-600" : "text-rose-600";
}

export function percentDotClass(percent: number) {
  return percent >= 60 ? "bg-emerald-500" : "bg-rose-500";
}

export function StatCard({
  icon,
  tone,
  value,
  label,
  size = "sm",
}: {
  icon: ReactNode;
  tone: StatTone;
  value: string;
  label: string;
  size?: "sm" | "lg";
}) {
  const isLarge = size === "lg";
  return (
    <div
      className={`rounded-2xl border border-slate-200/90 bg-white shadow-sm shadow-slate-900/5 ${
        isLarge ? "p-4" : "p-3"
      }`}
    >
      <span
        className={`flex items-center justify-center rounded-xl ${TONE_CLASSES[tone]} ${
          isLarge ? "h-11 w-11" : "h-9 w-9"
        }`}
      >
        {icon}
      </span>
      <p className={`font-bold text-slate-900 ${isLarge ? "mt-4 text-2xl" : "mt-3 text-lg"}`}>{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

export function ClockIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TrophyIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path
        d="M8 21h8M12 17v4M7 4h10l-.5 6a4.5 4.5 0 0 1-9 0L7 4zM7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DocIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M7 3h7l5 5v13a0 0 0 0 1 0 0H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 3v5h5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HelmetIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M2.5 17.5h19" strokeLinecap="round" />
      <path d="M5 17.5v-2.5a7 7 0 0 1 14 0v2.5" strokeLinejoin="round" />
      <path d="M10 8.6V7.2a2 2 0 0 1 4 0v1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChatIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M21 12a8 8 0 0 1-11.5 7.2L4 20l1-4.3A8 8 0 1 1 21 12z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MedalIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="15" r="6" />
      <path
        d="M12 13l1 2 2 .2-1.5 1.4.4 2-1.9-1-1.9 1 .4-2L9 15.2l2-.2 1-2zM8 3l2 6M16 3l-2 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
