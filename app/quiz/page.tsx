"use client";

import QuizModal from "@/components/QuizModal/QuizModal";
import { useRouter } from "next/navigation";
import { useState } from "react";

// 더미 페이지 추후 삭제 예정
export default function QuizPage() {
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(true);
  const router = useRouter();
  const onGoToQuiz = async () => {
    setIsQuizModalOpen(true);
  };

  const onLater = () => {
    setIsQuizModalOpen(false);
    router.push("/select");
  };
  return (
    <div>
      <button onClick={onGoToQuiz}>퀴즈 풀기</button>
      <QuizModal open={isQuizModalOpen} onOpenChange={setIsQuizModalOpen} onLater={onLater} />
    </div>
  );
}
