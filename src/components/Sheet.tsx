'use client'

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

// Pastdan sirg'alib chiquvchi panel (bottom sheet) — native ilova hissi.
// Yopish: overlay bosish · Esc · pastga sudrab tashlash · X tugmasi.
export function Sheet({
  ochiq, onYopish, sarlavha, children,
}: {
  ochiq: boolean
  onYopish: () => void
  sarlavha?: React.ReactNode
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(ochiq)
  const [korin, setKorin] = useState(false)
  const [dragY, setDragY] = useState(0)
  const boshY = useRef<number | null>(null)

  // Kirish/chiqish animatsiyasi — chiqishda DOM'ni darrov o'chirmaymiz.
  useEffect(() => {
    if (ochiq) {
      setMounted(true)
      const r = requestAnimationFrame(() => setKorin(true))
      return () => cancelAnimationFrame(r)
    }
    setKorin(false)
    const t = setTimeout(() => setMounted(false), 260)
    return () => clearTimeout(t)
  }, [ochiq])

  // Ochiq turganda orqa fon scroll qilinmasin.
  useEffect(() => {
    if (!mounted) return
    const eski = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = eski }
  }, [mounted])

  // Esc — yopish.
  useEffect(() => {
    if (!ochiq) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onYopish() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [ochiq, onYopish])

  if (!mounted) return null

  // Sudrash (drag-to-dismiss) — faqat pastga, 90px dan oshsa yopiladi.
  const boshla = (y: number) => { boshY.current = y }
  const suradi = (y: number) => {
    if (boshY.current === null) return
    setDragY(Math.max(0, y - boshY.current))
  }
  const qoyib = () => {
    if (boshY.current === null) return
    if (dragY > 90) onYopish()
    setDragY(0)
    boshY.current = null
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60 }} aria-hidden={!ochiq}>
      <div
        className="sheet-ov"
        data-korin={korin ? '1' : '0'}
        onClick={onYopish}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.5)' }}
      />
      <div
        className="sheet-pn"
        data-korin={korin ? '1' : '0'}
        role="dialog"
        aria-modal="true"
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          maxHeight: '86vh', display: 'flex', flexDirection: 'column',
          background: 'var(--surface)', borderRadius: '20px 20px 0 0',
          boxShadow: '0 -8px 40px rgba(0,0,0,.28)',
          transform: `translateY(${korin ? dragY : 600}px)`,
          transition: boshY.current === null ? 'transform .26s cubic-bezier(.32,.72,0,1)' : 'none',
        }}
      >
        {/* Sudrash dastagi */}
        <div
          onPointerDown={(e) => { (e.target as HTMLElement).setPointerCapture(e.pointerId); boshla(e.clientY) }}
          onPointerMove={(e) => suradi(e.clientY)}
          onPointerUp={qoyib}
          onPointerCancel={qoyib}
          style={{ padding: '10px 0 6px', display: 'flex', justifyContent: 'center', cursor: 'grab', touchAction: 'none', flexShrink: 0 }}
        >
          <span style={{ width: '38px', height: '4px', borderRadius: '999px', background: 'var(--line)' }} />
        </div>

        {sarlavha !== undefined && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '2px 18px 12px', borderBottom: '1px solid var(--line)', flexShrink: 0,
          }}>
            <div style={{ flex: 1, minWidth: 0, fontSize: '15px', fontWeight: 900, color: 'var(--ink)' }}>{sarlavha}</div>
            <button
              onClick={onYopish}
              aria-label="Yopish"
              className="soft-press"
              style={{
                width: '32px', height: '32px', borderRadius: '999px', flexShrink: 0, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--muted)',
              }}
            >
              <X size={17} strokeWidth={2.2} />
            </button>
          </div>
        )}

        <div style={{ overflowY: 'auto', padding: '16px 18px calc(20px + env(safe-area-inset-bottom))' }}>
          {children}
        </div>
      </div>

      <style>{`
        .sheet-ov { opacity: 0; }
        .sheet-ov[data-korin="1"] { opacity: 1; }
        @media (prefers-reduced-motion: no-preference) {
          .sheet-ov { transition: opacity .26s ease; }
        }
      `}</style>
    </div>
  )
}
