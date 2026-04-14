/** Канонические пути API v1 — удобно импортировать во фронте и интеграциях. */
export const API_V1_BASE = "/api/v1";

export const API_V1 = {
  discovery: `${API_V1_BASE}`,
  chat: `${API_V1_BASE}/chat`,
  completions: `${API_V1_BASE}/completions`,
  health: `${API_V1_BASE}/health`,
  models: `${API_V1_BASE}/models`,
  config: `${API_V1_BASE}/config`,
  embeddings: `${API_V1_BASE}/embeddings`,
} as const;
