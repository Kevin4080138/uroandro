'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const row = { display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #e5e7eb', fontSize: '14px' }
const label = { color: '#6b7280' }

export default function PrintReferralPage() {
  const { tashrifId } = useParams<{ tashrifId: string }>()
  const router = useRouter()
  const supabase = createClient()

  const [tashrif, setTashrif] = useState<any>(null)
  const [bemor, setBemor] = useState<any>(null)
  const [shifokor, setShifokor] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: t } = await supabase.from('tashriflar').select('*').eq('id', tashrifId).single()
      if (!t) { setLoading(false); return }
      setTashrif(t)

      const [{ data: b }, { data: s }] = await Promise.all([
        supabase.from('bemorlar').select('*').eq('id', t.bemor_id).single(),
        supabase.from('profiles').select('*').eq('id', t.doctor_id).single(),
      ])
      setBemor(b)
      setShifokor(s)
      setLoading(false)
    }
    load()
  }, [tashrifId])

  if (loading) return <p style={{ padding: '32px' }}>Yuklanmoqda...</p>
  if (!tashrif || !bemor) return <p style={{ padding: '32px' }}>Topilmadi.</p>

  const tekshiruvlar = (tashrif.buyurilgan_tekshiruvlar || '').split(',').map((s: string) => s.trim()).filter(Boolean)

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '24px' }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>

      <div className="no-print" style={{ maxWidth: '720px', margin: '0 auto 16px', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={() => router.back()} style={{
          backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '8px',
          padding: '8px 16px', cursor: 'pointer', fontSize: '14px',
        }}>
          ← Orqaga
        </button>
        <button onClick={() => window.print()} style={{
          backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px',
          padding: '8px 16px', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
        }}>
          🖨️ Chop etish / PDF
        </button>
      </div>

      <div style={{
        maxWidth: '720px', margin: '0 auto', backgroundColor: 'white', color: '#111827',
        borderRadius: '8px', padding: '40px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px', borderBottom: '2px solid #111827', paddingBottom: '16px' }}>
          <h1 style={{ margin: 0, fontSize: '24px' }}>UroAndro</h1>
          <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '13px' }}>Urologiya va Andrologiya platformasi</p>
          <h2 style={{ margin: '12px 0 0', fontSize: '16px' }}>Tekshiruvga yo&apos;llanma</h2>
        </div>

        <h3 style={{ fontSize: '14px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>Bemor ma&apos;lumotlari</h3>
        <div style={row}><span style={label}>F.I.O.</span><span>{bemor.fio}</span></div>
        <div style={row}><span style={label}>Pasport</span><span>{[bemor.passport_seria, bemor.passport_raqam].filter(Boolean).join(' ') || '—'}</span></div>
        <div style={row}><span style={label}>Tug&apos;ilgan sana</span><span>{bemor.tugilgan_sana ?? '—'}</span></div>

        <h3 style={{ fontSize: '14px', color: '#6b7280', textTransform: 'uppercase', marginTop: '24px', marginBottom: '8px' }}>Shikoyat va anamnez</h3>
        <div style={row}><span style={label}>Shikoyati</span><span style={{ textAlign: 'right', maxWidth: '60%' }}>{tashrif.shikoyat || '—'}</span></div>
        <div style={row}><span style={label}>Anamnez</span><span style={{ textAlign: 'right', maxWidth: '60%' }}>{tashrif.anamnez || '—'}</span></div>

        <h3 style={{ fontSize: '14px', color: '#6b7280', textTransform: 'uppercase', marginTop: '24px', marginBottom: '8px' }}>Buyurilgan tekshiruvlar</h3>
        {tekshiruvlar.length === 0 ? (
          <p style={{ fontSize: '14px', color: '#6b7280' }}>—</p>
        ) : (
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            {tekshiruvlar.map((tek: string) => (
              <li key={tek} style={{ fontSize: '15px', marginBottom: '6px' }}>{tek}</li>
            ))}
          </ul>
        )}

        <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6b7280' }}>
          <span>Sana: {new Date(tashrif.sana).toLocaleDateString()}</span>
          <span>Shifokor: {shifokor?.full_name ?? '—'}</span>
        </div>
      </div>
    </div>
  )
}
