export function normalizeName(s: string) {
  return s
    .toLowerCase()
    .replace(/([._-])\d+$/g, "")
    .replace(/[\s_.-]+/g, "");
}
