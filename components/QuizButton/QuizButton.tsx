"use client";
import { useState } from "react";
import QuizModal from "./QuizModal";
import { useRouter } from "next/navigation";

export default function QuizButton() {
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [view, setView] = useState<QuizModalView>("main");
  const router = useRouter();

  const onGoToEnd = () => {
    setIsQuizModalOpen(true);
    setView("start");
  };

  const onGoToQuiz = () => {
    setIsQuizModalOpen(true);
    setView("main");
  };

  const onLater = () => {
    setIsQuizModalOpen(false);
    router.push("/select");
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onGoToEnd}
        className="px-4 py-1 bg-[#222222] text-white font-semibold text-[13px] rounded-lg "
      >
        학습 종료
      </button>
      <button
        onClick={onGoToQuiz}
        className="px-4 py-1 bg-[#0077EA] text-white font-semibold text-[13px] rounded-lg "
      >
        퀴즈풀기
      </button>
      <QuizModal
        view={view}
        setView={setView}
        open={isQuizModalOpen}
        onOpenChange={setIsQuizModalOpen}
        onLater={onLater}
      />
    </div>
  );
}
