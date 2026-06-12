import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { withUser } from "@/lib/api/guard";
import { badRequest, json } from "@/lib/api/response";

export const runtime = "nodejs";

const AttemptSchema = z.object({
  scenarioId: z.string().min(1).max(191),
  correct: z.number().int().min(0),
  total: z.number().int().min(0),
  percent: z.number().int().min(0).max(100),
});

export async function POST(req: Request) {
  return withUser(async (user) => {
    let body: z.infer<typeof AttemptSchema>;
    try {
      body = AttemptSchema.parse(await req.json());
    } catch {
      return badRequest();
    }

    await prisma.scenarioAttempt.create({
      data: {
        userId: user.id,
        scenarioId: body.scenarioId,
        correct: body.correct,
        total: body.total,
        percent: body.percent,
      },
    });
    return json({ ok: true });
  });
}
