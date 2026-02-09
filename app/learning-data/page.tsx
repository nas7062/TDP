"use client";

import AnswerCircle from "@/components/LearningData/AnswerCircle";
import { Grade } from "@/components/LearningData/Grade";
import ModelCircle from "@/components/LearningData/ModelCircle";
import Popover from "@/components/LearningData/Popover";
import { StepProgressBar } from "@/components/LearningData/StepProgressBar";
import { CHIP_LEVEL_CONFIG, FALLBACK_GRADES } from "@/constant";
import { fetchUserQuizMe } from "@/lib/api/quiz";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function LearningDataPage() {
  const [user, setUser] = useState<IUser | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);

  const [data, setData] = useState<UserQuizMeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") ?? "{}");
    setUser(u);

    if (!u?.idx) {
      setLoading(false);
      setErr("유저 정보가 없습니다.");
      return;
    }

    setLoading(true);
    setErr(null);

    fetchUserQuizMe(u.idx)
      .then((res) => setData(res))
      .catch((e) => {
        console.error(e);
        setErr(e?.message ?? "데이터 조회 실패");
        setData(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-screen min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-500">불러오는 중...</p>
      </div>
    );
  }

  if (err) {
    return (
      <div className="w-screen min-h-screen flex items-center justify-center">
        <p className="text-sm text-red-600">{err}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-screen min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-500">데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-[url('/images/BlueBackground.png')] bg-[length:100%_50%] bg-no-repeat bg-top mt-[-64px] w-screen min-h-screen">
      <div className="flex flex-col gap-3">
        {/* 상단 */}
        <div className="w-4xl mx-auto flex flex-col gap-4 pt-28">
          <h2 className="text-center text-2xl font-semibold">나의 학습 데이터</h2>

          <div className="text-center leading-tight flex flex-col gap-4 mt-10">
            <h3 className="text-center text-2xl font-semibold">{user?.userId}님</h3>

            <h3 className="text-center text-2xl font-semibold">
              {data.problemsToNextGrade > 0 ? (
                <>
                  {data.problemsToNextGrade}문제만 더 풀면{" "}
                  <span className="text-2xl font-semibold text-blue-400">{data.nextGrade}</span>{" "}
                  등급 달성!
                </>
              ) : (
                <>
                  다음 등급 조건을 이미 달성했습니다.{" "}
                  <span className="text-2xl font-semibold text-blue-400">{data.nextGrade}</span>
                </>
              )}
            </h3>

            <div className="flex justify-center items-center">
              <div className="flex border rounded-2xl overflow-hidden">
                {["학습데이터", "퀴즈 문제"].map((cate, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedTab(idx)}
                    className={`px-10 py-2 transition-colors duration-300 cursor-pointer rounded-2xl 
                      ${selectedTab === idx ? "bg-black text-white" : "bg-transparent text-black"}`}
                  >
                    {cate}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 등급 카드 */}
        <div className="bg-gray-100 w-4xl mx-auto p-4 rounded-lg flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <p className="font-semibold">등급 달성률</p>

            <Popover
              trigger={
                <Image
                  src="/icons/Info.svg"
                  alt="등급안내 아이콘"
                  width={20}
                  height={20}
                  className="cursor-pointer"
                />
              }
            >
              <Grade
                grades={FALLBACK_GRADES}
                currentGrade={data.currentGrade}
                CHIP_LEVEL_CONFIG={CHIP_LEVEL_CONFIG}
              />
            </Popover>
          </div>

          <p className="text-center">
            {data.problemsToNextGrade > 0
              ? `${data.problemsToNextGrade}문제 남았어요. 힘내보세요!`
              : "다음 등급 조건을 달성했습니다."}
          </p>

          <StepProgressBar
            steps={[
              "입문 지망생",
              "테크니션",
              "매커닉",
              "전문 기술자",
              "수석 설계자",
              "마스터 엔지니어"
            ]}
            solvedCount={data.totalSolved}
          />
        </div>

        {/* 분석 섹션 */}
        <div className="w-4xl mx-auto grid grid-cols-1 gap-4 md:grid-cols-[1fr_360px]">
          <div className="rounded-xl bg-gray-100 p-4">
            <p className="mb-3 text-sm font-semibold text-gray-700">종합 분석 결과</p>

            <div className="flex flex-wrap items-center justify-start gap-6">
              {data.modelStats?.length ? (
                data.modelStats.map((m) => (
                  <ModelCircle
                    key={m.modelIdx}
                    label={`Model ${m.modelIdx}`}
                    correct={m.correct}
                    wrong={m.wrong}
                  />
                ))
              ) : (
                <div className="text-sm text-gray-500 w-full text-center py-10">
                  분석 결과가 없습니다.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl bg-gray-100 p-4">
            <p className="mb-3 text-sm font-semibold text-gray-700">정답과 오답</p>
            <AnswerCircle
              correct={data.totalCorrect}
              solved={data.totalSolved}
              wrong={data.totalWrong}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
