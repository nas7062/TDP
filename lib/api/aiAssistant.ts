export async function getChatList({
  userIdx,
  modelIdx
}: ChatListRequest): Promise<ChatListResponse> {
  const res = await fetch(`/proxy/api/v1/ai/chat?userIdx=${userIdx}&modelIdx=${modelIdx}`, {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  });

  const body = await res.json().catch(() => null);

  if (res.ok) {
    return body as ChatListResponse;
  }

  const errMessage =
    body && typeof body === "object" && "message" in body
      ? (body as { message: string }).message
      : undefined;
  throw new Error(errMessage || "채팅 목록 조회 실패");
}

export async function sendChat({
  userIdx,
  message,
  roomId,
  modelIdx
}: ChatRequest): Promise<ChatResponse> {
  const res = await fetch(`/proxy/api/v1/ai/chat`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userIdx, message, roomId, modelIdx })
  });

  const body = await res.json().catch(() => null);
  if (res.ok) {
    return body as ChatResponse;
  }

  const errMessage =
    body && typeof body === "object" && "message" in body
      ? (body as { message: string }).message
      : undefined;
  throw new Error(errMessage || "채팅 전송 실패");
}

/** SSE 스트림 옵션: 첫 이벤트 roomId 수신 시 콜백, 이후 delta(data)마다 onChunk 호출 */
export type SendChatStreamOptions = {
  onChunk: (chunk: string) => void;
  onRoomId?: (roomId: string) => void;
};

/**
 * EventSource API로 백엔드 SSE 스트림 직접 수신.
 * /proxy → 백엔드 스트림 엔드포인트. GET 쿼리로 파라미터 전달.
 * API 스펙: event=roomId(채팅방 식별자), event=delta(텍스트 청크).
 */
export function sendChatStream(
  params: ChatRequest,
  { onChunk, onRoomId }: SendChatStreamOptions
): Promise<string> {
  const { userIdx, message, roomId, modelIdx } = params;
  const searchParams = new URLSearchParams({
    userIdx: String(userIdx),
    modelIdx: String(modelIdx),
    message: message,
    ...(roomId != null && roomId !== "" && { roomId })
  });
  const url = `/api/chat-stream?${searchParams.toString()}`;
  // const url = `/proxy/api/v1/ai/chat/stream?${searchParams.toString()}`;

  return new Promise((resolve, reject) => {
    let fullMessage = "";
    const es = new EventSource(url);

    es.addEventListener("roomId", (e) => {
      const data = (e as MessageEvent).data?.trim();
      if (data) onRoomId?.(data);
    });

    es.addEventListener("delta", (e) => {
      const chunk = ((e as MessageEvent).data ?? "").trim();
      if (chunk) {
        fullMessage += chunk;
        onChunk(chunk);
      }
    });

    es.onerror = () => {
      es.close();
      if (fullMessage) resolve(fullMessage);
      else reject(new Error("스트림 연결이 끊어졌습니다."));
    };
  });
}

export async function searchChat({
  userIdx,
  keyword,
  modelIdx
}: ChatSearchRequest): Promise<ChatListResponse> {
  const res = await fetch(`/proxy/api/v1/ai/chat/search`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ modelIdx, userIdx, keyword })
  });

  const body = await res.json().catch(() => null);
  if (res.ok) return body as ChatListResponse;

  const errMessage =
    body && typeof body === "object" && "message" in body
      ? (body as { message: string }).message
      : undefined;
  throw new Error(errMessage || "채팅 검색 실패");
}

export async function deleteChat({ roomId }: ChatDeleteRequest): Promise<void> {
  const res = await fetch(`/proxy/api/v1/ai/chat?roomId=${roomId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json"
    }
  });

  const body = await res.json().catch(() => null);
  if (res.ok) return;

  const errMessage =
    body && typeof body === "object" && "message" in body
      ? (body as { message: string }).message
      : undefined;
  throw new Error(errMessage || "채팅 삭제 실패");
}
