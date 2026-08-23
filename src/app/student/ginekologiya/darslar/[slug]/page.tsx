'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { Clock } from 'lucide-react'

type GinDars = { slug: string; sarlavha: string; kategoriya: string | null; bosqich: string; qisqa: string | null; nazariya_html: string | null; daqiqa: number }

export default function GinDarsViewer() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const slug = String(params?.slug ?? '')
  const [dars, setDars] = useState<GinDars | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('gin_darslar')
        .select('slug, sarlavha, kategoriya, bosqich, qisqa, nazariya_html, daqiqa')
        .eq('slug', slug).eq('faol', true).maybeSingle()
      setDars((data as GinDars) ?? null)
      setLoading(false)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
      <Header backHref="/student/ginekologiya/darslar" backLabel="Ginekologiya darslari" />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '20px 20px 40px' }}>
        {loading ? (
          <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Yuklanmoqda…</p>
        ) : !dars ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--muted)' }}>
            <p style={{ margin: '0 0 16px' }}>Dars topilmadi.</p>
            <button onClick={() => router.push('/student/ginekologiya/darslar')} style={{ background: 'var(--gyn)', color: '#fff', border: 'none', borderRadius: '10px', padding: '11px 22px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
              Darslar ro&apos;yxati
            </button>
          </div>
        ) : (
          <>
            <span style={{ display: 'inline-block', background: 'var(--gyn-soft)', color: 'var(--gyn)', borderRadius: '999px', padding: '3px 11px', fontSize: '11px', fontWeight: 700, marginBottom: '10px' }}>
              Ginekologiya
            </span>
            <h1 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: 800, lineHeight: 1.25 }}>{dars.sarlavha}</h1>
            <p style={{ margin: '0 0 20px', color: 'var(--muted)', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={13} strokeWidth={2} /> {dars.daqiqa} daqiqa {dars.kategoriya ? `· ${dars.kategoriya}` : ''}
            </p>

            {dars.nazariya_html ? (
              <div className="maqola-html" dangerouslySetInnerHTML={{ __html: dars.nazariya_html }} />
            ) : (
              <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Bu dars mazmuni hali tayyorlanmoqda.</p>
            )}
          </>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
