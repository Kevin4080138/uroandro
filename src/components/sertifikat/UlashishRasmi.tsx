'use client'

import { useState } from 'react'
import type { SertifikatMalumoti } from '@/components/sertifikat/SertifikatVaraq'

// Ijtimoiy tarmoqlar uchun rasm. Instagram PDF qabul qilmaydi, shu sabab
// sertifikat alohida PNG bo'lib chiziladi: kvadrat (lenta) va 9:16 (story).
// Canvas'da chiziladi — qo'shimcha kutubxonasiz va serverga murojaatsiz ishlaydi.

type Olcham = 'kvadrat' | 'story'

const OLCHAMLAR: Record<Olcham, { w: number; h: number; nom: string; izoh: string }> = {
  kvadrat: { w: 1080, h: 1080, nom: 'Instagram lenta', izoh: '1080×1080' },
  story:   { w: 1080, h: 1920, nom: 'Story', izoh: '1080×1920' },
}

function matnniBol(ctx: CanvasRenderingContext2D, matn: string, maxKenglik: number): string[] {
  const sozlar = matn.split(' ')
  const qatorlar: string[] = []
  let joriy = ''
  for (const soz of sozlar) {
    const sinov = joriy ? `${joriy} ${soz}` : soz
    if (ctx.measureText(sinov).width > maxKenglik && joriy) {
      qatorlar.push(joriy)
      joriy = soz
    } else {
      joriy = sinov
    }
  }
  if (joriy) qatorlar.push(joriy)
  return qatorlar
}

async function rasmYukla(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

async function chiz(s: SertifikatMalumoti, olcham: Olcham): Promise<Blob | null> {
  const { w, h } = OLCHAMLAR[olcham]
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const nishonmi = s.turi === 'bob'
  const markaz = w / 2

  // Fon — chuqur ko'k gradient
  const fon = ctx.createLinearGradient(0, 0, w, h)
  fon.addColorStop(0, '#0d1730')
  fon.addColorStop(0.55, '#14213d')
  fon.addColorStop(1, '#1b2c52')
  ctx.fillStyle = fon
  ctx.fillRect(0, 0, w, h)

  // Yumshoq nur
  const nur = ctx.createRadialGradient(markaz, h * 0.34, 0, markaz, h * 0.34, w * 0.72)
  nur.addColorStop(0, 'rgba(37,99,235,.30)')
  nur.addColorStop(1, 'rgba(37,99,235,0)')
  ctx.fillStyle = nur
  ctx.fillRect(0, 0, w, h)

  // Oltin hoshiya
  const chet = 44
  ctx.strokeStyle = '#c9a227'
  ctx.lineWidth = 3
  ctx.strokeRect(chet, chet, w - chet * 2, h - chet * 2)
  ctx.strokeStyle = 'rgba(255,255,255,.22)'
  ctx.lineWidth = 1
  ctx.strokeRect(chet + 12, chet + 12, w - (chet + 12) * 2, h - (chet + 12) * 2)

  const y0 = olcham === 'story' ? h * 0.20 : h * 0.10

  ctx.textAlign = 'center'

  // Brend
  ctx.fillStyle = '#c9a227'
  ctx.font = '700 30px system-ui, sans-serif'
  ctx.letterSpacing = '8px'
  ctx.fillText('UROSFERA', markaz, y0)
  ctx.letterSpacing = '0px'

  ctx.fillStyle = 'rgba(255,255,255,.6)'
  ctx.font = '500 22px system-ui, sans-serif'
  ctx.fillText('urologiya va andrologiya platformasi', markaz, y0 + 40)

  // Sarlavha
  ctx.fillStyle = '#ffffff'
  ctx.font = `800 ${olcham === 'story' ? 82 : 74}px Georgia, serif`
  ctx.fillText(nishonmi ? 'NISHON' : 'SERTIFIKAT', markaz, y0 + 150)

  // Oltin ajratkich
  ctx.fillStyle = '#c9a227'
  ctx.fillRect(markaz - 90, y0 + 178, 180, 3)

  // Ism
  ctx.fillStyle = '#ffffff'
  ctx.font = `800 ${olcham === 'story' ? 66 : 58}px Georgia, serif`
  const ismQatorlari = matnniBol(ctx, s.ism, w - 200)
  let y = y0 + 268
  for (const qator of ismQatorlari) {
    ctx.fillText(qator, markaz, y)
    y += olcham === 'story' ? 76 : 68
  }

  // Tavsif
  ctx.fillStyle = 'rgba(255,255,255,.85)'
  ctx.font = '500 30px system-ui, sans-serif'
  const tavsif = nishonmi
    ? `${s.kategoriya} bo'limini tugalladi`
    : `${s.bosqichNomi} bosqichini yakunladi`
  y += 12
  for (const qator of matnniBol(ctx, tavsif, w - 220)) {
    ctx.fillText(qator, markaz, y)
    y += 42
  }

  // Natija yorliqlari
  y += 28
  const yorliqlar = [`${s.darsSoni} ta dars`]
  if (s.foiz != null && s.foiz > 0) yorliqlar.push(`${s.foiz}% natija`)
  ctx.font = '700 26px system-ui, sans-serif'
  const kenglikar = yorliqlar.map((t) => ctx.measureText(t).width + 52)
  const jamiKenglik = kenglikar.reduce((a, b) => a + b, 0) + (yorliqlar.length - 1) * 18
  let x = markaz - jamiKenglik / 2
  yorliqlar.forEach((t, i) => {
    const kw = kenglikar[i]
    ctx.fillStyle = 'rgba(255,255,255,.10)'
    ctx.beginPath()
    ctx.roundRect(x, y - 34, kw, 54, 27)
    ctx.fill()
    ctx.strokeStyle = 'rgba(201,162,39,.5)'
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.fillStyle = '#ffffff'
    ctx.fillText(t, x + kw / 2, y + 2)
    x += kw + 18
  })

  // Pastki blok pastdan yuqoriga quriladi. Har bir element balandlikdan alohida
  // ayirib hisoblanganda ular ustma-ust tushib qolgan edi — shu sabab bu yerda
  // ketma-ket, oldingisidan aniq masofada joylashtiriladi.
  const saytY = h - chet - 38
  const izohY = saytY - 48
  const kodY = izohY - 42
  const qrOlcham = olcham === 'story' ? 210 : 190
  const qrY = kodY - 56 - qrOlcham

  try {
    const qr = await rasmYukla(s.qrDataUrl)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(markaz - qrOlcham / 2 - 12, qrY - 12, qrOlcham + 24, qrOlcham + 24)
    ctx.drawImage(qr, markaz - qrOlcham / 2, qrY, qrOlcham, qrOlcham)

    ctx.fillStyle = 'rgba(255,255,255,.55)'
    ctx.font = '500 22px system-ui, sans-serif'
    ctx.fillText('Haqiqiyligini tekshirish uchun skanerlang', markaz, izohY)
  } catch {
    // QR yuklanmasa ham rasm chiqaveradi — tekshirish kodining o'zi yetarli
  }

  ctx.fillStyle = '#c9a227'
  ctx.font = '700 30px ui-monospace, Menlo, monospace'
  ctx.fillText(s.kod, markaz, kodY)

  ctx.fillStyle = 'rgba(255,255,255,.75)'
  ctx.font = '600 24px system-ui, sans-serif'
  ctx.fillText('urosfera.uz', markaz, saytY)

  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'))
}

export function UlashishRasmi({ s }: { s: SertifikatMalumoti }) {
  const [ishlayapti, setIshlayapti] = useState<Olcham | null>(null)
  const [xato, setXato] = useState<string | null>(null)

  const yuklab = async (olcham: Olcham) => {
    setIshlayapti(olcham)
    setXato(null)
    try {
      const blob = await chiz(s, olcham)
      if (!blob) throw new Error('rasm yaratilmadi')
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `urosfera-${s.kod}-${olcham}.png`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setXato("Rasm yaratilmadi — sahifani yangilab qayta urinib ko'ring")
    } finally {
      setIshlayapti(null)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {(Object.keys(OLCHAMLAR) as Olcham[]).map((o) => (
          <button
            key={o}
            onClick={() => yuklab(o)}
            disabled={ishlayapti !== null}
            style={{
              background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)',
              borderRadius: '11px', padding: '11px 16px', fontWeight: 700, fontSize: '13.5px',
              cursor: ishlayapti ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
            }}
          >
            <span style={{ fontSize: '16px' }}>{o === 'kvadrat' ? '📷' : '📱'}</span>
            <span>
              {OLCHAMLAR[o].nom}
              <span style={{ color: 'var(--muted)', fontWeight: 500, marginLeft: '6px', fontSize: '11.5px' }}>
                {OLCHAMLAR[o].izoh}
              </span>
            </span>
          </button>
        ))}
      </div>
      {xato && <p style={{ color: 'var(--danger)', fontSize: '12.5px', margin: '8px 0 0' }}>{xato}</p>}
    </div>
  )
}
