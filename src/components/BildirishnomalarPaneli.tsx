'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

type Bildirishnoma = {
  key: string
  ikon: string
  matn: string
  href: string
  yopish: () => Promise<void>
}

export function BildirishnomalarPaneli() {
  const router = useRouter()
  const supabase = createClient()
  const [royxat, setRoyxat] = useState<Bildirishnoma[]>([])

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [{ data: retseptlar }, { data: murojaatlar }] = await Promise.all([
        supabase.from('dori_retseptlari').select('id, nomi, dozasi').eq('bemor_user_id', user.id).eq('bemor_korgan', false).eq('faol', true),
        supabase.from('murojaatlar').select('id').eq('patient_id', user.id).eq('bemor_korgan', false).not('javob', 'is', null),
      ])

      const elementlar: Bildirishnoma[] = []

      for (const r of retseptlar ?? []) {
        elementlar.push({
          key: `dori_${r.id}`,
          ikon: '💊',
          matn: `Sizga yangi dori tayinlandi: ${r.nomi}${r.dozasi ? ' — ' + r.dozasi : ''}`,
          href: '/patient/dorilarim',
          yopish: async () => { await supabase.rpc('dori_korildi', { retsept_id: r.id }) },
        })
      }

      for (const m of murojaatlar ?? []) {
        elementlar.push({
          key: `murojaat_${m.id}`,
          ikon: '💬',
          matn: 'Shifokoringiz murojaatingizga javob berdi',
          href: '/patient/murojaatlarim',
          yopish: async () => { await supabase.rpc('murojaat_korildi', { m_id: m.id }) },
        })
      }

      setRoyxat(elementlar)
    }
    load()
  }, [])

  const yopish = async (b: Bildirishnoma) => {
    setRoyxat((arr) => arr.filter((x) => x.key !== b.key))
    await b.yopish()
  }

  if (royxat.length === 0) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
      {royxat.map((b, i) => (
        <div
          key={b.key}
          className="rise"
          style={{
            animationDelay: `${Math.min(i * 0.05, 0.3)}s`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
            background: 'var(--accent-soft)', border: '1px solid var(--accent)', borderRadius: '14px',
            padding: '13px 16px', cursor: 'pointer',
          }}
          onClick={() => router.push(b.href)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <span style={{ fontSize: '18px', flexShrink: 0 }}>{b.ikon}</span>
            <span style={{ fontSize: '13.5px', fontWeight: 700 }}>{b.matn}</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); yopish(b) }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '16px',
              flexShrink: 0, padding: '2px 6px',
            }}
            aria-label="Yopish"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
