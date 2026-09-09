'use client'

import type { ReactNode } from 'react'

// Barcha kalkulyatorlar uchun yagona 5-qismli klinik izoh standarti.
// 1-qism (Natija) har sahifaning o'z natija blokida ko'rsatiladi; bu komponent
// qolgan qismlarni beradi: nimani anglatadi / anglatmaydi / keyingi qadam /
// klinik misol + ko'p uchraydigan xato.

export type KlinikIzohMalumot = {
  anglatadi: ReactNode
  anglatmaydi: ReactNode[]
  keyingiQadam: ReactNode[]
  misol?: { vaziyat: ReactNode; javob: ReactNode }
  kopXato?: ReactNode[]
}

// Natija chegaraga yaqin bo'lganda ko'rsatiladigan belgi.
export function ChegaraviyBelgi({ matn }: { matn?: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '12px', fontWeight: 700, color: 'var(--warn)', background: 'color-mix(in srgb, var(--warn) 14%, transparent)', border: '1px solid var(--warn)', borderRadius: '999px', padding: '3px 10px' }}>
      ⚠ {matn ?? 'Chegaraviy natija — talqinda ehtiyot bo‘ling'}
    </span>
  )
}

function Bolim({ nishon, sarlavha, rang, children }: { nishon: string; sarlavha: string; rang: string; children: ReactNode }) {
  return (
    <div style={{ marginTop: '16px' }}>
      <div style={{ fontSize: '12px', fontWeight: 800, color: rang, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '7px', display: 'flex', alignItems: 'center', gap: '7px' }}>
        <span style={{ fontSize: '14px' }}>{nishon}</span> {sarlavha}
      </div>
      {children}
    </div>
  )
}

function Royxat({ satrlar, rang, raqamli }: { satrlar: ReactNode[]; rang: string; raqamli?: boolean }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {satrlar.map((s, i) => (
        <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          {raqamli
            ? <span style={{ flexShrink: 0, width: '19px', height: '19px', borderRadius: '50%', background: `color-mix(in srgb, ${rang} 16%, transparent)`, color: rang, fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px' }}>{i + 1}</span>
            : <span style={{ flexShrink: 0, width: '6px', height: '6px', borderRadius: '50%', background: rang, marginTop: '8px' }} />}
          <span>{s}</span>
        </li>
      ))}
    </ul>
  )
}

// Manba metadatasi: oxirgi tibbiy tekshiruv sanasi, mas'ul muharrir va
// (kerak bo'lsa) litsenziya holati. Har bir kalkulyator ostida ko'rsatiladi.
export function ManbaMeta({ litsenziya, tekshirilgan = '2026-09', muharrir = 'Urosfera tibbiy guruh' }: { litsenziya?: string; tekshirilgan?: string; muharrir?: string }) {
  return (
    <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px dashed var(--line)', fontSize: '11.5px', color: 'var(--muted)', lineHeight: 1.6 }}>
      <div>Oxirgi tibbiy tekshiruv: <strong>{tekshirilgan}</strong> · Mas'ul muharrir: {muharrir}</div>
      {litsenziya && (
        <div style={{ marginTop: '5px', display: 'flex', gap: '6px', color: 'var(--warn)' }}>
          <span>⚖️</span><span><strong>Litsenziya:</strong> {litsenziya}</span>
        </div>
      )}
    </div>
  )
}

export function KlinikIzoh({ data, rang = 'var(--accent)' }: { data: KlinikIzohMalumot; rang?: string }) {
  return (
    <section className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px 22px', marginTop: '16px' }}>
      <Bolim nishon="🧭" sarlavha="Bu nimani anglatadi?" rang={rang}>
        <p style={{ margin: 0, fontSize: '14.5px', color: 'var(--ink)', lineHeight: 1.7, borderLeft: `3px solid ${rang}`, paddingLeft: '14px' }}>{data.anglatadi}</p>
      </Bolim>

      <Bolim nishon="🚫" sarlavha="Bu nimani anglatmaydi?" rang="var(--danger)">
        <Royxat satrlar={data.anglatmaydi} rang="var(--danger)" />
      </Bolim>

      <Bolim nishon="➡️" sarlavha="Keyingi qadam" rang={rang}>
        <Royxat satrlar={data.keyingiQadam} rang={rang} raqamli />
      </Bolim>

      {data.misol && (
        <Bolim nishon="🩺" sarlavha="Klinik misol" rang="var(--good)">
          <div style={{ background: 'color-mix(in srgb, var(--good) 8%, var(--surface-2))', border: '1px solid color-mix(in srgb, var(--good) 30%, var(--line))', borderRadius: '12px', padding: '14px 16px', fontSize: '14px', lineHeight: 1.65 }}>
            <p style={{ margin: '0 0 7px' }}><strong style={{ color: 'var(--ink)' }}>Vaziyat:</strong> <span style={{ color: 'var(--ink-soft)' }}>{data.misol.vaziyat}</span></p>
            <p style={{ margin: 0 }}><strong style={{ color: 'var(--good)' }}>Javob:</strong> <span style={{ color: 'var(--ink-soft)' }}>{data.misol.javob}</span></p>
          </div>
        </Bolim>
      )}

      {data.kopXato && data.kopXato.length > 0 && (
        <Bolim nishon="⚠️" sarlavha="Ko‘p uchraydigan xato" rang="var(--warn)">
          <Royxat satrlar={data.kopXato} rang="var(--warn)" />
        </Bolim>
      )}
    </section>
  )
}
