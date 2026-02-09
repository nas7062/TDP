import { getLevelByGrade } from "./getLevelGrade";

export function getLevelBySolvedCount(solvedCount: number, grades: readonly GradeRule[]): number {
  // minSolved 내림차순
  const sorted = [...grades].sort((a, b) => b.minSolved - a.minSolved);

  const found = sorted.find(
    (g) => solvedCount >= g.minSolved && (g.maxSolved == null || solvedCount <= g.maxSolved)
  );

  if (!found) return 1;

  return getLevelByGrade(found.grade);
}
