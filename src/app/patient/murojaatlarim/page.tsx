'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'

type Murojaat = {
  id: string; shikoyatlar: string; taxminiy_tashxis: string | null; tavsiya: string | null
  javob: string | null; holat: string; shoshilinch: boolean; created_at: string
  doctor_id: string | null; target_doctor_id: string | null; bemor_korgan?: boolean
  bemor_id?: string | null
}

const HOLAT_LABEL: Record<string, { text: string; color: string }> = {
  kutilmoqda: { text: 'Javob kutilmoqda', color: 'var(--warn)' },
  qabul_qilindi: { text: 'Shifokor qabul qildi', color: 'var(--accent)' },
  qabulda: { text: "Shifokor ko'rigida", color: 'var(--accent-2)' },
  javob_berildi: { text: 'Javob berildi', color: 'var(--good)' },
}

// Murojaat qayerga yetganini pochta kuzatuvidek ko'rsatadigan bosqichlar
function HolatIzi({ m }: { m: Murojaat }) {
  const bosqichlar = [
    { nom: 'Yuborildi', bajarildi: true },
    { nom: 'Shifokor qabul qildi', bajarildi: m.holat !== 'kutilmoqda' || !!m.doctor_id },
    { nom: "Ko'rikda", bajarildi: !!m.bemor_id || m.holat === 'qabulda' },
    { nom: 'Javob tayyor', bajarildi: !!m.javob },
  ]
  // keyingi bosqich bajarilgan bo'lsa, oldingilari ham bajarilgan hisoblanadi
  for (let i = bosqichlar.length - 2; i >= 0; i--) {
    if (bosqichlar[i + 1].bajarildi) bosqichlar[i].bajarildi = true
  }
  const oxirgi = bosqichlar.reduce((acc, b, i) => (b.bajarildi ? i : acc), 0)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', margin: '14px 0 6px' }}>
      {bosqichlar.map((b, i) => (
        <div key={b.nom} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          {i > 0 && (
            <div style={{
              position: 'absolute', top: '9px', right: '50%', width: '100%', height: '2.5px',
              background: b.bajarildi ? 'var(--good)' : 'var(--line)', zIndex: 0,
            }} />
          )}
          <div style={{
            width: '19px', height: '19px', borderRadius: '50%', zIndex: 1, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px',
            background: b.bajarildi ? 'var(--good)' : 'var(--surface-2)',
            border: b.bajarildi ? 'none' : '2px solid var(--line)',
            color: 'white', fontWeight: 700,
            boxShadow: i === oxirgi && b.bajarildi ? '0 0 0 4px color-mix(in srgb, var(--good) 22%, transparent)' : 'none',
          }}>
            {b.bajarildi ? '✓' : ''}
          </div>
          <span style={{
            marginTop: '6px', fontSize: '10.5px', textAlign: 'center', lineHeight: 1.25, maxWidth: '76px',
            color: b.bajarildi ? 'var(--ink)' : 'var(--muted)', fontWeight: i === oxirgi && b.bajarildi ? 700 : 500,
          }}>
            {b.nom}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function MurojaatlarimPage() {
  const supabase = createClient()
  const [murojaatlar, setMurojaatlar] = useState<Murojaat[]>([])
  const [doctorNames, setDoctorNames] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('murojaatlar').select('*').order('created_at', { ascending: false })
      const list = (data as Murojaat[]) ?? []
      setMurojaatlar(list)

      const doctorIds = Array.from(new Set(list.map((m) => m.doctor_id).filter(Boolean))) as string[]
      if (doctorIds.length > 0) {
        const { data: docs } = await supabase.from('profiles').select('id, full_name').in('id', doctorIds)
        const map: Record<string, string> = {}
        for (const d of docs ?? []) map[d.id] = d.full_name
        setDoctorNames(map)
      }
      setLoading(false)

      // javob bor, lekin hali "ko'rildi" deb belgilanmagan murojaatlarni belgilash
      const korilmagan = list.filter((m) => m.javob && !m.bemor_korgan)
      for (const m of korilmagan) {
        await supabase.rpc('murojaat_korildi', { m_id: m.id })
      }
    }
    load()
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/patient/dashboard" backLabel="Bosh sahifa" />

      <div className="fade-in mx-auto max-w-[640px] px-8 py-8">
        <h2 style={{ margin: '0 0 4px 0', fontSize: '24px' }}>Mening murojaatlarim</h2>
        <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '24px' }}>
          Yuborilgan shikoyatlaringiz va shifokor javoblari.
        </p>

        {loading ? (
          <p style={{ color: 'var(--muted)' }}>Yuklanmoqda...</p>
        ) : murojaatlar.length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>Hozircha murojaat yo&apos;q.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {murojaatlar.map((m) => {
              const holat = HOLAT_LABEL[m.holat] ?? HOLAT_LABEL.kutilmoqda
              return (
                <div key={m.id} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '18px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '12.5px' }}>{new Date(m.created_at).toLocaleString()}</span>
                    <span style={{ color: holat.color, fontSize: '12.5px', fontWeight: 600 }}>{holat.text}</span>
                  </div>
                  <HolatIzi m={m} />
                  <p style={{ margin: '0 0 6px 0', fontSize: '14px' }}><strong>Shikoyat:</strong> {m.shikoyatlar}</p>
                  {m.taxminiy_tashxis && <p style={{ margin: '0 0 6px 0', fontSize: '13.5px', color: 'var(--accent)' }}>Taxminiy yo&apos;nalish: {m.taxminiy_tashxis}</p>}
                  {m.doctor_id && <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: 'var(--muted)' }}>Shifokor: {doctorNames[m.doctor_id] ?? '—'}</p>}
                  {m.javob && (
                    <div style={{ background: 'var(--accent-soft)', borderRadius: '8px', padding: '12px 14px', marginTop: '8px' }}>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--accent)' }}>Shifokor javobi:</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>{m.javob}</p>
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
