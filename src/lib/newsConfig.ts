export const DEFAULT_NEWS_MIN_IMPORTANCE_SCORE = 70

export function newsMinImportanceScore(value = process.env.NEWS_MIN_IMPORTANCE_SCORE) {
  return Math.max(0, Number(value ?? DEFAULT_NEWS_MIN_IMPORTANCE_SCORE) || DEFAULT_NEWS_MIN_IMPORTANCE_SCORE)
}

// Bir cron run'ida nechta eng yaxshi maqola ingest qilinadi (baza tez toʻlishi uchun).
export const DEFAULT_NEWS_MAX_PER_RUN = 3

export function newsMaxPerRun(value = process.env.NEWS_MAX_PER_RUN) {
  return Math.max(1, Math.min(10, Number(value ?? DEFAULT_NEWS_MAX_PER_RUN) || DEFAULT_NEWS_MAX_PER_RUN))
}

// Avto-tasdiq darvozasi (Bosqich 3): shu chegaralardan oʻtgan material odam koʻrigisiz nashr boʻladi.
export const DEFAULT_NEWS_MIN_CONFIDENCE = 60

export function newsMinConfidence(value = process.env.NEWS_MIN_CONFIDENCE) {
  return Math.max(0, Math.min(100, Number(value ?? DEFAULT_NEWS_MIN_CONFIDENCE) || DEFAULT_NEWS_MIN_CONFIDENCE))
}

export const DEFAULT_NEWS_AUTO_MAX_TRUST_TIER = 1

export function newsAutoMaxTrustTier(value = process.env.NEWS_AUTO_MAX_TRUST_TIER) {
  return Math.max(1, Math.min(3, Number(value ?? DEFAULT_NEWS_AUTO_MAX_TRUST_TIER) || DEFAULT_NEWS_AUTO_MAX_TRUST_TIER))
}
