"use client";

import { DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export type QuizModalStartContentProps = {
  /** 학습 기계 장비명 (예: 로봇팔) */
  equipmentName?: string;
  /** 공부 소요 시간 (예: 23분 23초) */
  studyTime?: string;
  /** 로딩 중 여부 (AI 퀴즈 생성 중) */
  isLoading?: boolean;
  /** "다음에 하기" 클릭 시 */
  onLaterClick?: () => void;
  /** "AI가 생성한 퀴즈 풀러가기" 클릭 시 */
  onGoToQuizClick?: () => void;
};

export default function QuizModalStartContent({
  equipmentName = "로봇팔",
  studyTime = "23분 23초",
  isLoading = false,
  onLaterClick,
  onGoToQuizClick
}: QuizModalStartContentProps) {
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
    <>
      <DialogHeader className="gap-4 text-center">
        <DialogTitle className="text-xl font-bold">학습을 끝내시겠습니까?</DialogTitle>
        <div className="flex flex-col gap-1.5 text-center text-sm text-foreground">
          <p>학습 기계 장비 : {equipmentName}</p>
          <p>공부 소요 시간: {studyTime}</p>
        </div>
      </DialogHeader>
      <DialogFooter className="flex-row justify-center gap-3 sm:justify-center">
        <Button
          type="button"
          variant="secondary"
          className="min-w-[120px] bg-gray-200 text-gray-800 hover:bg-gray-300"
          onClick={onLaterClick}
        >
          다음에 하기
        </Button>
        <Button
          type="button"
          className="min-w-[180px] bg-blue-500 text-white hover:bg-blue-600"
          onClick={onGoToQuizClick}
        >
          AI가 생성한 퀴즈 풀러가기
        </Button>
      </DialogFooter>
    </>
  );
}
