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
