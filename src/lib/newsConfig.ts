export const DEFAULT_NEWS_MIN_IMPORTANCE_SCORE = 70

export function newsMinImportanceScore(value = process.env.NEWS_MIN_IMPORTANCE_SCORE) {
  return Math.max(0, Number(value ?? DEFAULT_NEWS_MIN_IMPORTANCE_SCORE) || DEFAULT_NEWS_MIN_IMPORTANCE_SCORE)
}

// Bir cron run'ida nechta eng yaxshi maqola ingest qilinadi (baza tez toʻlishi uchun).
export const DEFAULT_NEWS_MAX_PER_RUN = 3

export function newsMaxPerRun(value = process.env.NEWS_MAX_PER_RUN) {
  return Math.max(1, Math.min(10, Number(value ?? DEFAULT_NEWS_MAX_PER_RUN) || DEFAULT_NEWS_MAX_PER_RUN))
}
