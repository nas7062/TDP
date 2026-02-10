export function getLevelByGrade(grade: string): number {
  const map: Record<string, number> = {
    "입문 지망생": 1,
    테크니션: 2,
    매커닉: 3,
    "전문 기술자": 4,
    "수석 설계자": 5,
    "마스터 엔지니어": 6
  };
  return map[grade] ?? 1;
}
