'use client'

import { BannerCarousel } from '@/components/BannerCarousel'

/**
 * Hero'ning o'ng tomoni — admin boshqaradigan reklama/e'lon joyi.
 *
 * Admin panelidan "🌐 Kirish sahifasi (ochiq)" bannerlari qo'shilsa,
 * o'shalar aylanib turadi. Banner bo'lmaganda bo'sh qolmasin —
 * o'rniga ilovaning haqiqiy ekrani ko'rsatiladi.
 *
 * Ilgari bu yerda uslublashtirilgan soxta panel (HeroMock) turardi —
 * u mahsulot haqida hech narsa aytmasdi va e'lon uchun joy ham bermasdi.
 */

const NAMUNA = {
  src: '/landing/talaba-bolimlar.webp',
  alt: "Urosfera talaba bo'limi — darslar, kutubxona, kalkulyatorlar",
}

function Namuna() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          width: 300,
          borderRadius: 26,
          overflow: 'hidden',
          border: '1px solid var(--line)',
          background: 'var(--surface)',
          boxShadow: 'var(--shadow)',
        }}
      >
        <img
          src={NAMUNA.src}
          alt={NAMUNA.alt}
          decoding="async"
          draggable={false}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>
    </div>
  )
}

export function HeroVisual() {
  return <BannerCarousel role="landing" faqatShuRol fallback={<Namuna />} />
}
