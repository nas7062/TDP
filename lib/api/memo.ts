export async function getMemoList({
  userIdx,
  modelIdx
}: MemoListRequest): Promise<MemoListResponse> {
  const res = await fetch(`/proxy/model/${modelIdx}/user/${userIdx}/memo`, {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  });

  const body = await res.json().catch(() => null);

  if (res.ok) {
    return body as MemoListResponse;
  }

  const errMessage =
    body && typeof body === "object" && "message" in body
      ? (body as { message: string }).message
      : undefined;
  throw new Error(errMessage || "메모 목록 조회 실패");
}

export async function makeMemo({ userIdx, memo, modelIdx }: MemoRequest): Promise<MemoResponse> {
  const res = await fetch(`/proxy/model/${modelIdx}/user/${userIdx}/memo`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ memo })
  });

  const body = await res.json().catch(() => null);
  if (res.ok) {
    return body as MemoResponse;
  }

  const errMessage =
    body && typeof body === "object" && "message" in body
      ? (body as { message: string }).message
      : undefined;
  throw new Error(errMessage || "메모 생성 실패");
}

export async function updateMemo({
  userIdx,
  memo,
  modelIdx,
  memoIdx
}: MemoUpdateRequest): Promise<void> {
  const res = await fetch(`/proxy/model/${modelIdx}/user/${userIdx}/memo/${memoIdx}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ memo })
  });

  const body = await res.json().catch(() => null);
  if (res.ok) return;

  const errMessage =
    body && typeof body === "object" && "message" in body
      ? (body as { message: string }).message
      : undefined;
  throw new Error(errMessage || "메모 생성 실패");
}

export async function deleteMemo({ userIdx, modelIdx, memoIdx }: MemoDeleteRequest): Promise<void> {
  const res = await fetch(`/proxy/model/${modelIdx}/user/${userIdx}/memo/${memoIdx}`, {
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
  throw new Error(errMessage || "메모 삭제 실패");
}

export async function searchMemo({
  userIdx,
  keyword,
  modelIdx
}: MemoSearchRequest): Promise<MemoSearchResponse> {
  const res = await fetch(`/proxy/model/${modelIdx}/user/${userIdx}/memo/search`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ keyword })
  });

  const body = await res.json().catch(() => null);
  if (res.ok) return body as MemoSearchResponse;

  const errMessage =
    body && typeof body === "object" && "message" in body
      ? (body as { message: string }).message
      : undefined;
  throw new Error(errMessage || "메모 검색 실패");
}
