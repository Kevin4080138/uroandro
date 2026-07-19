'use client'

import { useEffect, useRef, useState } from 'react'
import { SertifikatVaraq, type SertifikatMalumoti } from '@/components/sertifikat/SertifikatVaraq'
import { UlashishRasmi } from '@/components/sertifikat/UlashishRasmi'

// Sertifikat varag'i A4 kengligida (1123px) chiziladi — telefon ekraniga sig'maydi,
// shu sabab ko'rish uchun konteyner kengligiga qarab kichraytiriladi. Chop etishda
// esa transform bekor qilinadi (@media print), ya'ni PDF to'liq o'lchamda chiqadi.
export function SertifikatAmallar({ s }: { s: SertifikatMalumoti }) {
  const konteynerRef = useRef<HTMLDivElement>(null)
  const [masshtab, setMasshtab] = useState(1)
  const [nusxaOlindi, setNusxaOlindi] = useState(false)

  useEffect(() => {
    const hisobla = () => {
      const kenglik = konteynerRef.current?.clientWidth ?? 1123
      setMasshtab(Math.min(1, kenglik / 1123))
    }
    hisobla()
    window.addEventListener('resize', hisobla)
    return () => window.removeEventListener('resize', hisobla)
  }, [])

  const havolaniNusxala = async () => {
    try {
      await navigator.clipboard.writeText(s.tekshirishUrl)
      setNusxaOlindi(true)
      setTimeout(() => setNusxaOlindi(false), 2000)
    } catch {
      /* clipboard yopiq bo'lsa — havola baribir ko'rinib turibdi */
    }
  }

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '18px 20px 60px' }}>
      <div
        ref={konteynerRef}
        style={{ width: '100%', height: 794 * masshtab, overflow: 'hidden', marginBottom: '22px' }}
      >
        <div style={{
          transform: `scale(${masshtab})`, transformOrigin: 'top left',
          boxShadow: '0 18px 50px rgba(0,0,0,.28)', width: 1123, height: 794,
        }}>
          <SertifikatVaraq s={s} />
        </div>
      </div>

      <div className="sert-yashir-chop" style={{
        background: 'var(--surface)', border: '1px solid var(--line)',
        borderRadius: '16px', padding: '18px 20px',
      }}>
        <h2 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 800 }}>Yuklab olish va ulashish</h2>
        <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6 }}>
          Chop etish uchun PDF, ijtimoiy tarmoqlar uchun rasm. Instagram PDF qabul qilmaydi —
          u yerga rasm variantini joylang.
        </p>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
          <button
            onClick={() => window.print()}
            style={{
              background: 'linear-gradient(120deg, var(--accent), var(--accent-2))', color: 'white',
              border: 'none', borderRadius: '11px', padding: '11px 18px',
              fontWeight: 800, fontSize: '13.5px', cursor: 'pointer',
            }}
          >
            📄 PDF yuklab olish (A4)
          </button>
        </div>

        <UlashishRasmi s={s} />

        <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid var(--line)' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--muted)', marginBottom: '7px' }}>
            Tekshirish havolasi
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <code style={{
              fontSize: '12.5px', background: 'var(--surface-2)', padding: '8px 12px',
              borderRadius: '8px', color: 'var(--ink-soft)', wordBreak: 'break-all',
            }}>
              {s.tekshirishUrl}
            </code>
            <button
              onClick={havolaniNusxala}
              style={{
                background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--ink)',
                borderRadius: '9px', padding: '8px 14px', fontWeight: 700, fontSize: '12.5px', cursor: 'pointer',
              }}
            >
              {nusxaOlindi ? '✓ Nusxalandi' : 'Nusxalash'}
            </button>
          </div>
          <p style={{ margin: '8px 0 0', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
            Bu havolani ish beruvchi yoki ustozingizga bering — u sertifikat haqiqiyligini
            o&apos;zi tekshira oladi. Sertifikatdagi QR ham shu manzilga olib boradi.
          </p>
        </div>
      </div>
    </div>
  )
}
