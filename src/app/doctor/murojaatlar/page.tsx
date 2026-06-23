'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { AppShell } from '@/components/AppShell'

type Murojaat = {
  id: string; patient_id: string; shikoyatlar: string; taxminiy_tashxis: string | null
  sabablar: string | null; tavsiya: string | null; javob: string | null
  holat: string; shoshilinch: boolean; created_at: string
  doctor_id: string | null; target_doctor_id: string | null
}

const HOLAT_LABEL: Record<string, { text: string; color: string }> = {
  kutilmoqda: { text: 'Kutilmoqda', color: 'var(--warn)' },
  qabul_qilindi: { text: 'Qabul qilindi', color: 'var(--accent)' },
  javob_berildi: { text: 'Javob berildi', color: 'var(--good)' },
}

export default function DoctorMurojaatlarPage() {
  const supabase = createClient()
  const [murojaatlar, setMurojaatlar] = useState<Murojaat[]>([])
  const [patientNames, setPatientNames] = useState<Record<string, string>>({})
  const [myId, setMyId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [javobMatn, setJavobMatn] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setMyId(user?.id ?? null)

    const { data } = await supabase.from('murojaatlar').select('*').order('created_at', { ascending: false })
    const list = (data as Murojaat[]) ?? []
    setMurojaatlar(list)

    const patientIds = Array.from(new Set(list.map((m) => m.patient_id)))
    if (patientIds.length > 0) {
      const { data: pats } = await supabase.from('profiles').select('id, full_name').in('id', patientIds)
      const map: Record<string, string> = {}
      for (const p of pats ?? []) map[p.id] = p.full_name
      setPatientNames(map)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const qabulQil = async (m: Murojaat) => {
    if (!myId) return
    await supabase.from('murojaatlar').update({ doctor_id: myId, holat: 'qabul_qilindi' }).eq('id', m.id)
    load()
  }

  const javobYubor = async (m: Murojaat) => {
    const matn = javobMatn[m.id]?.trim()
    if (!matn) return
    setSaving(m.id)
    await supabase.from('murojaatlar').update({ javob: matn, holat: 'javob_berildi', doctor_id: myId }).eq('id', m.id)
    setSaving(null)
    load()
  }

  const navbat = murojaatlar.filter((m) => !m.target_doctor_id && !m.doctor_id && m.holat === 'kutilmoqda')
  const menikilar = murojaatlar.filter((m) => m.doctor_id === myId || (m.target_doctor_id === myId && !m.doctor_id))

  const Card = ({ m }: { m: Murojaat }) => {
    const holat = HOLAT_LABEL[m.holat] ?? HOLAT_LABEL.kutilmoqda
    return (
      <div style={{ background: 'var(--surface)', border: m.shoshilinch ? '1.5px solid var(--danger)' : '1px solid var(--line)', borderRadius: '12px', padding: '18px 20px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <strong style={{ fontSize: '14.5px' }}>{patientNames[m.patient_id] ?? 'Bemor'}</strong>
          <span style={{ color: holat.color, fontSize: '12.5px', fontWeight: 600 }}>{holat.text}</span>
        </div>
        {m.shoshilinch && <p style={{ margin: '0 0 6px 0', fontSize: '12.5px', color: 'var(--danger)', fontWeight: 600 }}>⚠️ Shoshilinch</p>}
        <p style={{ margin: '0 0 6px 0', fontSize: '14px' }}><strong>Shikoyat:</strong> {m.shikoyatlar}</p>
        {m.taxminiy_tashxis && <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: 'var(--accent)' }}>Taxminiy yo&apos;nalish: {m.taxminiy_tashxis}</p>}
        <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: 'var(--muted)' }}>{new Date(m.created_at).toLocaleString()}</p>

        {!m.doctor_id ? (
          <button onClick={() => qabulQil(m)} className="btn-animated" style={{
            background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '8px',
            padding: '8px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
          }}>
            Qabul qilish
          </button>
        ) : (
          <>
            {m.javob && (
              <div style={{ background: 'var(--accent-soft)', borderRadius: '8px', padding: '10px 14px', marginBottom: '10px', fontSize: '13.5px' }}>
                {m.javob}
              </div>
            )}
            <textarea
              value={javobMatn[m.id] ?? m.javob ?? ''}
              onChange={(e) => setJavobMatn((p) => ({ ...p, [m.id]: e.target.value }))}
              placeholder="Bemorga javob yozing..."
              style={{
                width: '100%', minHeight: '60px', background: 'var(--surface-2)', color: 'var(--ink)',
                border: '1px solid var(--line)', borderRadius: '8px', padding: '10px 12px', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box',
              }}
            />
            <button onClick={() => javobYubor(m)} disabled={saving === m.id} className="btn-animated" style={{
              marginTop: '8px', background: 'var(--good)', color: 'white', border: 'none', borderRadius: '8px',
              padding: '8px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
            }}>
              {saving === m.id ? 'Yuborilmoqda...' : 'Javobni yuborish'}
            </button>
          </>
        )}
      </div>
    )
  }

  return (
    <AppShell title="Murojaatlar">
      <div className="mx-auto max-w-[700px] px-8 py-8">
        {loading ? (
          <p style={{ color: 'var(--muted)' }}>Yuklanmoqda...</p>
        ) : (
          <>
            <h3 style={{ fontSize: '16px', marginBottom: '14px' }}>
              Umumiy navbat <span style={{ color: 'var(--muted)', fontFamily: 'monospace', fontSize: '13px' }}>({navbat.length})</span>
            </h3>
            {navbat.length === 0 ? <p style={{ color: 'var(--muted)', fontSize: '13.5px', marginBottom: '24px' }}>Navbatda murojaat yo&apos;q.</p> : navbat.map((m) => <Card key={m.id} m={m} />)}

            <h3 style={{ fontSize: '16px', margin: '24px 0 14px' }}>
              Mening murojaatlarim <span style={{ color: 'var(--muted)', fontFamily: 'monospace', fontSize: '13px' }}>({menikilar.length})</span>
            </h3>
            {menikilar.length === 0 ? <p style={{ color: 'var(--muted)', fontSize: '13.5px' }}>Hozircha yo&apos;q.</p> : menikilar.map((m) => <Card key={m.id} m={m} />)}
          </>
        )}
      </div>
    </AppShell>
  )
}
