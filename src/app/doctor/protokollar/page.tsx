'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PROTOKOLLAR } from '@/lib/protokollar'

const inputStyle = {
  backgroundColor: '#1e1e2e', color: 'white', border: '1px solid #2e2e3e',
  borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', maxWidth: '320px', width: '100%',
}

export default function ProtokollarPage() {
  const router = useRouter()
  const [qidiruv, setQidiruv] = useState('')

  const filtered = PROTOKOLLAR.filter((p) =>
    `${p.nom} ${p.toifa} ${p.qisqa}`.toLowerCase().includes(qidiruv.toLowerCase())
  )
  const toifalar = Array.from(new Set(filtered.map((p) => p.toifa)))

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', color: 'white' }}>
      <div style={{
        backgroundColor: '#111118', borderBottom: '1px solid #1e1e2e',
        padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>
          Uros<span style={{ color: '#60a5fa' }}>fera</span>
        </h1>
        <button onClick={() => router.push('/doctor/dashboard')} style={{
          backgroundColor: '#1e1e2e', color: '#9ca3af', border: '1px solid #2e2e3e',
          borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '14px',
        }}>
          ← Bosh sahifa
        </button>
      </div>

      <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
          <h2 style={{ margin: 0, fontSize: '24px' }}>Klinik protokollar</h2>
          <input
            placeholder="Qidirish..."
            value={qidiruv}
            onChange={(e) => setQidiruv(e.target.value)}
            style={inputStyle}
          />
        </div>

        {toifalar.map((toifa) => (
          <div key={toifa} style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '14px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>{toifa}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              {filtered.filter((p) => p.toifa === toifa).map((p) => (
                <div key={p.slug} onClick={() => router.push(`/doctor/protokollar/${p.slug}`)} style={{
                  backgroundColor: '#111118', border: '1px solid #1e1e2e', borderRadius: '12px',
                  padding: '20px', cursor: 'pointer',
                }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#60a5fa' }}>{p.nom}</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af' }}>{p.qisqa}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && <p style={{ color: '#9ca3af' }}>Hech narsa topilmadi.</p>}
      </div>
    </div>
  )
}
