'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { vaqtJadvali, faolKunMiSana } from '@/lib/doriEslatma'

type Retsept = { id: string; kuniga_marta: number; muddat_kun: number; boshlanish_sanasi: string }

export function HaftalikIntizom() {
  const supabase = createClient()
  const [foiz, setFoiz] = useState<number | null>(null)
  const [kutilgan, setKutilgan] = useState(0)
  const [qabulQilingan, setQabulQilingan] = useState(0)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const sanalar: string[] = []
      for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        sanalar.push(d.toISOString().slice(0, 10))
      }
      const sana7KunOldin = sanalar[0]

      const { data: retseptlar } = await supabase
        .from('dori_retseptlari')
        .select('id, kuniga_marta, muddat_kun, boshlanish_sanasi')
        .eq('bemor_user_id', user.id)
      const royxat = (retseptlar ?? []) as Retsept[]
      if (royxat.length === 0) { setFoiz(null); return }

      let jamiKutilgan = 0
      for (const r of royxat) {
        for (const sana of sanalar) {
          if (faolKunMiSana(r.boshlanish_sanasi, r.muddat_kun, sana)) {
            jamiKutilgan += r.kuniga_marta
          }
        }
      }
      if (jamiKutilgan === 0) { setFoiz(null); return }

      const { data: qabullar } = await supabase
        .from('dori_qabullari')
        .select('id')
        .eq('bemor_user_id', user.id)
        .gte('sana', sana7KunOldin)
      const jamiQabul = (qabullar ?? []).length

      setKutilgan(jamiKutilgan)
      setQabulQilingan(jamiQabul)
      setFoiz(Math.min(100, Math.round((jamiQabul / jamiKutilgan) * 100)))
    }
    load()
  }, [])

  if (foiz === null) return null

  const rang = foiz >= 85 ? 'var(--good)' : foiz >= 60 ? 'var(--warn)' : 'var(--danger)'

  return (
    <div className="rise" style={{
      background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
      padding: '14px 18px', marginBottom: '18px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-soft)' }}>📊 Haftalik intizom</span>
        <span style={{ fontSize: '13px', fontWeight: 800, color: rang }}>{foiz}%</span>
      </div>
      <div style={{ height: '8px', borderRadius: '999px', background: 'var(--surface-2)', overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: '999px', width: `${foiz}%`, background: rang, transition: 'width .3s ease' }} />
      </div>
      <p style={{ margin: '8px 0 0', fontSize: '11.5px', color: 'var(--muted)' }}>
        So&apos;nggi 7 kunda {qabulQilingan}/{kutilgan} doza o&apos;z vaqtida belgilangan
      </p>
    </div>
  )
}
