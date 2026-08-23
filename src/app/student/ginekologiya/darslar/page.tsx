'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { BookOpen, Clock, ChevronRight } from 'lucide-react'

type GinDars = { slug: string; sarlavha: string; kategoriya: string | null; bosqich: string; qisqa: string | null; daqiqa: number }

const BOSQICHLAR = [
  { id: 'oson', nom: 'Oson', rang: '#16a34a' },
  { id: 'orta', nom: "O'rta", rang: '#d97706' },
  { id: 'qiyin', nom: 'Qiyin', rang: '#dc2626' },
]

const BOLIM_SARLAVHA: Record<string, string> = {
  darslar: 'Ginekologiya darslari',
  klassifikatsiyalar: 'Klassifikatsiyalar',
  operativ: 'Operativ ginekologiya',
}

function Royxat() {
  const router = useRouter()
  const params = useSearchParams()
  const supabase = createClient()
  const bolim = params.get('bolim') || 'darslar'
  const [darslar, setDarslar] = useState<GinDars[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const { data } = await supabase.from('gin_darslar')
        .select('slug, sarlavha, kategoriya, bosqich, qisqa, daqiqa')
        .eq('faol', true).eq('bolim', bolim).order('bosqich').order('sort_order').order('created_at')
      setDarslar((data ?? []) as GinDars[])
      setLoading(false)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bolim])

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '20px 20px 40px' }}>
      <h2 style={{ margin: '0 0 5px', fontSize: '22px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '9px' }}>
        <span style={{ color: 'var(--gyn)' }}><BookOpen size={22} strokeWidth={2} /></span> {BOLIM_SARLAVHA[bolim] ?? 'Ginekologiya'}
      </h2>
      <p style={{ margin: '0 0 20px', color: 'var(--muted)', fontSize: '13.5px' }}>Bosqichma-bosqich.</p>

      {loading ? (
        <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Yuklanmoqda…</p>
      ) : darslar.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--muted)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px', color: 'var(--gyn)' }}><BookOpen size={38} strokeWidth={1.5} /></div>
          <p style={{ margin: 0 }}>Bu bo&apos;limda hozircha material yo&apos;q — tez orada qo&apos;shiladi.</p>
        </div>
      ) : (
        BOSQICHLAR.map((b) => {
          const list = darslar.filter((d) => d.bosqich === b.id)
          if (!list.length) return null
          return (
            <div key={b.id} style={{ marginBottom: '22px' }}>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 700, color: b.rang, margin: '0 0 10px' }}>{b.nom}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {list.map((d) => (
                  <button key={d.slug} onClick={() => router.push(`/student/ginekologiya/darslar/${d.slug}`)} className="soft-press"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '13px', width: '100%', textAlign: 'left', cursor: 'pointer',
                      background: 'var(--surface)', border: '1px solid var(--line)', borderLeft: `4px solid var(--gyn)`,
                      borderRadius: '14px', padding: '14px 16px',
                    }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14.5px', fontWeight: 700 }}>{d.sarlavha}</div>
                      {d.qisqa && <div style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '3px', lineHeight: 1.45 }}>{d.qisqa}</div>}
                      <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Clock size={12} strokeWidth={2} /> {d.daqiqa} daqiqa {d.kategoriya ? `· ${d.kategoriya}` : ''}
                      </div>
                    </div>
                    <ChevronRight size={18} strokeWidth={2.2} style={{ color: 'var(--muted)', flexShrink: 0 }} />
                  </button>
                ))}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

export default function GinDarslarRoyxati() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
      <Header backHref="/student/dashboard" backLabel="Bosh sahifa" />
      <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>Yuklanmoqda…</div>}>
        <Royxat />
      </Suspense>
      <BottomNav />
    </div>
  )
}
