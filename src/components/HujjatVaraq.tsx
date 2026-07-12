'use client'

import type { HujjatBlok } from '@/lib/shablonlar'

// Hujjat bloklarini varaq ko'rinishida chizadi; print rejimida kompakt — bitta A4 ga sig'sin
export function HujjatVaraq({ bloklar, print }: { bloklar: HujjatBlok[]; chop?: boolean; print?: boolean }) {
  const fs = print ? '10.5px' : '13.5px'
  const lh = print ? 1.28 : 1.6
  const pm = print ? '2px' : '4px'   // paragraf orasidagi masofa
  return (
    <div style={{
      background: print ? 'white' : 'var(--surface)', color: print ? '#000' : 'var(--ink)',
      border: print ? 'none' : '1px solid var(--line)', borderRadius: print ? 0 : '12px',
      padding: print ? 0 : '28px 32px', fontSize: fs, lineHeight: lh,
      maxWidth: 'none', margin: 0,
      fontFamily: print ? "'Times New Roman', Georgia, serif" : 'inherit',
    }}>
      {bloklar.map((b, i) => {
        if (b.tur === 'bosh') return <div key={i} style={{ height: print ? '8px' : '12px' }} />
        if (b.tur === 'sarlavha') return <h3 key={i} style={{ fontSize: print ? '12px' : '14px', fontWeight: 700, margin: print ? '8px 0 3px' : '12px 0 5px' }}>{b.matn}</h3>
        if (b.tur === 'matn') return <p key={i} style={{ margin: `0 0 ${pm}`, whiteSpace: 'pre-wrap', textAlign: 'justify' }}>{b.matn}</p>
        if (b.tur === 'band') return (
          <p key={i} style={{ margin: `0 0 ${pm}`, textAlign: 'justify', textIndent: print ? '1.2em' : 0 }}>
            <strong>{b.etiket}:</strong>{b.matn ? ' ' + b.matn : ''}
          </p>
        )
        if (b.tur === 'royxat') return <ul key={i} style={{ margin: `0 0 ${pm}`, paddingLeft: '24px' }}>{b.bandlar.map((x, j) => <li key={j} style={{ marginBottom: print ? '1px' : '2px' }}>{x}</li>)}</ul>
        if (b.tur === 'imzo') return (
          <div key={i} style={{ display: 'flex', justifyContent: 'flex-end', gap: '40px', padding: print ? '3px 0' : '6px 0' }}>
            <strong>{b.chap}:</strong>
            <span style={{ minWidth: '150px' }}>{b.ong}</span>
          </div>
        )
        // qator (label: value)
        return (
          <div key={i} style={{ display: 'flex', gap: '10px', padding: print ? '1px 0' : '2px 0' }}>
            <span style={{ color: print ? '#000' : 'var(--muted)', minWidth: '150px', flexShrink: 0 }}>{b.chap}:</span>
            <span style={{ fontWeight: 500 }}>{b.ong}</span>
          </div>
        )
      })}
    </div>
  )
}
