/** SSE 스트림 옵션: 첫 이벤트 roomId 수신 시 콜백, 이후 delta(data)마다 onChunk 호출 */
type SendChatStreamOptions = {
  onChunk: (chunk: string) => void;
  onRoomId?: (roomId: string) => void;
};

/**
 * POST + text/event-stream 스트림 수신.
 * API 스펙: 첫 이벤트 event=roomId(채팅방 식별자), 이후 event=delta·data=텍스트 청크.
 */
export async function sendChatStream(
  params: ChatRequest,
  { onChunk, onRoomId }: SendChatStreamOptions
): Promise<string> {
  const { userIdx, message, roomId, modelIdx } = params;

  const res = await fetch(`/api/chat-stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userIdx, message, roomId, modelIdx })
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const errMessage =
      body && typeof body === "object" && "message" in body
        ? (body as { message: string }).message
        : undefined;
    throw new Error(errMessage || "채팅 스트림 실패");
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error("스트림을 읽을 수 없습니다.");

  const decoder = new TextDecoder();
  let buffer = "";
  let fullMessage = "";
  let currentEvent = "";
  let currentData = "";

  const flushEvent = () => {
    if (currentEvent === "roomId" && currentData) {
      onRoomId?.(currentData.trim());
    }
    currentEvent = "";
    currentData = "";
  };

  const emitDelta = (chunk: string) => {
    if (!chunk) return;
    fullMessage += chunk;
    onChunk(chunk);
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // [역할] 줄바꿈(\n) 없이 도착한 청크 처리.
      // 백엔드가 "event:roomId", "data:안녕" 처럼 한 덩어리씩 보낼 때, \n으로 자를 수 없으므로
      // 버퍼 전체가 event:/data:/순수텍스트 중 하나로 보고 바로 파싱 후 onChunk/onRoomId 호출.
      if (!buffer.includes("\n")) {
        if (buffer.startsWith("event:")) {
          flushEvent();
          currentEvent = buffer.slice(6).trim();
          buffer = "";
        } else if (buffer.startsWith("data:")) {
          const chunk = buffer.slice(5);
          if (currentEvent === "delta") emitDelta(chunk);
          buffer = "";
        } else if (buffer.length > 0 && currentEvent === "delta") {
          emitDelta(buffer);
          buffer = "";
        }
        continue;
      }

      // [역할] 줄바꿈이 있는 청크 → SSE 라인 단위 파싱.
      // buffer를 \n으로 나눠 "완성된 줄"만 처리하고, 마지막 불완전 줄은 buffer에 남겨 다음 read와 합침.
      // event: → 이벤트 타입 저장, data: → 델타 조각으로 onChunk, 빈 줄 → 이벤트 끝(flush), 그 외 → 델타 연속 줄(줄바꿈 유지).
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (line.startsWith("event:")) {
          flushEvent();
          currentEvent = line.slice(6).trim();
        } else if (line.startsWith("data:")) {
          const part = line.slice(5);
          const chunk = currentData ? "\n" + part : part;
          currentData += chunk;
          if (currentEvent === "delta") emitDelta(chunk);
        } else if (line.trim() === "") {
          flushEvent();
        } else if (currentEvent === "delta") {
          const chunk = currentData ? "\n" + line : line;
          currentData += chunk;
          emitDelta(chunk);
        }
      }
    }

    flushEvent();

    // [역할] 스트림이 끝난 뒤 버퍼에 남은 내용 처리.
    // 마지막 read에서 \n 없이 끝나서 위 루프에서 처리되지 않은 "한 줄"을 여기서 event/data/연속줄로 처리 후 flush.
    if (buffer.trim()) {
      const line = buffer.trim();
      if (line.startsWith("event:")) {
        currentEvent = line.slice(6).trim();
        flushEvent();
      } else if (line.startsWith("data:")) {
        const chunk = currentData ? "\n" + line.slice(5) : line.slice(5);
        if (currentEvent === "delta") emitDelta(chunk);
        flushEvent();
      } else if (currentEvent === "delta") {
        emitDelta(currentData ? "\n" + line : line);
        flushEvent();
      }
    }
  } finally {
    reader.releaseLock();
  }

  return fullMessage;
}
