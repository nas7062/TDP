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
