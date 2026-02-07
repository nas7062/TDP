/**
 * 디바운스: 마지막 호출 후 ms 경과 시에만 fn 실행
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: unknown, ...args: Parameters<T>) {
    if (timeoutId !== null) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = null;
      fn.apply(this, args);
    }, ms);
  };
}
