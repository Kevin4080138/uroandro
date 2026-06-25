'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { createClient } from '@/lib/supabase'

type Fayl = { id: string; nom: string; izoh: string | null; file_path: string; created_at: string }

export default function StudentKutubxonaPage() {
  const supabase = createClient()
  const [fayllar, setFayllar] = useState<Fayl[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('kutubxona_fayllar').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setFayllar((data as Fayl[]) ?? [])
      setLoading(false)
    })
  }, [])

  const ochish = (yol: string) => {
    const { data } = supabase.storage.from('kutubxona').getPublicUrl(yol)
    window.open(data.publicUrl, '_blank')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/student/dashboard" backLabel="Bosh sahifa" />
      <div className="mx-auto max-w-[760px] px-8 py-8">
        <h2 className="rise" style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: 800 }}>📚 Kutubxona</h2>
        <p className="rise" style={{ margin: '0 0 24px', color: 'var(--muted)', fontSize: '13.5px', animationDelay: '.05s' }}>
          Shifokorlar tomonidan yuklangan o&apos;quv materiallari va qo&apos;llanmalar.
        </p>

        {loading ? (
          <p style={{ color: 'var(--muted)' }}>Yuklanmoqda...</p>
        ) : fayllar.length === 0 ? (
          <div className="rise" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--muted)' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>📂</div>
            <p style={{ margin: 0 }}>Hozircha material yo&apos;q.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {fayllar.map((f, i) => (
              <div
                key={f.id}
                onClick={() => ochish(f.file_path)}
                className="rise lift"
                style={{
                  animationDelay: `${Math.min(i * 0.05, 0.4)}s`,
                  background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
                  padding: '16px 20px', cursor: 'pointer', display: 'flex', gap: '14px', alignItems: 'center',
                }}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px', background: 'var(--accent-soft)', color: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0,
                }}>
                  📄
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>{f.nom}</div>
                  {f.izoh && <div style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '2px' }}>{f.izoh}</div>}
                </div>
                <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 700, flexShrink: 0 }}>Ochish ↗</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
