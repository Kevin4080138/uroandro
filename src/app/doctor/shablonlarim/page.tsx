'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/AppShell'
import { createClient } from '@/lib/supabase'
import { yangiTuzilma, type ShablonTuzilma } from '@/lib/shablonlar/deklarativ'

type Row = { id: string; kasallik: string; tuzilma: ShablonTuzilma; updated_at: string }

const card = {
  background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '18px 20px',
} as React.CSSProperties

export default function ShablonlarimPage() {
  const router = useRouter()
  const supabase = createClient()

  const [royxat, setRoyxat] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [yangiModal, setYangiModal] = useState(false)
  const [yangiNom, setYangiNom] = useState('')
  const [saving, setSaving] = useState(false)
  const [ochirishId, setOchirishId] = useState<string | null>(null)

  const yukla = async () => {
    const { data } = await supabase.from('shifokor_shablonlari')
      .select('id, kasallik, tuzilma, updated_at').order('kasallik')
    setRoyxat((data as Row[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { yukla() /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [])

  const yaratish = async () => {
    if (!yangiNom.trim()) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }
    const { data, error } = await supabase.from('shifokor_shablonlari')
      .insert({ doctor_id: user.id, kasallik: yangiNom.trim(), tuzilma: yangiTuzilma() })
      .select('id').single()
    setSaving(false)
    if (!error && data) router.push(`/doctor/shablonlarim/${data.id}`)
  }

  const nusxaOlish = async (r: Row) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('shifokor_shablonlari')
      .insert({ doctor_id: user.id, kasallik: `${r.kasallik} (nusxa)`, tuzilma: r.tuzilma })
      .select('id').single()
    if (data) router.push(`/doctor/shablonlarim/${data.id}`)
  }

  const ochirish = async (id: string) => {
    await supabase.from('shifokor_shablonlari').delete().eq('id', id)
    setOchirishId(null)
    yukla()
  }

  return (
    <AppShell title="Mening shablonlarim">
      <div className="fade-in px-4 py-6 sm:px-8" style={{ maxWidth: '860px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '24px', margin: 0 }}>📝 Mening shablonlarim</h1>
          <button onClick={() => { setYangiNom(''); setYangiModal(true) }} className="btn-animated soft-press" style={{
            background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '999px',
            padding: '10px 20px', cursor: 'pointer', fontSize: '13.5px', fontWeight: 600,
          }}>
            + Yangi shablon
          </button>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '13.5px', marginBottom: '20px' }}>
          Kasallik tarixi shablonlaringiz — faqat sizga ko&apos;rinadi. Har bir kasallik uchun o&apos;z uslubingizda
          anamnez, status localis, tashxis, davo va tavsiya matnlarini oldindan tayyorlab qo&apos;ying.
        </p>

        {yangiModal && (
          <div style={{ ...card, border: '1px solid var(--accent)', marginBottom: '16px' }}>
            <p style={{ margin: '0 0 10px', fontSize: '13.5px', fontWeight: 600 }}>Kasallik nomi</p>
            <input
              autoFocus
              value={yangiNom}
              onChange={(e) => setYangiNom(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') yaratish() }}
              placeholder="Masalan: Buyrak tosh kasalligi"
              style={{
                width: '100%', background: 'var(--surface-2)', color: 'var(--ink)', border: '1.5px solid var(--line)',
                borderRadius: '9px', padding: '10px 12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '12px',
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={yaratish} disabled={saving || !yangiNom.trim()} className="btn-animated" style={{
                background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '8px',
                padding: '9px 18px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, opacity: !yangiNom.trim() ? 0.5 : 1,
              }}>
                {saving ? 'Yaratilmoqda...' : 'Yaratish'}
              </button>
              <button onClick={() => setYangiModal(false)} className="btn-animated" style={{
                background: 'var(--surface-2)', color: 'var(--ink-soft)', border: '1px solid var(--line)',
                borderRadius: '8px', padding: '9px 18px', cursor: 'pointer', fontSize: '13px',
              }}>
                Bekor
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <p style={{ color: 'var(--muted)' }}>Yuklanmoqda...</p>
        ) : royxat.length === 0 ? (
          <div style={{ ...card, textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📄</div>
            <p style={{ margin: '0 0 6px', fontWeight: 600 }}>Hali shablon yo&apos;q</p>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '13.5px' }}>
              &quot;+ Yangi shablon&quot; tugmasi bilan birinchi shabloningizni yarating — tayyor 5 bo&apos;limli
              skelet (anamnez, status localis, tashxis, davo, tavsiya) bilan boshlanadi.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {royxat.map((r) => (
              <div key={r.id} style={{ ...card, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '22px' }}>📄</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '15px' }}>{r.kasallik}</p>
                  <p style={{ margin: 0, color: 'var(--muted)', fontSize: '12px' }}>
                    {(r.tuzilma?.hujjatlar ?? []).length} ta hujjat · yangilangan: {String(r.updated_at).slice(0, 10)}
                  </p>
                </div>
                {ochirishId === r.id ? (
                  <>
                    <span style={{ fontSize: '12.5px', color: 'var(--danger)' }}>O&apos;chirilsinmi?</span>
                    <button onClick={() => ochirish(r.id)} className="btn-animated" style={{
                      background: 'var(--danger)', color: 'white', border: 'none', borderRadius: '8px',
                      padding: '7px 14px', cursor: 'pointer', fontSize: '12.5px', fontWeight: 600,
                    }}>Ha</button>
                    <button onClick={() => setOchirishId(null)} className="btn-animated" style={{
                      background: 'var(--surface-2)', color: 'var(--ink-soft)', border: '1px solid var(--line)',
                      borderRadius: '8px', padding: '7px 14px', cursor: 'pointer', fontSize: '12.5px',
                    }}>Yo&apos;q</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => router.push(`/doctor/shablonlarim/${r.id}`)} className="btn-animated" style={{
                      background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '8px',
                      padding: '8px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                    }}>Tahrirlash</button>
                    <button onClick={() => nusxaOlish(r)} title="Nusxa olish" className="btn-animated" style={{
                      background: 'var(--surface-2)', color: 'var(--ink-soft)', border: '1px solid var(--line)',
                      borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', fontSize: '13px',
                    }}>⧉</button>
                    <button onClick={() => setOchirishId(r.id)} title="O'chirish" className="btn-animated" style={{
                      background: 'var(--surface-2)', color: 'var(--danger)', border: '1px solid var(--line)',
                      borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', fontSize: '13px',
                    }}>🗑️</button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
