/**
 * Ilova skrinshotlaridan iborat aylanma tasma.
 *
 * Rasmlar `public/landing/` da — WebP, 560px kenglikda (retina uchun 2x),
 * har biri 45 KB dan kichik. Animatsiya globals.css dagi `.marquee` —
 * sof CSS, hover'da to'xtaydi, prefers-reduced-motion da o'chadi.
 *
 * Rasmlar `skrinshotlar/qirq.js` orqali tayyorlanadi: holat paneli,
 * ilova sarlavhasi (avatar bilan) va tab-navigatsiya kesib tashlangan.
 */

export type Skrinshot = { src: string; izoh: string }

const KARTA_KENGLIK = 220
const KARTA_BALAND = 380

function Karta({ s }: { s: Skrinshot }) {
  return (
    <figure style={{ margin: 0, width: KARTA_KENGLIK, flexShrink: 0 }}>
      <div
        style={{
          height: KARTA_BALAND,
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
          style={{
            width: '100%',
            height: '100%',
            // Yuqoridan tekislash — har kartada sarlavha ko'rinib tursin
            objectFit: 'cover',
            objectPosition: 'top',
            display: 'block',
          }}
        />
      </div>
      <figcaption
        style={{
          marginTop: 9,
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
  tezlik = '58s',
  teskari = false,
}: {
  rasmlar: Skrinshot[]
  tezlik?: string
  teskari?: boolean
}) {
  if (rasmlar.length === 0) return null

  return (
    <div className="marquee">
      <div
        className={`marquee-track${teskari ? ' teskari' : ''}`}
        style={{ ['--tezlik' as string]: tezlik, alignItems: 'flex-start' }}
      >
        {/* Ikki nusxa — uzilishsiz aylanish uchun (translateX -50%) */}
        {[...rasmlar, ...rasmlar].map((s, i) => (
          <Karta key={`${s.src}-${i}`} s={s} />
        ))}
      </div>
    </div>
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
