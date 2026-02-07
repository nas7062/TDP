import { ReactNode } from "react";

/**
 * 정규식 특수문자 이스케이프
 */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * 텍스트에서 검색어(keyword)를 찾아 하이라이트된 React 노드 배열로 반환
 * @param text - 원본 텍스트
 * @param keyword - 하이라이트할 검색어
 * @param highlightClassName - 하이라이트 span에 적용할 클래스 (기본: 파란색)
 */
export function highlightKeyword(
  text: string,
  keyword: string,
  highlightClassName = "text-blue-400 font-medium"
): ReactNode[] {
  if (!text) return [];
  if (!keyword.trim()) return [text];

  const escaped = escapeRegExp(keyword);
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));

  return parts.map((part, i) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <span key={i} className={highlightClassName}>
        {part}
      </span>
    ) : (
      part
    )
  );
}
