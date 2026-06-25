'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AppShell } from '@/components/AppShell'
import { createClient } from '@/lib/supabase'

type Protokol = {
  id: string; slug: string; nom: string; toifa: string; qisqa: string
  korsatma: string; tashxis: string[]; davolash: string[]; manba: string | null
}

export default function ProtokolDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const supabase = createClient()
  const [protokol, setProtokol] = useState<Protokol | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('protokollar').select('*').eq('slug', slug).single().then(({ data }) => {
      setProtokol(data)
      setLoading(false)
    })
  }, [slug])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--ink)' }}>Yuklanmoqda...</p>
    </div>
  )

  if (!protokol) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--ink)' }}>Protokol topilmadi.</p>
    </div>
  )

  const orqagaTugmasi = (
    <button
      onClick={() => router.push('/doctor/protokollar')}
      className="btn-animated soft-press"
      style={{
        background: 'var(--surface-2)', color: 'var(--ink-soft)', border: '1px solid var(--line)', borderRadius: '999px',
        padding: '8px 16px', cursor: 'pointer', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px',
      }}
    >
      ← Protokollar
    </button>
  )

  return (
    <AppShell title={protokol.nom} actions={orqagaTugmasi}>
      <div className="mx-auto max-w-[760px] px-8 py-8">
        <span style={{ fontSize: '12px', color: 'var(--accent-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{protokol.toifa}</span>
        <h2 style={{ margin: '6px 0 8px 0', fontSize: '26px' }}>{protokol.nom}</h2>
        <p style={{ color: 'var(--muted)', fontSize: '15px' }}>{protokol.qisqa}</p>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '20px', marginTop: '20px' }}>
          <h3 style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', margin: '0 0 10px 0' }}>Ko&apos;rsatma</h3>
          <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.6 }}>{protokol.korsatma}</p>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '20px', marginTop: '16px' }}>
          <h3 style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', margin: '0 0 12px 0' }}>Tashxis bosqichlari</h3>
          <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {protokol.tashxis.map((t, i) => <li key={i} style={{ fontSize: '14.5px', lineHeight: 1.5 }}>{t}</li>)}
          </ul>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '20px', marginTop: '16px' }}>
          <h3 style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', margin: '0 0 12px 0' }}>Davolash algoritmi</h3>
          <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {protokol.davolash.map((d, i) => <li key={i} style={{ fontSize: '14.5px', lineHeight: 1.5, color: 'var(--good)' }}>{d}</li>)}
          </ul>
        </div>

        {protokol.manba && (
          <div style={{ marginTop: '18px', background: 'var(--accent-soft)', border: '1px solid var(--line)', borderRadius: '10px', padding: '13px 15px', fontSize: '12.5px', color: 'var(--warn)' }}>
            Manba: {protokol.manba}. Bu qisqacha yo&apos;naltiruvchi xulosa — yakuniy klinik qaror to&apos;liq rasmiy qo&apos;llanma va shifokorning shaxsiy baholashiga asoslanishi kerak.
          </div>
        )}
      </div>
    </AppShell>
  )
}
