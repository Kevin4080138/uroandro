'use client'

// Shifokorlar tasdiqlash — ro'yxatdan o'tgan shifokor nomzodlarini ko'rib chiqish.
// Tasdiqlansa role='doctor' bo'ladi (mavjud /api/admin/shifokor-tasdiq orqali).

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { UrosferaLoaderMini } from '@/components/UrosferaLoader'

type Nomzod = {
  id: string
  full_name: string | null
  email: string | null
  telefon: string | null
  role: string
  doctor_holati: string | null
  mutaxassislik: string | null
  ish_joyi: string | null
  created_at: string
}

function sanaFmt(s: string): string {
  return new Date(s).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function AdminShifokorlarPage() {
  const supabase = createClient()
  const [royxat, setRoyxat] = useState<Nomzod[]>([])
  const [yuklandi, setYuklandi] = useState(false)
  const [ketmoqda, setKetmoqda] = useState<string | null>(null)
  const [xabar, setXabar] = useState<string | null>(null)

  const yukla = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, email, telefon, role, doctor_holati, mutaxassislik, ish_joyi, created_at')
      .or('doctor_holati.not.is.null,role.eq.doctor')
      .eq('arxivlangan', false)
      .order('created_at', { ascending: false })
    setRoyxat((data as Nomzod[]) ?? [])
    setYuklandi(true)
  }

  useEffect(() => {
    Promise.resolve().then(yukla)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const amal = async (n: Nomzod, turi: 'tasdiqlash' | 'rad_etish') => {
    const savol = turi === 'tasdiqlash'
      ? `"${n.full_name ?? n.email}" shifokor sifatida TASDIQLANSINMI? U shifokor paneliga kirish huquqini oladi.`
      : `"${n.full_name ?? n.email}" arizasi RAD ETILSINMI?`
    if (!confirm(savol)) return
    setKetmoqda(n.id)
    setXabar(null)
    try {
      const res = await fetch('/api/admin/shifokor-tasdiq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: n.id, amal: turi }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Xatolik')
      setXabar(turi === 'tasdiqlash' ? `✅ ${n.full_name ?? ''} shifokor sifatida tasdiqlandi` : `🚫 Ariza rad etildi`)
      yukla()
    } catch (e) {
      setXabar(`❌ ${e instanceof Error ? e.message : 'Xatolik'}`)
    } finally {
      setKetmoqda(null)
    }
  }

  const guruhlar = useMemo(() => ({
    kutish: royxat.filter((n) => n.doctor_holati === 'kutish'),
    tasdiqlangan: royxat.filter((n) => n.role === 'doctor'),
    rad: royxat.filter((n) => n.doctor_holati === 'rad_etildi' && n.role !== 'doctor'),
  }), [royxat])

  const Karta = ({ n, tugmalar }: { n: Nomzod; tugmalar: boolean }) => (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
      padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
    }}>
      <div style={{ flex: 1, minWidth: '180px' }}>
        <div style={{ fontSize: '13.5px', fontWeight: 800 }}>{n.full_name ?? '—'}</div>
        <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>
          {n.email ?? n.telefon ?? ''}
          {n.mutaxassislik && ` · ${n.mutaxassislik}`}
          {n.ish_joyi && ` · ${n.ish_joyi}`}
        </div>
        <div style={{ fontSize: '10.5px', color: 'var(--muted)', marginTop: '2px' }}>📅 {sanaFmt(n.created_at)}</div>
      </div>
      {tugmalar ? (
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <button
            onClick={() => amal(n, 'tasdiqlash')}
            disabled={ketmoqda === n.id}
            className="soft-press"
            style={{
              background: '#16a34a', color: 'white', border: 'none', borderRadius: '10px',
              padding: '8px 15px', fontSize: '12px', fontWeight: 800, cursor: 'pointer',
            }}
          >{ketmoqda === n.id ? '...' : '✅ Tasdiqlash'}</button>
          <button
            onClick={() => amal(n, 'rad_etish')}
            disabled={ketmoqda === n.id}
            className="soft-press"
            style={{
              background: '#dc262614', color: '#dc2626', border: '1px solid #dc262633', borderRadius: '10px',
              padding: '8px 15px', fontSize: '12px', fontWeight: 800, cursor: 'pointer',
            }}
          >🚫 Rad etish</button>
        </div>
      ) : n.role === 'doctor' ? (
        <span style={{ fontSize: '11px', fontWeight: 800, color: '#16a34a', background: '#16a34a14', borderRadius: '999px', padding: '4px 12px', flexShrink: 0 }}>✅ Tasdiqlangan</span>
      ) : (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#dc2626', background: '#dc262614', borderRadius: '999px', padding: '4px 12px' }}>🚫 Rad etilgan</span>
          <button
            onClick={() => amal(n, 'tasdiqlash')}
            disabled={ketmoqda === n.id}
            className="soft-press"
            style={{
              background: 'var(--surface-2)', color: 'var(--ink-soft)', border: '1px solid var(--line)', borderRadius: '10px',
              padding: '7px 13px', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer',
            }}
          >Qayta tasdiqlash</button>
        </div>
      )}
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/admin/dashboard" backLabel="Dashboard" />

      <div className="mx-auto max-w-[860px] px-6 py-8">
        <h1 style={{ margin: '0 0 6px', fontSize: '23px', fontWeight: 900 }}>👨‍⚕️ Shifokorlar tasdiqlash</h1>
        <p style={{ margin: '0 0 20px', color: 'var(--muted)', fontSize: '13px' }}>
          Shifokor sifatida ro&apos;yxatdan o&apos;tganlar tasdiqlangunicha talaba huquqida qoladi
        </p>

        {xabar && (
          <div style={{
            fontSize: '13px', fontWeight: 700, padding: '11px 14px', borderRadius: '12px', marginBottom: '16px',
            background: xabar.startsWith('❌') ? '#dc262614' : '#16a34a14',
            color: xabar.startsWith('❌') ? '#dc2626' : '#16a34a',
          }}>{xabar}</div>
        )}

        {!yuklandi ? (
          <UrosferaLoaderMini />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h2 style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 900, color: '#d97706' }}>
                ⏳ Kutilmoqda ({guruhlar.kutish.length})
              </h2>
              {guruhlar.kutish.length === 0 ? (
                <p style={{ margin: 0, color: 'var(--muted)', fontSize: '12.5px' }}>Yangi ariza yo&apos;q.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {guruhlar.kutish.map((n) => <Karta key={n.id} n={n} tugmalar />)}
                </div>
              )}
            </div>

            <div>
              <h2 style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 900, color: '#16a34a' }}>
                ✅ Tasdiqlangan shifokorlar ({guruhlar.tasdiqlangan.length})
              </h2>
              {guruhlar.tasdiqlangan.length === 0 ? (
                <p style={{ margin: 0, color: 'var(--muted)', fontSize: '12.5px' }}>Hali yo&apos;q.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {guruhlar.tasdiqlangan.map((n) => <Karta key={n.id} n={n} tugmalar={false} />)}
                </div>
              )}
            </div>

            {guruhlar.rad.length > 0 && (
              <div>
                <h2 style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 900, color: '#dc2626' }}>
                  🚫 Rad etilganlar ({guruhlar.rad.length})
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {guruhlar.rad.map((n) => <Karta key={n.id} n={n} tugmalar={false} />)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
