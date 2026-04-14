"use client";

import { useCallback, useRef, useState, type Dispatch, type SetStateAction } from "react";
import type { ChatMessage } from "@/types/chat";

type ChatPanelProps = {
  messages: ChatMessage[];
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
};

function extractReply(data: { reply?: string; ok?: boolean; error?: string; detail?: unknown }): string {
  if (typeof data.reply === "string") return data.reply;
  throw new Error(data.error ?? "Нет поля reply в ответе");
}

export function ChatPanel({ messages, setMessages }: ChatPanelProps) {
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
      const res = await fetch("/api/chat", {
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

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-300/70 bg-white/85 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/85">
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overflow-x-hidden overscroll-y-contain p-4 sm:p-5">
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "ml-8 rounded-2xl rounded-br-md bg-blue-600 px-4 py-3 text-white dark:bg-blue-700"
                : "mr-8 rounded-2xl rounded-bl-md border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100"
            }
          >
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{m.content}</p>
          </div>
        ))}
        {loading && (
          <div className="mr-8 rounded-2xl rounded-bl-md border border-dashed border-blue-300/70 bg-blue-50/70 px-4 py-3 text-sm text-blue-900/80 dark:border-blue-500/30 dark:bg-blue-950/25 dark:text-blue-100/90">
            Думаю…
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {error && (
        <div className="shrink-0 border-t border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="flex shrink-0 gap-2 border-t border-slate-300/70 p-3 sm:p-4 dark:border-slate-700/70">
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
          className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-[15px] text-slate-900 outline-none ring-blue-500/30 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
          disabled={loading}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => void send()}
          disabled={loading || !input.trim()}
          className="shrink-0 rounded-xl bg-blue-600 px-5 py-3 text-[15px] font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          Отправить
        </button>
      </div>
    </div>
  );
}
