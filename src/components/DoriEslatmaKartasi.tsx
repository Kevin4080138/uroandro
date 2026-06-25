'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { vaqtJadvali, faolKunMi } from '@/lib/doriEslatma'

type Retsept = {
  id: string; nomi: string; dozasi: string | null
  kuniga_marta: number; muddat_kun: number; boshlanish_sanasi: string
}
type Doza = { retsept: Retsept; vaqt: string; tartibi: number; qabulQilingan: boolean }

export function DoriEslatmaKartasi() {
  const router = useRouter()
  const supabase = createClient()
  const [dozalar, setDozalar] = useState<Doza[] | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [now, setNow] = useState(new Date())
  const [belgilanmoqda, setBelgilanmoqda] = useState(false)

  const bugun = new Date().toISOString().slice(0, 10)

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setUserId(user.id)

    const { data: retseptlar } = await supabase
      .from('dori_retseptlari')
      .select('*')
      .eq('bemor_user_id', user.id)
      .eq('faol', true)
    const faollar = (retseptlar ?? []).filter((r: Retsept) => faolKunMi(r.boshlanish_sanasi, r.muddat_kun))
    if (faollar.length === 0) { setDozalar([]); return }

    const { data: qabullar } = await supabase
      .from('dori_qabullari')
      .select('retsept_id, vaqt_tartibi')
      .eq('sana', bugun)
      .in('retsept_id', faollar.map((r: Retsept) => r.id))
    const qabulXarita = new Set((qabullar ?? []).map((q: any) => `${q.retsept_id}_${q.vaqt_tartibi}`))

    const royxat: Doza[] = []
    for (const r of faollar as Retsept[]) {
      vaqtJadvali(r.kuniga_marta).forEach((vaqt, vi) => {
        const tartibi = vi + 1
        royxat.push({ retsept: r, vaqt, tartibi, qabulQilingan: qabulXarita.has(`${r.id}_${tartibi}`) })
      })
    }
    royxat.sort((a, b) => a.vaqt.localeCompare(b.vaqt))
    setDozalar(royxat)
  }

  useEffect(() => {
    load()
    const tikInterval = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(tikInterval)
  }, [])

  const hozirgiVaqt = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  const keyingiDoza = useMemo(() => {
    if (!dozalar) return null
    return dozalar.find((d) => !d.qabulQilingan) ?? null
  }, [dozalar])

  const oxirgiQabulQilingan = useMemo(() => {
    if (!dozalar) return false
    return dozalar.length > 0 && dozalar.every((d) => d.qabulQilingan)
  }, [dozalar])

  const belgila = async () => {
    if (!keyingiDoza || !userId) return
    setBelgilanmoqda(true)
    await supabase.from('dori_qabullari').insert({
      retsept_id: keyingiDoza.retsept.id, bemor_user_id: userId, sana: bugun, vaqt_tartibi: keyingiDoza.tartibi,
    })
    await load()
    setBelgilanmoqda(false)
  }

  if (dozalar === null) return null
  if (dozalar.length === 0) return null

  const otibKetdi = keyingiDoza && keyingiDoza.vaqt <= hozirgiVaqt

  return (
    <div
      className="rise"
      onClick={() => router.push('/patient/dorilarim')}
      style={{
        background: keyingiDoza ? (otibKetdi ? 'color-mix(in srgb, var(--danger) 10%, var(--surface))' : 'var(--accent-soft)') : 'color-mix(in srgb, var(--good) 10%, var(--surface))',
        border: `1px solid ${keyingiDoza ? (otibKetdi ? 'var(--danger)' : 'var(--accent)') : 'var(--good)'}`,
        borderRadius: '16px', padding: '18px 20px', marginBottom: '24px', cursor: 'pointer',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px', flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        <span style={{ fontSize: '24px', flexShrink: 0 }}>{oxirgiQabulQilingan ? '✅' : otibKetdi ? '⏰' : '💊'}</span>
        <div style={{ minWidth: 0 }}>
          {oxirgiQabulQilingan ? (
            <div style={{ fontSize: '14px', fontWeight: 700 }}>Bugungi barcha dozalar qabul qilindi 🎉</div>
          ) : keyingiDoza ? (
            <>
              <div style={{ fontSize: '14.5px', fontWeight: 800 }}>
                {otibKetdi ? "Dori ichish vaqti keldi!" : `Keyingi doza: ${keyingiDoza.vaqt}`}
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--ink-soft)', marginTop: '2px' }}>
                {keyingiDoza.retsept.nomi}{keyingiDoza.retsept.dozasi ? ` — ${keyingiDoza.retsept.dozasi}` : ''}
                {!otibKetdi && ` · soat ${keyingiDoza.vaqt}da`}
              </div>
            </>
          ) : null}
        </div>
      </div>
      {keyingiDoza && (
        <button
          onClick={(e) => { e.stopPropagation(); belgila() }}
          disabled={belgilanmoqda}
          className="soft-press"
          style={{
            background: otibKetdi ? 'var(--danger)' : 'var(--accent)', color: 'white', border: 'none', borderRadius: '999px',
            padding: '9px 18px', cursor: 'pointer', fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap',
          }}
        >
          {belgilanmoqda ? '...' : '✓ Ichdim'}
        </button>
      )}
    </div>
  )
}
