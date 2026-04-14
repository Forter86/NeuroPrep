import type { ChatMessage } from "@/types/chat";

export type ChatSession = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  /** Закреплённый чат выше остальных; при нескольких — выше тот, что закреплён позже */
  pinned: boolean;
  pinnedAt: string | null;
  /** Если пользователь переименовал — заголовок не перезаписывается из первого сообщения */
  titleManuallySet: boolean;
  messages: ChatMessage[];
};
