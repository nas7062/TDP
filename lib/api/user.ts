
type ErrorResponse = {
  status: number;
  code: string;
  message: string;
};

export async function fetchUser(userId: string): Promise<IUser> {
  const res = await fetch(`/proxy/user/${encodeURIComponent(userId)}`, {
    method: "GET",
    headers: { Accept: "application/json" }
  });

  const body = await res.json().catch(() => null);
  if (res.ok) return body as IUser;

  const err = body as ErrorResponse;
  const error = new Error(err.message || `유저 조회 실패`);
  (error as any).code = err.code; // cec005 코드 반환
  (error as any).status = err.status;
  throw error;
}

export async function createUser(userId: string): Promise<IUser> {
  const res = await fetch(`/proxy/user`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userId })
  });
  const body = await res.json().catch(() => null);
  if (res.ok) return body as IUser;

  throw new Error(body?.message || `유저 생성 실패`);
}



