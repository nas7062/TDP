/**
 * 랜덤 UUID v4 생성 (브라우저/Node 환경 공통)
 * crypto.randomUUID() 사용 — 별도 라이브러리 불필요
 */
export function randomUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // 폴리필: crypto.randomUUID 미지원 환경용
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
