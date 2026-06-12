import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { withUser } from "@/lib/api/guard";
import { badRequest, json } from "@/lib/api/response";

export const runtime = "nodejs";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
});

const SessionSchema = z.object({
  id: z.string().min(1).max(191),
  title: z.string().max(255),
  createdAt: z.string(),
  updatedAt: z.string(),
  pinned: z.boolean(),
  pinnedAt: z.string().nullable(),
  titleManuallySet: z.boolean(),
  messages: z.array(MessageSchema),
});

const PutSchema = z.object({ sessions: z.array(SessionSchema).max(500) });

function toDate(value: string | null, fallback: Date): Date {
  if (!value) return fallback;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? fallback : d;
}

export async function GET() {
  return withUser(async (user) => {
    const sessions = await prisma.chatSession.findMany({
      where: { userId: user.id },
      include: { messages: { orderBy: { position: "asc" } } },
      orderBy: { updatedAt: "desc" },
    });

    return json({
      sessions: sessions.map((s) => ({
        id: s.id,
        title: s.title,
        createdAt: s.createdAt.toISOString(),
        updatedAt: s.updatedAt.toISOString(),
        pinned: s.pinned,
        pinnedAt: s.pinnedAt ? s.pinnedAt.toISOString() : null,
        titleManuallySet: s.titleManuallySet,
        messages: s.messages.map((m) => ({ role: m.role, content: m.content })),
      })),
    });
  });
}

export async function PUT(req: Request) {
  return withUser(async (user) => {
    let body: z.infer<typeof PutSchema>;
    try {
      body = PutSchema.parse(await req.json());
    } catch {
      return badRequest();
    }

    const now = new Date();

    await prisma.$transaction(async (tx) => {
      await tx.chatSession.deleteMany({ where: { userId: user.id } });

      for (const s of body.sessions) {
        await tx.chatSession.create({
          data: {
            id: s.id,
            userId: user.id,
            title: s.title.slice(0, 255),
            pinned: s.pinned,
            pinnedAt: s.pinnedAt ? toDate(s.pinnedAt, now) : null,
            titleManuallySet: s.titleManuallySet,
            createdAt: toDate(s.createdAt, now),
            updatedAt: toDate(s.updatedAt, now),
            messages: {
              create: s.messages.map((m, index) => ({
                role: m.role,
                content: m.content,
                position: index,
              })),
            },
          },
        });
      }
    });

    return json({ ok: true });
  });
}
