"use client";

import { fetchModelQuizHistory } from "@/lib/api/quiz";
import { QuizHistoryResponse } from "@/types/api";
import { useEffect, useMemo, useState } from "react";
import QuizCard from "./QuizCard";
import Pagination from "./Pagenation";
import { MODEL_NAME_BY_IDX } from "@/constant";

type Props = {
  userIdx: number;
  modelIdxList: number[];
  modelNameMap?: Record<number, string>;
};

export default function QuizHistoryPanel({ userIdx, modelIdxList }: Props) {
  const models = useMemo(() => {
    const uniq = Array.from(new Set(modelIdxList))
      .filter((x) => Number.isFinite(x) && x > 0)
      .sort((a, b) => a - b);
    return uniq;
  }, [modelIdxList]);

  const [modelIdx, setModelIdx] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [size] = useState(3);

  const [resp, setResp] = useState<QuizHistoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // 모델 바꾸면 1페이지로
  useEffect(() => {
    setPage(0);
  }, [modelIdx]);

  useEffect(() => {
    // models가 준비되면 첫 모델로 세팅
    if (models.length > 0) setModelIdx(models[0]);
    else setModelIdx(null);
  }, [models]);

  useEffect(() => {
    if (!modelIdx) return; // modelIdx 없으면 호출 금지
    setLoading(true);
    setErr(null);

    fetchModelQuizHistory({ modelIdx, userIdx, page, size })
      .then(setResp)
      .catch((e) => {
        console.error(e);
        setErr(e?.message ?? "조회 실패");
        setResp(null);
      })
      .finally(() => setLoading(false));
  }, [modelIdx, userIdx, page, size]);

  return (
    <div className="w-4xl mx-auto mt-6">
      {/* 모델 선택 */}
      <div className="flex items-center justify-end">
        <select
          value={modelIdx ?? ""}
          onChange={(e) => setModelIdx(Number(e.target.value))}
          className="rounded-lg border bg-white px-3 py-2 text-sm"
        >
          {models.map((m) => (
            <option key={m} value={m}>
              {MODEL_NAME_BY_IDX[m]}
            </option>
          ))}
        </select>
      </div>

      {/* 본문 */}
      <div className="mt-4 space-y-4">
        {loading ? (
          <div className="rounded-xl bg-white p-6 text-sm text-gray-500">불러오는 중...</div>
        ) : err ? (
          <div className="rounded-xl bg-white p-6 text-sm text-red-600">{err}</div>
        ) : !resp || resp.contents.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center text-sm text-gray-500">
            퀴즈 이력이 없습니다.
          </div>
        ) : (
          resp.contents.map((item, i) => (
            <QuizCard
              key={`${item.quizIdx}-${item.createdAt}`}
              item={item}
              index={page * size + i + 1}
            />
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {resp && resp.totalCount > 0 && (
        <Pagination
          page={page}
          totalCount={resp.totalCount}
          size={size}
          onChange={setPage}
          modelNameMap={{
            7: "드론(Drone)",
            8: "산업용 로봇 암",
            9: "4기통 엔진 구동계",
            10: "기어 구동 로봇 그리퍼"
          }}
        />
      )}
    </div>
  );
}
