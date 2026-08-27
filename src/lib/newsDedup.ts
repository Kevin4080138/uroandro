import { createHash } from 'node:crypto'
import type { NormalizedNewsCandidate } from '@/lib/newsSources/types'

export function canonicalUrl(value: string) {
  const url = new URL(value); url.hash = ''
  for (const key of [...url.searchParams.keys()]) if (/^(utm_|fbclid|gclid)/i.test(key)) url.searchParams.delete(key)
  url.hostname = url.hostname.toLowerCase().replace(/^www\./, '')
  url.pathname = url.pathname.replace(/\/+$/, '') || '/'
  return url.toString()
}
export function normalizedTitle(value: string) { return value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim() }
export function candidateHash(candidate: NormalizedNewsCandidate) {
  const doi = String(candidate.metadata.doi ?? '').toLowerCase().trim(), pmid = String(candidate.metadata.pmid ?? '').trim()
  return createHash('sha256').update(doi ? `doi:${doi}` : pmid ? `pmid:${pmid}` : `url:${canonicalUrl(candidate.canonical_url)}`).digest('hex')
}
export function titleSimilarity(a: string, b: string) {
  const left = new Set(normalizedTitle(a).split(' ').filter((x) => x.length > 2)), right = new Set(normalizedTitle(b).split(' ').filter((x) => x.length > 2))
  if (!left.size || !right.size) return 0
  return [...left].filter((x) => right.has(x)).length / Math.max(left.size, right.size)
}
