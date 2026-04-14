import { getGatewayMeta } from "@/lib/aiGateway";
import type { V1DiscoveryResponse, V1EndpointDescriptor } from "@/types/apiV1";

const ENDPOINTS: V1EndpointDescriptor[] = [
  {
    id: "discovery",
    method: "GET",
    path: "/api/v1",
    summary: "Список эндпоинтов v1 и состояние шлюза",
  },
  {
    id: "chat",
    method: "POST",
    path: "/api/v1/chat",
    summary: "Диалог: тело { messages } → { ok, reply?, mode?, error? }",
  },
  {
    id: "completions",
    method: "POST",
    path: "/api/v1/completions",
    summary: "То же, что chat, но upstream с суффиксом /completions (OpenAI-совместимые провайдеры)",
  },
  {
    id: "health",
    method: "GET",
    path: "/api/v1/health",
    summary: "Проверка шлюза и режима (mock / upstream)",
  },
  {
    id: "models",
    method: "GET",
    path: "/api/v1/models",
    summary: "Список имён моделей из NEUROPREP_MODELS (без запроса к upstream)",
  },
  {
    id: "config",
    method: "GET",
    path: "/api/v1/config",
    summary: "Публичные подсказки для клиента (без секретов)",
  },
  {
    id: "embeddings",
    method: "POST",
    path: "/api/v1/embeddings",
    summary: "Зарезервировано под векторизацию текста (пока 501)",
  },
];

export function buildV1Discovery(): V1DiscoveryResponse {
  const gateway = getGatewayMeta();
  return {
    ok: true,
    apiVersion: "1",
    gateway,
    endpoints: ENDPOINTS,
    requestExample: {
      chat: {
        body: {
          messages: [{ role: "user", content: "Пример вопроса по СИЗ на объекте" }],
        },
      },
    },
    responseShape: {
      success: { ok: true, mode: "mock", reply: "Текст ответа ассистента" },
      error: { ok: false, error: "Описание ошибки", detail: "опционально" },
    },
  };
}

export function buildV1Config() {
  const gateway = getGatewayMeta();
  return {
    ok: true,
    apiVersion: "1",
    gateway,
    clientHints: {
      chatPath: "/api/v1/chat",
      maxMessagesRecommended: 50,
    },
    features: {
      streaming: false,
      serverSessions: false,
      upstreamConfigured: gateway.configured,
    },
  };
}
