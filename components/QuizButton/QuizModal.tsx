"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import QuizModalStartContent from "./QuizModalStartContent";
import QuizModalMainContent from "./QuizModalMainContent";
import { useState } from "react";
import QuizModalResultContent from "./QuizModalResultContent";

type QuizModalProps = {
  view: QuizModalView;
  setView: (view: QuizModalView) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;

  /** "다음에 하기" 클릭 시 */
  onLater?: () => void;
};

export default function QuizModal({ view, setView, open, onOpenChange, onLater }: QuizModalProps) {
  const [quizResult, setQuizResult] = useState<QuizSubmitResponse | null>(null);
  const [moreQuizCount, setMoreQuizCount] = useState(0);

  const handleLater = () => {
    onOpenChange(false);
    onLater?.();
  };

  const handleGoToQuiz = () => {
    setView("main");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        showOverlay={true}
        className="left-1/2 top-1/2 min-w-[550px] w-[fit_content] -translate-x-1/2 -translate-y-1/2 gap-6 p-6"
      >
        {view === "start" && (
          <QuizModalStartContent onLaterClick={handleLater} onGoToQuizClick={handleGoToQuiz} />
        )}
        {view === "main" && (
          <QuizModalMainContent setQuizResult={setQuizResult} setView={setView} />
        )}
        {view === "result" && (
          <QuizModalResultContent
            quizResult={quizResult}
            setView={setView}
            moreQuizCount={moreQuizCount}
            setMoreQuizCount={setMoreQuizCount}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
