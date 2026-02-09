

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


// 모델 정보 캐시 (메모리 기반, 페이지 새로고침 시 초기화)
const modelCache = new Map<string, IModelDetail>();

export async function fetchModelByIdx({ userIdx, modelIdx }: { userIdx: number, modelIdx: number }): Promise<IModelDetail> {
  const cacheKey = `${userIdx}-${modelIdx}`;
  
  // 캐시 확인
  if (modelCache.has(cacheKey)) {
    return modelCache.get(cacheKey)!;
  }

  const res = await fetch(`/proxy/model/${modelIdx}?userIdx=${userIdx}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  const body = await res.json().catch(() => null);

  if (res.ok) {
    const model = body as IModelDetail;
    modelCache.set(cacheKey, model);
    return model;
  }

  const error = new Error('카테고리별 목록 조회 실패');
  throw error;
}