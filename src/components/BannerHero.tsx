'use client'

import { BannerCarousel } from './BannerCarousel'

// Banner sahifa tepasida turadi (Header ostida); keyingi kontent yumaloq burchakli
// "varaq" (sheet) bo'lib banner USTIDAN scroll bo'ladi. Banner sticky bo'lgani uchun
// scroll paytida joyida qoladi, varaq esa uni asta yopib boradi.
export function BannerHero({ role, maxWidth = 1000, children }: {
  role: string
  maxWidth?: number
  children: React.ReactNode
}) {
  return (
    <>
      {/* Banner qatlami — z-index 0, Header (z-20) uning ustida qoladi */}
      <div style={{ position: 'sticky', top: 0, zIndex: 0 }}>
        <div className="mx-auto px-4 pt-3 sm:px-6" style={{ maxWidth }}>
          <BannerCarousel role={role} />
        </div>
      </div>

      {/* Kontent varag'i — banner ustidan siljiydi */}
      <div style={{
        position: 'relative', zIndex: 1,
        background: 'var(--bg)',
        borderRadius: '22px 22px 0 0',
        marginTop: '14px',
        boxShadow: '0 -10px 26px rgba(2, 8, 23, .10)',
        minHeight: '70vh',
      }}>
        {children}
      </div>
    </>
  )
}
