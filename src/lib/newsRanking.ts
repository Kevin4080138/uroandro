import type { Audience, NormalizedNewsCandidate } from '@/lib/newsSources/types'

export function defaultAudience(type: NormalizedNewsCandidate['content_type']): Audience[] {
  if (type === 'research_summary' || type === 'event') return ['student', 'doctor']
  if (type === 'guideline_update' || type === 'clinical_review') return ['doctor']
  return ['student']
}
export function importanceHisobla(candidate: NormalizedNewsCandidate, referenceCount = 1) {
  const text = `${candidate.title_original} ${candidate.summary_original}`.toLowerCase()
  let score = 20
  const reasons: string[] = ['Yangi va mavzuga mos material']
  if (/guideline|recommendation|consensus|practice bulletin/.test(text)) { score += 35; reasons.push('Yangi yoki yangilangan klinik qo‘llanma') }
  if (/systematic review|meta-analysis|randomi[sz]ed|clinical trial/.test(text)) { score += 25; reasons.push('Yuqori dalil darajasidagi tadqiqot') }
  if (/diagnos|screen|treatment|therapy|surg|device|technology/.test(text)) { score += 15; reasons.push('Klinik amaliyotga bevosita aloqador') }
  if (/^pubmed-|^niddk-|^nichd-|^eau-|^aua-|^acog-/.test(candidate.source_key)) { score += 15; reasons.push('Rasmiy yoki indekslangan ishonchli manba') }
  if (referenceCount > 1) { score += Math.min(15, (referenceCount - 1) * 5); reasons.push('Bir nechta manbada yoritilgan') }
  if (!candidate.summary_original.trim()) { score -= 50; reasons.push('Ochiq annotatsiya mavjud emas') }
  if (/register now|buy tickets|sponsor|advertis/.test(text)) { score -= 40; reasons.push('Reklama yoki tadbir savdosi alomati') }
  return { score: Math.max(0, Math.min(100, score)), reasons }
}
