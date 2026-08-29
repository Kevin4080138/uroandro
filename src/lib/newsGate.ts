import { newsMinConfidence, newsAutoMaxTrustTier } from './newsConfig'

export type AvtoTasdiqQaror = { publish: boolean; reasons: string[] }

// Bosqichli avto-tasdiq qoidasi: material odam koʻrigisiz nashr boʻlishi uchun
// barcha shart bajarilishi kerak. Aks holda draft navbatiga (admin koʻrigi) tushadi.
export function avtoTasdiqQarori(input: {
  confidence: number; trustTier: number; safetyIssues: string[]; autoSite: boolean; testMode: boolean
}): AvtoTasdiqQaror {
  const reasons: string[] = []
  if (input.testMode) reasons.push('test rejimi')
  if (!input.autoSite) reasons.push('avto-nashr oʻchirilgan (NEWS_AUTO_SITE_PUBLISH)')
  const minConf = newsMinConfidence()
  if (input.confidence < minConf) reasons.push(`ishonch ${input.confidence} < ${minConf}`)
  const maxTier = newsAutoMaxTrustTier()
  if (input.trustTier > maxTier) reasons.push(`manba darajasi ${input.trustTier} > ${maxTier}`)
  if (input.safetyIssues.length) reasons.push(`xavfsizlik: ${input.safetyIssues.join('; ')}`)
  return { publish: reasons.length === 0, reasons: reasons.length ? reasons : ['barcha shartlar bajarildi'] }
}
