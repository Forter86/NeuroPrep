/** Разбор ответа бэкенда — подстрой под реальный контракт, когда API будет готов. */
export function parseAssistantReply(data: unknown): string {
  if (!data || typeof data !== "object") {
    throw new Error("Пустой ответ API");
  }
  const o = data as Record<string, unknown>;

  if (typeof o.reply === "string") return o.reply;
  if (typeof o.response === "string") return o.response;
  if (typeof o.text === "string") return o.text;

  const msg = o.message;
  if (msg && typeof msg === "object") {
    const c = (msg as Record<string, unknown>).content;
    if (typeof c === "string") return c;
  }

  const choices = o.choices;
  if (Array.isArray(choices) && choices[0] && typeof choices[0] === "object") {
    const m = (choices[0] as Record<string, unknown>).message;
    if (m && typeof m === "object") {
      const c = (m as Record<string, unknown>).content;
      if (typeof c === "string") return c;
    }
  }

  throw new Error(
    "Неизвестный формат ответа. Ожидались поля reply, response, text, message.content или choices[0].message.content.",
  );
}
