"use client";

import { useAuthUser } from "@/lib/auth/useAuthUser";

export function MobileProfileView() {
  const user = useAuthUser();
  const label = user?.login ?? "Гость";
  const initial = label.charAt(0).toUpperCase();

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#f3f7fc]">
      <div className="shrink-0 px-4 pb-2 pt-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Профиль</h1>
        <p className="mt-0.5 text-sm text-slate-500">Ваш аккаунт</p>
      </div>

      <div className="px-4 pb-4">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm shadow-slate-900/5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-600 text-lg font-semibold text-white">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-slate-900">{label}</p>
            <p className="text-sm text-slate-500">LabPro ID</p>
          </div>
        </div>
      </div>
    </div>
  );
}
