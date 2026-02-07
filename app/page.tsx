"use client";

import { createUser, fetchUser } from "@/lib/api/user";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [userId, setUserId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onSubmit = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      // 유저 조회
      const user = await fetchUser(userId);
      const userInfo = {
        userId: user.userId,
        idx: user.idx
      };
      localStorage.setItem("user", JSON.stringify(userInfo));
      router.replace("/select");
      return;
    } catch (error) {
      const code = (error as any)?.code;
      const status = (error as any)?.status;
      try {
        // 실패 시 유저 생성
        if (code === "CEC0007" || status === 400) {
          const user = await createUser(userId);
          const userInfo = {
            userId: user.userId,
            idx: user.idx
          };
          localStorage.setItem("user", JSON.stringify(userInfo));
          router.replace("/select");
          return;
        }
        throw error;
      } catch (err) {
        setError(err instanceof Error ? err.message : "error 발생");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[url('/images/Background.png')] bg-cover bg-center h-screen w-screen flex flex-col justify-center gap-4 mt-[-64px]">
      <div className="flex flex-col justify-around w-[467px] h-[292px] mx-auto mt-[60px]">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-6xl font-bold text-black">
            <Image
              src="/images/logo.png"
              alt="SIMVEX"
              width={230}
              height={86}
              className="inline-block"
            />
          </h1>
          <h2 className="text-2xl mt-2 font-semibold text-black">공학 학습의 새로운 기준</h2>
        </div>
        <strong className="text-lg font-medium text-center leading-relaxed">
          교과서 그림만으로는 이해하기 어려운 복잡한 기계 구조,
          <br />
          이제 3D로 돌려보고 분해하며 배우세요.
        </strong>
      </div>

      <div className="bg-[#F3F3F3] shadow-lg w-[476px] h-[261px] mx-auto rounded-lg">
        <div className="p-12 flex flex-col justify-between h-full">
          <div className="flex w-full flex-col gap-2">
            <label htmlFor="userid" className="font-medium">
              닉네임을 입력해주세요
            </label>
            <input
              id="userid"
              type="text"
              placeholder="닉네임"
              className="w-full bg-white px-4 py-2 rounded-lg"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>

          <div className="mt-auto flex flex-col gap-3">
            <button
              onClick={onSubmit}
              disabled={!userId || loading}
              className="w-full bg-gray-800 text-gray-200 py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "조회 중..." : "접속하기"}
            </button>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
