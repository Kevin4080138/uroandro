'use client'

import { BannerCarousel } from './BannerCarousel'

// FAQAT TELEFON (≤680px): banner sahifa tepasida turadi, keyingi kontent yumaloq
// burchakli "varaq" bo'lib banner USTIDAN scroll bo'ladi.
// Kompyuterda bu komponent hech narsani o'zgartirmaydi: tepadagi banner yashirinadi,
// varaq oddiy oqimga qaytadi — sahifalar o'z desktop ko'rinishida qoladi.
export function BannerHero({ role, maxWidth = 1000, children }: {
  role: string
  maxWidth?: number
  children: React.ReactNode
}) {
  return (
    <>
      <style>{`
        .bh-banner { position: sticky; top: 0; z-index: 0; }
        .bh-sheet {
          position: relative; z-index: 1;
          background: var(--bg);
          border-radius: 22px 22px 0 0;
          margin-top: 14px;
          box-shadow: 0 -10px 26px rgba(2, 8, 23, .10);
          min-height: 70vh;
        }
        @media (min-width: 681px) {
          .bh-banner { display: none; }
          .bh-sheet { border-radius: 0; margin-top: 0; box-shadow: none; min-height: auto; }
        }
      `}</style>

      {/* Banner qatlami — z-index 0, Header (z-20) uning ustida qoladi */}
      <div className="bh-banner">
        <div className="mx-auto px-4 pt-3" style={{ maxWidth }}>
          <BannerCarousel role={role} />
        </div>
      </div>

      {/* Kontent varag'i — telefonda banner ustidan siljiydi */}
      <div className="bh-sheet">
        {children}
      </div>
    </>
  )
}
