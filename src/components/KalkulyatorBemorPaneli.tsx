'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function KalkulyatorBemorPaneli({ bemorId, bemor, tayyor, saqlash }: {
  bemorId: string | null
  bemor: { fio: string } | null
  tayyor: boolean
  saqlash: () => Promise<{ error: string | null }>
}) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saqlandi, setSaqlandi] = useState(false)
  const [xato, setXato] = useState<string | null>(null)

  if (!bemor) return null

  const bosildi = async () => {
    setSaving(true)
    setXato(null)
    const res = await saqlash()
    setSaving(false)
    if (res.error) { setXato(res.error); return }
    setSaqlandi(true)
  }

  return (
    <div className="rise" style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px', flexWrap: 'wrap',
      background: 'var(--accent-soft)', border: '1px solid var(--accent)', borderRadius: '14px',
      padding: '12px 18px', marginBottom: '18px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', fontWeight: 600 }}>
        <span style={{
          width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent)', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, flexShrink: 0,
        }}>
          {bemor.fio.trim().charAt(0).toUpperCase()}
        </span>
        Bemor: <strong>{bemor.fio}</strong> uchun to&apos;ldirilmoqda
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {saqlandi && bemorId && (
          <button
            onClick={() => router.push(`/doctor/patients/${bemorId}`)}
            className="soft-press menyu-ochilish"
            style={{
              background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--line)', borderRadius: '999px',
              padding: '8px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap',
            }}
          >
            ← Bemor profiliga qaytish
          </button>
        )}
        <button
          onClick={bosildi}
          disabled={!tayyor || saving}
          className="soft-press"
          style={{
            background: saqlandi ? 'var(--good)' : 'var(--accent)', color: 'white', border: 'none', borderRadius: '999px',
            padding: '8px 18px', cursor: tayyor ? 'pointer' : 'not-allowed', fontSize: '13px', fontWeight: 700,
            opacity: tayyor ? 1 : 0.5, whiteSpace: 'nowrap',
          }}
        >
          {saving ? 'Saqlanmoqda...' : saqlandi ? '✓ Saqlandi' : '💾 Bemorga saqlash'}
        </button>
      </div>
      {xato && <span style={{ color: 'var(--danger)', fontSize: '12.5px', width: '100%' }}>{xato}</span>}
    </div>
  )
}
