"use client";

import Image from "next/image";
import type { AppTab } from "@/types/appTab";
import analyticsIcon from "@/icons/analitics.png";
import bagIcon from "@/icons/bag.png";
import chatIcon from "@/icons/chat.png";
import helmetIcon from "@/icons/helmet.png";
import profileIcon from "@/icons/profile.png";

const TABS: { id: AppTab; label: string; icon: typeof chatIcon }[] = [
  { id: "chat", label: "Чат", icon: chatIcon },
  { id: "tests", label: "Тесты", icon: bagIcon },
  { id: "scenarios", label: "Сценарии", icon: helmetIcon },
  { id: "analytics", label: "Аналитика", icon: analyticsIcon },
  { id: "profile", label: "Профиль", icon: profileIcon },
];

type MobileBottomNavProps = {
  current: AppTab;
  onSelect: (tab: AppTab) => void;
};

export function MobileBottomNav({ current, onSelect }: MobileBottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200/90 bg-white/95 shadow-[0_-4px_20px_rgba(15,23,42,0.06)] backdrop-blur-md"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      aria-label="Основная навигация"
    >
      <ul className="flex items-stretch justify-around px-1 pt-1">
        {TABS.map((tab) => {
          const active = current === tab.id;
          return (
            <li key={tab.id} className="flex-1">
              <button
                type="button"
                onClick={() => onSelect(tab.id)}
                className={`flex w-full flex-col items-center gap-0.5 rounded-xl px-1 py-2 transition ${
                  active ? "text-blue-600" : "text-slate-500"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <Image
                  src={tab.icon}
                  alt=""
                  width={26}
                  height={26}
                  className={`h-[26px] w-[26px] object-contain ${active ? "opacity-100" : "opacity-55"}`}
                />
                <span className={`text-[10px] leading-tight ${active ? "font-semibold" : "font-medium"}`}>
                  {tab.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
