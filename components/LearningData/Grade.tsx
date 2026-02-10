import { formatRange } from "./formatRange";
import { getLevelByGrade } from "./getLevelGrade";

export function Grade({
  grades,
  currentGrade,
  CHIP_LEVEL_CONFIG
}: {
  grades: GradeRule[];
  currentGrade: string;
  CHIP_LEVEL_CONFIG: Record<number, { label: string; className: string }>;
}) {
  const rows = grades.slice().sort((a, b) => b.minSolved - a.minSolved);

  return (
    <div className="w-80 py-2">
      {/* 헤더 */}
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900">등급 안내</p>
      </div>

      {/* 테이블 헤더 */}
      <div className="grid grid-cols-[100px_90px_72px] items-center rounded-md bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600">
        <span>등급</span>
        <span className="text-center">문제 수</span>
        <span className="text-center">명예</span>
      </div>

      {/* 테이블 바디 */}
      <div className="mt-1 divide-y divide-gray-100 rounded-md border bg-white">
        {rows.map((g) => {
          const gradeKey = (g.grade ?? "").trim();
          const chip = CHIP_LEVEL_CONFIG[gradeKey];
          const active = g.grade === currentGrade;

          return (
            <div
              key={g.grade}
              className={[
                "grid grid-cols-[1fr_100px_1fr] items-center px-3 py-2",
                active ? "bg-blue-50" : "bg-white"
              ].join(" ")}
            >
              <span className="text-sm font-medium text-gray-900">{g.grade}</span>
              <span className="text-center text-sm text-gray-600">{formatRange(g)}</span>
              <div className="flex justify-center w-24">
                <span
                  className={[
                    "rounded-full px-2 py-0.5 text-xs font-semibold",
                    chip?.className ?? "bg-gray-100 text-gray-500"
                  ].join(" ")}
                >
                  {chip?.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
