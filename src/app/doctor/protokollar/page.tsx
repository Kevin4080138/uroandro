'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { PROTOKOLLAR } from '@/lib/protokollar'

export default function ProtokollarPage() {
  const router = useRouter()
  const [qidiruv, setQidiruv] = useState('')

  const filtered = PROTOKOLLAR.filter((p) =>
    `${p.nom} ${p.toifa} ${p.qisqa}`.toLowerCase().includes(qidiruv.toLowerCase())
  )
  const toifalar = Array.from(new Set(filtered.map((p) => p.toifa)))

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header />

      <div className="fade-in mx-auto max-w-[900px] px-8 py-8">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
          <h2 className="text-2xl font-bold">Klinik protokollar</h2>
          <input
            placeholder="Qidirish..."
            value={qidiruv}
            onChange={(e) => setQidiruv(e.target.value)}
            className="rounded-lg border px-3.5 py-2.5 text-sm outline-none"
            style={{ background: 'var(--surface)', color: 'var(--ink)', borderColor: 'var(--line)', maxWidth: '320px', width: '100%' }}
          />
        </div>

        {toifalar.map((toifa) => (
          <div key={toifa} style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '14px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>{toifa}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              {filtered.filter((p) => p.toifa === toifa).map((p) => (
                <div
                  key={p.slug}
                  onClick={() => router.push(`/doctor/protokollar/${p.slug}`)}
                  className="card-hover"
                  style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '20px', cursor: 'pointer' }}
                >
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: 'var(--accent)' }}>{p.nom}</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>{p.qisqa}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && <p style={{ color: 'var(--muted)' }}>Hech narsa topilmadi.</p>}
      </div>
    </div>
  )
}
