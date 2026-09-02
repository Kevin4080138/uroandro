'use client'

import { useEffect, useState } from 'react'

// O'ngdan sirg'alib chiquvchi panel (side drawer).
// Yopish: overlay bosish · Esc. Kirish/chiqish animatsiyali.
export function SideDrawer({
  ochiq, onYopish, en = 320, children,
}: {
  ochiq: boolean
  onYopish: () => void
  en?: number
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(ochiq)
  const [korin, setKorin] = useState(false)

  useEffect(() => {
    if (ochiq) {
      setMounted(true)
      const r = requestAnimationFrame(() => setKorin(true))
      return () => cancelAnimationFrame(r)
    }
    setKorin(false)
    const t = setTimeout(() => setMounted(false), 280)
    return () => clearTimeout(t)
  }, [ochiq])

  useEffect(() => {
    if (!mounted) return
    const eski = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = eski }
  }, [mounted])

  useEffect(() => {
    if (!ochiq) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onYopish() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [ochiq, onYopish])

  if (!mounted) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
      <div
        className="sd-ov"
        data-korin={korin ? '1' : '0'}
        onClick={onYopish}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.5)' }}
      />
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: `min(${en}px, 86vw)`,
          background: 'var(--surface)', boxShadow: '-8px 0 40px rgba(0,0,0,.28)',
          display: 'flex', flexDirection: 'column', overflowY: 'auto',
          transform: `translateX(${korin ? 0 : 100}%)`,
          transition: 'transform .28s cubic-bezier(.32,.72,0,1)',
        }}
      >
        {children}
      </div>
      <style>{`
        .sd-ov { opacity: 0; }
        .sd-ov[data-korin="1"] { opacity: 1; }
        @media (prefers-reduced-motion: no-preference) {
          .sd-ov { transition: opacity .28s ease; }
        }
      `}</style>
    </div>
  )
}
