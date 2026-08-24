'use client'

import type { RankInfo } from '@/lib/rank'
import { hammaRanklar } from '@/lib/rank'

// Hex clip-path — 6 burchakli shakl
const HEX = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'

// Har bir daraja uchun vizual konfig (darajaSon 0–10)
// HTML t4 "yakuniy tanlov" dizayni asosida
const RANK_VIS: Record<number, {
  p1: string; p2: string; accent: string
  stars: number; bars: number; chevs: number; crown: boolean
  glow: string; labelColor: string
}> = {
  0:  { p1: '#5a6478', p2: '#3a4150', accent: '#d1d5db', stars: 0, bars: 0, chevs: 1, crown: false, glow: 'rgba(90,100,120,0.35)',   labelColor: '#94a3b8' },
  1:  { p1: '#4C90F5', p2: '#1F5FE0', accent: '#ffffff', stars: 0, bars: 0, chevs: 1, crown: false, glow: 'rgba(76,144,245,0.45)',   labelColor: '#93c5fd' },
  2:  { p1: '#3E82F2', p2: '#1750DA', accent: '#ffffff', stars: 0, bars: 1, chevs: 1, crown: false, glow: 'rgba(62,130,242,0.45)',   labelColor: '#93c5fd' },
  3:  { p1: '#3572E8', p2: '#1247C9', accent: '#ffffff', stars: 0, bars: 3, chevs: 1, crown: false, glow: 'rgba(53,114,232,0.45)',   labelColor: '#93c5fd' },
  4:  { p1: '#22B4B0', p2: '#0E8783', accent: '#ffffff', stars: 0, bars: 3, chevs: 2, crown: false, glow: 'rgba(34,180,176,0.45)',   labelColor: '#5eead4' },
  5:  { p1: '#1FA79E', p2: '#0C7A72', accent: '#ffffff', stars: 1, bars: 3, chevs: 1, crown: false, glow: 'rgba(31,167,158,0.45)',   labelColor: '#5eead4' },
  6:  { p1: '#1C9A8C', p2: '#0A6259', accent: '#ffffff', stars: 2, bars: 3, chevs: 1, crown: false, glow: 'rgba(28,154,140,0.45)',   labelColor: '#5eead4' },
  7:  { p1: '#137F72', p2: '#07463F', accent: '#ffffff', stars: 3, bars: 3, chevs: 1, crown: false, glow: 'rgba(19,127,114,0.45)',   labelColor: '#34d399' },
  8:  { p1: '#4C4FC9', p2: '#2B2E95', accent: '#ffffff', stars: 3, bars: 3, chevs: 2, crown: false, glow: 'rgba(76,79,201,0.45)',    labelColor: '#a5b4fc' },
  9:  { p1: '#9142CE', p2: '#5C2596', accent: '#ffffff', stars: 4, bars: 3, chevs: 2, crown: false, glow: 'rgba(145,66,206,0.45)',   labelColor: '#d8b4fe' },
  10: { p1: '#121E44', p2: '#050914', accent: '#F7DE8B', stars: 4, bars: 3, chevs: 2, crown: true,  glow: 'rgba(247,222,139,0.55)', labelColor: '#F7DE8B' },
}

// ── Hexagon badge (asosiy vizual) ────────────────────────────────────────────

function HexBadge({
  darajaSon, earned = true, size = 'md', delay = '0',
}: {
  darajaSon: number
  earned?: boolean
  size?: 'sm' | 'md' | 'lg'
  delay?: string
}) {
  const vis = RANK_VIS[darajaSon] ?? RANK_VIS[0]
  const W = size === 'lg' ? 100 : size === 'md' ? 70 : 44
  const H = Math.round(W * 1.14)
  const s = (n: number) => Math.max(1, Math.round(n * W / 70))

  return (
    <div style={{
      position: 'relative', width: W, height: H, flexShrink: 0,
      filter: earned
        ? `drop-shadow(0 ${s(10)}px ${s(16)}px ${vis.glow})`
        : 'grayscale(0.92)',
      opacity: earned ? 1 : 0.42,
    }}>
      {/* Gradient qatlam */}
      <div style={{
        position: 'absolute', inset: 0, clipPath: HEX,
        background: `linear-gradient(135deg, ${vis.p1}, ${vis.p2})`,
      }} />
      {/* Yorug'lik jilosi */}
      <div style={{
        position: 'absolute', inset: 0, clipPath: HEX,
        background: 'linear-gradient(160deg, rgba(255,255,255,0.26), transparent 48%)',
        pointerEvents: 'none',
      }} />
      {/* Nishon belgilari */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: s(6), padding: s(13),
      }}>
        {vis.crown && (
          <div className="badge-crown" style={{
            width: s(24), height: s(13),
            background: vis.accent,
            clipPath: 'polygon(0% 100%, 0% 28%, 20% 55%, 50% 0%, 80% 55%, 100% 28%, 100% 100%)',
            animationDelay: `${delay}s`,
          }} />
        )}
        {vis.stars > 0 && (
          <div style={{ display: 'flex', gap: s(4), alignItems: 'center' }}>
            {Array.from({ length: vis.stars }).map((_, i) => (
              <div
                key={i}
                className="badge-star"
                style={{
                  width: s(12), height: s(12),
                  background: vis.accent,
                  clipPath: 'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
                  animationDelay: `${(parseFloat(delay) + i * 0.15).toFixed(2)}s`,
                }}
              />
            ))}
          </div>
        )}
        {vis.bars > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: s(3), alignItems: 'center' }}>
            {Array.from({ length: vis.bars }).map((_, i) => (
              <div
                key={i}
                className="badge-bar"
                style={{
                  width: s(38), height: s(4),
                  borderRadius: 999,
                  background: vis.accent,
                  animationDelay: `${(parseFloat(delay) + i * 0.15).toFixed(2)}s`,
                }}
              />
            ))}
          </div>
        )}
        {vis.chevs > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {Array.from({ length: vis.chevs }).map((_, i) => (
              <div
                key={i}
                className="badge-chev"
                style={{
                  width: s(30), height: s(9),
                  marginTop: i > 0 ? s(-2) : 0,
                  background: vis.accent,
                  clipPath: 'polygon(50% 0%,100% 100%,76% 100%,50% 42%,24% 100%,0% 100%)',
                  animationDelay: `${(parseFloat(delay) + i * 0.2).toFixed(2)}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Asosiy eksport: RankBadge ────────────────────────────────────────────────

export function RankBadge({ rank, size = 'md' }: { rank: RankInfo; size?: 'sm' | 'md' | 'lg' }) {
  const vis = RANK_VIS[rank.darajaSon] ?? RANK_VIS[0]
  const isLg = size === 'lg'
  const delay = (rank.darajaSon * 0.22).toFixed(2)

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: isLg ? 8 : 5 }}>
      <HexBadge darajaSon={rank.darajaSon} size={size} delay={delay} />
      <span style={{
        fontSize: isLg ? 13 : size === 'md' ? 11 : 10,
        fontWeight: 800,
        color: vis.labelColor,
        letterSpacing: '0.02em',
        textAlign: 'center',
        lineHeight: 1.2,
      }}>
        {rank.nom}
      </span>
    </div>
  )
}

// ── Katta karta (dashboard uchun) ────────────────────────────────────────────

export function RankCard({ rank }: { rank: RankInfo }) {
  const vis = RANK_VIS[rank.darajaSon] ?? RANK_VIS[0]
  const delay = (rank.darajaSon * 0.22).toFixed(2)

  return (
    <div style={{
      background: `linear-gradient(135deg, ${vis.p1}1a, ${vis.p2}0d)`,
      border: `1px solid ${vis.labelColor}40`,
      borderRadius: 18,
      padding: 20,
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', right: -20, top: -20,
        width: 120, height: 120, borderRadius: '50%',
        background: vis.glow, filter: 'blur(40px)', pointerEvents: 'none',
      }} />
      <div style={{ flexShrink: 0 }}>
        <HexBadge darajaSon={rank.darajaSon} size="lg" delay={delay} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 700, color: vis.labelColor, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Sizning unvoningiz
        </p>
        <p style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 900, color: 'var(--ink)', lineHeight: 1.2 }}>
          {rank.nom}
        </p>
        <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
          {rank.tavsif}
        </p>
        {rank.tier !== 'akademik' ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>
                Keyingi: <span style={{ color: vis.labelColor }}>{rank.keyingiNom}</span>
              </span>
              <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700 }}>
                {rank.keyingiFoiz}%
              </span>
            </div>
            <div style={{ height: 5, background: 'var(--line)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 999,
                width: `${rank.keyingiFoiz}%`,
                background: `linear-gradient(90deg, ${vis.p1}, ${vis.labelColor})`,
                transition: 'width 0.8s ease',
              }} />
            </div>
          </>
        ) : (
          <p style={{ margin: 0, fontSize: 13, color: vis.labelColor, fontWeight: 800 }}>
            🏆 Eng oliy unvon — to&apos;liq kurs yakunlandi!
          </p>
        )}
      </div>
    </div>
  )
}

// ── Mini badge (profil sahifasi uchun) ───────────────────────────────────────

export function RankMini({ rank, onClick }: { rank: RankInfo; onClick?: () => void }) {
  const vis = RANK_VIS[rank.darajaSon] ?? RANK_VIS[0]
  const bosiladigan = typeof onClick === 'function'
  const delay = (rank.darajaSon * 0.22).toFixed(2)
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!bosiladigan}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: `${vis.p1}22`, border: `1px solid ${vis.labelColor}50`,
        borderRadius: 10, padding: '6px 12px',
        cursor: bosiladigan ? 'pointer' : 'default', font: 'inherit',
      }}
    >
      <HexBadge darajaSon={rank.darajaSon} size="sm" delay={delay} />
      <span style={{ fontSize: 12, fontWeight: 800, color: vis.labelColor }}>{rank.nom}</span>
      {bosiladigan && (
        <span style={{ fontSize: 11, color: vis.labelColor, opacity: .7, marginLeft: 2 }}>ⓘ</span>
      )}
    </button>
  )
}

// ── Barcha unvonlar modali ────────────────────────────────────────────────────

export function UnvonlarModal({ joriyDaraja, onClose }: { joriyDaraja: number; onClose: () => void }) {
  const ranklar = hammaRanklar()

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 60,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface)', borderRadius: '20px 20px 0 0', width: '100%',
          maxWidth: 520, maxHeight: '85vh', overflowY: 'auto',
          border: '1px solid var(--line)', borderBottom: 'none', padding: '20px 18px 32px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Unvonlar yo&apos;li</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Yopish"
            style={{
              width: 30, height: 30, borderRadius: '50%', border: 'none',
              background: 'var(--surface-2)', color: 'var(--ink)', fontSize: 16,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>
        <p style={{ margin: '0 0 16px', fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.6 }}>
          Darslarni tugatgan sari unvoningiz ko&apos;tariladi. Yetib kelgan darajalaringiz rangli,
          keyingilari kulrang.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ranklar.map((r) => {
            const vis = RANK_VIS[r.darajaSon] ?? RANK_VIS[0]
            const yetgan = r.darajaSon <= joriyDaraja
            const joriy = r.darajaSon === joriyDaraja
            const delay = (r.darajaSon * 0.22).toFixed(2)
            return (
              <div
                key={r.darajaSon}
                style={{
                  display: 'flex', alignItems: 'center', gap: 13,
                  padding: '11px 13px', borderRadius: 13,
                  background: joriy ? `${vis.p1}22` : 'var(--surface-2)',
                  border: joriy ? `1.5px solid ${vis.labelColor}` : '1px solid var(--line)',
                }}
              >
                <HexBadge darajaSon={r.darajaSon} earned={yetgan} size="sm" delay={delay} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: 14, fontWeight: 800,
                      color: yetgan ? 'var(--ink)' : 'var(--muted)',
                    }}>
                      {r.nom}
                    </span>
                    {joriy && (
                      <span style={{
                        fontSize: 10, fontWeight: 800, color: 'white',
                        background: vis.labelColor,
                        borderRadius: 999, padding: '2px 8px', letterSpacing: '.02em',
                      }}>
                        SIZ
                      </span>
                    )}
                    {yetgan && !joriy && (
                      <span style={{ fontSize: 12, color: vis.labelColor }}>✓</span>
                    )}
                  </div>
                  <div style={{
                    fontSize: 11.5, marginTop: 2, lineHeight: 1.45,
                    color: 'var(--muted)', opacity: yetgan ? 1 : .7,
                  }}>
                    {r.tavsif}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
