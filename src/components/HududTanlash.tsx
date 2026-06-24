'use client'

import { useState, useRef, useEffect } from 'react'
import { HUDUDLAR, VILOYATLAR } from '@/lib/hududlar'

const inputStyle = {
  width: '100%',
  background: 'var(--surface-2)',
  color: 'var(--ink)',
  border: '1px solid var(--line)',
  borderRadius: '10px',
  padding: '10px 14px',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box' as const,
}

function Autokomplit({ value, onChange, variantlar, placeholder }: {
  value: string; onChange: (v: string) => void; variantlar: string[]; placeholder: string
}) {
  const [ochiq, setOchiq] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tashqi = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOchiq(false) }
    document.addEventListener('mousedown', tashqi)
    return () => document.removeEventListener('mousedown', tashqi)
  }, [])

  const mos = variantlar.filter((v) => v.toLowerCase().includes(value.toLowerCase())).slice(0, 30)

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <input
        style={inputStyle}
        value={value}
        placeholder={placeholder}
        onChange={(e) => { onChange(e.target.value); setOchiq(true) }}
        onFocus={() => setOchiq(true)}
      />
      {ochiq && mos.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 30,
          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)', maxHeight: '220px', overflowY: 'auto',
        }}>
          {mos.map((v) => (
            <div
              key={v}
              onClick={() => { onChange(v); setOchiq(false) }}
              style={{ padding: '9px 14px', fontSize: '13.5px', cursor: 'pointer' }}
              onMouseDown={(e) => e.preventDefault()}
              className="hover-row"
            >
              {v}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function HududTanlash({ viloyat, tuman, qolgan, onViloyat, onTuman, onQolgan }: {
  viloyat: string; tuman: string; qolgan: string
  onViloyat: (v: string) => void; onTuman: (v: string) => void; onQolgan: (v: string) => void
}) {
  const tumanlar = HUDUDLAR[viloyat] ?? []
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ flex: 1 }}>
          <Autokomplit value={viloyat} onChange={(v) => { onViloyat(v); onTuman('') }} variantlar={VILOYATLAR} placeholder="Viloyat" />
        </div>
        <div style={{ flex: 1 }}>
          <Autokomplit value={tuman} onChange={onTuman} variantlar={tumanlar} placeholder="Tuman / shahar" />
        </div>
      </div>
      <input style={inputStyle} value={qolgan} onChange={(e) => onQolgan(e.target.value)} placeholder="MFY, ko'cha, uy raqami" />
    </div>
  )
}
