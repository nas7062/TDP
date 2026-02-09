import { normalizeName } from "./NormalizeName";
import { scoreMatch } from "./ScoreMatch";

type HasMesh = { mesh: string };

export function findBestPart<T extends HasMesh>(
  items: readonly T[] | undefined,
  selectedName: string
): T | null {
  if (!items?.length) return null;

  const sel = normalizeName(selectedName);

  let best: T | null = null;
  let bestScore = 0;

  for (const p of items) {
    const key = normalizeName(p.mesh);
    const sc = scoreMatch(sel, key);
    if (sc > bestScore) {
      bestScore = sc;
      best = p;
    }
  }

  return bestScore > 0 ? best : null;
}
