'use client'

import { useEffect, useRef, useState } from 'react'
import { MoreVertical } from 'lucide-react'

// Uch nuqta (kebab) menyu — qatordagi bir nechta amalni bitta ⋮ tugmasiga yig'adi.
// Menyu `position: fixed` bilan chiziladi — jadval overflow'i uni kesib qo'ymaydi.
export type KebabAmal = {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  danger?: boolean
  disabled?: boolean
}

export function KebabMenu({ amallar, ariaLabel = 'Amallar' }: { amallar: KebabAmal[]; ariaLabel?: string }) {
  const [ochiq, setOchiq] = useState(false)
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const joylash = () => {
    const r = btnRef.current?.getBoundingClientRect()
    if (!r) return
    setPos({ top: r.bottom + 6, right: Math.max(8, window.innerWidth - r.right) })
  }

  const toggle = () => {
    if (!ochiq) joylash()
    setOchiq((v) => !v)
  }

  useEffect(() => {
    if (!ochiq) return
    const tashqariBosildi = (e: Event) => {
      if (menuRef.current?.contains(e.target as Node) || btnRef.current?.contains(e.target as Node)) return
      setOchiq(false)
    }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOchiq(false) }
    // Scroll/resize'da menyu tugmadan uzilib qolmasin — shunchaki yopamiz.
    const yop = () => setOchiq(false)
    document.addEventListener('mousedown', tashqariBosildi)
    window.addEventListener('keydown', esc)
    window.addEventListener('scroll', yop, true)
    window.addEventListener('resize', yop)
    return () => {
      document.removeEventListener('mousedown', tashqariBosildi)
      window.removeEventListener('keydown', esc)
      window.removeEventListener('scroll', yop, true)
      window.removeEventListener('resize', yop)
    }
  }, [ochiq])

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={ochiq}
        className="soft-press"
        style={{
          width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: ochiq ? 'var(--accent-soft)' : 'var(--surface-2)',
          border: `1px solid ${ochiq ? 'var(--accent)' : 'var(--line)'}`,
          color: ochiq ? 'var(--accent)' : 'var(--ink-soft)',
        }}
      >
        <MoreVertical size={17} strokeWidth={2.2} />
      </button>

      {ochiq && pos && (
        <div
          ref={menuRef}
          role="menu"
          style={{
            position: 'fixed', top: pos.top, right: pos.right, zIndex: 80, minWidth: '184px',
            background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px',
            boxShadow: '0 10px 34px rgba(0,0,0,.22)', padding: '6px', display: 'flex', flexDirection: 'column', gap: '2px',
          }}
        >
          {amallar.map((a, i) => (
            <button
              key={i}
              role="menuitem"
              disabled={a.disabled}
              onClick={() => { a.onClick(); setOchiq(false) }}
              className="row-hover"
              style={{
                display: 'flex', alignItems: 'center', gap: '9px', width: '100%', textAlign: 'left',
                background: 'none', border: 'none', borderRadius: '8px', padding: '9px 11px',
                fontSize: '13px', fontWeight: 600, cursor: a.disabled ? 'not-allowed' : 'pointer',
                color: a.danger ? 'var(--danger)' : 'var(--ink)', opacity: a.disabled ? 0.5 : 1,
                whiteSpace: 'nowrap',
              }}
            >
              {a.icon && <span style={{ display: 'inline-flex', flexShrink: 0 }}>{a.icon}</span>}
              {a.label}
            </button>
          ))}
        </div>
      )}
    </>
  )
}
