export function formatRange(g: GradeRule) {
  if (g.maxSolved == null) return `${g.minSolved}개 이상`;
  // 0~15 같은 케이스는 "15개 이하"로 표기하고 싶으면 아래처럼 처리
  if (g.minSolved === 0) return `${g.maxSolved}개 이하`;
  return `${g.minSolved}~${g.maxSolved}개`;
}
