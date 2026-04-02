"use client";

import { useCallback, useRef, useState } from "react";
import type { ChatMessage } from "@/types/chat";

const INTRO: ChatMessage = {
  role: "assistant",
  content:
    "Привет! Я виртуальный помощник по охране труда и технике безопасности. Спроси про СИЗ, нормы, действия при инциденте — разберём по шагам.",
};

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([INTRO]);
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
      const data = (await res.json()) as { reply?: string; error?: string; detail?: unknown };

      if (!res.ok) {
        const detail =
          data.detail != null
            ? ` ${typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail)}`
            : "";
        throw new Error((data.error ?? "Ошибка сервера") + detail);
      }

      if (typeof data.reply !== "string") {
        throw new Error("Нет поля reply в ответе");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply! }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось отправить сообщение");
      setMessages((prev) => prev.slice(0, -1));
      setInput(text);
    } finally {
      setLoading(false);
      requestAnimationFrame(scrollToBottom);
    }
  }, [input, loading, messages, scrollToBottom]);

  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-amber-900/20 bg-white/80 shadow-lg shadow-amber-950/5 backdrop-blur dark:border-amber-500/15 dark:bg-zinc-900/80">
      <div className="max-h-[min(520px,70vh)] flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "ml-8 rounded-2xl rounded-br-md bg-amber-600 px-4 py-3 text-white dark:bg-amber-700"
                : "mr-8 rounded-2xl rounded-bl-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-100"
            }
          >
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{m.content}</p>
          </div>
        ))}
        {loading && (
          <div className="mr-8 rounded-2xl rounded-bl-md border border-dashed border-amber-400/50 bg-amber-50/50 px-4 py-3 text-sm text-amber-900/80 dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-100/90">
            Думаю…
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {error && (
        <div className="border-t border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="flex gap-2 border-t border-amber-900/10 p-3 sm:p-4 dark:border-amber-500/10">
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
          className="min-w-0 flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-3 text-[15px] text-zinc-900 outline-none ring-amber-500/30 placeholder:text-zinc-400 focus:border-amber-500 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500"
          disabled={loading}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => void send()}
          disabled={loading || !input.trim()}
          className="shrink-0 rounded-xl bg-amber-600 px-5 py-3 text-[15px] font-medium text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-amber-600 dark:hover:bg-amber-500"
        >
          Отправить
        </button>
      </div>
    </div>
  );
}
