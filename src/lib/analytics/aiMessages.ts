import { CHAT_INTRO_MESSAGE } from "@/constants/chatIntro";
import { loadChatSessions } from "@/lib/chatSessionsStorage";

export function countAiMessages(): number {
  const sessions = loadChatSessions();
  if (!sessions) return 0;

  let count = 0;
  for (const session of sessions) {
    for (const message of session.messages) {
      if (message.role !== "assistant") continue;
      if (message.content === CHAT_INTRO_MESSAGE.content) continue;
      count += 1;
    }
  }
  return count;
}
