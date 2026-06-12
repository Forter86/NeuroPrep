import { prisma } from "@/lib/db/prisma";
import { withUser } from "@/lib/api/guard";
import { json } from "@/lib/api/response";
import { CHAT_INTRO_MESSAGE } from "@/constants/chatIntro";

export const runtime = "nodejs";

function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

export async function GET() {
  return withUser(async (user) => {
    const [tests, scenarios, sessionTime, aiMessages] = await Promise.all([
      prisma.testAttempt.findMany({
        where: { userId: user.id },
        orderBy: { completedAt: "desc" },
      }),
      prisma.scenarioAttempt.findMany({
        where: { userId: user.id },
        orderBy: { completedAt: "desc" },
      }),
      prisma.userSessionTime.findUnique({ where: { userId: user.id } }),
      prisma.chatMessage.count({
        where: {
          role: "assistant",
          content: { not: CHAT_INTRO_MESSAGE.content },
          session: { userId: user.id },
        },
      }),
    ]);

    // Темы — группировка попыток тестов по testId
    const byTest = new Map<string, typeof tests>();
    for (const row of tests) {
      const arr = byTest.get(row.testId) ?? [];
      arr.push(row);
      byTest.set(row.testId, arr);
    }
    const topics = [...byTest.entries()].map(([refId, rows]) => ({
      refId,
      latestPercent: rows[0]!.percent,
      bestPercent: Math.max(...rows.map((r) => r.percent)),
      attempts: rows.length,
    }));

    const history = [
      ...tests.map((r) => ({
        id: r.id,
        kind: "test" as const,
        refId: r.testId,
        percent: r.percent,
        completedAt: r.completedAt.toISOString(),
      })),
      ...scenarios.map((r) => ({
        id: r.id,
        kind: "scenario" as const,
        refId: r.scenarioId,
        percent: r.percent,
        completedAt: r.completedAt.toISOString(),
      })),
    ].sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

    return json({
      activeSeconds: sessionTime?.activeSeconds ?? 0,
      completedTests: tests.length,
      completedScenarios: scenarios.length,
      aiMessages,
      averageTestScore: avg(topics.map((t) => t.latestPercent)),
      successRate: avg([...tests, ...scenarios].map((r) => r.percent)),
      topics,
      history,
    });
  });
}
