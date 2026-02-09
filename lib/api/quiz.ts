import { QuizHistoryResponse, UserQuizMeResponse } from "@/types/api";

export async function fetchUserQuizMe(userIdx: number) {
  const res = await fetch(`/proxy/user/${userIdx}/me`, {
    method: "GET",
    headers: {
      Accept: "application/json"
    },
    cache: "no-store"
  });

  const body = (await res.json()) as UserQuizMeResponse;
  if (res.ok && body) return body;
  const msg =
    (body as any)?.message || (body as any)?.error || `퀴즈 통계 조회 실패 (${res.status})`;
  throw new Error(msg);
}

export async function fetchModelQuizHistory(params: {
  modelIdx: number;
  userIdx: number;
  page?: number;
  size?: number;
}) {
  const { modelIdx, userIdx, page = 0, size = 3 } = params;

  const qs = new URLSearchParams({
    userIdx: String(userIdx),
    page: String(page),
    size: String(size)
  });

  const res = await fetch(`/proxy/model/${modelIdx}/quiz/history?${qs.toString()}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store"
  });

  const body = (await res.json()) as QuizHistoryResponse;
  if (res.ok && body) return body;

  const msg =
    (body as any)?.message || (body as any)?.error || `퀴즈 이력 조회 실패 (${res.status})`;
  throw new Error(msg);
}
