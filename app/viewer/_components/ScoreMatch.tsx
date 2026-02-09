export function scoreMatch(selected: string, key: string) {
  if (selected === key) return 1000;
  if (selected.startsWith(key)) return 600 + key.length;
  if (selected.includes(key)) return 300 + key.length;
  return 0;
}
