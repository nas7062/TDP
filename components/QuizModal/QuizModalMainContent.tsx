"use client";

import { useState } from "react";
import { DialogClose, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const PROGRESS_SEGMENTS = 3;

/** 나중에 API 응답 타입으로 교체 */
type QuizOption = { letter: string; text: string };

/** 더미 퀴즈 문항 (API 연동 시 제거) */
const DUMMY_QUESTIONS = [
  {
    question:
      "로봇 팔에서 인간의 '관절'과 같은 역할을 하며, 회전이나 직선 운동을 통해 움직임을 만들어내는 구성 요소는 무엇인가요?",
    options: [
      { letter: "A", text: "액추에이터 (Actuator)" },
      { letter: "B", text: "엔드 이펙터 (End Effector)" },
      { letter: "C", text: "컨트롤러 (Controller)" },
      { letter: "D", text: "링크 (Link)" }
    ] as QuizOption[]
  }
  // API 연동 시 추가 문항 확장
];

export default function QuizModalMainContent() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const totalQuestions = DUMMY_QUESTIONS.length;
  const currentStep = currentQuestionIndex + 1;
  const current = DUMMY_QUESTIONS[currentQuestionIndex];
  const questionNumber = currentQuestionIndex + 1;

  const handleNext = () => {
    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex((i) => i + 1);
      setSelectedIndex(null);
    }
    // 마지막 문항이면 나중에 API 제출/모달 닫기 등 처리
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 상단: 진행 바 + 닫기(X) */}
      <div className="flex items-start gap-2">
        <div className="flex flex-1 gap-1">
          {Array.from({ length: PROGRESS_SEGMENTS }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 flex-1 rounded-full transition-colors",
                i < currentStep ? "bg-blue-400" : "bg-gray-200"
              )}
            />
          ))}
        </div>
        <DialogClose
          className="rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="닫기"
        >
          <XIcon className="size-5" />
        </DialogClose>
      </div>

      {/* Q 번호 */}
      <DialogTitle className="text-center text-lg font-semibold text-foreground">
        Q{questionNumber}
      </DialogTitle>

      {/* 문제 문장 */}
      <p className="text-center text-base leading-relaxed text-foreground">{current.question}</p>

      {/* 선택지 2x2 그리드 */}
      <div className="grid grid-cols-2 gap-3">
        {current.options.map((opt, index) => (
          <button
            key={opt.letter}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className={cn(
              "flex items-center gap-2 rounded-lg border-2 px-4 py-3 text-left text-sm transition-colors",
              selectedIndex === index
                ? "border-blue-500 bg-blue-50 text-foreground"
                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
            )}
          >
            <span className="font-semibold text-foreground">{opt.letter}.</span>
            <span>{opt.text}</span>
          </button>
        ))}
      </div>

      {/* 다음 버튼 */}
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleNext}
          disabled={selectedIndex === null}
          className="min-w-[80px] bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          다음
        </Button>
      </div>
    </div>
  );
}
