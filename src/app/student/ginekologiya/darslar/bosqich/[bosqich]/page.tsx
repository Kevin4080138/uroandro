'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { Clock, ChevronRight, PlayCircle } from 'lucide-react'

type GinDars = { slug: string; sarlavha: string; kategoriya: string | null; qisqa: string | null; daqiqa: number }

const BOSQICH_MA: Record<string, { nom: string; ost: string; rang: string }> = {
  oson: { nom: 'Oson', ost: 'Foundation', rang: '#16a34a' },
  orta: { nom: "O'rta", ost: 'Clinical', rang: '#d97706' },
  qiyin: { nom: 'Qiyin', ost: 'Advanced', rang: '#dc2626' },
}

export default function GinBosqichDarslar() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const bosqich = String(params?.bosqich ?? '')
  const ma = BOSQICH_MA[bosqich] ?? { nom: 'Bosqich', ost: '', rang: 'var(--gyn)' }
  const [darslar, setDarslar] = useState<GinDars[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('gin_darslar').select('slug, sarlavha, kategoriya, qisqa, daqiqa')
      .eq('faol', true).eq('bolim', 'darslar').eq('bosqich', bosqich).order('sort_order').order('created_at')
      .then(({ data }) => { setDarslar((data ?? []) as GinDars[]); setLoading(false) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bosqich])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
      <Header backHref="/student/ginekologiya/darslar" backLabel="Ginekologiya darslari" />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '20px 20px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: ma.rang }} />
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 900 }}>{ma.nom} bosqich</h1>
          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>· {ma.ost}</span>
        </div>
        <p style={{ margin: '0 0 20px', color: 'var(--muted)', fontSize: '13.5px' }}>
          {loading ? '' : `${darslar.length} ta modul — ketma-ket o'rganing.`}
        </p>

        {loading ? (
          <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Yuklanmoqda…</p>
        ) : darslar.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px', color: ma.rang }}><PlayCircle size={38} strokeWidth={1.5} /></div>
            <p style={{ margin: 0 }}>Bu bosqichda hozircha modul yo&apos;q — tez orada qo&apos;shiladi.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {darslar.map((d, i) => (
              <button key={d.slug} onClick={() => router.push(`/student/ginekologiya/darslar/${d.slug}`)} className="soft-press"
                style={{ display: 'flex', alignItems: 'center', gap: '13px', width: '100%', textAlign: 'left', cursor: 'pointer', background: 'var(--surface)', border: '1px solid var(--line)', borderLeft: `4px solid ${ma.rang}`, borderRadius: '14px', padding: '14px 16px' }}>
                <span style={{ width: '30px', height: '30px', borderRadius: '9px', flexShrink: 0, background: `${ma.rang}18`, color: ma.rang, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800 }}>{i + 1}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14.5px', fontWeight: 700 }}>{d.sarlavha}</div>
                  {d.qisqa && <div style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '3px', lineHeight: 1.45 }}>{d.qisqa}</div>}
                  <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={12} strokeWidth={2} /> {d.daqiqa} daqiqa
                  </div>
                </div>
                <ChevronRight size={18} strokeWidth={2.2} style={{ color: 'var(--muted)', flexShrink: 0 }} />
              </button>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
