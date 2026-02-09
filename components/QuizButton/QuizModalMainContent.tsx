"use client";

import { useEffect, useState } from "react";
import { DialogClose, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";
import { getQuizList, submitQuiz } from "@/lib/api/quiz";
import { useSearchParams } from "next/navigation";

const LOADING_DURATION_MS = 700;

const optionIdxList = ["A", "B", "C", "D"];

export default function QuizModalMainContent({
  setQuizResult,
  setView
}: {
  setQuizResult: (result: QuizSubmitResponse) => void;
  setView: (view: QuizModalView) => void;
}) {
  const userIdx =
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") ?? "{}").idx : null;
  const searchParams = useSearchParams();
  const modelIdx = searchParams.get("modelIdx") ? parseInt(searchParams.get("modelIdx")!) : null;
  const [quizList, setQuizList] = useState<QuizContent[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [anwers, setAnswers] = useState<QuizAnswer[]>(new Array(quizList.length).fill(null));

  const totalQuestions = quizList.length;
  const current = quizList[currentQuestionIndex];

  useEffect(() => {
    if (!modelIdx) return;
    getQuizList({ modelIdx: Number(modelIdx) }).then((res) => {
      setQuizList(res.contents);
    });
  }, [modelIdx]);

  useEffect(() => {
    if (!isLoading) return;
    const t = setTimeout(() => setIsLoading(false), LOADING_DURATION_MS);
    return () => clearTimeout(t);
  }, [isLoading]);

  const handleNext = async () => {
    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex((i) => i + 1);
    }
    // 마지막 문항이면 API 제출/모달 닫기 등 처리
    if (currentQuestionIndex + 1 === totalQuestions) {
      const res = await submitQuiz({
        userIdx,
        modelIdx: Number(modelIdx),
        answers: anwers
      });
      setQuizResult(res);
      setView("result");
    }
  };

  useEffect(() => {
    console.log(anwers, "anwers");
  }, [anwers]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-4 text-center">
        <Spinner size="xl" className="my-4 mb-7" />
        <DialogTitle className="text-lg font-bold"> 좋아요!</DialogTitle>
        <p className="text-md font-medium mt-2">AI가 실시간으로 새로운 문제를 만들고 있습니다</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-[500px] ">
      <DialogClose
        className="rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 self-end"
        aria-label="닫기"
      >
        <XIcon className="size-5" />
      </DialogClose>

      {/* 상단: 진행 바 + 닫기(X) */}
      <div className="flex items-start gap-2">
        <div className="flex flex-1 gap-1">
          {Array.from({ length: quizList?.length ?? 0 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                i === currentQuestionIndex ? "bg-[#4BAEFE]" : "bg-gray-200"
              )}
            />
          ))}
        </div>
      </div>

      {/* Q 번호 */}
      <DialogTitle className="text-center text-lg font-semibold text-foreground">
        Q{currentQuestionIndex + 1}
      </DialogTitle>

      {/* 문제 문장 */}
      <p className="text-center text-base leading-relaxed text-foreground font-medium mb-3 w-[90%] mx-auto">
        {current?.quizContent}
      </p>

      {/* 선택지 2x2 그리드 */}
      <div className="grid grid-cols-2 gap-3 mb-2">
        {current?.quizOptions.map((opt, index) => (
          <button
            key={opt.optionIdx}
            type="button"
            onClick={() =>
              setAnswers((prev) => {
                const newAnswers = [...prev];
                newAnswers[currentQuestionIndex] = { quizIdx: current?.idx, answer: opt.optionIdx };
                return newAnswers;
              })
            }
            className={cn(
              "flex items-center gap-2 rounded-lg border-1 px-4 py-3 text-left text-sm transition-colors",
              anwers[currentQuestionIndex]?.answer === opt.optionIdx
                ? "border-gray-400 bg-gray-200 text-foreground"
                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
            )}
          >
            <span className="font-semibold text-foreground">{optionIdxList[index]}.</span>
            <span>{opt?.optionContent}</span>
          </button>
        ))}
      </div>

      {/* 다음 버튼 */}
      <div className="flex justify-end">
        <Button
          type="button"
          size="lg"
          onClick={handleNext}
          disabled={!anwers[currentQuestionIndex]?.answer}
          className="min-w-[80px] bg-[#4BAEFE] text-white hover:bg-[#4BAEFE]  disabled:opacity-50"
        >
          다음
        </Button>
      </div>
    </div>
  );
}
