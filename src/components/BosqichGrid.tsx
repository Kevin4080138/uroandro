'use client'

import { BookOpen, Layers, GraduationCap, ArrowRight, type LucideIcon } from 'lucide-react'

// Bosqich kirish grid — ingichka progress-chiziqlar o'rniga bold rangli plitalar.
// Har plita: rangli ikonka + progress halqasi + katta "tugadi/jami" soni.
export type BosqichItem = { id: string; nom: string; rang: string; tugadi: number; jami: number }

// Bosqichlar doim oson → o'rta → qiyin tartibida keladi. Id ba'zan "o'rta",
// ba'zan "orta" bo'lgani uchun ikonkani indeks bo'yicha tanlaymiz.
const IKONKALAR: LucideIcon[] = [BookOpen, Layers, GraduationCap]

function Halqa({ pct, rang }: { pct: number; rang: string }) {
  const r = 15
  const c = 2 * Math.PI * r
  const off = c * (1 - pct / 100)
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" style={{ position: 'absolute', top: '10px', right: '10px' }}>
      <circle cx="19" cy="19" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="4" />
      <circle
        cx="19" cy="19" r={r} fill="none" stroke={rang} strokeWidth="4" strokeLinecap="round"
        strokeDasharray={c.toFixed(1)} strokeDashoffset={off.toFixed(1)} transform="rotate(-90 19 19)"
      />
      <text x="19" y="22" textAnchor="middle" style={{ fontSize: '9px', fontWeight: 900, fill: rang }}>{pct}%</text>
    </svg>
  )
}

export function BosqichGrid({ items, onOpen }: { items: BosqichItem[]; onOpen: (item: BosqichItem) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
      {items.map((b, i) => {
        const pct = b.jami ? Math.round((b.tugadi / b.jami) * 100) : 0
        const Icon = IKONKALAR[i] ?? BookOpen
        return (
          <button
            key={b.id}
            onClick={() => onOpen(b)}
            className="soft-press"
            aria-label={`${b.nom} bosqichi — ${b.tugadi}/${b.jami} dars tugallandi`}
            style={{
              position: 'relative', border: `1px solid color-mix(in srgb, ${b.rang} 26%, transparent)`,
              background: `color-mix(in srgb, ${b.rang} 9%, var(--surface))`,
              borderRadius: '18px', padding: '12px 11px 13px', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', gap: '9px', textAlign: 'left', font: 'inherit',
              overflow: 'hidden',
            }}
          >
            <div style={{
              width: '34px', height: '34px', borderRadius: '11px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: b.rang, color: '#fff',
            }}>
              <Icon size={19} strokeWidth={2} />
            </div>
            <Halqa pct={pct} rang={b.rang} />
            <div>
              <div style={{ fontSize: '21px', fontWeight: 900, color: 'var(--ink)', lineHeight: 1, marginTop: '2px' }}>
                {b.tugadi}<span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)' }}>/{b.jami}</span>
              </div>
              <div style={{ fontSize: '11.5px', fontWeight: 800, color: b.rang, display: 'flex', alignItems: 'center', gap: '3px', marginTop: '3px' }}>
                {b.nom} <ArrowRight size={12} strokeWidth={2.6} />
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
