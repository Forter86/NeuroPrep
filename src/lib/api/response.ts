import { NextResponse } from "next/server";

export function json<T>(data: T, init?: number | ResponseInit) {
  return NextResponse.json(data, typeof init === "number" ? { status: init } : init);
}

export function unauthorized(message = "Не авторизован") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function badRequest(message = "Некорректный запрос") {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function serverError(message = "Внутренняя ошибка") {
  return NextResponse.json({ error: message }, { status: 500 });
}
