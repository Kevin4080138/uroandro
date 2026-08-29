import { acogAdapter } from './adapters/acog'
import { auaAdapter } from './adapters/aua'
import { eauAdapter } from './adapters/eau'
import { europepmcAdapter } from './adapters/europepmc'
import { nichdAdapter } from './adapters/nichd'
import { niddkAdapter } from './adapters/niddk'
import { pubmedAdapter } from './adapters/pubmed'
import type { NewsSourceAdapter, SourceConfig } from './types'
import { isolateSourceFetch } from './isolation'

const exact = new Map<string, NewsSourceAdapter>([
  ['niddk-news', niddkAdapter], ['nichd-news', nichdAdapter], ['eau-news', eauAdapter],
  ['aua-news', auaAdapter], ['acog-news', acogAdapter],
])

export function sourceAdapter(config: SourceConfig) {
  if (config.source_key.startsWith('pubmed-') || config.source_type === 'pubmed') return pubmedAdapter
  if (config.source_key.startsWith('europepmc-')) return europepmcAdapter
  const adapter = exact.get(config.source_key)
  if (!adapter) throw new Error(`${config.name}: adapter registryda topilmadi`)
  return adapter
}

export async function fetchSourceSafely(config: SourceConfig) {
  return isolateSourceFetch(() => sourceAdapter(config).fetch(config))
}
