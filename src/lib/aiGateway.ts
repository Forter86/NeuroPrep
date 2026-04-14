import { NextResponse } from "next/server";
import { parseAssistantReply } from "@/lib/parseAssistantReply";
import type { ChatMessage, ChatRequestBody } from "@/types/chat";

type GatewayOptions = {
  endpointPath?: string;
};

function getApiConfig() {
  return {
    baseUrl: process.env.NEUROPREP_API_URL?.trim() ?? "",
    apiKey: process.env.NEUROPREP_API_KEY?.trim() ?? "",
    models: (process.env.NEUROPREP_MODELS ?? "demo-safety-tutor")
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean),
  };
}

function mockReply(userText: string): string {
  if (!userText.trim()) {
    return "Напиши, что тебя волнует по охране труда или на работе — как только смогу отвечать в полном режиме, разберём это спокойно и по шагам.";
  }
  return "Привет! Я пока не умею отвечать на вопросы, но очень скоро научусь — и вместе мы разберёмся со всеми твоими вопросами по ТБ.";
}

export function validateChatBody(body: unknown): { ok: true; value: ChatRequestBody } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Body должен быть JSON-объектом" };
  }
  const maybe = body as Record<string, unknown>;
  if (!Array.isArray(maybe.messages) || maybe.messages.length === 0) {
    return { ok: false, error: "Нужен непустой массив messages" };
  }
  const messages = maybe.messages as ChatMessage[];
  const hasInvalid = messages.some(
    (m) =>
      !m ||
      typeof m !== "object" ||
      !["user", "assistant", "system"].includes((m as ChatMessage).role) ||
      typeof (m as ChatMessage).content !== "string",
  );
  if (hasInvalid) {
    return { ok: false, error: "Каждый элемент messages должен содержать role и content" };
  }
  return { ok: true, value: { messages } };
}

function normalizeUpstreamUrl(baseUrl: string, endpointPath = ""): string {
  if (!endpointPath) return baseUrl;
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = endpointPath.startsWith("/") ? endpointPath : `/${endpointPath}`;
  return `${normalizedBase}${normalizedPath}`;
}

export async function handleChatRequest(req: Request, options?: GatewayOptions) {
  let parsedJson: unknown;
  try {
    parsedJson = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный JSON" }, { status: 400 });
  }

  const validated = validateChatBody(parsedJson);
  if (!validated.ok) {
    return NextResponse.json({ ok: false, error: validated.error }, { status: 400 });
  }

  const { messages } = validated.value;
  const { baseUrl, apiKey } = getApiConfig();
  const lastUser = [...messages].reverse().find((m) => m.role === "user");

  if (!baseUrl) {
    return NextResponse.json({
      ok: true,
      mode: "mock",
      reply: mockReply(lastUser?.content ?? ""),
    });
  }

  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

    const upstream = await fetch(normalizeUpstreamUrl(baseUrl, options?.endpointPath), {
      method: "POST",
      headers,
      body: JSON.stringify({ messages }),
    });

    const raw = await upstream.text();
    let data: unknown = null;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      return NextResponse.json(
        { ok: false, error: "Upstream вернул не JSON", detail: raw.slice(0, 500) },
        { status: 502 },
      );
    }

    if (!upstream.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: `Upstream ответил ${upstream.status}`,
          detail: typeof data === "object" && data ? data : raw.slice(0, 500),
        },
        { status: 502 },
      );
    }

    const reply = parseAssistantReply(data);
    return NextResponse.json({ ok: true, mode: "upstream", reply });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Ошибка запроса к upstream",
      },
      { status: 502 },
    );
  }
}

export type GatewayMeta = {
  configured: boolean;
  mode: "mock" | "upstream";
  models: string[];
};

export function getGatewayMeta(): GatewayMeta {
  const { baseUrl, models } = getApiConfig();
  return {
    configured: Boolean(baseUrl),
    mode: baseUrl ? "upstream" : "mock",
    models,
  };
}
