import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { withUser } from "@/lib/api/guard";
import { badRequest, json } from "@/lib/api/response";

export const runtime = "nodejs";

const AttemptSchema = z.object({
  testId: z.string().min(1).max(191),
  correct: z.number().int().min(0),
  total: z.number().int().min(0),
  percent: z.number().int().min(0).max(100),
});

/** Последняя попытка по каждому тесту: { [testId]: { percent, correct, total, completedAt } } */
export async function GET() {
  return withUser(async (user) => {
    const rows = await prisma.testAttempt.findMany({
      where: { userId: user.id },
      orderBy: { completedAt: "desc" },
    });

    const latest: Record<string, { testId: string; correct: number; total: number; percent: number; completedAt: string }> = {};
    for (const row of rows) {
      if (latest[row.testId]) continue;
      latest[row.testId] = {
        testId: row.testId,
        correct: row.correct,
        total: row.total,
        percent: row.percent,
        completedAt: row.completedAt.toISOString(),
      };
    }
    return json({ attempts: latest });
  });
}

export async function POST(req: Request) {
  return withUser(async (user) => {
    let body: z.infer<typeof AttemptSchema>;
    try {
      body = AttemptSchema.parse(await req.json());
    } catch {
      return badRequest();
    }

    await prisma.testAttempt.create({
      data: {
        userId: user.id,
        testId: body.testId,
        correct: body.correct,
        total: body.total,
        percent: body.percent,
      },
    });
    return json({ ok: true });
  });
}
