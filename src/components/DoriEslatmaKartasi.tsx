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
  const [belgilanmoqda, setBelgilanmoqda] = useState<string | null>(null)
  const [ertaXabar, setErtaXabar] = useState<string | null>(null)

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

  const hammasiQabulQilingan = useMemo(() => {
    if (!dozalar) return false
    return dozalar.length > 0 && dozalar.every((d) => d.qabulQilingan)
  }, [dozalar])

  const dozaKaliti = (d: Doza) => `${d.retsept.id}_${d.tartibi}`

  const belgila = async (d: Doza) => {
    if (!userId) return
    if (d.vaqt > hozirgiVaqt) {
      // Hali vaqti kelmagan dozani belgilashga urinish — ogohlantirish ko'rsatamiz, belgilamaymiz
      const kalit = dozaKaliti(d)
      setErtaXabar(kalit)
      setTimeout(() => setErtaXabar((x) => (x === kalit ? null : x)), 2200)
      return
    }
    setBelgilanmoqda(dozaKaliti(d))
    await supabase.from('dori_qabullari').insert({
      retsept_id: d.retsept.id, bemor_user_id: userId, sana: bugun, vaqt_tartibi: d.tartibi,
    })
    await load()
    setBelgilanmoqda(null)
  }

  // Yuklanmaguncha hech narsa ko'rsatmaymiz, lekin karta doim bitta barqaror joy egallaydi
  if (dozalar === null) {
    return <div style={{ minHeight: '0' }} />
  }

  return (
    <div className="rise" style={{
      background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
      padding: '16px 18px', marginBottom: '24px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: dozalar.length ? '12px' : 0 }}>
        <span style={{ fontSize: '13.5px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '7px' }}>
          💊 Bugungi dorilar
          {dozalar.length > 0 && (
            <span style={{ fontSize: '11.5px', color: 'var(--muted)', fontWeight: 600 }}>
              ({dozalar.filter((d) => d.qabulQilingan).length}/{dozalar.length})
            </span>
          )}
        </span>
        {dozalar.length > 0 && (
          <button
            onClick={() => router.push('/patient/dorilarim')}
            style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
          >
            Batafsil →
          </button>
        )}
      </div>

      {dozalar.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '14px 0', color: 'var(--muted)' }}>
          <div style={{ fontSize: '22px', marginBottom: '4px' }}>📭</div>
          <p style={{ margin: 0, fontSize: '13px' }}>Sizda hozircha faol dori retsepti mavjud emas.</p>
        </div>
      ) : hammasiQabulQilingan ? (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 4px',
          color: 'var(--good)', fontWeight: 700, fontSize: '13.5px',
        }}>
          ✅ Bugungi barcha dozalar qabul qilindi 🎉
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '230px', overflowY: 'auto' }}>
          {dozalar.map((d) => {
            const kalit = dozaKaliti(d)
            const otibKetdi = !d.qabulQilingan && d.vaqt <= hozirgiVaqt
            const hozirErta = ertaXabar === kalit
            return (
              <div key={kalit} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px',
                background: d.qabulQilingan ? 'transparent' : otibKetdi ? 'color-mix(in srgb, var(--danger) 8%, transparent)' : 'var(--surface-2)',
                borderRadius: '10px', padding: '8px 10px', opacity: d.qabulQilingan ? 0.55 : 1,
              }}>
                <div style={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: otibKetdi ? 'var(--danger)' : 'var(--ink-soft)', flexShrink: 0, width: '38px' }}>
                    {d.vaqt}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 600, textDecoration: d.qabulQilingan ? 'line-through' : 'none' }}>
                    {d.retsept.nomi}{d.retsept.dozasi ? ` — ${d.retsept.dozasi}` : ''}
                  </span>
                </div>
                {d.qabulQilingan ? (
                  <span style={{ fontSize: '12px', color: 'var(--good)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                ) : (
                  <button
                    onClick={() => belgila(d)}
                    disabled={belgilanmoqda === kalit}
                    className="soft-press"
                    style={{
                      background: hozirErta ? 'var(--surface-2)' : otibKetdi ? 'var(--danger)' : 'var(--accent-soft)',
                      color: hozirErta ? 'var(--warn)' : otibKetdi ? 'white' : 'var(--accent)',
                      border: hozirErta ? '1px solid var(--warn)' : 'none',
                      borderRadius: '999px', padding: '5px 11px', cursor: 'pointer', fontSize: '11.5px', fontWeight: 700,
                      whiteSpace: 'nowrap', flexShrink: 0,
                    }}
                  >
                    {belgilanmoqda === kalit ? '...' : hozirErta ? `⏳ ${d.vaqt}dan keyin` : '✓ Ichdim'}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
