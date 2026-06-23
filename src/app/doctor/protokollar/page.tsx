'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/AppShell'
import { createClient } from '@/lib/supabase'

type Protokol = { id: string; slug: string; nom: string; toifa: string; qisqa: string }

export default function ProtokollarPage() {
  const router = useRouter()
  const supabase = createClient()
  const [protokollar, setProtokollar] = useState<Protokol[]>([])
  const [loading, setLoading] = useState(true)
  const [qidiruv, setQidiruv] = useState('')

  useEffect(() => {
    supabase.from('protokollar').select('id, slug, nom, toifa, qisqa').order('toifa').then(({ data }) => {
      setProtokollar(data ?? [])
      setLoading(false)
    })
  }, [])

  const filtered = protokollar.filter((p) =>
    `${p.nom} ${p.toifa} ${p.qisqa}`.toLowerCase().includes(qidiruv.toLowerCase())
  )
  const toifalar = Array.from(new Set(filtered.map((p) => p.toifa)))

  return (
    <AppShell title="Klinik protokollar">
      <div className="mx-auto max-w-[900px] px-8 py-8">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
          <input
            placeholder="Qidirish..."
            value={qidiruv}
            onChange={(e) => setQidiruv(e.target.value)}
            className="rounded-lg border px-3.5 py-2.5 text-sm outline-none"
            style={{ background: 'var(--surface)', color: 'var(--ink)', borderColor: 'var(--line)', maxWidth: '320px', width: '100%' }}
          />
        </div>

        {loading ? (
          <p style={{ color: 'var(--muted)' }}>Yuklanmoqda...</p>
        ) : (
          <>
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
          </>
        )}
      </div>
    </AppShell>
  )
}
