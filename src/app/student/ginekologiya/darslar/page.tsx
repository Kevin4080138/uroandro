'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { BookOpen, Clock, ChevronRight } from 'lucide-react'

type GinDars = { slug: string; sarlavha: string; kategoriya: string | null; bosqich: string; qisqa: string | null; daqiqa: number }

const BOSQICHLAR = [
  {
    id: 'oson', nom: 'Oson', ost: 'Foundation', rang: '#16a34a', bepul: true,
    tavsif: 'Ginekologiyani noldan tushunish uchun poydevor.',
    imkon: ['Anatomiya', 'Fiziologiya', 'Hayz sikli', 'Tekshirish', 'Kontratseptsiya'],
  },
  {
    id: 'orta', nom: "O'rta", ost: 'Clinical', rang: '#d97706', bepul: false,
    tavsif: 'Kasallikni simptomdan tanish, tashxis va davolash algoritmi.',
    imkon: ['Sikl buzilishlari', 'Infeksiyalar', 'PID', 'Mioma', 'Endometrioz'],
  },
  {
    id: 'qiyin', nom: 'Qiyin', ost: 'Advanced', rang: '#dc2626', bepul: false,
    tavsif: 'Murakkab klinik vaziyatlarni tahlil qilish darajasi.',
    imkon: ['PCOS', 'Onkologiya', 'Bepushtlik', 'Homiladorlik', 'Menopauza'],
  },
]

const BOLIM_SARLAVHA: Record<string, string> = {
  klassifikatsiyalar: 'Klassifikatsiyalar',
  operativ: 'Operativ ginekologiya',
}

// ── Landing: 3 bosqich ──
function BosqichLanding() {
  const router = useRouter()
  const supabase = createClient()
  const [sonlar, setSonlar] = useState<Record<string, number>>({})

  useEffect(() => {
    supabase.from('gin_darslar').select('bosqich').eq('faol', true).eq('bolim', 'darslar').then(({ data }) => {
      const s: Record<string, number> = {}
      for (const r of (data ?? []) as { bosqich: string }[]) s[r.bosqich] = (s[r.bosqich] ?? 0) + 1
      setSonlar(s)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="mx-auto max-w-[1000px]" style={{ padding: '20px 20px 40px' }}>
      <div className="rise" style={{ textAlign: 'center', marginBottom: '22px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 900, lineHeight: 1.25 }}>
          Ginekologiyani <span style={{ color: 'var(--gyn)' }}>bosqichma-bosqich</span> egallang
        </h1>
        <p style={{ margin: '10px auto 0', color: 'var(--muted)', fontSize: '13px', maxWidth: '480px', lineHeight: 1.6 }}>
          Har modulda video, nazariya, klinik holat va test — bitta yo&apos;lda. Boshlash bepul.
        </p>
      </div>

      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', alignItems: 'stretch' }}>
        {BOSQICHLAR.map((b, i) => (
          <div key={b.id} onClick={() => router.push(`/student/ginekologiya/darslar/bosqich/${b.id}`)}
            className="rise lift" style={{
              background: 'var(--surface)', border: `2px solid ${b.rang}55`, borderRadius: '20px',
              padding: '20px', cursor: 'pointer', display: 'flex', flexDirection: 'column',
              boxShadow: `0 8px 30px ${b.rang}18`, animationDelay: `${0.05 + i * 0.06}s`,
            }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: b.rang }} />
                <span style={{ fontSize: '18px', fontWeight: 900 }}>{b.nom}</span>
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>· {b.ost}</span>
              </div>
              <span style={{
                fontSize: '10.5px', fontWeight: 800, padding: '3px 9px', borderRadius: '999px',
                background: b.bepul ? 'rgba(22,163,74,.14)' : `${b.rang}18`, color: b.bepul ? '#16a34a' : b.rang,
              }}>{b.bepul ? 'BEPUL' : "Ko'proq"}</span>
            </div>
            <p style={{ margin: '0 0 12px', fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.5 }}>{b.tavsif}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
              {b.imkon.map((x) => (
                <span key={x} style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)', background: 'var(--surface-2)', borderRadius: '999px', padding: '4px 10px' }}>{x}</span>
              ))}
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: b.rang }}>{sonlar[b.id] ?? 0} ta modul</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 800, color: b.rang }}>
                Kirish <ChevronRight size={16} strokeWidth={2.4} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Flat ro'yxat: klassifikatsiyalar / operativ ──
function FlatRoyxat({ bolim }: { bolim: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [darslar, setDarslar] = useState<GinDars[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('gin_darslar').select('slug, sarlavha, kategoriya, bosqich, qisqa, daqiqa')
      .eq('faol', true).eq('bolim', bolim).order('sort_order').order('created_at')
      .then(({ data }) => { setDarslar((data ?? []) as GinDars[]); setLoading(false) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bolim])

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '20px 20px 40px' }}>
      <h2 style={{ margin: '0 0 5px', fontSize: '22px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '9px' }}>
        <span style={{ color: 'var(--gyn)' }}><BookOpen size={22} strokeWidth={2} /></span> {BOLIM_SARLAVHA[bolim] ?? 'Ginekologiya'}
      </h2>
      <p style={{ margin: '0 0 20px', color: 'var(--muted)', fontSize: '13.5px' }}>Ma&apos;lumotnoma.</p>
      {loading ? (
        <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Yuklanmoqda…</p>
      ) : darslar.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--muted)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px', color: 'var(--gyn)' }}><BookOpen size={38} strokeWidth={1.5} /></div>
          <p style={{ margin: 0 }}>Bu bo&apos;limda hozircha material yo&apos;q — tez orada qo&apos;shiladi.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {darslar.map((d) => (
            <button key={d.slug} onClick={() => router.push(`/student/ginekologiya/darslar/${d.slug}`)} className="soft-press"
              style={{ display: 'flex', alignItems: 'center', gap: '13px', width: '100%', textAlign: 'left', cursor: 'pointer', background: 'var(--surface)', border: '1px solid var(--line)', borderLeft: `4px solid var(--gyn)`, borderRadius: '14px', padding: '14px 16px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '14.5px', fontWeight: 700 }}>{d.sarlavha}</div>
                {d.qisqa && <div style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '3px', lineHeight: 1.45 }}>{d.qisqa}</div>}
              </div>
              <ChevronRight size={18} strokeWidth={2.2} style={{ color: 'var(--muted)', flexShrink: 0 }} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function Ichki() {
  const bolim = useSearchParams().get('bolim') || 'darslar'
  return bolim === 'darslar' ? <BosqichLanding /> : <FlatRoyxat bolim={bolim} />
}

export default function GinDarslar() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
      <Header backHref="/student/dashboard" backLabel="Bosh sahifa" />
      <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>Yuklanmoqda…</div>}>
        <Ichki />
      </Suspense>
      <BottomNav />
    </div>
  )
}
