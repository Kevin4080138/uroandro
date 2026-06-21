'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { createClient } from '@/lib/supabase'
import { tavsiyaBerish } from '@/lib/tavsiya'
import { shikoyatToifalari } from '@/lib/shikoyatlar'
import { tekshiruvTavsiyalari } from '@/lib/tekshiruvlar'
import { tekshiruvBoyichaMaydonlar, asosiyMaydonKalitlari, type Maydon } from '@/lib/natijaMaydonlari'

const inputStyle = {
  width: '100%',
  background: 'var(--surface-2)',
  color: 'var(--ink)',
  border: '1px solid var(--line)',
  borderRadius: '10px',
  padding: '10px 14px',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box' as const,
}

const labelStyle = { color: 'var(--ink-soft)', fontSize: '13px', display: 'block', marginBottom: '6px' }

const holatLabel: Record<string, { text: string; color: string }> = {
  yangi: { text: "Shikoyat qabul qilindi", color: 'var(--warn)' },
  tekshiruv_buyurildi: { text: 'Tekshiruv buyurildi', color: 'var(--warn)' },
  natija_kiritildi: { text: 'Tekshiruv natijasi kiritildi', color: 'var(--accent)' },
  yakunlandi: { text: 'Tavsiya varaqasi yakunlandi', color: 'var(--good)' },
}

const emptyYangiForm = { shikoyat: '', anamnez: '', ogriq: "yo'q", oldin_operatsiya: "yo'q", tekshiruvlar: '' }

function kalkulyatorHavolasi(bemor: any, t: any) {
  const gradeMap: Record<string, string> = { I: '1', II: '2', III: '3' }
  const latMap: Record<string, string> = { chap: 'left', "o'ng": 'right', 'ikki tomonlama': 'bilateral' }
  const params = new URLSearchParams({
    fio: bemor?.fio ?? '',
    telefon: bemor?.telefon ?? '',
    grade: gradeMap[t.daraja] ?? '3',
    lat: latMap[t.tomon] ?? 'left',
    recur: t.oldin_operatsiya === 'ha' ? '1' : '0',
    reflux: t.reflux === 'bor' ? '1' : '0',
    venaDiametri: String(t.vena_diametri ?? ''),
    spermKonts: String(t.sperm_konts ?? ''),
    spermHarakat: String(t.sperm_harakat ?? ''),
    indic: t.ogriq === 'bor' ? 'pain' : 'infertility',
  })
  return `/doctor/calculators/varikotsele/klinik-qaror?${params.toString()}`
}

export default function PatientCardPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = createClient()

  const [bemor, setBemor] = useState<any>(null)
  const [tashriflar, setTashriflar] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [showYangiForm, setShowYangiForm] = useState(false)
  const [editingYangiId, setEditingYangiId] = useState<string | null>(null)
  const [yangiForm, setYangiForm] = useState(emptyYangiForm)
  const [tanlanganOrganlar, setTanlanganOrganlar] = useState<string[]>([])

  const [natijaTashrif, setNatijaTashrif] = useState<any>(null)
  const [natijaForm, setNatijaForm] = useState<Record<string, string>>({})
  const [natija, setNatija] = useState<{ tavsiya: string; sabab: string } | null>(null)

  const [yakunlashTashrifId, setYakunlashTashrifId] = useState<string | null>(null)
  const [doriMuolaja, setDoriMuolaja] = useState('')

  const [saving, setSaving] = useState(false)

  const load = async () => {
    const { data: bemorData } = await supabase.from('bemorlar').select('*').eq('id', id).single()
    setBemor(bemorData)

    const { data: { user } } = await supabase.auth.getUser()
    const { data: tashriflarData } = await supabase
      .from('tashriflar')
      .select('*')
      .eq('bemor_id', id)
      .eq('doctor_id', user?.id)
      .order('sana', { ascending: false })
    setTashriflar(tashriflarData ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  const setY = (key: string) => (e: any) => setYangiForm((f) => ({ ...f, [key]: e.target.value }))

  const qoshShikoyat = (matn: string) => {
    setYangiForm((f) => {
      const mavjud = f.shikoyat.split(',').map((s) => s.trim()).filter(Boolean)
      if (mavjud.includes(matn)) return f
      return { ...f, shikoyat: [...mavjud, matn].join(', ') }
    })
  }

  const toggleOrgan = (nom: string) => {
    setTanlanganOrganlar((prev) =>
      prev.includes(nom) ? prev.filter((o) => o !== nom) : [...prev, nom]
    )
  }

  const qoshTekshiruv = (matn: string) => {
    setYangiForm((f) => {
      const mavjud = f.tekshiruvlar.split(',').map((s) => s.trim()).filter(Boolean)
      if (mavjud.includes(matn)) return f
      return { ...f, tekshiruvlar: [...mavjud, matn].join(', ') }
    })
  }

  const openYangiForm = (t?: any) => {
    if (t) {
      setEditingYangiId(t.id)
      setYangiForm({
        shikoyat: t.shikoyat || '', anamnez: t.anamnez || '',
        ogriq: t.ogriq || "yo'q", oldin_operatsiya: t.oldin_operatsiya || "yo'q",
        tekshiruvlar: t.buyurilgan_tekshiruvlar || '',
      })
      setTanlanganOrganlar((t.organlar || '').split(',').map((s: string) => s.trim()).filter(Boolean))
    } else {
      setEditingYangiId(null)
      setYangiForm(emptyYangiForm)
      setTanlanganOrganlar([])
    }
    setShowYangiForm(true)
  }

  const handleYangiSave = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    setSaving(true)
    const payload = {
      shikoyat: yangiForm.shikoyat,
      anamnez: yangiForm.anamnez,
      ogriq: yangiForm.ogriq,
      oldin_operatsiya: yangiForm.oldin_operatsiya,
      organlar: tanlanganOrganlar.join(', '),
      buyurilgan_tekshiruvlar: yangiForm.tekshiruvlar,
    }

    const { error } = editingYangiId
      ? await supabase.from('tashriflar').update(payload).eq('id', editingYangiId)
      : await supabase.from('tashriflar').insert({
          bemor_id: id, doctor_id: user.id, fio: bemor.fio, holat: 'tekshiruv_buyurildi', ...payload,
        })
    setSaving(false)

    if (!error) {
      setYangiForm(emptyYangiForm)
      setTanlanganOrganlar([])
      setEditingYangiId(null)
      setShowYangiForm(false)
      load()
    }
  }

  const openNatijaForm = (t: any) => {
    setNatijaTashrif(t)
    setNatija(null)
    const boshlangich: Record<string, string> = {}
    const json = t.natija_json || {}
    for (const key of asosiyMaydonKalitlari) {
      if (t[key] !== null && t[key] !== undefined) boshlangich[key] = String(t[key])
    }
    for (const key of Object.keys(json)) {
      boshlangich[key] = String(json[key])
    }
    setNatijaForm(boshlangich)
  }

  const setNatijaQiymat = (key: string) => (e: any) => setNatijaForm((f) => ({ ...f, [key]: e.target.value }))

  const guruhlanganMaydonlar = natijaTashrif
    ? tekshiruvBoyichaMaydonlar(natijaTashrif.buyurilgan_tekshiruvlar || '')
    : []

  const handleNatijaSave = async () => {
    if (!natijaTashrif) return

    const asosiy: Record<string, any> = {}
    const qoshimcha: Record<string, any> = {}
    for (const [key, value] of Object.entries(natijaForm)) {
      if (value === '' || value === undefined) continue
      if (asosiyMaydonKalitlari.includes(key)) {
        asosiy[key] = ['vena_diametri', 'sperm_konts', 'sperm_harakat', 'sperm_morf', 'testosteron', 'fsh', 'lh'].includes(key)
          ? Number(value) : value
      } else {
        qoshimcha[key] = value
      }
    }

    let tavsiya: string | null = null
    let sabab = ''
    if (asosiy.daraja && asosiy.tomon) {
      const natijaHisob = tavsiyaBerish(
        asosiy.daraja, asosiy.tomon, natijaTashrif.ogriq || "yo'q", natijaTashrif.oldin_operatsiya || "yo'q",
        Number(asosiy.sperm_konts) || 0, Number(asosiy.sperm_harakat) || 0
      )
      tavsiya = natijaHisob.tavsiya
      sabab = natijaHisob.sabab
    }

    setSaving(true)
    const yakunlanganmi = natijaTashrif.holat === 'yakunlandi'
    const { error } = await supabase.from('tashriflar').update({
      ...asosiy,
      natija_json: qoshimcha,
      tavsiya,
      holat: yakunlanganmi ? 'yakunlandi' : 'natija_kiritildi',
    }).eq('id', natijaTashrif.id)
    setSaving(false)

    if (!error) {
      if (tavsiya) setNatija({ tavsiya, sabab })
      load()
    }
  }

  const openYakunlash = (tashrifId: string, mavjudDori: string) => {
    setYakunlashTashrifId(tashrifId)
    setDoriMuolaja(mavjudDori || '')
  }

  const handleYakunlashSave = async () => {
    if (!yakunlashTashrifId) return
    setSaving(true)
    const { error } = await supabase.from('tashriflar').update({
      dori_muolaja: doriMuolaja,
      holat: 'yakunlandi',
    }).eq('id', yakunlashTashrifId)
    setSaving(false)

    if (!error) {
      setYakunlashTashrifId(null)
      setDoriMuolaja('')
      load()
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--ink)' }}>Yuklanmoqda...</p>
    </div>
  )

  if (!bemor) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--ink)' }}>Bemor topilmadi.</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/doctor/patients" backLabel="Reestrga qaytish" />

      <div style={{ padding: '32px' }}>
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px',
          padding: '24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '22px' }}>{bemor.fio}</h2>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '13px' }}>
              Pasport: {[bemor.passport_seria, bemor.passport_raqam].filter(Boolean).join(' ') || '—'}
              {' · '}Tug&apos;ilgan: {bemor.tugilgan_sana ?? '—'}
              {' · '}Tel: {bemor.telefon ?? '—'}
            </p>
          </div>
          <button onClick={() => (showYangiForm ? setShowYangiForm(false) : openYangiForm())} style={{
            background: 'var(--accent)', color: 'var(--ink)', border: 'none', borderRadius: '10px',
            padding: '10px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap',
          }}>
            {showYangiForm ? 'Bekor qilish' : '+ Yangi qabul'}
          </button>
        </div>

        {/* 1-bosqich: shikoyat, anamnez, tekshiruv buyurtmasi */}
        {showYangiForm && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ marginTop: 0, fontSize: '15px', color: 'var(--muted)' }}>
              {editingYangiId ? 'Qabulni tahrirlash' : 'Shikoyat va kasallik tarixi'}
            </h3>
            <div>
              <label style={labelStyle}>Shikoyati</label>

              <p style={{ color: 'var(--muted)', fontSize: '12px', margin: '0 0 8px 0' }}>1) Qaysi organ bilan bog&apos;liq?</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                {shikoyatToifalari.map((toifa) => {
                  const tanlangan = tanlanganOrganlar.includes(toifa.nom)
                  return (
                    <button
                      key={toifa.nom}
                      type="button"
                      onClick={() => toggleOrgan(toifa.nom)}
                      style={{
                        background: tanlangan ? 'var(--accent)' : 'var(--surface-2)',
                        color: tanlangan ? 'white' : 'var(--ink-soft)',
                        border: tanlangan ? '1px solid var(--accent)' : '1px solid var(--line)',
                        borderRadius: '20px', padding: '7px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                      }}
                    >
                      {toifa.nom}
                    </button>
                  )
                })}
              </div>

              {tanlanganOrganlar.length > 0 && (
                <>
                  <p style={{ color: 'var(--muted)', fontSize: '12px', margin: '0 0 8px 0' }}>2) Tegishli shikoyatlarni tanlang</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                    {shikoyatToifalari
                      .filter((toifa) => tanlanganOrganlar.includes(toifa.nom))
                      .map((toifa) => (
                        <div key={toifa.nom} style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                          <span style={{ color: 'var(--muted)', fontSize: '12px', marginRight: '2px' }}>{toifa.nom}:</span>
                          {toifa.shikoyatlar.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => qoshShikoyat(s)}
                              style={{
                                background: 'var(--surface-2)', color: 'var(--ink-soft)', border: '1px solid var(--line)',
                                borderRadius: '20px', padding: '5px 12px', cursor: 'pointer', fontSize: '12px',
                              }}
                            >
                              + {s}
                            </button>
                          ))}
                        </div>
                      ))}
                  </div>
                </>
              )}

              <textarea style={{ ...inputStyle, minHeight: '60px' }} value={yangiForm.shikoyat} onChange={setY('shikoyat')} placeholder="Tugmalardan tanlang yoki qo'lda yozing..." />
            </div>
            <div style={{ marginTop: '12px' }}>
              <label style={labelStyle}>Kasallik tarixi (anamnez)</label>
              <textarea style={{ ...inputStyle, minHeight: '60px' }} value={yangiForm.anamnez} onChange={setY('anamnez')} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginTop: '12px' }}>
              <div>
                <label style={labelStyle}>Og&apos;riq / simptom</label>
                <select style={inputStyle} value={yangiForm.ogriq} onChange={setY('ogriq')}>
                  <option value="yo'q">yo&apos;q</option>
                  <option value="bor">bor</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Oldin operatsiya bo&apos;lganmi?</label>
                <select style={inputStyle} value={yangiForm.oldin_operatsiya} onChange={setY('oldin_operatsiya')}>
                  <option value="yo'q">yo&apos;q</option>
                  <option value="ha">ha</option>
                </select>
              </div>
            </div>

            {tanlanganOrganlar.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <label style={labelStyle}>Tavsiya etilgan tekshiruvlar</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                  {tanlanganOrganlar
                    .filter((organ) => tekshiruvTavsiyalari[organ])
                    .map((organ) => (
                      <div key={organ} style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                        <span style={{ color: 'var(--muted)', fontSize: '12px', marginRight: '2px' }}>{organ}:</span>
                        {tekshiruvTavsiyalari[organ].map((tek) => (
                          <button
                            key={tek}
                            type="button"
                            onClick={() => qoshTekshiruv(tek)}
                            style={{
                              background: 'var(--surface-2)', color: 'var(--warn)', border: '1px solid var(--line)',
                              borderRadius: '20px', padding: '5px 12px', cursor: 'pointer', fontSize: '12px',
                            }}
                          >
                            + {tek}
                          </button>
                        ))}
                      </div>
                    ))}
                </div>
                <textarea style={{ ...inputStyle, minHeight: '50px' }} value={yangiForm.tekshiruvlar} onChange={setY('tekshiruvlar')} placeholder="Buyurilgan tekshiruvlar ro'yxati..." />
              </div>
            )}

            <button onClick={handleYangiSave} disabled={saving} style={{
              marginTop: '16px', background: 'var(--accent)', color: 'var(--ink)', border: 'none',
              borderRadius: '10px', padding: '12px 24px', cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '14px', fontWeight: 600, opacity: saving ? 0.7 : 1,
            }}>
              {saving ? 'Saqlanmoqda...' : editingYangiId ? 'O\'zgarishlarni saqlash' : "Saqlash va tekshiruvga yo'llash"}
            </button>
          </div>
        )}

        {/* 2-bosqich: tekshiruv natijalari (buyurilgan testlarga mos dinamik maydonlar) */}
        {natijaTashrif && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ marginTop: 0, fontSize: '15px', color: 'var(--muted)' }}>Tekshiruv natijalari</h3>

            {guruhlanganMaydonlar.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: '13px' }}>
                Bu qabulda tekshiruv buyurilmagan. Avval &quot;Tahrirlash&quot; orqali tekshiruv qo&apos;shing.
              </p>
            ) : (
              guruhlanganMaydonlar.map(({ test, maydonlar }: { test: string; maydonlar: Maydon[] }) => (
                <div key={test} style={{ marginBottom: '16px' }}>
                  <p style={{ color: 'var(--warn)', fontSize: '13px', fontWeight: 600, margin: '0 0 8px 0' }}>{test}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {maydonlar.map((m: Maydon) => (
                      <div key={m.key}>
                        <label style={labelStyle}>{m.label}{m.unit ? ` (${m.unit})` : ''}</label>
                        {m.type === 'select' ? (
                          <select style={inputStyle} value={natijaForm[m.key] ?? ''} onChange={setNatijaQiymat(m.key)}>
                            <option value="">—</option>
                            {m.options!.map((o) => <option key={o} value={o}>{o}</option>)}
                          </select>
                        ) : (
                          <input
                            type={m.type === 'number' ? 'number' : 'text'}
                            style={inputStyle}
                            value={natijaForm[m.key] ?? ''}
                            onChange={setNatijaQiymat(m.key)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}

            {natija && (
              <div style={{ marginTop: '16px', background: 'var(--accent-soft)', border: '1px solid var(--good)', borderRadius: '10px', padding: '14px' }}>
                <p style={{ margin: 0, color: 'var(--good)', fontWeight: 600 }}>Tavsiya: {natija.tavsiya}</p>
                <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '13px' }}>{natija.sabab}</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button onClick={handleNatijaSave} disabled={saving} style={{
                background: 'var(--accent)', color: 'var(--ink)', border: 'none', borderRadius: '10px',
                padding: '12px 24px', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 600,
                opacity: saving ? 0.7 : 1,
              }}>
                {saving ? 'Saqlanmoqda...' : 'Natijalarni saqlash'}
              </button>
              <button onClick={() => setNatijaTashrif(null)} style={{
                background: 'var(--surface-2)', color: 'var(--muted)', border: '1px solid var(--line)', borderRadius: '10px',
                padding: '12px 24px', cursor: 'pointer', fontSize: '14px',
              }}>
                Yopish
              </button>
            </div>
          </div>
        )}

        {/* 3-bosqich: dori va muolaja */}
        {yakunlashTashrifId && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ marginTop: 0, fontSize: '15px', color: 'var(--muted)' }}>Tavsiya varaqasi — dori va muolaja</h3>
            <textarea style={{ ...inputStyle, minHeight: '120px' }} value={doriMuolaja} onChange={(e) => setDoriMuolaja(e.target.value)} placeholder="Dorilar, dozalar, muolajalar, tavsiyalar..." />
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button onClick={handleYakunlashSave} disabled={saving} style={{
                background: 'var(--accent)', color: 'var(--ink)', border: 'none', borderRadius: '10px',
                padding: '12px 24px', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 600,
                opacity: saving ? 0.7 : 1,
              }}>
                {saving ? 'Saqlanmoqda...' : 'Varaqani yakunlash'}
              </button>
              <button onClick={() => setYakunlashTashrifId(null)} style={{
                background: 'var(--surface-2)', color: 'var(--muted)', border: '1px solid var(--line)', borderRadius: '10px',
                padding: '12px 24px', cursor: 'pointer', fontSize: '14px',
              }}>
                Yopish
              </button>
            </div>
          </div>
        )}

        <h3 style={{ fontSize: '16px', color: 'var(--muted)', marginBottom: '12px' }}>Qabullar tarixi</h3>
        {tashriflar.length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>Hozircha qabul yo&apos;q.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tashriflar.map((t) => {
              const holat = holatLabel[t.holat] ?? holatLabel.yangi
              return (
                <div key={t.id} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '13px' }}>{new Date(t.sana).toLocaleString()}</span>
                    <span style={{ color: holat.color, fontSize: '13px', fontWeight: 600 }}>{holat.text}</span>
                  </div>
                  {t.shikoyat && <p style={{ margin: '0 0 4px 0', fontSize: '14px' }}><strong>Shikoyat:</strong> {t.shikoyat}</p>}
                  {t.anamnez && <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: 'var(--muted)' }}><strong>Anamnez:</strong> {t.anamnez}</p>}
                  {t.buyurilgan_tekshiruvlar && <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: 'var(--warn)' }}><strong>Buyurilgan tekshiruvlar:</strong> {t.buyurilgan_tekshiruvlar}</p>}
                  {t.tavsiya && <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: 'var(--accent)' }}><strong>Tavsiya:</strong> {t.tavsiya} ({t.daraja}-daraja, {t.tomon})</p>}
                  {t.dori_muolaja && <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: 'var(--good)' }}><strong>Dori/muolaja:</strong> {t.dori_muolaja}</p>}

                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                    <button onClick={() => openYangiForm(t)} style={{
                      background: 'var(--surface-2)', color: 'var(--ink-soft)', border: '1px solid var(--line)', borderRadius: '8px',
                      padding: '8px 14px', cursor: 'pointer', fontSize: '13px',
                    }}>
                      ✎ Tahrirlash
                    </button>
                    {(t.holat === 'yangi' || t.holat === 'tekshiruv_buyurildi') && (
                      <button onClick={() => window.open(`/doctor/print/referral/${t.id}`, '_blank')} style={{
                        background: 'var(--surface-2)', color: 'var(--warn)', border: '1px solid var(--line)', borderRadius: '8px',
                        padding: '8px 14px', cursor: 'pointer', fontSize: '13px',
                      }}>
                        🖨️ Yo&apos;llanma chop etish
                      </button>
                    )}
                    {t.holat !== 'yakunlandi' && (
                      <button onClick={() => openNatijaForm(t)} style={{
                        background: 'var(--surface-2)', color: 'var(--accent)', border: '1px solid var(--line)', borderRadius: '8px',
                        padding: '8px 14px', cursor: 'pointer', fontSize: '13px',
                      }}>
                        Tekshiruv natijalarini kiritish
                      </button>
                    )}
                    {t.holat === 'natija_kiritildi' && (
                      <button onClick={() => openYakunlash(t.id, t.dori_muolaja)} style={{
                        background: 'var(--surface-2)', color: 'var(--good)', border: '1px solid var(--line)', borderRadius: '8px',
                        padding: '8px 14px', cursor: 'pointer', fontSize: '13px',
                      }}>
                        Tavsiya varaqasini yakunlash
                      </button>
                    )}
                    {(t.holat === 'natija_kiritildi' || t.holat === 'yakunlandi') && (
                      <button onClick={() => router.push(kalkulyatorHavolasi(bemor, t))} style={{
                        background: 'var(--surface-2)', color: 'var(--accent-2)', border: '1px solid var(--line)', borderRadius: '8px',
                        padding: '8px 14px', cursor: 'pointer', fontSize: '13px',
                      }}>
                        🧮 Varikotsele kalkulyatoriga o&apos;tish
                      </button>
                    )}
                    {t.holat === 'yakunlandi' && (
                      <>
                        <button onClick={() => openNatijaForm(t)} style={{
                          background: 'var(--surface-2)', color: 'var(--accent)', border: '1px solid var(--line)', borderRadius: '8px',
                          padding: '8px 14px', cursor: 'pointer', fontSize: '13px',
                        }}>
                          Natijalarni tahrirlash
                        </button>
                        <button onClick={() => openYakunlash(t.id, t.dori_muolaja)} style={{
                          background: 'var(--surface-2)', color: 'var(--good)', border: '1px solid var(--line)', borderRadius: '8px',
                          padding: '8px 14px', cursor: 'pointer', fontSize: '13px',
                        }}>
                          Dori/muolajani tahrirlash
                        </button>
                        <button onClick={() => window.open(`/doctor/print/${t.id}`, '_blank')} style={{
                          background: 'var(--surface-2)', color: 'var(--muted)', border: '1px solid var(--line)', borderRadius: '8px',
                          padding: '8px 14px', cursor: 'pointer', fontSize: '13px',
                        }}>
                          🖨️ Chop etish / PDF
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
