

export async function fetchCategory(): Promise<ICategory> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_URL}/proxy/model/category`,
    {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: 'force-cache'
    }
  );

  const body = await res.json().catch(() => null);
  if (res.ok) return body as ICategory;

  const error = new Error(`카테고리 조회 실패`);
  throw error;
}

export async function fetchCategoryInModel(categoryIdx: number): Promise<ICategory> {
  const res = await fetch(
    `/proxy/model/category/${categoryIdx}`,
    { method: "GET", headers: { Accept: "application/json" } }
  );

  const body = await res.json().catch(() => null);

  if (res.ok) return body as ICategory;

  const error = new Error('카테고리별 목록 조회 실패');
  throw error;
}


export async function fetchModelByIdx({ userIdx, modelIdx }: { userIdx: number, modelIdx: number }): Promise<IModelDetail> {
  const res = await fetch(`/proxy/model/${modelIdx}?userIdx=${userIdx}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  const body = await res.json().catch(() => null);

  if (res.ok) return body as IModelDetail;

  const error = new Error('카테고리별 목록 조회 실패');
  throw error;
}