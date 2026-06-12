"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import type { AuthUser } from "@/lib/auth/types";
import { apiLogin } from "@/lib/auth/client";

type LabProLoginFormProps = {
  onSuccess: (user: AuthUser) => void;
};

const LOGIN_ERROR =
  "Нет аккаунта с таким логином. Возможно, он удален или его никогда не было.";

function LabProLogo() {
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="text-2xl font-bold tracking-tight text-slate-900">LabPro</span>
      <Image
        src="/icons/LabPro.png"
        alt="ID"
        width={48}
        height={24}
        className="h-6 w-auto"
        priority
      />
    </div>
  );
}

function LoginCard({ onSuccess }: LabProLoginFormProps) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await apiLogin(login, password);
    if (!result.ok) {
      setError(result.error || LOGIN_ERROR);
      setSubmitting(false);
      return;
    }

    onSuccess(result.user);
  };

  return (
    <div className="w-full max-w-[22rem] rounded-3xl bg-white px-6 py-8 shadow-xl shadow-slate-900/10 sm:max-w-[24rem] sm:px-8 sm:py-10">
      <LabProLogo />

      <h1 className="mt-6 text-center text-[22px] font-medium leading-tight text-slate-900">
        Преподаватель
        <br />
        по охране труда
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-3">
        <div>
          <input
            type="text"
            value={login}
            onChange={(event) => {
              setLogin(event.target.value);
              if (error) setError(null);
            }}
            placeholder="Логин или email"
            autoComplete="username"
            className={`w-full rounded-xl border bg-white px-4 py-3.5 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 ${
              error ? "border-red-500" : "border-slate-300"
            }`}
          />
        </div>

        <div>
          <input
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              if (error) setError(null);
            }}
            placeholder="Пароль"
            autoComplete="current-password"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900"
          />
        </div>

        {error ? (
          <div className="flex items-start gap-2 pt-1">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-red-500"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" />
            </svg>
            <p className="text-sm leading-snug text-red-600">{error}</p>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full rounded-xl bg-zinc-900 py-3.5 text-[15px] font-medium text-white transition hover:bg-zinc-800 disabled:opacity-70"
        >
          Войти
        </button>

        <button
          type="button"
          className="w-full rounded-xl border border-slate-300 bg-white py-3.5 text-[15px] font-medium text-slate-900 transition hover:bg-slate-50"
        >
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
}

export function LabProLoginForm({ onSuccess }: LabProLoginFormProps) {
  return (
    <>
      {/* Desktop — с фоном */}
      <div
        className="hidden min-h-full flex-1 items-center justify-center bg-cover bg-center bg-no-repeat p-6 md:flex"
        style={{ backgroundImage: "url(/icons/FonAVTOR.png)" }}
      >
        <LoginCard onSuccess={onSuccess} />
      </div>

      {/* Mobile — без фона, фиксированная видимая область */}
      <div className="auth-mobile-shell flex items-center justify-center bg-white px-4 py-6 md:hidden">
        <LoginCard onSuccess={onSuccess} />
      </div>
    </>
  );
}
