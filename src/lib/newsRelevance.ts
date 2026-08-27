import type { NormalizedNewsCandidate } from '@/lib/newsSources/types'

const SPECIALTY_KEYWORDS = [
  /\burolog(?:y|ic|ist)?\b/i,
  /\bandrolog(?:y|ic|ist)?\b/i,
  /\bgynecol(?:ogy|ogic|ogist)?\b|\bgynaecol(?:ogy|ogic|ogist)?\b/i,
  /\burogynecol(?:ogy|ogic)?\b/i,
  /\burinary\s+(?:tract|bladder|incontinence|retention|infection)\b/i,
  /\bkidney\s+(?:stone|cancer|tumou?r|disease|failure|transplant)\b/i,
  /\brenal\s+(?:stone|cancer|tumou?r|disease|failure|cell carcinoma|transplant)\b/i,
  /\bprostat(?:e|ic|itis)\b|\bBPH\b/i,
  /\bbladder\b|\burothelial\b|\bureter(?:al)?\b|\burethr(?:a|al)\b/i,
  /\btesti(?:s|cular)\b|\bpeni(?:s|le)\b|\berectile dysfunction\b/i,
  /\breproductive health\b|\binfertility\b|\bsperm\b|\bsemen\b/i,
  /\bpelvic floor\b|\bpelvic organ prolapse\b/i,
  /\bovarian\b|\buter(?:us|ine)\b|\bendometriosis\b|\bmenopause\b/i,
  /\bcervix\b|\buterine cervix\b|\bcervical\s+(?:cancer|carcinoma|screening)\b/i,
]

const FALSE_CERVICAL = /\bcervical\s+(?:dystonia|spine|myelopathy|radiculopathy)\b/i

export function urosferaRelevant(candidate: Pick<NormalizedNewsCandidate, 'title_original' | 'summary_original'>) {
  const text = `${candidate.title_original} ${candidate.summary_original}`
  if (FALSE_CERVICAL.test(text)) return false
  return SPECIALTY_KEYWORDS.some((pattern) => pattern.test(text))
}

export { SPECIALTY_KEYWORDS }
