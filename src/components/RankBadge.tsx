'use client'

import type { RankInfo } from '@/lib/rank'
import { hammaRanklar } from '@/lib/rank'
import { Repeat, RefreshCw } from 'lucide-react'
import { UnvonUlashish, type UnvonUlashData } from '@/components/UnvonUlashish'

// Hex clip-path — 6 burchakli shakl
const HEX = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'

// Ramka gradientlari (metall romka his beradi)
const FRAME = {
  steel:  'linear-gradient(160deg,#C8D0DA,#8A94A2 55%,#525A66)',
  silver: 'linear-gradient(160deg,#F4F7FA,#AAB8C4 55%,#64707E)',
  gold:   'linear-gradient(160deg,#FCEFC2,#D9A93B 55%,#8A5F14)',
}

// Har bir daraja uchun vizual konfig (darajaSon 0–10)
// HTML t4 "yakuniy tanlov" dizayni asosida — ramka bilan
// Eksport: ulashish kartasi (canvas) ham shu ranglardan foydalanadi
export const RANK_VIS: Record<number, {
  p1: string; p2: string; accent: string; frame: string
  stars: number; bars: number; chevs: number; crown: boolean
  glow: string; labelColor: string
}> = {
  0:  { p1: '#7C93C4', p2: '#4A5A7E', accent: '#ffffff', frame: FRAME.steel,  stars: 0, bars: 0, chevs: 1, crown: false, glow: 'rgba(124,147,196,0.4)',  labelColor: '#93a5c4' },
  1:  { p1: '#4C90F5', p2: '#1F5FE0', accent: '#ffffff', frame: FRAME.silver, stars: 0, bars: 0, chevs: 1, crown: false, glow: 'rgba(76,144,245,0.45)',  labelColor: '#3b82f6' },
  2:  { p1: '#3E82F2', p2: '#1750DA', accent: '#ffffff', frame: FRAME.silver, stars: 0, bars: 1, chevs: 1, crown: false, glow: 'rgba(62,130,242,0.45)',  labelColor: '#3b82f6' },
  3:  { p1: '#3572E8', p2: '#1247C9', accent: '#ffffff', frame: FRAME.silver, stars: 0, bars: 3, chevs: 1, crown: false, glow: 'rgba(53,114,232,0.45)',  labelColor: '#2563eb' },
  4:  { p1: '#22B4B0', p2: '#0E8783', accent: '#ffffff', frame: FRAME.silver, stars: 0, bars: 3, chevs: 2, crown: false, glow: 'rgba(34,180,176,0.45)',  labelColor: '#0d9488' },
  5:  { p1: '#1FA79E', p2: '#0C7A72', accent: '#ffffff', frame: FRAME.silver, stars: 1, bars: 3, chevs: 1, crown: false, glow: 'rgba(31,167,158,0.45)',  labelColor: '#0d9488' },
  6:  { p1: '#1C9A8C', p2: '#0A6259', accent: '#ffffff', frame: FRAME.silver, stars: 2, bars: 3, chevs: 1, crown: false, glow: 'rgba(28,154,140,0.45)',  labelColor: '#0d9488' },
  7:  { p1: '#137F72', p2: '#07463F', accent: '#F7DE8B', frame: FRAME.gold,   stars: 3, bars: 3, chevs: 1, crown: false, glow: 'rgba(217,169,59,0.45)',  labelColor: '#b8860b' },
  8:  { p1: '#4C4FC9', p2: '#2B2E95', accent: '#F7DE8B', frame: FRAME.gold,   stars: 3, bars: 3, chevs: 2, crown: false, glow: 'rgba(217,169,59,0.45)',  labelColor: '#6366f1' },
  9:  { p1: '#9142CE', p2: '#5C2596', accent: '#F7DE8B', frame: FRAME.gold,   stars: 4, bars: 3, chevs: 2, crown: false, glow: 'rgba(217,169,59,0.5)',   labelColor: '#9333ea' },
  10: { p1: '#121E44', p2: '#050914', accent: '#F7DE8B', frame: FRAME.gold,   stars: 4, bars: 3, chevs: 2, crown: true,  glow: 'rgba(247,222,139,0.6)', labelColor: '#c99326' },
}

// ── Hexagon badge (asosiy vizual) — rangli metall ramka bilan ────────────────

function HexBadge({
  darajaSon, earned = true, size = 'md', delay = '0',
}: {
  darajaSon: number
  earned?: boolean
  size?: 'sm' | 'md' | 'lg'
  delay?: string
}) {
  const vis = RANK_VIS[darajaSon] ?? RANK_VIS[0]
  const W = size === 'lg' ? 100 : size === 'md' ? 70 : 46
  const H = Math.round(W * 1.14)
  const s = (n: number) => Math.max(1, Math.round(n * W / 70))
  const frameW = s(4) // ramka qalinligi

  // Belgilarni ramka ichiga SIG'DIRISH: element hajmlari W=70 asosida (dizayn px)
  // hisoblanadi, so'ng hexagonning xavfsiz o'rta zonasiga mos ravishda
  // birgalikda kichraytiriladi — shunda 7–10 darajada ham shakllar ramkadan chiqmaydi.
  const uBase = W / 70
  const rows: { turi: string; h: number; w: number }[] = []
  if (vis.crown)     rows.push({ turi: 'crown', h: 13, w: 24 })
  if (vis.stars > 0) rows.push({ turi: 'stars', h: 12, w: vis.stars * 12 + (vis.stars - 1) * 4 })
  if (vis.bars > 0)  rows.push({ turi: 'bars',  h: vis.bars * 4 + (vis.bars - 1) * 3, w: 38 })
  if (vis.chevs > 0) rows.push({ turi: 'chevs', h: vis.chevs * 9 - (vis.chevs - 1) * 2, w: 30 })
  const BLOCK_GAP = 5
  const totalH = rows.reduce((a, r) => a + r.h, 0) + Math.max(0, rows.length - 1) * BLOCK_GAP
  const maxW = rows.reduce((a, r) => Math.max(a, r.w), 1)
  // Xavfsiz zona — hexagonning to'la kenglikdagi o'rta bo'lagi (balandlik 52%, en 60%)
  const fit = Math.min(1, (70 * 1.14 * 0.52) / totalH, (70 * 0.60) / maxW)
  const u = uBase * fit
  const g = (n: number) => n * u // sig'dirilgan px

  return (
    <div style={{
      position: 'relative', width: W, height: H, flexShrink: 0,
      filter: earned
        ? `drop-shadow(0 ${s(10)}px ${s(16)}px ${vis.glow})`
        : 'grayscale(0.92)',
      opacity: earned ? 1 : 0.42,
    }}>
      {/* Ramka (metall romka) — tashqi hexagon */}
      <div style={{
        position: 'absolute', inset: 0, clipPath: HEX,
        background: vis.frame,
      }} />
      {/* Ichki gradient */}
      <div style={{
        position: 'absolute', inset: frameW, clipPath: HEX,
        background: `linear-gradient(135deg, ${vis.p1}, ${vis.p2})`,
      }} />
      {/* Yorug'lik jilosi */}
      <div style={{
        position: 'absolute', inset: frameW, clipPath: HEX,
        background: 'linear-gradient(160deg, rgba(255,255,255,0.28), transparent 48%)',
        pointerEvents: 'none',
      }} />
      {/* Nishon belgilari — fit orqali ramka ichiga sig'diriladi */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: g(BLOCK_GAP),
      }}>
        {vis.crown && (
          <div className="badge-crown" style={{
            width: g(24), height: g(13),
            background: vis.accent,
            clipPath: 'polygon(0% 100%, 0% 28%, 20% 55%, 50% 0%, 80% 55%, 100% 28%, 100% 100%)',
            animationDelay: `${delay}s`,
          }} />
        )}
        {vis.stars > 0 && (
          <div style={{ display: 'flex', gap: g(4), alignItems: 'center' }}>
            {Array.from({ length: vis.stars }).map((_, i) => (
              <div
                key={i}
                className="badge-star"
                style={{
                  width: g(12), height: g(12),
                  background: vis.accent,
                  clipPath: 'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
                  animationDelay: `${(parseFloat(delay) + i * 0.15).toFixed(2)}s`,
                }}
              />
            ))}
          </div>
        )}
        {vis.bars > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: g(3), alignItems: 'center' }}>
            {Array.from({ length: vis.bars }).map((_, i) => (
              <div
                key={i}
                className="badge-bar"
                style={{
                  width: g(38), height: g(4),
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
                  width: g(30), height: g(9),
                  marginTop: i > 0 ? g(-2) : 0,
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

// ── Katta karta (dashboard uchun) — bosiladigan ──────────────────────────────

export function RankCard({ rank, onClick }: { rank: RankInfo; onClick?: () => void }) {
  const vis = RANK_VIS[rank.darajaSon] ?? RANK_VIS[0]
  const delay = (rank.darajaSon * 0.22).toFixed(2)
  const bosiladigan = typeof onClick === 'function'

  return (
    <div
      onClick={onClick}
      className={bosiladigan ? 'lift' : undefined}
      role={bosiladigan ? 'button' : undefined}
      tabIndex={bosiladigan ? 0 : undefined}
      onKeyDown={bosiladigan ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick!() } } : undefined}
      style={{
        background: `linear-gradient(135deg, ${vis.p1}1a, ${vis.p2}0d)`,
        border: `1px solid ${vis.labelColor}40`,
        borderRadius: 18,
        padding: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        position: 'relative',
        overflow: 'hidden',
        cursor: bosiladigan ? 'pointer' : 'default',
      }}
    >
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
      {bosiladigan && (
        <span style={{
          position: 'absolute', right: 12, bottom: 10,
          fontSize: 10.5, fontWeight: 700, color: vis.labelColor, opacity: 0.85,
          display: 'inline-flex', alignItems: 'center', gap: 3,
        }}>
          Unvonlar yo&apos;li ⓘ
        </span>
      )}
    </div>
  )
}

// ── Mini badge (profil sahifasi uchun) — rangli fonga chidamli shisha chip ────

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
        display: 'inline-flex', alignItems: 'center', gap: 9,
        // Rangli gradient (profil kartasi) ustida ham o'qiladigan qorong'i shisha
        background: 'rgba(10,15,25,0.28)',
        border: '1px solid rgba(255,255,255,0.28)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        borderRadius: 12, padding: '6px 12px 6px 8px',
        cursor: bosiladigan ? 'pointer' : 'default', font: 'inherit',
      }}
    >
      <HexBadge darajaSon={rank.darajaSon} size="sm" delay={delay} />
      <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.1 }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '.06em', textTransform: 'uppercase' }}>Unvon</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>{rank.nom}</span>
      </span>
      {bosiladigan && (
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', marginLeft: 1 }}>ⓘ</span>
      )}
    </button>
  )
}

// ── Barcha unvonlar modali ────────────────────────────────────────────────────
// Unvon ustiga bosilganda: 10 ta unvon + qanday erishish sharti ko'rinadi.
// Talaba yetgan darajalar rangli, hali yetmagani rangsiz (grayscale).

export function UnvonlarModal({ joriyDaraja, onClose, ulash }: { joriyDaraja: number; onClose: () => void; ulash?: UnvonUlashData }) {
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
          maxWidth: 520, maxHeight: '88vh', overflowY: 'auto',
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
          Darslarni tugatgan sari unvoningiz ko&apos;tariladi — har bir darajaga
          <b> qancha o&apos;qishingiz kerakligi</b> quyida ko&apos;rsatilgan. Yetib kelgan
          darajalaringiz rangli, keyingilari kulrang.
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
                      {r.darajaSon}. {r.nom}
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
                  {/* Qanday erishish sharti */}
                  <div style={{
                    fontSize: 11.5, marginTop: 3, lineHeight: 1.45,
                    color: yetgan ? vis.labelColor : 'var(--muted)',
                    fontWeight: yetgan ? 600 : 500,
                    opacity: yetgan ? 1 : 0.85,
                  }}>
                    {yetgan ? '✓ ' : '🎯 '}{r.shart}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Joriy unvonni ulashish — faqat kamida 1-darajaga yetganda */}
        {ulash && ulash.rank.darajaSon >= 1 && (
          <UnvonUlashish data={ulash} />
        )}

        {/* Eslatma 1 — takrorlash */}
        <div style={{
          display: 'flex', gap: 11, alignItems: 'flex-start',
          marginTop: 18, padding: '13px 15px', borderRadius: 13,
          background: 'var(--accent-soft)', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)',
        }}>
          <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }}><Repeat size={18} strokeWidth={2.2} /></span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink)', marginBottom: 2 }}>Takrorlash — bilimlar onasi</div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
              Unvonni qo&apos;lga kiritish yetarli emas — o&apos;tilgan mavzularni vaqti-vaqti bilan
              qaytarib turmasangiz, bilim yodingizdan ko&apos;tariladi. Har bosqichni takrorlab boring,
              shunda unvoningiz haqiqiy bilimga aylanadi.
            </div>
          </div>
        </div>

        {/* Eslatma 2 — platforma yangilanishi */}
        <div style={{
          display: 'flex', gap: 11, alignItems: 'flex-start',
          marginTop: 10, padding: '13px 15px', borderRadius: 13,
          background: 'var(--surface-2)', border: '1px solid var(--line)',
        }}>
          <span style={{ color: 'var(--good)', flexShrink: 0, marginTop: 1 }}><RefreshCw size={18} strokeWidth={2.2} /></span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink)', marginBottom: 2 }}>Platforma doimo yangilanadi</div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
              Urosfera har 6 oydan bir yilgacha bo&apos;lgan muddatda yangi darslar, mavzular va
              imkoniyatlar bilan yangilanib turadi. Tez-tez kirib, yangilanishlardan boxabar bo&apos;lib turing.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
