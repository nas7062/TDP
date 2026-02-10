import { QuizHistoryItem } from "@/types/api";

export default function QuizCard({ item, index }: { item: QuizHistoryItem; index: number }) {
  const selected = item.quizOptions.find((o) => o.optionIdx === item.selectedOptionIdx);
  const correct = item.quizOptions.find((o) => o.optionIdx === item.correctOptionIdx);

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-gray-900">Q{index}</p>

      <p className="mt-3 text-base font-medium text-gray-900">{item.quizContent}</p>

      <div className="mt-3 space-y-2">
        {item.quizOptions.map((o) => {
          const isSelected = o.optionIdx === item.selectedOptionIdx;
          const isCorrect = o.optionIdx === item.correctOptionIdx;

          return (
            <div
              key={o.optionIdx}
              className={[
                "rounded-lg border px-3 py-2 text-sm",
                isCorrect ? "border-green-300 bg-green-50" : "border-gray-200",
                isSelected && !isCorrect ? "border-red-300 bg-red-50" : ""
              ].join(" ")}
            >
              {o.optionContent}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span
          className={[
            "rounded-full px-3 py-1 text-xs font-semibold",
            item.isCorrect ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
          ].join(" ")}
        >
          {item.isCorrect ? "정답" : "오답"}
        </span>

        <span className="text-xs text-gray-500">선택: {selected?.optionContent ?? "-"}</span>
        <span className="text-xs text-gray-500">정답: {correct?.optionContent ?? "-"}</span>
        <span className="text-xs text-gray-400 ml-auto">{item.createdAt}</span>
      </div>

      {item.explanation && (
        <div className="mt-3 text-sm text-gray-600">
          <span className="font-semibold text-gray-700">해설</span>
          <p className="mt-1">{item.explanation}</p>
        </div>
      )}
    </div>
  );
}
