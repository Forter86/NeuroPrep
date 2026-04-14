import type { GatewayMeta } from "@/lib/aiGateway";
import type { ChatRequestBody } from "@/types/chat";

export type V1EndpointDescriptor = {
  id: string;
  method: "GET" | "POST";
  path: string;
  summary: string;
};

export type V1GatewayMeta = GatewayMeta;

export type V1DiscoveryResponse = {
  ok: true;
  apiVersion: string;
  gateway: V1GatewayMeta;
  endpoints: V1EndpointDescriptor[];
  /** Пример тела запроса чата (валидный ChatRequestBody). */
  requestExample: { chat: { body: ChatRequestBody } };
  /** Описание полей ответа чата. */
  responseShape: {
    success: { ok: true; mode: "mock" | "upstream"; reply: string };
    error: { ok: false; error: string; detail?: string };
  };
};
