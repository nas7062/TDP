import { NextRequest } from "next/server";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/** POST: fetch 요청 -> 백엔드 스트림 엔드포인트로 요청 후 그대로 반환 */
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!baseUrl) {
    return new Response(JSON.stringify({ message: "API URL not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  const response = await fetch(`${baseUrl}/api/v1/ai/chat/stream`, {
    method: "POST",
    headers: {
      Accept: "text/event-stream",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.body) {
    return new Response(JSON.stringify({ message: "No response body" }), {
      status: 502,
      headers: { "Content-Type": "application/json" }
    });
  }

  // 래핑 스트림: 백엔드 조기 종료 시에도 한 번만 close 해서 ERR_INCOMPLETE_CHUNKED_ENC 방지
  let closed = false;
  const stream = new ReadableStream({
    async start(controller) {
      const reader = response.body!.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
      } catch {
        // other side closed 등 — 이미 보낸 데이터까지만 전달
      } finally {
        reader.releaseLock();
        if (!closed) {
          closed = true;
          controller.close();
        }
      }
    },
    cancel() {
      closed = true;
    }
  });

  return new Response(stream, {
    status: response.status,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    }
  });
}
