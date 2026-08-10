'use client'

import type { RankInfo } from '@/lib/rank'
import { hammaRanklar } from '@/lib/rank'

// ── SVG primitives ───────────────────────────────────────────────────────────

function Bar({ x, y, w, h, color }: { x: number; y: number; w: number; h: number; color: string }) {
  return <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={color} />
}

function Star({ cx, cy, r = 7, color }: { cx: number; cy: number; r?: number; color: string }) {
  const pts: string[] = []
  for (let i = 0; i < 10; i++) {
    const ang = (i * Math.PI) / 5 - Math.PI / 2
    const rad = i % 2 === 0 ? r : r * 0.42
    pts.push(`${cx + Math.cos(ang) * rad},${cy + Math.sin(ang) * rad}`)
  }
  return <polygon points={pts.join(' ')} fill={color} stroke="rgba(255,255,255,0.35)" strokeWidth="0.6" />
}

function Crown({ cx, cy, size = 20, color }: { cx: number; cy: number; size?: number; color: string }) {
  const h = size * 0.55
  const w = size
  return (
    <g>
      <path
        d={`M${cx - w / 2} ${cy + h / 2} L${cx - w / 2} ${cy - h / 4} L${cx - w / 4} ${cy - h / 2 + 2} L${cx} ${cy - h / 2 - 4} L${cx + w / 4} ${cy - h / 2 + 2} L${cx + w / 2} ${cy - h / 4} L${cx + w / 2} ${cy + h / 2} Z`}
        fill={color} stroke="rgba(255,255,255,0.5)" strokeWidth="0.8"
      />
      <circle cx={cx - w / 2} cy={cy - h / 4} r="2" fill="white" opacity="0.9" />
      <circle cx={cx} cy={cy - h / 2 - 4} r="2.5" fill="white" opacity="0.9" />
      <circle cx={cx + w / 2} cy={cy - h / 4} r="2" fill="white" opacity="0.9" />
    </g>
  )
}

function Medal({ cx, cy, r = 7, color }: { cx: number; cy: number; r?: number; color: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={color} stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
      <Star cx={cx} cy={cy} r={r * 0.55} color="rgba(255,255,255,0.8)" />
    </g>
  )
}

function Wings({ cx, cy, size = 20, color }: { cx: number; cy: number; size?: number; color: string }) {
  const w = size
  return (
    <g>
      {/* Left wing */}
      <path
        d={`M${cx} ${cy} C${cx - w * 0.4} ${cy - size * 0.5}, ${cx - w} ${cy - size * 0.3}, ${cx - w * 1.1} ${cy + size * 0.1} C${cx - w * 0.7} ${cy - size * 0.1}, ${cx - w * 0.3} ${cy - size * 0.1}, ${cx} ${cy} Z`}
        fill={color} opacity="0.85"
      />
      {/* Right wing */}
      <path
        d={`M${cx} ${cy} C${cx + w * 0.4} ${cy - size * 0.5}, ${cx + w} ${cy - size * 0.3}, ${cx + w * 1.1} ${cy + size * 0.1} C${cx + w * 0.7} ${cy - size * 0.1}, ${cx + w * 0.3} ${cy - size * 0.1}, ${cx} ${cy} Z`}
        fill={color} opacity="0.85"
      />
    </g>
  )
}

// ── Tier konfiguratsiyasi ────────────────────────────────────────────────────

const TIER_CONFIG = {
  boshlang: {
    bg1: '#64748b', bg2: '#475569', stripe: '#94a3b8',
    labelColor: '#cbd5e1', borderColor: '#94a3b8',
    glow: 'rgba(100,116,139,0.3)',
  },
  oson: {
    bg1: '#92400e', bg2: '#78350f', stripe: '#d97706',
    labelColor: '#fde68a', borderColor: '#f59e0b',
    glow: 'rgba(217,119,6,0.35)',
  },
  orta: {
    bg1: '#334155', bg2: '#1e293b', stripe: '#94a3b8',
    labelColor: '#e2e8f0', borderColor: '#94a3b8',
    glow: 'rgba(148,163,184,0.35)',
  },
  qiyin: {
    bg1: '#78350f', bg2: '#451a03', stripe: '#f59e0b',
    labelColor: '#fef3c7', borderColor: '#fbbf24',
    glow: 'rgba(251,191,36,0.4)',
  },
  akademik: {
    bg1: '#3b0764', bg2: '#1e1b4b', stripe: '#a855f7',
    labelColor: '#f0abfc', borderColor: '#c084fc',
    glow: 'rgba(168,85,247,0.5)',
  },
}

// ── Badge SVG ────────────────────────────────────────────────────────────────
// Badge design:
//   Novice/Apprentice/Scholar  (oson):   1–3 bars
//   Explorer/Practitioner/Specialist (orta): n stars (top row) + 3 bars (bottom)
//   Expert/Master (qiyin):             4–5 stars
//   Elite (qiyin):                     5 stars + medal above
//   Legend (akademik):                 wings + crown + 5 stars

function PogonSvg({ rank, size = 'md' }: { rank: RankInfo; size?: 'sm' | 'md' | 'lg' }) {
  const cfg = TIER_CONFIG[rank.tier]
  const W = size === 'lg' ? 130 : size === 'md' ? 100 : 76
  const H = size === 'lg' ? 56 : size === 'md' ? 46 : 36
  const cx = W / 2
  const cy = H / 2
  const sc = size === 'lg' ? 1.3 : size === 'sm' ? 0.75 : 1

  const barW = 28 * sc
  const barH = 6 * sc
  const barGap = 4 * sc
  const totalBarsW = 3 * barW + 2 * barGap
  const barsStartX = cx - totalBarsW / 2

  const renderInsignia = () => {
    if (rank.tier === 'boshlang') return null

    if (rank.tier === 'oson') {
      // 1–3 bars, horizontally centered
      const n = rank.subRank
      const totalW = n * barW + (n - 1) * barGap
      const startX = cx - totalW / 2
      return (
        <g>
          {Array.from({ length: n }).map((_, i) => (
            <Bar key={i} x={startX + i * (barW + barGap)} y={cy - barH / 2} w={barW} h={barH} color={cfg.labelColor} />
          ))}
        </g>
      )
    }

    if (rank.tier === 'orta') {
      // n stars (top) + 3 bars (bottom), subRank = star count
      const n = rank.subRank
      const starR = 5.5 * sc
      const starsY = cy - barH / 2 - starR - 3 * sc
      const barsY = cy + barH / 2 - barH + 3 * sc

      const starsW = n * starR * 2.4
      const starsStartX = cx - starsW / 2 + starR

      return (
        <g>
          {Array.from({ length: n }).map((_, i) => (
            <Star key={i} cx={starsStartX + i * starR * 2.4} cy={starsY} r={starR} color={cfg.labelColor} />
          ))}
          {Array.from({ length: 3 }).map((_, i) => (
            <Bar key={i} x={barsStartX + i * (barW + barGap)} y={barsY} w={barW} h={barH} color={cfg.labelColor} />
          ))}
        </g>
      )
    }

    if (rank.tier === 'qiyin') {
      // Expert=4 stars, Master=5 stars, Elite=5 stars + medal above
      const isElite = rank.darajaSon === 9
      const starCount = rank.subRank === 1 ? 4 : 5
      const starR = 5.5 * sc
      const starsY = isElite ? cy + 3 * sc : cy
      const starsW = starCount * starR * 2.4
      const starsStartX = cx - starsW / 2 + starR

      return (
        <g>
          {isElite && (
            <Medal cx={cx} cy={cy - starR * 2.2 - 2 * sc} r={5.5 * sc} color={cfg.labelColor} />
          )}
          {Array.from({ length: starCount }).map((_, i) => (
            <Star key={i} cx={starsStartX + i * starR * 2.4} cy={starsY} r={starR} color={cfg.labelColor} />
          ))}
        </g>
      )
    }

    if (rank.tier === 'akademik') {
      // Wings + crown + 5 stars
      const starR = 4.5 * sc
      const starsY = cy + 4 * sc
      const starsW = 5 * starR * 2.2
      const starsStartX = cx - starsW / 2 + starR
      return (
        <g>
          <Wings cx={cx} cy={cy - 2 * sc} size={18 * sc} color={cfg.labelColor} />
          <Crown cx={cx} cy={cy - 8 * sc} size={16 * sc} color={cfg.labelColor} />
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} cx={starsStartX + i * starR * 2.2} cy={starsY} r={starR} color={cfg.labelColor} />
          ))}
        </g>
      )
    }

    return null
  }

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`pg-${rank.darajaSon}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={cfg.bg1} />
          <stop offset="100%" stopColor={cfg.bg2} />
        </linearGradient>
        <pattern id={`stripe-${rank.darajaSon}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke={cfg.stripe} strokeOpacity="0.15" strokeWidth="2" />
        </pattern>
      </defs>

      <rect x="1" y="1" width={W - 2} height={H - 2} rx="6" ry="6" fill={`url(#pg-${rank.darajaSon})`} />
      <rect x="1" y="1" width={W - 2} height={H - 2} rx="6" ry="6" fill={`url(#stripe-${rank.darajaSon})`} />
      <rect x="1" y="1" width={W - 2} height={H - 2} rx="6" ry="6"
        fill="none" stroke={cfg.borderColor} strokeWidth="1.5" strokeOpacity="0.7" />
      <line x1="8" y1="4" x2={W - 8} y2="4"
        stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round" />

      {renderInsignia()}
    </svg>
  )
}

// ── Asosiy eksport: RankBadge ────────────────────────────────────────────────

export function RankBadge({ rank, size = 'md' }: { rank: RankInfo; size?: 'sm' | 'md' | 'lg' }) {
  const cfg = TIER_CONFIG[rank.tier]
  const isLg = size === 'lg'

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: isLg ? '8px' : '5px' }}>
      <div style={{ filter: `drop-shadow(0 4px 12px ${cfg.glow})`, transition: 'filter .3s' }}>
        <PogonSvg rank={rank} size={size} />
      </div>
      <span style={{
        fontSize: isLg ? '13px' : size === 'md' ? '11px' : '10px',
        fontWeight: 800,
        color: cfg.borderColor,
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
  const cfg = TIER_CONFIG[rank.tier]

  return (
    <div style={{
      background: `linear-gradient(135deg, ${cfg.bg1}22, ${cfg.bg2}11)`,
      border: `1px solid ${cfg.borderColor}50`,
      borderRadius: '18px',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '18px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', right: -20, top: -20,
        width: 120, height: 120, borderRadius: '50%',
        background: cfg.glow, filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      <div style={{ flexShrink: 0 }}>
        <PogonSvg rank={rank} size="lg" />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: '0 0 2px', fontSize: '11px', fontWeight: 700, color: cfg.borderColor, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Sizning unvoningiz
        </p>
        <p style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 900, color: 'var(--ink)', lineHeight: 1.2 }}>
          {rank.nom}
        </p>
        <p style={{ margin: '0 0 10px', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.4 }}>
          {rank.tavsif}
        </p>

        {rank.tier !== 'akademik' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>
                Keyingi: <span style={{ color: cfg.borderColor }}>{rank.keyingiNom}</span>
              </span>
              <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700 }}>
                {rank.keyingiFoiz}%
              </span>
            </div>
            <div style={{ height: '5px', background: 'var(--line)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '999px',
                width: `${rank.keyingiFoiz}%`,
                background: `linear-gradient(90deg, ${cfg.bg1}, ${cfg.borderColor})`,
                transition: 'width 0.8s ease',
              }} />
            </div>
          </>
        )}

        {rank.tier === 'akademik' && (
          <p style={{ margin: 0, fontSize: '13px', color: cfg.borderColor, fontWeight: 800 }}>
            🏆 Eng oliy unvon — to&apos;liq kurs yakunlandi!
          </p>
        )}
      </div>
    </div>
  )
}

// ── Mini badge (profil sahifasi uchun) ───────────────────────────────────────

export function RankMini({ rank, onClick }: { rank: RankInfo; onClick?: () => void }) {
  const cfg = TIER_CONFIG[rank.tier]
  const bosiladigan = typeof onClick === 'function'
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!bosiladigan}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        background: `${cfg.bg1}22`, border: `1px solid ${cfg.borderColor}50`,
        borderRadius: '10px', padding: '6px 12px',
        cursor: bosiladigan ? 'pointer' : 'default', font: 'inherit',
      }}
    >
      <PogonSvg rank={rank} size="sm" />
      <span style={{ fontSize: '12px', fontWeight: 800, color: cfg.borderColor }}>{rank.nom}</span>
      {bosiladigan && (
        <span style={{ fontSize: '11px', color: cfg.borderColor, opacity: .7, marginLeft: '2px' }}>ⓘ</span>
      )}
    </button>
  )
}

// ── Barcha unvonlar modali ────────────────────────────────────────────────────
// Unvon ustiga bosilganda: 10 ta unvon ko'rinadi. Talaba yetgan darajalar rangli,
// hali yetmagani rangsiz (grayscale). Joriy daraja ajratib ko'rsatiladi.

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
          maxWidth: '520px', maxHeight: '85vh', overflowY: 'auto',
          border: '1px solid var(--line)', borderBottom: 'none', padding: '20px 18px 32px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Unvonlar yo&apos;li</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Yopish"
            style={{
              width: '30px', height: '30px', borderRadius: '50%', border: 'none',
              background: 'var(--surface-2)', color: 'var(--ink)', fontSize: '16px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>
        <p style={{ margin: '0 0 16px', fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.6 }}>
          Darslarni tugatgan sari unvoningiz ko&apos;tariladi. Yetib kelgan darajalaringiz rangli,
          keyingilari kulrang.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {ranklar.map((r) => {
            const cfg = TIER_CONFIG[r.tier]
            const yetgan = r.darajaSon <= joriyDaraja
            const joriy = r.darajaSon === joriyDaraja
            return (
              <div
                key={r.darajaSon}
                style={{
                  display: 'flex', alignItems: 'center', gap: '13px',
                  padding: '11px 13px', borderRadius: '13px',
                  background: joriy ? `${cfg.bg1}22` : 'var(--surface-2)',
                  border: joriy ? `1.5px solid ${cfg.borderColor}` : '1px solid var(--line)',
                }}
              >
                <div style={{
                  flexShrink: 0, width: '76px',
                  filter: yetgan ? `drop-shadow(0 3px 8px ${cfg.glow})` : 'grayscale(1)',
                  opacity: yetgan ? 1 : .38,
                }}>
                  <PogonSvg rank={r as RankInfo} size="sm" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '14px', fontWeight: 800,
                      color: yetgan ? 'var(--ink)' : 'var(--muted)',
                    }}>
                      {r.nom}
                    </span>
                    {joriy && (
                      <span style={{
                        fontSize: '10px', fontWeight: 800, color: 'white', background: cfg.borderColor,
                        borderRadius: '999px', padding: '2px 8px', letterSpacing: '.02em',
                      }}>
                        SIZ
                      </span>
                    )}
                    {yetgan && !joriy && (
                      <span style={{ fontSize: '12px', color: cfg.borderColor }}>✓</span>
                    )}
                  </div>
                  <div style={{
                    fontSize: '11.5px', marginTop: '2px', lineHeight: 1.45,
                    color: yetgan ? 'var(--muted)' : 'var(--muted)', opacity: yetgan ? 1 : .7,
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
