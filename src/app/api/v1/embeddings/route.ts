import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      apiVersion: "1",
      code: "NOT_IMPLEMENTED",
      message:
        "Эмбеддинги появятся, когда будет подключён бэкенд. Контракт: POST JSON { input: string | string[] } → { ok, data?: number[][] }.",
    },
    { status: 501 },
  );
}
