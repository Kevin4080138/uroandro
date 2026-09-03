'use client'

import { usePathname, useRouter } from 'next/navigation'
import { type LucideIcon } from 'lucide-react'

export type NavBand = { Icon: LucideIcon; label: string; href: string }

// Suzuvchi (Floating/Detached) bar + faol tabga oqib boruvchi suyuq "bead"
// (goo filtri bilan meniscus ulanish). Bandlar prop orqali beriladi —
// talaba ham, bemor ham shu komponentni ishlatadi.
const MENISCUS_NAV = true

export function MeniscusNav({ bandlar }: { bandlar: NavBand[] }) {
  const pathname = usePathname()
  const router = useRouter()

  const topilgan = bandlar.findIndex((b) => pathname?.startsWith(b.href))
  const joriy = topilgan < 0 ? 0 : topilgan
  const n = bandlar.length
  const markaz = `${((joriy + 0.5) / n) * 100}%`
  // goo filtri id — sahifada bir nechta nav bo'lsa to'qnashmasin
  const filterId = `mnav-goo-${n}`

  if (!MENISCUS_NAV) {
    return (
      <nav
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
          background: 'var(--surface)', borderTop: '1px solid var(--line)',
          display: 'flex', justifyContent: 'space-around',
          padding: '8px 6px calc(8px + env(safe-area-inset-bottom))',
          boxShadow: '0 -2px 16px rgba(0,0,0,.08)',
        }}
      >
        {bandlar.map((b) => {
          const faol = pathname?.startsWith(b.href)
          return (
            <button key={b.href} onClick={() => router.push(b.href)} className="soft-press" style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
              background: 'none', border: 'none', cursor: 'pointer', flex: 1, padding: '5px 0',
              color: faol ? 'var(--accent)' : 'var(--muted)',
            }}>
              <b.Icon size={21} strokeWidth={faol ? 2.4 : 2} aria-hidden />
              <span style={{ fontSize: '10.5px', fontWeight: faol ? 700 : 500 }}>{b.label}</span>
            </button>
          )
        })}
      </nav>
    )
  }

  return (
    <div
      style={{
        position: 'fixed', left: 0, right: 0, zIndex: 40,
        bottom: 'calc(14px + env(safe-area-inset-bottom))',
        display: 'flex', justifyContent: 'center', padding: '0 16px', pointerEvents: 'none',
      }}
    >
      <style>{`
        .mnav-bar { position: relative; width: 100%; max-width: 360px; height: 64px;
          background: var(--surface); border: 1px solid var(--line); border-radius: 26px;
          box-shadow: 0 12px 34px rgba(0,0,0,.22); pointer-events: auto; }
        .mnav-liquid { position: absolute; inset: 0; overflow: visible; pointer-events: none; }
        .mnav-part { position: absolute; transform: translateX(-50%);
          background: linear-gradient(135deg, var(--accent), var(--accent-2));
          transition: left .5s cubic-bezier(.34,1.4,.5,1); }
        .mnav-bead { width: 46px; height: 46px; border-radius: 50%; top: -19px; }
        .mnav-neck { width: 40px; height: 30px; border-radius: 16px; top: 4px; }
        .mnav-tabs { position: absolute; inset: 0; display: flex; z-index: 2; }
        .mnav-tab { flex: 1; border: none; background: none; cursor: pointer; font: inherit;
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px;
          color: var(--muted); padding: 0; -webkit-tap-highlight-color: transparent; }
        .mnav-ico { display: flex; transition: transform .5s cubic-bezier(.34,1.4,.5,1), color .3s; }
        .mnav-lbl { font-size: 10px; font-weight: 600; transition: opacity .3s, transform .3s; }
        .mnav-tab.on { color: var(--accent); }
        .mnav-tab.on .mnav-ico { transform: translateY(-27px); color: #fff; }
        .mnav-tab.on .mnav-lbl { opacity: 0; transform: translateY(6px); }
        @media (prefers-reduced-motion: reduce) {
          .mnav-part, .mnav-ico, .mnav-lbl { transition: none; }
        }
      `}</style>

      <nav className="mnav-bar" aria-label="Asosiy navigatsiya">
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
          <defs>
            <filter id={filterId}>
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b" />
              <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -11" result="g" />
              <feBlend in="SourceGraphic" in2="g" />
            </filter>
          </defs>
        </svg>

        <div className="mnav-liquid" style={{ filter: `url(#${filterId})` }}>
          <span className="mnav-part mnav-neck" style={{ left: markaz }} />
          <span className="mnav-part mnav-bead" style={{ left: markaz }} />
        </div>

        <div className="mnav-tabs">
          {bandlar.map((b, i) => {
            const faol = i === joriy
            return (
              <button
                key={b.href}
                onClick={() => router.push(b.href)}
                className={`mnav-tab${faol ? ' on' : ''}`}
                aria-current={faol ? 'page' : undefined}
                aria-label={b.label}
              >
                <span className="mnav-ico"><b.Icon size={23} strokeWidth={faol ? 2.3 : 2} aria-hidden /></span>
                <span className="mnav-lbl">{b.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
