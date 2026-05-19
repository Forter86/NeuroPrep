"use client";

import { useCallback, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { API_V1 } from "@/constants/apiV1";
import { CHAT_INTRO_MESSAGE } from "@/constants/chatIntro";
import type { ChatMessage } from "@/types/chat";

type ChatPanelProps = {
  messages: ChatMessage[];
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  variant?: "desktop" | "mobile";
};

function extractReply(data: { reply?: string; ok?: boolean; error?: string; detail?: unknown }): string {
  if (typeof data.reply === "string") return data.reply;
  throw new Error(data.error ?? "Нет поля reply в ответе");
}

function isWelcomeOnly(messages: ChatMessage[]) {
  return (
    messages.length === 1 &&
    messages[0]?.role === "assistant" &&
    messages[0]?.content === CHAT_INTRO_MESSAGE.content
  );
}

export function ChatPanel({ messages, setMessages, variant = "desktop" }: ChatPanelProps) {
  const isMobile = variant === "mobile";
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    setError(null);
    const userMsg: ChatMessage = { role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    requestAnimationFrame(scrollToBottom);

    try {
      const res = await fetch(API_V1.chat, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = (await res.json()) as { reply?: string; ok?: boolean; error?: string; detail?: unknown };

      if (!res.ok) {
        const detail =
          data.detail != null
            ? ` ${typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail)}`
            : "";
        throw new Error((data.error ?? "Ошибка сервера") + detail);
      }

      const reply = extractReply(data);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось отправить сообщение");
      setMessages((prev) => prev.slice(0, -1));
      setInput(text);
    } finally {
      setLoading(false);
      requestAnimationFrame(scrollToBottom);
    }
  }, [input, loading, messages, setMessages, scrollToBottom]);

  const showWelcome = isMobile && isWelcomeOnly(messages);

  return (
    <div
      className={
        isMobile
          ? "flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-white"
          : "flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-300/70 bg-white/85 shadow-lg shadow-slate-900/5 backdrop-blur"
      }
    >
      <div
        className={`min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain ${
          isMobile ? "touch-pan-y px-3 py-4 [-webkit-overflow-scrolling:touch]" : "space-y-3 p-4 sm:p-5"
        } ${!isMobile ? "space-y-3" : ""}`}
      >
        {showWelcome ? (
          <div className="flex h-full min-h-[12rem] flex-col items-center justify-center px-4 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl font-bold text-white shadow-md shadow-blue-500/25">
              N
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Чем могу помочь?</h2>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
              Спроси про СИЗ, нормы ТБ или действия в нештатной ситуации.
            </p>
          </div>
        ) : (
          <div className={isMobile ? "space-y-3" : "space-y-3"}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? isMobile
                      ? "ml-6 rounded-2xl rounded-br-sm bg-blue-600 px-4 py-2.5 text-white"
                      : "ml-8 rounded-2xl rounded-br-md bg-blue-600 px-4 py-3 text-white"
                    : isMobile
                      ? "mr-6 rounded-2xl rounded-bl-sm border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-800"
                      : "mr-8 rounded-2xl rounded-bl-md border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800"
                }
              >
                <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{m.content}</p>
              </div>
            ))}
            {loading && (
              <div
                className={
                  isMobile
                    ? "mr-6 rounded-2xl rounded-bl-sm border border-dashed border-blue-300/70 bg-blue-50/70 px-4 py-2.5 text-sm text-blue-900/80"
                    : "mr-8 rounded-2xl rounded-bl-md border border-dashed border-blue-300/70 bg-blue-50/70 px-4 py-3 text-sm text-blue-900/80"
                }
              >
                Думаю…
              </div>
            )}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {error && (
        <div className="shrink-0 border-t border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">
          {error}
        </div>
      )}

      <div
        className={
          isMobile
            ? "shrink-0 border-t border-slate-200/80 bg-white px-3 py-3"
            : "flex shrink-0 gap-2 border-t border-slate-300/70 p-3 sm:p-4"
        }
      >
        {isMobile ? (
          <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              placeholder="Вопрос по ТБ, СИЗ, нормам…"
              className="min-w-0 flex-1 bg-transparent py-2 text-[15px] text-slate-900 outline-none placeholder:text-slate-400"
              disabled={loading}
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => void send()}
              disabled={loading || !input.trim()}
              aria-label="Отправить"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        ) : (
          <>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              placeholder="Вопрос по ТБ, СИЗ, нормам…"
              className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-[15px] text-slate-900 outline-none ring-blue-500/30 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2"
              disabled={loading}
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => void send()}
              disabled={loading || !input.trim()}
              className="shrink-0 rounded-xl bg-blue-600 px-5 py-3 text-[15px] font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Отправить
            </button>
          </>
        )}
      </div>
    </div>
  );
}
