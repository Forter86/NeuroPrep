"use client";

import { useAuthUser } from "@/lib/auth/useAuthUser";
import { UserAccountMenu } from "@/components/auth/UserAccountMenu";

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
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm shadow-slate-900/5">
          <UserAccountMenu label={label} initial={initial} className="w-full" />
        </div>
      </div>
    </div>
  );
}
