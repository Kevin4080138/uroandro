'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/AppShell'
import { bemorHisobiniTop } from '@/lib/telefonMos'
import { OPERATSIYALAR, postOpHolat, POSTOP_JADVALI } from '@/lib/operatsiyalar'

const inputStyle = {
  width: '100%', background: 'var(--surface-2)', color: 'var(--ink)',
  border: '1px solid var(--line)', borderRadius: '10px', padding: '10px 14px',
  fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const,
}
const labelStyle = { color: 'var(--ink-soft)', fontSize: '13px', display: 'block', marginBottom: '6px' }

type Bemor = { id: string; fio: string; telefon: string | null }
type Kuzatuv = {
  id: string
  bemor_ismi: string
  bemor_user_id: string | null
  operatsiya_nomi: string
  operatsiya_slug: string | null
  operatsiya_sanasi: string
  izoh: string | null
}

function bugungiSana() {
  return new Date().toISOString().slice(0, 10)
}

export default function OperatsiyaKuzatuviPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [kuzatuvlar, setKuzatuvlar] = useState<Kuzatuv[]>([])
  const [bemorlar, setBemorlar] = useState<Bemor[]>([])
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const [bemorId, setBemorId] = useState('')
  const [opSlug, setOpSlug] = useState('')
  const [opNomiQol, setOpNomiQol] = useState('')
  const [sana, setSana] = useState(bugungiSana())
  const [izoh, setIzoh] = useState('')

  const load = async () => {
    const [{ data: kz }, { data: bm }] = await Promise.all([
      supabase.from('operatsiya_kuzatuvi').select('*').order('operatsiya_sanasi', { ascending: false }),
      supabase.from('bemorlar').select('id, fio, telefon').order('created_at', { ascending: false }),
    ])
    setKuzatuvlar((kz as Kuzatuv[]) ?? [])
    setBemorlar((bm as Bemor[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const saqla = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const bemor = bemorlar.find((b) => b.id === bemorId)
    if (!bemor) { alert('Bemorni tanlang'); return }

    const opKatalog = OPERATSIYALAR.find((o) => o.slug === opSlug)
    const operatsiyaNomi = opKatalog ? opKatalog.nom : opNomiQol.trim()
    if (!operatsiyaNomi) { alert('Operatsiya nomini tanlang yoki kiriting'); return }

    setSaving(true)
    const bemorUserId = await bemorHisobiniTop(supabase, bemor.telefon)

    const { data: yangi, error } = await supabase.from('operatsiya_kuzatuvi').insert({
      doctor_id: user.id,
      bemor_id: bemor.id,
      bemor_user_id: bemorUserId,
      bemor_ismi: bemor.fio,
      operatsiya_slug: opKatalog ? opSlug : null,
      operatsiya_nomi: operatsiyaNomi,
      operatsiya_sanasi: sana,
      izoh: izoh.trim() || null,
    }).select('id').single()
    setSaving(false)

    if (error) { alert('Xatolik: ' + error.message); return }

    // Bemor hisobi bog'langan bo'lsa — kuzatuv boshlanganini push bilan bildiramiz
    if (bemorUserId && yangi) {
      fetch('/api/push/yangi-operatsiya', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kuzatuvId: yangi.id }),
      }).catch(() => {})
    }

    setBemorId(''); setOpSlug(''); setOpNomiQol(''); setSana(bugungiSana()); setIzoh('')
    setShowForm(false)
    if (!bemorUserId) {
      alert("Kuzatuv saqlandi. ⚠ Bu bemor telefon raqami bilan ilovada ro'yxatdan o'tmagani uchun unga push eslatma yuborilmaydi.")
    }
    load()
  }

  return (
    <AppShell title="Operatsiya kuzatuvi">
      <div className="mx-auto max-w-[860px] px-8 py-8">
        <div className="rise" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>Operatsiyadan keyingi kuzatuv</h2>
            <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '13px', maxWidth: '520px', lineHeight: 1.5 }}>
              Bemorga operatsiyani biriktiring — tizim 1-kun, 7-kun, 1-oy, 3-oy va 6-oyda bemorga avtomatik push eslatma yuboradi.
            </p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-animated soft-press" style={{
            background: showForm ? 'var(--surface-2)' : 'var(--accent)', color: showForm ? 'var(--ink-soft)' : 'white',
            border: showForm ? '1px solid var(--line)' : 'none', borderRadius: '999px',
            padding: '10px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap',
          }}>
            {showForm ? 'Bekor qilish' : '+ Yangi kuzatuv'}
          </button>
        </div>

        {showForm && (
          <div className="rise" style={{
            background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
            padding: '24px', marginBottom: '20px', boxShadow: 'var(--shadow)',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Bemor *</label>
                <select style={inputStyle} value={bemorId} onChange={(e) => setBemorId(e.target.value)}>
                  <option value="">— tanlang —</option>
                  {bemorlar.map((b) => (
                    <option key={b.id} value={b.id}>{b.fio}{b.telefon ? ` · ${b.telefon}` : ''}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Operatsiya sanasi *</label>
                <input type="date" style={inputStyle} value={sana} onChange={(e) => setSana(e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Operatsiya (katalogdan)</label>
                <select style={inputStyle} value={opSlug} onChange={(e) => setOpSlug(e.target.value)}>
                  <option value="">— boshqa (qo&apos;lda kiritish) —</option>
                  {OPERATSIYALAR.map((o) => (
                    <option key={o.slug} value={o.slug}>{o.nom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Yoki operatsiya nomi (qo&apos;lda)</label>
                <input style={inputStyle} value={opNomiQol} onChange={(e) => setOpNomiQol(e.target.value)} placeholder="Masalan: Nefrektomiya" disabled={!!opSlug} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Izoh (bemor ko&apos;radi)</label>
                <input style={inputStyle} value={izoh} onChange={(e) => setIzoh(e.target.value)} placeholder="Masalan: chap tomon, tikuv 7-kuni olinadi" />
              </div>
            </div>
            <button onClick={saqla} disabled={saving || !bemorId} className="btn-animated" style={{
              marginTop: '16px', background: 'var(--accent)', color: 'white', border: 'none',
              borderRadius: '10px', padding: '12px 24px', cursor: saving || !bemorId ? 'not-allowed' : 'pointer',
              fontSize: '14px', fontWeight: 600, opacity: saving || !bemorId ? 0.7 : 1,
            }}>
              {saving ? 'Saqlanmoqda...' : 'Kuzatuvni boshlash'}
            </button>
          </div>
        )}

        {loading ? (
          <p style={{ color: 'var(--muted)' }}>Yuklanmoqda...</p>
        ) : kuzatuvlar.length === 0 ? (
          <div className="rise" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px', opacity: 0.6 }}>🩹</div>
            <p style={{ margin: 0, fontSize: '14px' }}>Hozircha kuzatuv yo&apos;q. Yangi kuzatuv qo&apos;shing.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {kuzatuvlar.map((k, idx) => {
              const bosqichlar = postOpHolat(k.operatsiya_sanasi)
              const otganlar = bosqichlar.filter((b) => b.otdi).length
              const keyingi = bosqichlar.find((b) => !b.otdi)
              return (
                <div key={k.id} className="rise lift" style={{
                  animationDelay: `${Math.min(idx * 0.05, 0.4)}s`,
                  background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '18px 20px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '15px', fontWeight: 700 }}>{k.bemor_ismi}</div>
                      <div style={{ fontSize: '13px', color: 'var(--ink-soft)', marginTop: '2px' }}>{k.operatsiya_nomi}</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <span>📅 {new Date(k.operatsiya_sanasi).toLocaleDateString('uz-UZ')}</span>
                        <span>✓ {otganlar}/{POSTOP_JADVALI.length} bosqich</span>
                        {!k.bemor_user_id && <span style={{ color: 'var(--warn)' }}>⚠ push yo&apos;q (hisob topilmadi)</span>}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      {keyingi ? (
                        <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                          Keyingi: <strong style={{ color: 'var(--accent)' }}>{keyingi.nom}</strong>
                          <div>{keyingi.qoldi} kun qoldi</div>
                        </div>
                      ) : (
                        <span style={{ fontSize: '12px', color: 'var(--good)', fontWeight: 700 }}>✓ Yakunlandi</span>
                      )}
                    </div>
                  </div>
                  {k.izoh && (
                    <div style={{ marginTop: '10px', fontSize: '12.5px', color: 'var(--ink-soft)', background: 'var(--surface-2)', borderRadius: '10px', padding: '8px 12px' }}>
                      📝 {k.izoh}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AppShell>
  )
}
