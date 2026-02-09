export function normalizeName(s: string) {
  return s
    .toLowerCase()
    .replace(/[\s_-]+/g, "")
    .replace(/\d+/g, "");
}
