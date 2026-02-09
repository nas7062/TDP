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
