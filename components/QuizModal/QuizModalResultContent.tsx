"use client";

import { DialogClose, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

/** 나중에 API 응답 타입으로 교체 */
type IncorrectItem = {
  questionNumber: number;
  question: string;
  correctAnswer: string;
  explanation: string;
};

/** 더미 풀이 결과 (API 연동 시 제거) */
const DUMMY_RESULT = {
  correctCount: 2,
  incorrectCount: 1,
  scorePercent: 80,
  incorrectItems: [
    {
      questionNumber: 1,
      question:
        "로봇 팔에서 인간의 '관절'과 같은 역할을 하며, 회전이나 직선 운동을 통해 움직임을 만들어내는 구성 요소는 무엇인가요?",
      correctAnswer: "액추에이터 (Actuator)",
      explanation: "해설해설해설해설해설해설해설해설해설해설"
    }
  ] as IncorrectItem[]
};

export default function QuizModalResultContent() {
  const { correctCount, incorrectCount, scorePercent, incorrectItems } = DUMMY_RESULT;

  return (
    <div className="flex flex-col gap-6">
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
        <DialogTitle className="text-xl font-bold text-foreground">아쉬워요!</DialogTitle>
        <p className="mt-2 text-sm leading-relaxed text-foreground">
          AI가 틀린 문제의 핵심 개념만 쏙쏙 뽑아
          <br />
          문제를 다시 만들어 줄 수 있어요
        </p>
      </div>

      {/* 점수: 도넛 차트 + 정답/오답 */}
      <div className="flex items-center justify-center gap-6">
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
            {scorePercent}%
          </span>
        </div>
        <div className="flex flex-col gap-0.5 text-sm">
          <p className="font-medium text-blue-500">정답 {correctCount}</p>
          <p className="font-medium text-red-500">오답 {incorrectCount}</p>
        </div>
      </div>

      {/* 오답 항목 */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-gray-500">오답 항목</h3>
        <div className="flex flex-col gap-3">
          {incorrectItems.map((item) => (
            <div key={item.questionNumber} className="rounded-lg bg-gray-100 p-4">
              <p className="mb-2 text-sm font-semibold text-foreground">Q{item.questionNumber}</p>
              <p className="mb-2 text-sm leading-relaxed text-foreground">{item.question}</p>
              <p className="mb-2 text-sm font-medium text-blue-500">{item.correctAnswer}</p>
              <p className="text-sm text-gray-600">{item.explanation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="secondary"
          className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
        >
          홈으로 나가기
        </Button>
        <Button
          type="button"
          className="min-w-[180px] flex-1 bg-blue-500 text-white hover:bg-blue-600"
        >
          오답과 비슷한 문제 더 풀러가기
        </Button>
      </div>
    </div>
  );
}
