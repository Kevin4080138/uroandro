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

function Royxat({ satrlar }: { satrlar: ReactNode[] }) {
  return (
    <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
      {satrlar.map((s, i) => <li key={i} style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.55 }}>{s}</li>)}
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
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>{data.anglatadi}</p>
      </Bolim>

      <Bolim nishon="🚫" sarlavha="Bu nimani anglatmaydi?" rang="var(--danger)">
        <Royxat satrlar={data.anglatmaydi} />
      </Bolim>

      <Bolim nishon="➡️" sarlavha="Keyingi qadam" rang={rang}>
        <Royxat satrlar={data.keyingiQadam} />
      </Bolim>

      {data.misol && (
        <Bolim nishon="🩺" sarlavha="Klinik misol" rang="var(--good)">
          <div style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '10px', padding: '12px 14px', fontSize: '13.5px', lineHeight: 1.6 }}>
            <p style={{ margin: '0 0 6px' }}><strong>Vaziyat:</strong> {data.misol.vaziyat}</p>
            <p style={{ margin: 0 }}><strong>Javob:</strong> {data.misol.javob}</p>
          </div>
        </Bolim>
      )}

      {data.kopXato && data.kopXato.length > 0 && (
        <Bolim nishon="⚠️" sarlavha="Ko‘p uchraydigan xato" rang="var(--warn)">
          <Royxat satrlar={data.kopXato} />
        </Bolim>
      )}
    </section>
  )
}
