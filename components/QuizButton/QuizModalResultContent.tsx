"use client";

import { DialogClose, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function QuizModalResultContent({
  quizResult,
  setView,
  moreQuizCount,
  setMoreQuizCount
}: {
  quizResult: QuizSubmitResponse | null;
  setView: (view: QuizModalView) => void;
  moreQuizCount: number;
  setMoreQuizCount: (count: number) => void;
}) {
  const { correctCount, totalCount, results } = quizResult ?? {
    correctCount: 0,
    totalCount: 0,
    result: []
  };
  const scorePercent = Math.round((correctCount / totalCount) * 100);
  const router = useRouter();

  const onClickMoreQuiz = () => {
    setView("main");
    setMoreQuizCount(moreQuizCount + 1);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 닫기(X) */}
      <div className="flex justify-end">
        <DialogClose
          className="rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="닫기"
        >
          <XIcon className="size-5" />
        </DialogClose>
      </div>

      {/* 헤더 */}
      <div className="text-center">
        {totalCount == correctCount ? (
          <DialogTitle className="text-xl font-bold text-foreground">
            완벽해요! 마스터하셨군요.
          </DialogTitle>
        ) : (
          <DialogTitle className="text-xl font-bold text-foreground">아쉬워요!</DialogTitle>
        )}

        <p className="mt-2 text-sm leading-relaxed text-foreground">
          {totalCount == correctCount ? (
            <>더 어려운 심화 문제를 생성해 드릴까요?</>
          ) : (
            <>
              AI가 틀린 문제의 핵심 개념만 쏙쏙 뽑아
              <br />
              문제를 다시 만들어 줄 수 있어요
            </>
          )}
        </p>
      </div>

      {/* 점수: 도넛 차트 + 정답/오답 */}
      <div className="flex items-center justify-center gap-6 my-2">
        <div className="relative size-24">
          <svg viewBox="0 0 36 36" className="size-full -rotate-90">
            <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="4" />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="4"
              strokeDasharray={`${(scorePercent / 100) * 100.5} ${100.5 - (scorePercent / 100) * 100.5}`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-blue-500">
            {scorePercent || 0}%
          </span>
        </div>
        <div className="flex flex-col gap-0.5 text-sm">
          <p className="font-medium text-blue-500">정답 {correctCount}</p>
          {!!(totalCount - correctCount) && (
            <p className="font-medium text-red-500">오답 {totalCount - correctCount}</p>
          )}
        </div>
      </div>

      {/* 오답 항목 */}
      <div>
        {!!(totalCount - correctCount) && (
          <h3 className="mb-3 text-sm font-medium text-gray-500">오답 항목</h3>
        )}
        <div className="flex flex-col gap-3 max-h-[30vh] overflow-y-auto">
          {results
            ?.map((item, index) =>
              !item.isCorrect ? (
                <div key={item.quizIdx} className="rounded-lg bg-[#F3F3F3] p-4">
                  <p className="mb-2 text-sm font-semibold text-foreground">Q{index + 1}</p>
                  <p className="mb-2 text-sm leading-relaxed text-foreground">{item.quizContent}</p>
                  <p className="mb-2 text-sm font-medium text-[#60a5fa]">
                    {item.correctOptionContent}
                  </p>
                  <p className="text-sm text-gray-600">{item.explanation}</p>
                </div>
              ) : null
            )
            .filter(Boolean)}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="flex self-center justify-center gap-3 mb-4">
        <Button
          type="button"
          size="lg"
          variant="secondary"
          className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
          onClick={() => router.push("/")}
        >
          홈으로 나가기
        </Button>
        {!moreQuizCount && (
          <Button
            onClick={onClickMoreQuiz}
            type="button"
            size="lg"
            className={`flex-1 bg-[#4BAEFE] text-white hover:bg-[#4BAEFE] ${totalCount == correctCount ? "min-w-[160px]" : "min-w-[200px]"}`}
          >
            {totalCount == correctCount ? "심화문제 더 풀러가기" : "오답과 비슷한 문제 더 풀러가기"}
          </Button>
        )}
      </div>
    </div>
  );
}
