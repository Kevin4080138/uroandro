'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { createClient } from '@/lib/supabase'
import { UrosferaLoaderMini } from '@/components/UrosferaLoader'

type Fikr = { id: string; student_id: string; matn: string; korildi: boolean; created_at: string; full_name?: string }

export default function AdminFikrlarPage() {
  const supabase = createClient()
  const [fikrlar, setFikrlar] = useState<Fikr[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const { data: f } = await supabase.from('fikrlar').select('*').order('created_at', { ascending: false })
    const studentIds = Array.from(new Set((f ?? []).map((x) => x.student_id)))
    const { data: profillar } = studentIds.length
      ? await supabase.from('profiles').select('id, full_name').in('id', studentIds)
      : { data: [] }
    const ismlar: Record<string, string> = {}
    for (const p of profillar ?? []) ismlar[p.id] = p.full_name
    setFikrlar((f ?? []).map((x) => ({ ...x, full_name: ismlar[x.student_id] ?? "Noma'lum" })))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const korildiBelgila = async (id: string) => {
    setFikrlar((prev) => prev.map((x) => (x.id === id ? { ...x, korildi: true } : x)))
    await supabase.from('fikrlar').update({ korildi: true }).eq('id', id)
  }

  const ochir = async (id: string) => {
    if (!confirm("Bu fikrni o'chirishni tasdiqlaysizmi?")) return
    setFikrlar((prev) => prev.filter((x) => x.id !== id))
    await supabase.from('fikrlar').delete().eq('id', id)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/admin/dashboard" backLabel="Admin bosh sahifasi" />
      <div className="fade-in px-4 py-6 sm:px-8 sm:py-8">
        <h2 style={{ margin: '0 0 20px 0', fontSize: '24px' }}>💬 Talabalar fikrlari</h2>

        {loading ? (
          <UrosferaLoaderMini />
        ) : fikrlar.length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>Hozircha fikr yo&apos;q.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '720px' }}>
            {fikrlar.map((f) => (
              <div key={f.id} style={{
                background: 'var(--surface)', border: `1px solid ${f.korildi ? 'var(--line)' : 'var(--accent)'}`,
                borderRadius: '12px', padding: '16px 20px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <strong style={{ fontSize: '14px' }}>{f.full_name}</strong>
                    {f.korildi && <span style={{ fontSize: '11px', color: 'var(--muted)', background: 'var(--surface-2)', padding: '2px 7px', borderRadius: 6 }}>Ko'rildi</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11.5px', color: 'var(--muted)' }}>{new Date(f.created_at).toLocaleString('uz-UZ')}</span>
                    <button onClick={() => ochir(f.id)} title="O'chirish" style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--muted)', fontSize: '15px', padding: '2px 4px', lineHeight: 1,
                    }}>🗑️</button>
                  </div>
                </div>
                <p style={{ margin: '0 0 10px', fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{f.matn}</p>
                {!f.korildi && (
                  <button onClick={() => korildiBelgila(f.id)} className="soft-press" style={{
                    background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--accent)',
                    borderRadius: '8px', padding: '5px 11px', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer',
                  }}>
                    ✓ Ko&apos;rildi deb belgilash
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
