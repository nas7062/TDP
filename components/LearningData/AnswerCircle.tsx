"use client";

import Bubble from "./Bubble";

export default function AnswerCircle({
  correct,
  solved,
  wrong
}: {
  correct: number;
  solved: number;
  wrong: number;
}) {
  return (
    <div className="flex items-center justify-center ">
      <Bubble title="정답" value={correct} size={90} className="bg-blue-200 text-blue-700" />
      <Bubble
        title="문제 풀이 수"
        value={solved}
        size={120}
        className="bg-pink-200 text-pink-700"
      />
      <Bubble title="오답" value={wrong} size={90} className="bg-red-200 text-red-700" />
    </div>
  );
}
