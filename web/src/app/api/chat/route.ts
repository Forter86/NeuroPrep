import { NextResponse } from "next/server";
import type { ChatRequestBody } from "@/types/chat";
import { parseAssistantReply } from "@/lib/parseAssistantReply";

export const runtime = "nodejs";

function mockReply(userText: string): string {
  const trimmed = userText.trim();
  if (!trimmed) {
    return "Напиши вопрос по охране труду или технике безопасности — подскажу, на что обратить внимание.";
  }
  return [
    "Пока подключён демо-режим: бэкенд с нейросетью не задан (переменная NEUROPREP_API_URL в Vercel пустая).",
    "",
    `Твой вопрос: «${trimmed.slice(0, 200)}${trimmed.length > 200 ? "…" : ""}»`,
    "",
    "Когда коллега даст URL API, добавь его в Environment Variables на Vercel и задеплой снова — ответы пойдут с сервера.",
  ].join("\n");
}

export async function POST(req: Request) {
  let body: ChatRequestBody;
  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 });
  }

  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "Нужен массив messages" }, { status: 400 });
  }

  const apiUrl = process.env.NEUROPREP_API_URL?.trim();
  const apiKey = process.env.NEUROPREP_API_KEY?.trim();

  if (!apiUrl) {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const text = lastUser?.content ?? "";
    return NextResponse.json({ reply: mockReply(text) });
  }

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (apiKey) {
      headers.Authorization = `Bearer ${apiKey}`;
    }

    const upstream = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ messages }),
    });

    const raw = await upstream.text();
    let data: unknown;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      return NextResponse.json(
        {
          error: "Бэкенд вернул не JSON",
          detail: raw.slice(0, 500),
        },
        { status: 502 },
      );
    }

    if (!upstream.ok) {
      return NextResponse.json(
        {
          error: `Бэкенд ответил ${upstream.status}`,
          detail: typeof data === "object" && data ? data : raw.slice(0, 500),
        },
        { status: 502 },
      );
    }

    const reply = parseAssistantReply(data);
    return NextResponse.json({ reply });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Ошибка запроса к API";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
