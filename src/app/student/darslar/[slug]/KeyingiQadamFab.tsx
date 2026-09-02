'use client'

import { useState } from 'react'
import {
  ArrowRight, ChevronLeft, ChevronUp, X, Lock, CheckCircle2, PartyPopper,
  type LucideIcon,
} from 'lucide-react'
import { type Tab } from './bolimlar/types'

// FAB "Keyingi qadam" — prototip.
// Eski keng pastki panel o'rniga bitta suzuvchi tugma talabani
// dars oqimi bo'ylab yetaklaydi: joriy qadamni yakunlab keyingisiga
// o'tkazadi, chevron esa oldinda nima turganini stack bo'lib ochadi.
type QadamMa = { Icon: LucideIcon; nom: string; turi: string }

export function KeyingiQadamFab({
  qadamlar, joriy, tugallangan, QADAM_NOMI, accent, accent2,
  ochiqMi, qadamgaOt, yakunlaVaDavom, qadamChip, progressSaqlanmoqda,
}: {
  qadamlar: Tab[]
  joriy: number
  tugallangan: Set<string>
  QADAM_NOMI: Record<Tab, QadamMa>
  accent: string
  accent2: string
  ochiqMi: (i: number) => boolean
  qadamgaOt: (i: number) => void
  yakunlaVaDavom: () => Promise<void>
  qadamChip: (t: Tab) => string
  progressSaqlanmoqda: boolean
}) {
  const [ochiq, setOchiq] = useState(false)

  const qadam = qadamlar[Math.min(joriy, qadamlar.length - 1)]
  const oxirgi = joriy === qadamlar.length - 1
  const joriyTugadi = tugallangan.has(qadam)
  const keyingi = qadamlar[joriy + 1]
  const oldinda = qadamlar.slice(joriy + 1) // stack'da ko'rsatiladigan kelgusi qadamlar

  // Asosiy tugma matni va harakati holatga qarab o'zgaradi.
  let ustNom: string
  let astNom: string
  let AsosiyIcon: LucideIcon
  let bosildi: () => void
  let jonli = true // e'tibor tortuvchi pulse faqat harakat bo'lganda

  if (oxirgi && joriyTugadi) {
    ustNom = 'Barakalla'
    astNom = 'Dars tugallandi'
    AsosiyIcon = PartyPopper
    bosildi = () => window.scrollTo({ top: 0, behavior: 'smooth' })
    jonli = false
  } else if (oxirgi) {
    ustNom = "So'nggi qadam"
    astNom = 'Darsni yakunlash'
    AsosiyIcon = PartyPopper
    bosildi = yakunlaVaDavom
  } else if (joriyTugadi) {
    ustNom = 'Keyingi qadam'
    astNom = QADAM_NOMI[keyingi].nom
    AsosiyIcon = QADAM_NOMI[keyingi].Icon
    bosildi = () => qadamgaOt(joriy + 1)
  } else {
    ustNom = 'Yakunlab davom et'
    astNom = QADAM_NOMI[keyingi].nom
    AsosiyIcon = ArrowRight
    bosildi = yakunlaVaDavom
  }

  const stackOchiladi = oldinda.length > 0

  return (
    <div
      style={{
        position: 'fixed', right: '16px', zIndex: 45,
        bottom: 'calc(18px + env(safe-area-inset-bottom))',
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px',
        pointerEvents: 'none', // faqat bolalar bosiladi, orqa fon emas
      }}
    >
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .kqf-pulse { animation: kqf-pulse 2.6s cubic-bezier(.4,0,.6,1) infinite; }
          .kqf-item { animation: kqf-rise .26s ease both; }
        }
        @keyframes kqf-pulse {
          0%   { box-shadow: 0 0 0 0 var(--kqf-ring); }
          70%  { box-shadow: 0 0 0 13px transparent; }
          100% { box-shadow: 0 0 0 0 transparent; }
        }
        @keyframes kqf-rise {
          from { opacity: 0; transform: translateY(10px) scale(.92); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>

      {/* Ochilgan stack — oldinda turgan qadamlar (rasmdagi FAB kabi) */}
      {ochiq && stackOchiladi && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '9px', pointerEvents: 'auto' }}>
          {oldinda.map((t, k) => {
            const i = joriy + 1 + k
            const ma = QADAM_NOMI[t]
            const ki = ochiqMi(i)
            const tugadi = tugallangan.has(t)
            return (
              <button
                key={t}
                className="kqf-item soft-press"
                onClick={() => { if (ki) { qadamgaOt(i); setOchiq(false) } }}
                disabled={!ki}
                aria-label={`${i + 1}. ${ma.nom}${ki ? '' : ' — qulflangan'}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: '9px', border: 'none',
                  background: 'transparent', cursor: ki ? 'pointer' : 'not-allowed',
                  animationDelay: `${k * 40}ms`, font: 'inherit', padding: 0,
                }}
              >
                <span style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  background: 'var(--surface)', border: '1px solid var(--line)',
                  borderRadius: '999px', padding: '6px 11px', boxShadow: '0 4px 14px rgba(0,0,0,.12)',
                  opacity: ki ? 1 : 0.55,
                }}>
                  <span style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--ink)', whiteSpace: 'nowrap' }}>{ma.nom}</span>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{qadamChip(t)}</span>
                </span>
                <span style={{
                  width: '40px', height: '40px', borderRadius: '999px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: tugadi ? '#16a34a1f' : 'var(--surface)',
                  border: tugadi ? '1.5px solid #16a34a' : `1.5px solid ${accent}55`,
                  color: tugadi ? '#16a34a' : ki ? accent : 'var(--muted)',
                  boxShadow: '0 4px 14px rgba(0,0,0,.14)',
                }}>
                  {tugadi ? <CheckCircle2 size={19} strokeWidth={2} /> : ki ? <ma.Icon size={18} strokeWidth={2} /> : <Lock size={15} strokeWidth={2} />}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Pastki qator: [oldingi] [chevron] [asosiy FAB + yorliq] */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', pointerEvents: 'auto' }}>
        {joriy > 0 && (
          <button
            onClick={() => qadamgaOt(joriy - 1)}
            className="soft-press"
            aria-label="Oldingi qadam"
            style={{
              width: '42px', height: '42px', borderRadius: '999px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--surface)', border: '1px solid var(--line)', cursor: 'pointer',
              color: 'var(--muted)', boxShadow: '0 4px 14px rgba(0,0,0,.12)',
            }}
          >
            <ChevronLeft size={20} strokeWidth={2.2} />
          </button>
        )}

        {stackOchiladi && (
          <button
            onClick={() => setOchiq(!ochiq)}
            className="soft-press"
            aria-label={ochiq ? 'Yopish' : 'Kelgusi qadamlar'}
            aria-expanded={ochiq}
            style={{
              width: '42px', height: '42px', borderRadius: '999px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: ochiq ? accent + '18' : 'var(--surface)',
              border: `1px solid ${ochiq ? accent : 'var(--line)'}`, cursor: 'pointer',
              color: ochiq ? accent : 'var(--muted)', boxShadow: '0 4px 14px rgba(0,0,0,.12)',
              transition: 'all .15s ease',
            }}
          >
            {ochiq ? <X size={19} strokeWidth={2.2} /> : <ChevronUp size={20} strokeWidth={2.2} />}
          </button>
        )}

        {/* Asosiy yetaklovchi tugma */}
        <button
          onClick={bosildi}
          disabled={progressSaqlanmoqda}
          aria-busy={progressSaqlanmoqda}
          className="soft-press"
          style={{
            position: 'relative', display: 'flex', alignItems: 'center', gap: '11px',
            border: 'none', cursor: progressSaqlanmoqda ? 'wait' : 'pointer', font: 'inherit',
            background: oxirgi && joriyTugadi ? 'var(--surface)' : `linear-gradient(135deg, ${accent}, ${accent2})`,
            color: oxirgi && joriyTugadi ? 'var(--ink-soft)' : 'white',
            borderRadius: '999px', padding: '9px 9px 9px 18px',
            boxShadow: '0 8px 26px rgba(0,0,0,.24)',
            ...(oxirgi && joriyTugadi ? { border: '1px solid var(--line)' } : {}),
          }}
        >
          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.15 }}>
            <span style={{
              fontSize: '9.5px', fontWeight: 800, letterSpacing: '.04em', textTransform: 'uppercase',
              opacity: oxirgi && joriyTugadi ? 0.7 : 0.85,
            }}>{progressSaqlanmoqda ? 'Kuting' : ustNom}</span>
            <span style={{ fontSize: '14px', fontWeight: 900, whiteSpace: 'nowrap' }}>{progressSaqlanmoqda ? 'Saqlanmoqda…' : astNom}</span>
          </span>
          <span
            className={jonli ? 'kqf-pulse' : undefined}
            style={{
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ['--kqf-ring' as any]: 'rgba(255,255,255,.55)',
              width: '46px', height: '46px', borderRadius: '999px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: oxirgi && joriyTugadi ? accent + '18' : 'rgba(255,255,255,.22)',
              color: oxirgi && joriyTugadi ? accent : 'white',
            }}
          >
            <AsosiyIcon size={22} strokeWidth={2.3} />
          </span>
        </button>
      </div>
    </div>
  )
}
