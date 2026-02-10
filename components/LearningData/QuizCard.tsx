import { QuizHistoryItem, QuizHistoryOption } from "@/types/api";
import { formatKST } from "./FormatKST";

function normalizeOptions(item: QuizHistoryItem): QuizHistoryOption[] {
  const opts: any = (item as any).quizOptions ?? [];

  if (Array.isArray(opts) && (opts.length === 0 || typeof opts[0] === "string")) {
    return (opts as string[]).map((text, idx) => ({
      optionIdx: idx,
      optionContent: text
    }));
  }
  if (Array.isArray(opts)) {
    return (opts as any[]).map((o) => ({
      optionIdx: Number(o.optionIdx),
      optionContent: String(o.optionContent ?? "")
    }));
  }

  return [];
}

export default function QuizCard({ item, index }: { item: QuizHistoryItem; index: number }) {
  const options = normalizeOptions(item);
  const selected = options.find((o) => o.optionIdx === (item as any).selectedOptionIdx);
  const correct = options.find((o) => o.optionIdx === (item as any).correctOptionIdx);

  const selectedText = selected?.optionContent ?? (item as any).selectedOptionContent ?? "-";
  const correctText = correct?.optionContent ?? (item as any).correctOptionContent ?? "-";

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-gray-900">Q{index}</p>

      <p className="mt-3 text-base font-medium text-gray-900">{(item as any).quizContent}</p>

      <div className="mt-3 space-y-2">
        {options.map((o) => {
          const isSelected = o.optionIdx === (item as any).selectedOptionIdx;
          const isCorrect = o.optionIdx === (item as any).correctOptionIdx;

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
            (item as any).isCorrect ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
          ].join(" ")}
        >
          {(item as any).isCorrect ? "정답" : "오답"}
        </span>

        <span className="text-xs text-gray-500">선택: {selectedText}</span>
        <span className="text-xs text-gray-500">정답: {correctText}</span>
        <span className="text-xs text-gray-400 ml-auto">{formatKST((item as any).createdAt)}</span>
      </div>

      {(item as any).explanation && (
        <div className="mt-3 text-sm text-gray-600">
          <span className="font-semibold text-gray-700">해설</span>
          <p className="mt-1">{(item as any).explanation}</p>
        </div>
      )}
    </div>
  );
}
