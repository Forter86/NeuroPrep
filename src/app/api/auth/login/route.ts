import { z } from "zod";
import { getAuthProvider } from "@/lib/auth/providers";
import { establishSession } from "@/lib/auth/session";
import { badRequest, json, serverError, unauthorized } from "@/lib/api/response";

export const runtime = "nodejs";

const LoginSchema = z.object({
  login: z.string().min(1).max(200),
  password: z.string().min(1).max(200),
});

export async function POST(req: Request) {
  let parsed: z.infer<typeof LoginSchema>;
  try {
    parsed = LoginSchema.parse(await req.json());
  } catch {
    return badRequest("Укажите логин и пароль");
  }

  try {
    const user = await getAuthProvider().authenticate(parsed.login, parsed.password);
    if (!user) {
      return unauthorized("Неверный логин или пароль");
    }

    await establishSession(user, req.headers.get("user-agent"));
    return json({ user });
  } catch (error) {
    console.error("[auth/login]", error);
    return serverError();
  }
}
