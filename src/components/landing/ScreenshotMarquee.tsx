/**
 * Ilova skrinshotlaridan iborat aylanma tasma.
 *
 * Rasmlar `public/landing/` da — WebP, 560px kenglikda (retina uchun 2x),
 * har biri 45 KB dan kichik. Tasma o'zi aylanadi va qo'lda ham suriladi
 * (AylanmaTasma) — telefonda barmoq, kompyuterda sichqoncha bilan.
 *
 * Rasmlar `skrinshotlar/qirq.js` orqali tayyorlanadi: holat paneli,
 * ilova sarlavhasi (avatar bilan) va tab-navigatsiya kesib tashlangan.
 */

import { AylanmaTasma } from './AylanmaTasma'

export type Skrinshot = { src: string; izoh: string }

/**
 * Balandlik qat'iy, kenglik esa rasmning o'z nisbatiga qarab o'zgaradi.
 *
 * Ilgari kenglik qat'iy edi va `object-fit: cover` ishlatilardi — natijada
 * nisbati mos kelmagan rasmlar kesilib qolardi (11 qadamdan 8 tasi ko'rinardi,
 * "QADAM" yozuvi "ADAM" bo'lib qolardi). Endi hech narsa kesilmaydi:
 * tasmaning tepa va past chizig'i tekis, kengliklar tabiiy farq qiladi.
 */
const KARTA_BALAND = 420
const IZOH_KENGLIK = 230

function Karta({ s }: { s: Skrinshot }) {
  return (
    <figure
      style={{
        margin: 0, flexShrink: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}
    >
      <div
        style={{
          height: KARTA_BALAND,
          width: 'fit-content',
          borderRadius: 18,
          overflow: 'hidden',
          border: '1px solid var(--line)',
          background: 'var(--surface)',
          boxShadow: 'var(--shadow)',
        }}
      >
        <img
          src={s.src}
          alt={s.izoh}
          loading="lazy"
          decoding="async"
          draggable={false}
          style={{ height: '100%', width: 'auto', display: 'block' }}
        />
      </div>
      <figcaption
        style={{
          marginTop: 9,
          maxWidth: IZOH_KENGLIK,
          fontSize: 12,
          color: 'var(--muted)',
          textAlign: 'center',
          lineHeight: 1.35,
        }}
      >
        {s.izoh}
      </figcaption>
    </figure>
  )
}

export function ScreenshotMarquee({
  rasmlar,
  tezlikPx = 45,
  teskari = false,
}: {
  rasmlar: Skrinshot[]
  /** Sekundiga necha piksel suriladi (avval "58s" kabi string edi) */
  tezlikPx?: number
  teskari?: boolean
}) {
  if (rasmlar.length === 0) return null

  return (
    <AylanmaTasma tezlikPx={tezlikPx} teskari={teskari}>
      {rasmlar.map((s, i) => (
        <Karta key={`${s.src}-${i}`} s={s} />
      ))}
    </AylanmaTasma>
  )
}

// ── Tayyor to'plamlar ────────────────────────────────────────────────────────

export const TALABA_SKRINSHOTLAR: Skrinshot[] = [
  { src: '/landing/talaba-bolimlar.webp',      izoh: "Talaba bo'limlari" },
  { src: '/landing/talaba-bosqich-oson.webp',  izoh: 'Birinchi bosqich — bepul' },
  { src: '/landing/talaba-nazariya.webp',      izoh: 'Nazariya — manbasi ko\'rsatilgan' },
  { src: '/landing/talaba-dars-qadamlar.webp', izoh: 'Bir dars — 11 qadam' },
  { src: '/landing/talaba-bosqich-pro.webp',   izoh: 'Qiyin bosqich — klinik qarorlar' },
  { src: '/landing/talaba-kalkulyator.webp',   izoh: 'Kalkulyatorlar' },
]

/**
 * Kirish sahifasi uchun — ikkala bo'lim aralash.
 * Mehmon rolini hali tanlamagani uchun platforma har ikkalasi uchun
 * ishlashini bir qarashda ko'rsatadi. Izohda bo'lim nomi turadi.
 */
export const ARALASH_SKRINSHOTLAR: Skrinshot[] = [
  { src: '/landing/talaba-bolimlar.webp',      izoh: "Talaba — bo'limlar" },
  { src: '/landing/bemor-qayeringiz.webp',     izoh: 'Bemor — shikoyatni belgilash' },
  { src: '/landing/talaba-nazariya.webp',      izoh: 'Talaba — nazariya' },
  { src: '/landing/bemor-yonalish.webp',       izoh: "Bemor — taxminiy yo'nalish" },
  { src: '/landing/talaba-dars-qadamlar.webp', izoh: 'Talaba — bir dars, 11 qadam' },
  { src: '/landing/bemor-operatsiya.webp',     izoh: 'Bemor — operatsiyalar' },
  { src: '/landing/talaba-bosqich-pro.webp',   izoh: 'Talaba — qiyin bosqich' },
  { src: '/landing/bemor-oz-tekshiruv.webp',   izoh: "Bemor — o'z-o'zini tekshirish" },
  { src: '/landing/talaba-kalkulyator.webp',   izoh: 'Talaba — kalkulyatorlar' },
  { src: '/landing/bemor-bolimlar.webp',       izoh: "Bemor — bo'limlar" },
]

export const BEMOR_SKRINSHOTLAR: Skrinshot[] = [
  { src: '/landing/bemor-bolimlar.webp',     izoh: "Bemor bo'limi" },
  { src: '/landing/bemor-qayeringiz.webp',   izoh: 'Qayeringiz bezovta qilyapti?' },
  { src: '/landing/bemor-shikoyat.webp',     izoh: 'Shikoyatni belgilash' },
  { src: '/landing/bemor-yonalish.webp',     izoh: "Taxminiy yo'nalish" },
  { src: '/landing/bemor-operatsiya.webp',   izoh: 'Operatsiyalar — oddiy tilda' },
  { src: '/landing/bemor-oz-tekshiruv.webp', izoh: "O'z-o'zini tekshirish" },
]
