'use client'

import { useState } from 'react'
import type { RankInfo } from '@/lib/rank'
import { RANK_VIS } from '@/components/RankBadge'

// Ijtimoiy tarmoqlarga ulashish: canvas → PNG blob → navigator.share yoki URL ulashish.
// Ulashish kartasi dizayni: navy-havorang fon (dizayn hujjati t4/1b asosida).

type Olcham = 'story'

const BOSQICH_NOMI: Record<RankInfo['tier'], string> = {
  boshlang: "BOSHLANG'ICH",
  oson: 'OSON BOSQICH',
  orta: "O'RTA BOSQICH",
  qiyin: 'QIYIN BOSQICH',
  akademik: 'OLIY UNVON',
}

function ramkaRangi(darajaSon: number): string {
  if (darajaSon >= 7) return '#D9A93B'
  if (darajaSon >= 1) return '#AAB8C4'
  return '#8A94A2'
}

export type UnvonUlashData = {
  rank: RankInfo
  ism: string
  ortacha: number
  seriya: number
  yonalish?: 'urologiya' | 'ginekologiya'
}

// ── Canvas primitivlari ───────────────────────────────────────────────────────

function hexYol(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.beginPath()
  ctx.moveTo(x + w / 2, y)
  ctx.lineTo(x + w, y + h * 0.25)
  ctx.lineTo(x + w, y + h * 0.75)
  ctx.lineTo(x + w / 2, y + h)
  ctx.lineTo(x, y + h * 0.75)
  ctx.lineTo(x, y + h * 0.25)
  ctx.closePath()
}

function yulduz(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, rang: string) {
  ctx.beginPath()
  for (let i = 0; i < 10; i++) {
    const ang = (i * Math.PI) / 5 - Math.PI / 2
    const rad = i % 2 === 0 ? r : r * 0.42
    const px = cx + Math.cos(ang) * rad
    const py = cy + Math.sin(ang) * rad
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
  ctx.fillStyle = rang
  ctx.fill()
}

function toj(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number, rang: string) {
  ctx.beginPath()
  ctx.moveTo(cx - w / 2, cy + h / 2)
  ctx.lineTo(cx - w / 2, cy - h * 0.22)
  ctx.lineTo(cx - w * 0.2, cy)
  ctx.lineTo(cx, cy - h / 2)
  ctx.lineTo(cx + w * 0.2, cy)
  ctx.lineTo(cx + w / 2, cy - h * 0.22)
  ctx.lineTo(cx + w / 2, cy + h / 2)
  ctx.closePath()
  ctx.fillStyle = rang
  ctx.fill()
}

function chevron(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number, rang: string) {
  const x = cx - w / 2, y = cy - h / 2
  ctx.beginPath()
  ctx.moveTo(x + w * 0.5, y)
  ctx.lineTo(x + w, y + h)
  ctx.lineTo(x + w * 0.76, y + h)
  ctx.lineTo(x + w * 0.5, y + h * 0.42)
  ctx.lineTo(x + w * 0.24, y + h)
  ctx.lineTo(x, y + h)
  ctx.closePath()
  ctx.fillStyle = rang
  ctx.fill()
}

function yumaloqRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

function chizNishon(ctx: CanvasRenderingContext2D, cx: number, cy: number, W: number, darajaSon: number) {
  const vis = RANK_VIS[darajaSon] ?? RANK_VIS[0]
  const H = W * 1.14
  const x = cx - W / 2, y = cy - H / 2
  const frameW = W * 0.055

  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.45)'
  ctx.shadowBlur = W * 0.18
  ctx.shadowOffsetY = W * 0.08
  hexYol(ctx, x, y, W, H)
  ctx.fillStyle = ramkaRangi(darajaSon)
  ctx.fill()
  ctx.restore()

  const g = ctx.createLinearGradient(x, y, x + W, y + H)
  g.addColorStop(0, vis.p1)
  g.addColorStop(1, vis.p2)
  hexYol(ctx, x + frameW, y + frameW, W - frameW * 2, H - frameW * 2)
  ctx.fillStyle = g
  ctx.fill()

  const gl = ctx.createLinearGradient(x, y, x + W * 0.6, y + H * 0.6)
  gl.addColorStop(0, 'rgba(255,255,255,0.30)')
  gl.addColorStop(0.5, 'rgba(255,255,255,0)')
  ctx.save()
  hexYol(ctx, x + frameW, y + frameW, W - frameW * 2, H - frameW * 2)
  ctx.clip()
  ctx.fillStyle = gl
  ctx.fillRect(x, y, W, H)
  ctx.restore()

  const acc = vis.accent
  const uBase = W / 140
  const satrlar: { turi: string; h: number; w: number }[] = []
  if (vis.crown)     satrlar.push({ turi: 'crown', h: 15, w: 26 })
  if (vis.stars > 0) satrlar.push({ turi: 'stars', h: 15, w: vis.stars * 14 + (vis.stars - 1) * 5 })
  if (vis.bars > 0)  satrlar.push({ turi: 'bars',  h: vis.bars * 6 + (vis.bars - 1) * 4, w: 46 })
  if (vis.chevs > 0) satrlar.push({ turi: 'chevs', h: vis.chevs * 11 - (vis.chevs - 1) * 2, w: 34 })
  const GAP_U = 8
  const totalHU = satrlar.reduce((a, r) => a + r.h, 0) + Math.max(0, satrlar.length - 1) * GAP_U
  const maxWU = satrlar.reduce((a, r) => Math.max(a, r.w), 1)
  const fit = Math.min(1, (140 * 1.14 * 0.52) / totalHU, (140 * 0.60) / maxWU)
  const u = uBase * fit
  const bloklar = satrlar.map((r) => ({ turi: r.turi, balandlik: r.h * u }))
  const oraliq = GAP_U * u
  const jamiH = bloklar.reduce((a, b) => a + b.balandlik, 0) + (bloklar.length - 1) * oraliq
  let cursorY = cy - jamiH / 2

  for (const blok of bloklar) {
    const markazY = cursorY + blok.balandlik / 2
    if (blok.turi === 'crown') {
      toj(ctx, cx, markazY, 26 * u, 15 * u, acc)
    } else if (blok.turi === 'stars') {
      const r = 7 * u
      const gap = 5 * u
      const totalW = vis.stars * r * 2 + (vis.stars - 1) * gap
      let sx = cx - totalW / 2 + r
      for (let i = 0; i < vis.stars; i++) {
        yulduz(ctx, sx, markazY, r, acc)
        sx += r * 2 + gap
      }
    } else if (blok.turi === 'bars') {
      const bw = 46 * u, bh = 6 * u, bg = 4 * u
      let by = cursorY
      for (let i = 0; i < vis.bars; i++) {
        yumaloqRect(ctx, cx - bw / 2, by, bw, bh, bh / 2)
        ctx.fillStyle = acc
        ctx.fill()
        by += bh + bg
      }
    } else if (blok.turi === 'chevs') {
      const cw = 34 * u, ch = 11 * u
      let cyy = cursorY + ch / 2
      for (let i = 0; i < vis.chevs; i++) {
        chevron(ctx, cx, cyy, cw, ch, acc)
        cyy += ch - 2 * u
      }
    }
    cursorY += blok.balandlik + oraliq
  }
}

// ── Story kartasini canvas'da chizadi (1080×1920) ───────────────────────────

async function storyBlob(d: UnvonUlashData): Promise<Blob | null> {
  const w = 1080, h = 1920
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const vis = RANK_VIS[d.rank.darajaSon] ?? RANK_VIS[0]
  const markaz = w / 2
  const accent = d.rank.darajaSon >= 7 ? '#F7DE8B' : '#8FAEE8'

  // Fon — navy-havorang
  const fon = ctx.createLinearGradient(0, 0, w, h)
  fon.addColorStop(0, '#062A3C')
  fon.addColorStop(1, '#04121C')
  ctx.fillStyle = fon
  ctx.fillRect(0, 0, w, h)

  // Yumshoq radial nur
  const nurY = h * 0.40
  const nur = ctx.createRadialGradient(markaz, nurY, 0, markaz, nurY, w * 0.6)
  nur.addColorStop(0, 'rgba(6,182,212,0.35)')
  nur.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = nur
  ctx.fillRect(0, 0, w, h)

  ctx.textAlign = 'center'

  // Brend
  const brendY = h * 0.13
  ctx.fillStyle = '#BFEAF5'
  ctx.font = '700 40px system-ui, sans-serif'
  ctx.letterSpacing = '4px'
  ctx.fillText('UROSFERA', markaz, brendY)
  ctx.letterSpacing = '0px'
  ctx.fillStyle = 'rgba(191,234,245,0.6)'
  ctx.font = '500 24px system-ui, sans-serif'
  const yonalishMatn = d.yonalish === 'ginekologiya' ? 'ginekologiya' : 'urologiya va andrologiya'
  ctx.fillText(`${yonalishMatn} platformasi`, markaz, brendY + 42)

  // Nishon
  const badgeW = 420
  const badgeCy = nurY
  chizNishon(ctx, markaz, badgeCy, badgeW, d.rank.darajaSon)

  // Unvon nomi
  const nomY = badgeCy + badgeW * 0.62 + 96
  ctx.fillStyle = '#DCF4FB'
  ctx.font = '800 88px Georgia, serif'
  ctx.fillText(d.rank.nom, markaz, nomY)

  // Daraja qatori
  ctx.fillStyle = accent
  ctx.font = '600 30px system-ui, sans-serif'
  ctx.letterSpacing = '2px'
  ctx.fillText(`${d.rank.darajaSon}-DARAJA · ${BOSQICH_NOMI[d.rank.tier]}`, markaz, nomY + 50)
  ctx.letterSpacing = '0px'

  // Stat tiles
  const statY = nomY + 110
  const tileW = 260, tileH = 130, tileGap = 30
  const boshX = markaz - (tileW * 2 + tileGap) / 2
  const statlar = [
    { son: `${d.ortacha}%`, yorliq: "O'RTACHA" },
    { son: `${d.seriya}`,   yorliq: 'KUN SERIYA' },
  ]
  statlar.forEach((st, i) => {
    const tx = boshX + i * (tileW + tileGap)
    ctx.fillStyle = 'rgba(255,255,255,0.06)'
    yumaloqRect(ctx, tx, statY, tileW, tileH, 22)
    ctx.fill()
    ctx.strokeStyle = 'rgba(6,182,212,0.32)'
    ctx.lineWidth = 1.5
    yumaloqRect(ctx, tx, statY, tileW, tileH, 22)
    ctx.stroke()
    ctx.fillStyle = '#DCF4FB'
    ctx.font = '800 56px Georgia, serif'
    ctx.fillText(st.son, tx + tileW / 2, statY + 66)
    ctx.fillStyle = '#6FB4C8'
    ctx.font = '600 24px system-ui, sans-serif'
    ctx.fillText(st.yorliq, tx + tileW / 2, statY + 104)
  })

  // Pastki blok
  const pastY = h - 160
  ctx.fillStyle = '#E4F4FA'
  ctx.font = '700 44px Georgia, serif'
  ctx.fillText(d.ism, markaz, pastY)
  ctx.fillStyle = '#6FB4C8'
  ctx.font = '500 28px system-ui, sans-serif'
  ctx.fillText('urosfera.uz', markaz, pastY + 44)

  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'))
}

function faylNom(rank: RankInfo) {
  return `urosfera-unvon-${rank.nom.toLowerCase().replace(/\s+/g, '-')}.png`
}

// ── Komponent ─────────────────────────────────────────────────────────────────

type Platform = 'instagram' | 'telegram' | 'facebook'

const PLATFORMALAR: { id: Platform; nom: string; rang: string; emoji: string }[] = [
  { id: 'instagram', nom: 'Instagram',  rang: 'linear-gradient(135deg,#833AB4,#E1306C)', emoji: '📸' },
  { id: 'telegram',  nom: 'Telegram',   rang: '#229ED9',                                 emoji: '✈️'  },
  { id: 'facebook',  nom: 'Facebook',   rang: '#1877F2',                                 emoji: '👥' },
]

export function UnvonUlashish({ data }: { data: UnvonUlashData }) {
  const [ishlayapti, setIshlayapti] = useState<Platform | null>(null)
  const [xato, setXato]             = useState<string | null>(null)

  const canNativeShare =
    typeof navigator !== 'undefined' &&
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files: [new File([], 'x.png', { type: 'image/png' })] })

  const shareText = `Urosfera'da "${data.rank.nom}" unvoniga erishdim! 🎖️\nurosfera.uz`

  const bosim = async (platform: Platform) => {
    setIshlayapti(platform)
    setXato(null)
    try {
      if (canNativeShare) {
        // Barcha platformalar uchun native share (foydalanuvchi ilovani o'zi tanlaydi)
        const blob = await storyBlob(data)
        if (!blob) throw new Error('rasm yaratilmadi')
        const fayl = new File([blob], faylNom(data.rank), { type: 'image/png' })
        await navigator.share({ files: [fayl], title: 'Urosfera unvoni', text: shareText })
      } else {
        // Desktop: rasm yuklab → platforma URL'ni ochamiz
        const blob = await storyBlob(data)
        if (!blob) throw new Error('rasm yaratilmadi')
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = faylNom(data.rank)
        a.click()
        URL.revokeObjectURL(url)

        // Telegram va Facebook uchun URL ulashish oynasini ochamiz
        if (platform === 'telegram') {
          const tgUrl = `https://t.me/share/url?url=${encodeURIComponent('https://urosfera.uz')}&text=${encodeURIComponent(shareText)}`
          window.open(tgUrl, '_blank', 'noopener')
        } else if (platform === 'facebook') {
          const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://urosfera.uz')}`
          window.open(fbUrl, '_blank', 'noopener')
        }
      }
    } catch (e) {
      if ((e as Error)?.name !== 'AbortError') {
        setXato("Ulashib bo'lmadi — rasmni yuklab olib qo'lda joylang")
      }
    } finally {
      setIshlayapti(null)
    }
  }

  return (
    <div style={{
      marginTop: 16,
      borderRadius: 16,
      overflow: 'hidden',
      background: 'linear-gradient(160deg, #062A3C, #081824)',
      border: '1px solid rgba(6,182,212,0.22)',
      boxShadow: '0 4px 20px rgba(6,182,212,0.08)',
    }}>
      {/* Sarlavha */}
      <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#DCF4FB', marginBottom: 3 }}>
          Unvoningizni ulashing 🎖️
        </div>
        <p style={{ margin: 0, fontSize: 11.5, color: 'rgba(220,244,251,0.6)', lineHeight: 1.5 }}>
          {canNativeShare
            ? 'Chiroyli story rasm tayyorlanadi — siz ilovani tanlaysiz.'
            : 'Rasm yuklab olinadi, so\'ng platformani ochamiz.'}
        </p>
      </div>

      {/* Platforma tugmalari */}
      <div style={{ padding: '12px 16px 14px', display: 'flex', flexDirection: 'column', gap: 9 }}>
        {PLATFORMALAR.map((p) => (
          <button
            key={p.id}
            onClick={() => bosim(p.id)}
            disabled={ishlayapti !== null}
            style={{
              display: 'flex', alignItems: 'center', gap: 11,
              background: ishlayapti === p.id ? 'rgba(255,255,255,0.08)' : p.rang,
              border: 'none', borderRadius: 11, padding: '11px 14px',
              color: 'white', fontWeight: 800, fontSize: 13,
              cursor: ishlayapti !== null ? 'wait' : 'pointer',
              opacity: ishlayapti !== null && ishlayapti !== p.id ? 0.55 : 1,
              transition: 'opacity 0.2s, transform 0.15s',
              transform: ishlayapti === p.id ? 'scale(0.98)' : 'scale(1)',
            }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>{p.emoji}</span>
            <span style={{ flex: 1, textAlign: 'left' }}>
              {ishlayapti === p.id ? 'Tayyorlanmoqda...' : `${p.nom}ga ulashish`}
            </span>
            {!canNativeShare && (ishlayapti !== p.id) && (
              <span style={{ fontSize: 10.5, opacity: 0.75, fontWeight: 600 }}>↓ rasm</span>
            )}
          </button>
        ))}

        {xato && (
          <p style={{ color: '#FCA5A5', fontSize: 12, margin: '4px 0 0', lineHeight: 1.45 }}>
            ⚠️ {xato}
          </p>
        )}
      </div>
    </div>
  )
}
