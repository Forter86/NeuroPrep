import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { withUser } from "@/lib/api/guard";
import { badRequest, json } from "@/lib/api/response";

export const runtime = "nodejs";

const AddTimeSchema = z.object({
  seconds: z.number().int().min(1).max(3600),
});

export async function POST(req: Request) {
  return withUser(async (user) => {
    let body: z.infer<typeof AddTimeSchema>;
    try {
      body = AddTimeSchema.parse(await req.json());
    } catch {
      return badRequest();
    }

    await prisma.userSessionTime.upsert({
      where: { userId: user.id },
      update: { activeSeconds: { increment: body.seconds } },
      create: { userId: user.id, activeSeconds: body.seconds },
    });
    return json({ ok: true });
  });
}
