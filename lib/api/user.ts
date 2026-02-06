type UserResponse = {
  idx: number;
  userId: string;
};
type ErrorResponse = {
  status: number;
  code: string;
  message: string;
}


export async function fetchUser(userId: string): Promise<UserResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/${encodeURIComponent(userId)}`,
    { method: "GET", headers: { Accept: "application/json" } }
  );

  const body = await res.json().catch(() => null);

  if (res.ok) return body as UserResponse;

  const err = body as ErrorResponse;
  const error = new Error(err.message || `유저 조회 실패`);
  (error as any).code = err.code; // cec005 코드 반환
  throw error;
}

export async function createUser(userId: string): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });
  if (res.ok) return;

  const body = await res.json().catch(() => null);
  throw new Error(body?.message || `유저 생성 실패`);
}