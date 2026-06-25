'use client'

import { useState } from 'react'

const inputStyleAsosiy = {
  width: '100%', background: 'var(--surface-2)', color: 'var(--ink)', border: '1px solid var(--line)',
  borderRadius: '10px', padding: '8px 10px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' as const,
}

export function HoverVariantInput({ value, onChange, variantlar, placeholder, type = 'text' }: {
  value: string | number
  onChange: (v: string) => void
  variantlar: (string | number)[]
  placeholder?: string
  type?: 'text' | 'number'
}) {
  const [ochiq, setOchiq] = useState(false)

  const mosKeluvchilar = type === 'text' && typeof value === 'string' && value.trim()
    ? variantlar.filter((v) => String(v).toLowerCase().includes(value.toLowerCase()))
    : variantlar

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setOchiq(true)}
      onMouseLeave={() => setOchiq(false)}
    >
      <input
        type={type}
        style={inputStyleAsosiy}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {ochiq && mosKeluvchilar.length > 0 && (
        <div className="menyu-ochilish" style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 60,
          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '10px',
          boxShadow: '0 10px 28px rgba(0,0,0,0.15)', maxHeight: '200px', overflowY: 'auto',
          display: 'flex', flexWrap: 'wrap', gap: '4px', padding: '6px',
          transformOrigin: 'top left',
        }}>
          {mosKeluvchilar.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => { onChange(String(v)); setOchiq(false) }}
              className="soft-press"
              style={{
                background: 'var(--surface-2)', color: 'var(--ink-soft)', border: '1px solid var(--line)',
                borderRadius: '999px', padding: '5px 11px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {v}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
