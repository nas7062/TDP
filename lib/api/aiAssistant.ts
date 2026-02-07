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

// TODO: 안에 내용이랑 파람 다 수정 필요
export async function searchChat({
  userIdx,
  keyword,
  modelIdx
}: MemoSearchRequest): Promise<ChatListResponse> {
  const res = await fetch(`/proxy/model/${modelIdx}/user/${userIdx}/memo/search`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ keyword })
  });

  const body = await res.json().catch(() => null);
  if (res.ok) return body as ChatListResponse;

  const errMessage =
    body && typeof body === "object" && "message" in body
      ? (body as { message: string }).message
      : undefined;
  throw new Error(errMessage || "메모 생성 실패");
}
