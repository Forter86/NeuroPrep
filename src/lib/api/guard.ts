import { requireUser, UnauthorizedError } from "@/lib/auth/server";
import { serverError, unauthorized } from "@/lib/api/response";
import type { AuthUser } from "@/lib/auth/types";

/** Оборачивает обработчик: проверяет пользователя, ловит ошибки. */
export async function withUser(fn: (user: AuthUser) => Promise<Response>): Promise<Response> {
  try {
    const user = await requireUser();
    return await fn(user);
  } catch (error) {
    if (error instanceof UnauthorizedError) return unauthorized();
    console.error("[api]", error);
    return serverError();
  }
}
