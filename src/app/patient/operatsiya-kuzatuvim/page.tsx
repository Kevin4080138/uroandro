'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { postOpHolat, POSTOP_JADVALI } from '@/lib/operatsiyalar'
import { Bandage, CalendarClock, Building2, StickyNote } from 'lucide-react'
import { UrosferaLoaderMini } from '@/components/UrosferaLoader'

type Kuzatuv = {
  id: string
  operatsiya_nomi: string
  operatsiya_slug: string | null
  operatsiya_sanasi: string
  izoh: string | null
}

function sanaFormat(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function OperatsiyaKuzatuvimPage() {
  const router = useRouter()
  const supabase = createClient()
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [kuzatuvlar, setKuzatuvlar] = useState<Kuzatuv[]>([])

  useEffect(() => {
    const yukla = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data } = await supabase
        .from('operatsiya_kuzatuvi')
        .select('id, operatsiya_nomi, operatsiya_slug, operatsiya_sanasi, izoh')
        .eq('bemor_user_id', user.id)
        .order('operatsiya_sanasi', { ascending: false })
      setKuzatuvlar((data as Kuzatuv[]) ?? [])
      setYuklanmoqda(false)
    }
    yukla()
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/patient/dashboard" backLabel="Bosh sahifa" />
      <div className="mx-auto max-w-[760px] px-8 py-8">
        <h2 className="rise" style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '9px' }}><Bandage size={24} strokeWidth={2} /> Operatsiya kuzatuvim</h2>
        <p className="rise" style={{ margin: '0 0 24px', color: 'var(--muted)', fontSize: '13.5px', animationDelay: '.05s' }}>
          Operatsiyadan keyingi tiklanish bosqichlari va eslatmalar. Ilova har bosqichda sizga bildirishnoma yuboradi.
        </p>

        {yuklanmoqda ? (
          <UrosferaLoaderMini />
        ) : kuzatuvlar.length === 0 ? (
          <div className="rise" style={{
            background: 'var(--surface)', border: '1px dashed var(--line)', borderRadius: '16px',
            padding: '28px 22px', textAlign: 'center',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px', color: 'var(--muted)' }}><CalendarClock size={38} strokeWidth={1.5} /></div>
            <p style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 700 }}>Hozircha kuzatuv yo&apos;q</p>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5 }}>
              Shifokoringiz operatsiyani biriktirgach, tiklanish jadvali shu yerda paydo bo&apos;ladi.
            </p>
            <button
              onClick={() => router.push('/patient/operatsiyalar')}
              style={{
                marginTop: '16px', background: 'var(--accent)', color: 'white', border: 'none',
                borderRadius: '12px', padding: '11px 20px', fontSize: '13.5px', fontWeight: 700, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '7px',
              }}
            >
              <Building2 size={16} strokeWidth={2} /> Operatsiyalar haqida o&apos;qish
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {kuzatuvlar.map((k, idx) => {
              const bosqichlar = postOpHolat(k.operatsiya_sanasi)
              const otganlar = bosqichlar.filter((b) => b.otdi).length
              return (
                <div key={k.id} className="rise" style={{
                  animationDelay: `${Math.min(idx * 0.08, 0.4)}s`,
                  background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px 22px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '4px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>{k.operatsiya_nomi}</h3>
                    {k.operatsiya_slug && (
                      <button
                        onClick={() => router.push(`/patient/operatsiyalar/${k.operatsiya_slug}`)}
                        style={{
                          background: 'none', border: 'none', color: 'var(--accent)', fontSize: '12px',
                          fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                        }}
                      >
                        Batafsil →
                      </button>
                    )}
                  </div>
                  <p style={{ margin: '0 0 16px', fontSize: '12.5px', color: 'var(--muted)' }}>
                    Operatsiya sanasi: {sanaFormat(k.operatsiya_sanasi)} · {otganlar}/{POSTOP_JADVALI.length} bosqich o&apos;tdi
                  </p>

                  {/* Bosqichlar timeline */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {bosqichlar.map((b, i) => (
                      <div key={b.kalit} style={{ display: 'flex', gap: '12px' }}>
                        {/* chiziq + nuqta */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '24px', flexShrink: 0 }}>
                          <div style={{
                            width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                            background: b.otdi ? 'var(--good)' : 'var(--surface-2)',
                            border: b.otdi ? 'none' : '2px solid var(--line)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: '10px', fontWeight: 700,
                          }}>{b.otdi ? '✓' : ''}</div>
                          {i < bosqichlar.length - 1 && (
                            <div style={{ width: '2px', flex: 1, minHeight: '28px', background: b.otdi ? 'var(--good)' : 'var(--line)' }} />
                          )}
                        </div>
                        {/* matn */}
                        <div style={{ paddingBottom: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '13.5px', fontWeight: 700, color: b.otdi ? 'var(--ink)' : 'var(--muted)' }}>{b.sarlavha}</span>
                            {!b.otdi && b.qoldi > 0 && (
                              <span style={{ fontSize: '11px', color: 'var(--muted)' }}>· {b.qoldi} kun qoldi</span>
                            )}
                          </div>
                          <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{b.matn}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {k.izoh && (
                    <div style={{
                      marginTop: '8px', padding: '10px 14px', background: 'var(--surface-2)', borderRadius: '10px',
                      fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5,
                      display: 'flex', alignItems: 'flex-start', gap: '6px',
                    }}>
                      <StickyNote size={14} strokeWidth={2} style={{ flexShrink: 0, marginTop: '1px' }} /> <span>Shifokor izohi: {k.izoh}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
