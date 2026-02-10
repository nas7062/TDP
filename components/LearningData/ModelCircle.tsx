"use client";

export default function ModelCircle({
  label,
  correct,
  wrong
}: {
  label: string;
  correct: number;
  wrong: number;
}) {
  const total = correct + wrong;
  const correctRatio = total > 0 ? correct / total : 0;
  const deg = Math.round(correctRatio * 360);

  return (
    <div className="flex flex-col items-center gap-2 p-2">
      {/* 도넛 */}
      <div
        className="relative h-14 w-14 rounded-full"
        style={{
          background: `conic-gradient(#93C5FD 0deg ${deg}deg, #FCA5A5 ${deg}deg 360deg)`
        }}
      >
        <div className="absolute inset-1.75 rounded-full bg-gray-100" />
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold">
          <span className="text-red-400">오답</span>
          <span className="mx-1 text-gray-300">/</span>
          <span className="text-blue-500">정답</span>
        </div>
      </div>

      {/* 모델명 */}
      <p className="text-xs font-semibold text-gray-700">{label}</p>

      {/* 숫자 */}
      <div className="flex gap-2 text-[11px] text-gray-600">
        <span className="text-blue-600">정답 {correct}</span>
        <span className="text-red-500">오답 {wrong}</span>
      </div>
    </div>
  );
}
