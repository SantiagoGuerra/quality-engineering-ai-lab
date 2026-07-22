export function averageScore(scores: readonly number[]): number | null {
  if (scores.length === 0) return null;
  const sum = scores.reduce((total, score) => total + score, 0);
  return Math.round((sum / scores.length) * 100) / 100;
}
