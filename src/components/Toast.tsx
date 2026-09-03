'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Info, type LucideIcon } from 'lucide-react'

// Umumiy bildirishnoma (toast) tizimi — provider'siz.
// Istalgan joyda `showToast('matn', 'success')` chaqiring; sahifada bir marta
// <Toaster/> turgan bo'lsa (talaba layout'ida), toast o'sha yerda ko'rinadi.

export type ToastTuri = 'success' | 'error' | 'info'
type ToastItem = { id: number; matn: string; turi: ToastTuri }

let ketma = 0
const tinglovchilar = new Set<(t: ToastItem) => void>()

export function showToast(matn: string, turi: ToastTuri = 'info') {
  const item: ToastItem = { id: ++ketma, matn, turi }
  tinglovchilar.forEach((l) => l(item))
}

const MA: Record<ToastTuri, { Icon: LucideIcon; rang: string }> = {
  success: { Icon: CheckCircle2, rang: '#16a34a' },
  error:   { Icon: XCircle,      rang: 'var(--danger)' },
  info:    { Icon: Info,         rang: 'var(--accent)' },
}

const DAVOMIYLIK = 2800

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([])

  useEffect(() => {
    const l = (it: ToastItem) => {
      setItems((p) => [...p, it])
      setTimeout(() => setItems((p) => p.filter((x) => x.id !== it.id)), DAVOMIYLIK)
    }
    tinglovchilar.add(l)
    return () => { tinglovchilar.delete(l) }
  }, [])

  if (items.length === 0) return null

  return (
    <div
      style={{
        position: 'fixed', left: '50%', transform: 'translateX(-50%)', zIndex: 90,
        bottom: 'calc(92px + env(safe-area-inset-bottom))',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        width: 'max-content', maxWidth: 'calc(100vw - 32px)', pointerEvents: 'none',
      }}
    >
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .toast-item { animation: toast-in .28s cubic-bezier(.32,.72,0,1) both; }
        }
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(14px) scale(.96); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>
      {items.map((t) => {
        const m = MA[t.turi]
        return (
          <div
            key={t.id}
            className="toast-item"
            role="status"
            aria-live="polite"
            style={{
              display: 'flex', alignItems: 'center', gap: '9px',
              background: 'var(--surface)', border: '1px solid var(--line)',
              borderLeft: `3px solid ${m.rang}`,
              borderRadius: '12px', padding: '11px 15px',
              boxShadow: '0 10px 30px rgba(0,0,0,.22)',
              fontSize: '13px', fontWeight: 700, color: 'var(--ink)',
              maxWidth: '100%',
            }}
          >
            <m.Icon size={17} strokeWidth={2.2} style={{ color: m.rang, flexShrink: 0 }} />
            <span style={{ minWidth: 0 }}>{t.matn}</span>
          </div>
        )
      })}
    </div>
  )
}
