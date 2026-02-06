

export async function fetchCategory(): Promise<ICategory> {
  const res = await fetch(
    `${process.env.API_BASE_URL}/model/category}`,
    { method: "GET", headers: { Accept: "application/json" }, next: { revalidate: 60 } }
  );

  const body = await res.json().catch(() => null);

  if (res.ok) return body as ICategory;

  const error = new Error(`카테고리 조회 실패`);
  throw error;
}

export async function fetchCategoryInModel(categoryIdx: number): Promise<ICategory> {
  const res = await fetch(
    `${process.env.API_BASE_URL}/model/category/${categoryIdx}`,
    { method: "GET", headers: { Accept: "application/json" } }
  );

  const body = await res.json().catch(() => null);

  if (res.ok) return body as ICategory;

  const error = new Error('카테고리별 목록 조회 실패');
  throw error;
}