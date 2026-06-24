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
type BemorInfo = { name: string; telefon: string | null }

const HOLAT_LABEL: Record<string, { text: string; color: string }> = {
  kutilmoqda: { text: 'Kutilmoqda', color: 'var(--warn)' },
  qabul_qilindi: { text: 'Qabul qilindi', color: 'var(--accent)' },
  javob_berildi: { text: 'Javob berildi', color: 'var(--good)' },
}

export default function DoctorMurojaatlarPage() {
  const supabase = createClient()
  const [murojaatlar, setMurojaatlar] = useState<Murojaat[]>([])
  const [bemorInfo, setBemorInfo] = useState<Record<string, BemorInfo>>({})
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
      const { data: pats } = await supabase.from('profiles').select('id, full_name, telefon').in('id', patientIds)
      const map: Record<string, BemorInfo> = {}
      for (const p of pats ?? []) map[p.id] = { name: p.full_name, telefon: p.telefon }
      setBemorInfo(map)
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
    setJavobMatn((p) => { const c = { ...p }; delete c[m.id]; return c })
    load()
  }

  const setJavob = (id: string, val: string) => setJavobMatn((p) => ({ ...p, [id]: val }))

  const navbat = murojaatlar.filter((m) => !m.target_doctor_id && !m.doctor_id && m.holat === 'kutilmoqda')
  const menikilar = murojaatlar.filter((m) => m.doctor_id === myId || (m.target_doctor_id === myId && !m.doctor_id))

  const sarlavha = (matn: string, son: number) => (
    <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ width: '3px', height: '16px', background: 'var(--accent)', borderRadius: '2px', display: 'inline-block' }} />
      {matn}
      <span style={{ color: 'var(--muted)', fontFamily: 'monospace', fontSize: '13px', fontWeight: 400 }}>({son})</span>
    </h3>
  )

  return (
    <AppShell title="Murojaatlar">
      <div className="mx-auto max-w-[700px] px-8 py-8">
        {loading ? (
          <p style={{ color: 'var(--muted)' }}>Yuklanmoqda...</p>
        ) : (
          <>
            {sarlavha('Umumiy navbat', navbat.length)}
            {navbat.length === 0
              ? <p style={{ color: 'var(--muted)', fontSize: '13.5px', marginBottom: '24px' }}>Navbatda murojaat yo&apos;q.</p>
              : navbat.map((m, i) => (
                <MurojaatCard key={m.id} m={m} i={i} bemor={bemorInfo[m.patient_id]}
                  javobMatn={javobMatn[m.id] ?? m.javob ?? ''} setJavob={setJavob}
                  qabulQil={qabulQil} javobYubor={javobYubor} saving={saving === m.id} />
              ))}

            <div style={{ height: '24px' }} />
            {sarlavha('Mening murojaatlarim', menikilar.length)}
            {menikilar.length === 0
              ? <p style={{ color: 'var(--muted)', fontSize: '13.5px' }}>Hozircha yo&apos;q.</p>
              : menikilar.map((m, i) => (
                <MurojaatCard key={m.id} m={m} i={i} bemor={bemorInfo[m.patient_id]}
                  javobMatn={javobMatn[m.id] ?? m.javob ?? ''} setJavob={setJavob}
                  qabulQil={qabulQil} javobYubor={javobYubor} saving={saving === m.id} />
              ))}
          </>
        )}
      </div>
    </AppShell>
  )
}

function MurojaatCard({ m, i, bemor, javobMatn, setJavob, qabulQil, javobYubor, saving }: {
  m: Murojaat; i: number; bemor?: BemorInfo
  javobMatn: string; setJavob: (id: string, v: string) => void
  qabulQil: (m: Murojaat) => void; javobYubor: (m: Murojaat) => void; saving: boolean
}) {
  const holat = HOLAT_LABEL[m.holat] ?? HOLAT_LABEL.kutilmoqda
  const boshHarf = (bemor?.name ?? 'B').trim().split(/\s+/).map((x) => x[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="rise" style={{
      animationDelay: `${Math.min(i * 0.05, 0.3)}s`,
      background: 'var(--surface)', borderRadius: '14px', padding: '18px 20px', marginBottom: '14px',
      border: m.shoshilinch ? '1.5px solid var(--danger)' : '1px solid var(--line)',
      borderLeft: `3px solid ${m.shoshilinch ? 'var(--danger)' : holat.color}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
          <span className="avatar" style={{ width: '40px', height: '40px', fontSize: '14px' }}>{boshHarf}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '14.5px', fontWeight: 600 }}>{bemor?.name ?? 'Bemor'}</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '1px' }}>
              {bemor?.telefon && <span>📞 {bemor.telefon}</span>}
              <span>🕐 {new Date(m.created_at).toLocaleString()}</span>
            </div>
          </div>
        </div>
        <span style={{ color: holat.color, fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', background: `color-mix(in srgb, ${holat.color} 14%, transparent)`, padding: '4px 10px', borderRadius: '999px' }}>{holat.text}</span>
      </div>

      {m.shoshilinch && <p style={{ margin: '0 0 6px 0', fontSize: '12.5px', color: 'var(--danger)', fontWeight: 600 }}>⚠️ Shoshilinch</p>}
      <p style={{ margin: '0 0 6px 0', fontSize: '14px' }}><strong>Shikoyat:</strong> {m.shikoyatlar}</p>
      {m.taxminiy_tashxis && <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--accent)' }}>Taxminiy yo&apos;nalish: {m.taxminiy_tashxis}</p>}

      {!m.doctor_id ? (
        <button onClick={() => qabulQil(m)} className="btn-animated soft-press" style={{
          background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '999px',
          padding: '9px 18px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
        }}>
          ✋ Qabul qilish
        </button>
      ) : (
        <>
          <textarea
            value={javobMatn}
            onChange={(e) => setJavob(m.id, e.target.value)}
            placeholder="Bemorga javob yozing..."
            style={{
              width: '100%', minHeight: '64px', background: 'var(--surface-2)', color: 'var(--ink)',
              border: '1px solid var(--line)', borderRadius: '10px', padding: '10px 12px', fontSize: '13.5px',
              outline: 'none', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit',
            }}
          />
          <button onClick={() => javobYubor(m)} disabled={saving} className="btn-animated soft-press" style={{
            marginTop: '8px', background: 'var(--good)', color: 'white', border: 'none', borderRadius: '999px',
            padding: '9px 18px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, opacity: saving ? 0.7 : 1,
          }}>
            {saving ? 'Yuborilmoqda...' : m.javob ? '✓ Javobni yangilash' : '📤 Javobni yuborish'}
          </button>
        </>
      )}
    </div>
  )
}
