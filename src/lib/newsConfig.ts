export const DEFAULT_NEWS_MIN_IMPORTANCE_SCORE = 70

export function newsMinImportanceScore(value = process.env.NEWS_MIN_IMPORTANCE_SCORE) {
  return Math.max(0, Number(value ?? DEFAULT_NEWS_MIN_IMPORTANCE_SCORE) || DEFAULT_NEWS_MIN_IMPORTANCE_SCORE)
}
