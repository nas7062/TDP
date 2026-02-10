
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
export async function getQuizList({
  count = 3,
  modelIdx
}: QuizListRequest): Promise<QuizListResponse> {
  const res = await fetch(`/proxy/model/${modelIdx}/quiz?count=${count}`, {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  });

  const body = await res.json().catch(() => null);

  if (res.ok) {
    return body as QuizListResponse;
  }

  const errMessage =
    body && typeof body === "object" && "message" in body
      ? (body as { message: string }).message
      : undefined;
  throw new Error(errMessage || "문제 목록 조회 실패");
}

export async function submitQuiz({
  userIdx,
  modelIdx,
  answers
}: QuizSubmitRequest): Promise<QuizSubmitResponse> {
  const res = await fetch(`/proxy/model/${modelIdx}/quiz/submit`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userIdx, answers })
  });

  const body = await res.json().catch(() => null);

  if (res.ok) {
    return body as QuizSubmitResponse;
  }

  const errMessage =
    body && typeof body === "object" && "message" in body
      ? (body as { message: string }).message
      : undefined;
  throw new Error(errMessage || "문제 제출 실패");
}
