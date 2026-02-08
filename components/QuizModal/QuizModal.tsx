"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import QuizModalStartContent from "./QuizModalStartContent";
import QuizModalMainContent from "./QuizModalMainContent";
import { useState, useEffect } from "react";
import QuizModalResultContent from "./QuizModalResultContent";

type QuizModalView = "start" | "loading" | "main" | "result";

const LOADING_DURATION_MS = 1500;

export type QuizModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 학습 기계 장비명 (예: 로봇팔) */
  equipmentName?: string;
  /** 공부 소요 시간 (예: 23분 23초) */
  studyTime?: string;
  /** "다음에 하기" 클릭 시 */
  onLater?: () => void;
};

export default function QuizModal({
  open,
  onOpenChange,
  equipmentName = "로봇팔",
  studyTime = "23분 23초",
  onLater
}: QuizModalProps) {
  const [view, setView] = useState<QuizModalView>("main");

  const handleLater = () => {
    onOpenChange(false);
    onLater?.();
  };

  const handleGoToQuiz = () => {
    setView("loading");
  };

  useEffect(() => {
    if (view !== "loading") return;
    const t = setTimeout(() => setView("main"), LOADING_DURATION_MS);
    return () => clearTimeout(t);
  }, [view]);

  useEffect(() => {
    if (!open) setView("start");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 gap-6 p-6"
      >
        {(view === "start" || view === "loading") && (
          <QuizModalStartContent
            equipmentName={equipmentName}
            studyTime={studyTime}
            isLoading={view === "loading"}
            onLaterClick={handleLater}
            onGoToQuizClick={handleGoToQuiz}
          />
        )}
        {view === "main" && <QuizModalMainContent />}
        {view === "result" && <QuizModalResultContent />}
      </DialogContent>
    </Dialog>
  );
}
