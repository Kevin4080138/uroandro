'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { tavsiyaBerish } from '@/lib/tavsiya'
import { shikoyatToifalari } from '@/lib/shikoyatlar'
import { tekshiruvTavsiyalari } from '@/lib/tekshiruvlar'

const inputStyle = {
  width: '100%',
  backgroundColor: '#1e1e2e',
  color: 'white',
  border: '1px solid #2e2e3e',
  borderRadius: '10px',
  padding: '10px 14px',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box' as const,
}

const labelStyle = { color: '#d1d5db', fontSize: '13px', display: 'block', marginBottom: '6px' }

const holatLabel: Record<string, { text: string; color: string }> = {
  yangi: { text: "Shikoyat qabul qilindi", color: '#f59e0b' },
  tekshiruv_buyurildi: { text: 'Tekshiruv buyurildi', color: '#f59e0b' },
  natija_kiritildi: { text: 'Tekshiruv natijasi kiritildi', color: '#60a5fa' },
  yakunlandi: { text: 'Tavsiya varaqasi yakunlandi', color: '#4ade80' },
}

const emptyYangiForm = { shikoyat: '', anamnez: '', tekshiruvlar: '' }

const emptyNatijaForm = {
  tomon: 'chap', daraja: 'I', vena_diametri: 3,
  reflux: 'bor', ogriq: "yo'q", oldin_operatsiya: "yo'q",
  sperm_konts: 20, sperm_harakat: 45, sperm_morf: 5,
  testosteron: 15, fsh: 5, lh: 5, izoh: '',
}

export default function PatientCardPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = createClient()

  const [bemor, setBemor] = useState<any>(null)
  const [tashriflar, setTashriflar] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [showYangiForm, setShowYangiForm] = useState(false)
  const [yangiForm, setYangiForm] = useState(emptyYangiForm)
  const [tanlanganOrganlar, setTanlanganOrganlar] = useState<string[]>([])

  const [natijaTashrifId, setNatijaTashrifId] = useState<string | null>(null)
  const [natijaForm, setNatijaForm] = useState(emptyNatijaForm)
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
  const setN = (key: string) => (e: any) => setNatijaForm((f) => ({ ...f, [key]: e.target.value }))

  const handleYangiSave = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    setSaving(true)
    const { error } = await supabase.from('tashriflar').insert({
      bemor_id: id,
      doctor_id: user.id,
      fio: bemor.fio,
      shikoyat: yangiForm.shikoyat,
      anamnez: yangiForm.anamnez,
      organlar: tanlanganOrganlar.join(', '),
      buyurilgan_tekshiruvlar: yangiForm.tekshiruvlar,
      holat: 'tekshiruv_buyurildi',
    })
    setSaving(false)

    if (!error) {
      setYangiForm(emptyYangiForm)
      setTanlanganOrganlar([])
      setShowYangiForm(false)
      load()
    }
  }

  const openNatijaForm = (tashrifId: string) => {
    setNatijaTashrifId(tashrifId)
    setNatija(null)
    setNatijaForm(emptyNatijaForm)
  }

  const handleNatijaSave = async () => {
    if (!natijaTashrifId) return

    const { tavsiya, sabab } = tavsiyaBerish(
      natijaForm.daraja, natijaForm.tomon, natijaForm.ogriq, natijaForm.oldin_operatsiya,
      Number(natijaForm.sperm_konts), Number(natijaForm.sperm_harakat)
    )

    setSaving(true)
    const { error } = await supabase.from('tashriflar').update({
      tomon: natijaForm.tomon,
      daraja: natijaForm.daraja,
      vena_diametri: Number(natijaForm.vena_diametri),
      reflux: natijaForm.reflux,
      ogriq: natijaForm.ogriq,
      oldin_operatsiya: natijaForm.oldin_operatsiya,
      sperm_konts: Number(natijaForm.sperm_konts),
      sperm_harakat: Number(natijaForm.sperm_harakat),
      sperm_morf: Number(natijaForm.sperm_morf),
      testosteron: Number(natijaForm.testosteron),
      fsh: Number(natijaForm.fsh),
      lh: Number(natijaForm.lh),
      izoh: natijaForm.izoh,
      tavsiya,
      holat: 'natija_kiritildi',
    }).eq('id', natijaTashrifId)
    setSaving(false)

    if (!error) {
      setNatija({ tavsiya, sabab })
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
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'white' }}>Yuklanmoqda...</p>
    </div>
  )

  if (!bemor) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'white' }}>Bemor topilmadi.</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', color: 'white' }}>
      <div style={{
        backgroundColor: '#111118', borderBottom: '1px solid #1e1e2e',
        padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>
          Uro<span style={{ color: '#60a5fa' }}>Andro</span>
        </h1>
        <button onClick={() => router.push('/doctor/patients')} style={{
          backgroundColor: '#1e1e2e', color: '#9ca3af', border: '1px solid #2e2e3e',
          borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '14px',
        }}>
          ← Reestrga qaytish
        </button>
      </div>

      <div style={{ padding: '32px' }}>
        <div style={{
          backgroundColor: '#111118', border: '1px solid #1e1e2e', borderRadius: '12px',
          padding: '24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '22px' }}>{bemor.fio}</h2>
            <p style={{ margin: 0, color: '#9ca3af', fontSize: '13px' }}>
              Pasport: {[bemor.passport_seria, bemor.passport_raqam].filter(Boolean).join(' ') || '—'}
              {' · '}Tug&apos;ilgan: {bemor.tugilgan_sana ?? '—'}
              {' · '}Tel: {bemor.telefon ?? '—'}
            </p>
          </div>
          <button onClick={() => { setShowYangiForm(!showYangiForm) }} style={{
            backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '10px',
            padding: '10px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap',
          }}>
            {showYangiForm ? 'Bekor qilish' : '+ Yangi qabul'}
          </button>
        </div>

        {/* 1-bosqich: shikoyat va anamnez */}
        {showYangiForm && (
          <div style={{ backgroundColor: '#111118', border: '1px solid #1e1e2e', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ marginTop: 0, fontSize: '15px', color: '#9ca3af' }}>Shikoyat va kasallik tarixi</h3>
            <div>
              <label style={labelStyle}>Shikoyati</label>

              <p style={{ color: '#6b7280', fontSize: '12px', margin: '0 0 8px 0' }}>1) Qaysi organ bilan bog'liq?</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                {shikoyatToifalari.map((toifa) => {
                  const tanlangan = tanlanganOrganlar.includes(toifa.nom)
                  return (
                    <button
                      key={toifa.nom}
                      type="button"
                      onClick={() => toggleOrgan(toifa.nom)}
                      style={{
                        backgroundColor: tanlangan ? '#2563eb' : '#1e1e2e',
                        color: tanlangan ? 'white' : '#d1d5db',
                        border: tanlangan ? '1px solid #2563eb' : '1px solid #2e2e3e',
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
                  <p style={{ color: '#6b7280', fontSize: '12px', margin: '0 0 8px 0' }}>2) Tegishli shikoyatlarni tanlang</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                    {shikoyatToifalari
                      .filter((toifa) => tanlanganOrganlar.includes(toifa.nom))
                      .map((toifa) => (
                        <div key={toifa.nom} style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                          <span style={{ color: '#6b7280', fontSize: '12px', marginRight: '2px' }}>{toifa.nom}:</span>
                          {toifa.shikoyatlar.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => qoshShikoyat(s)}
                              style={{
                                backgroundColor: '#1e1e2e', color: '#d1d5db', border: '1px solid #2e2e3e',
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

            {tanlanganOrganlar.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <label style={labelStyle}>Tavsiya etilgan tekshiruvlar</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                  {tanlanganOrganlar
                    .filter((organ) => tekshiruvTavsiyalari[organ])
                    .map((organ) => (
                      <div key={organ} style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                        <span style={{ color: '#6b7280', fontSize: '12px', marginRight: '2px' }}>{organ}:</span>
                        {tekshiruvTavsiyalari[organ].map((tek) => (
                          <button
                            key={tek}
                            type="button"
                            onClick={() => qoshTekshiruv(tek)}
                            style={{
                              backgroundColor: '#1e1e2e', color: '#fbbf24', border: '1px solid #2e2e3e',
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
              marginTop: '16px', backgroundColor: '#2563eb', color: 'white', border: 'none',
              borderRadius: '10px', padding: '12px 24px', cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '14px', fontWeight: 600, opacity: saving ? 0.7 : 1,
            }}>
              {saving ? 'Saqlanmoqda...' : "Saqlash va tekshiruvga yo'llash"}
            </button>
          </div>
        )}

        {/* 2-bosqich: tekshiruv natijalari */}
        {natijaTashrifId && (
          <div style={{ backgroundColor: '#111118', border: '1px solid #1e1e2e', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ marginTop: 0, fontSize: '15px', color: '#9ca3af' }}>Tekshiruv natijalari</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Tomoni</label>
                <select style={inputStyle} value={natijaForm.tomon} onChange={setN('tomon')}>
                  <option value="chap">chap</option>
                  <option value="o'ng">o&apos;ng</option>
                  <option value="ikki tomonlama">ikki tomonlama</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Darajasi (Dubin)</label>
                <select style={inputStyle} value={natijaForm.daraja} onChange={setN('daraja')}>
                  <option value="I">I</option>
                  <option value="II">II</option>
                  <option value="III">III</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Vena diametri (mm)</label>
                <input type="number" step="0.1" style={inputStyle} value={natijaForm.vena_diametri} onChange={setN('vena_diametri')} />
              </div>
              <div>
                <label style={labelStyle}>Reflux</label>
                <select style={inputStyle} value={natijaForm.reflux} onChange={setN('reflux')}>
                  <option value="bor">bor</option>
                  <option value="yo'q">yo&apos;q</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Og&apos;riq / simptom</label>
                <select style={inputStyle} value={natijaForm.ogriq} onChange={setN('ogriq')}>
                  <option value="yo'q">yo&apos;q</option>
                  <option value="bor">bor</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Oldin operatsiya bo&apos;lganmi?</label>
                <select style={inputStyle} value={natijaForm.oldin_operatsiya} onChange={setN('oldin_operatsiya')}>
                  <option value="yo'q">yo&apos;q</option>
                  <option value="ha">ha</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Sperma konsentratsiyasi (mln/ml)</label>
                <input type="number" style={inputStyle} value={natijaForm.sperm_konts} onChange={setN('sperm_konts')} />
              </div>
              <div>
                <label style={labelStyle}>Harakatchanlik (%)</label>
                <input type="number" style={inputStyle} value={natijaForm.sperm_harakat} onChange={setN('sperm_harakat')} />
              </div>
              <div>
                <label style={labelStyle}>Normal morfologiya (%)</label>
                <input type="number" style={inputStyle} value={natijaForm.sperm_morf} onChange={setN('sperm_morf')} />
              </div>
              <div>
                <label style={labelStyle}>Testosteron (nmol/l)</label>
                <input type="number" style={inputStyle} value={natijaForm.testosteron} onChange={setN('testosteron')} />
              </div>
              <div>
                <label style={labelStyle}>FSH (mIU/ml)</label>
                <input type="number" style={inputStyle} value={natijaForm.fsh} onChange={setN('fsh')} />
              </div>
              <div>
                <label style={labelStyle}>LH (mIU/ml)</label>
                <input type="number" style={inputStyle} value={natijaForm.lh} onChange={setN('lh')} />
              </div>
            </div>
            <div style={{ marginTop: '16px' }}>
              <label style={labelStyle}>Izoh</label>
              <textarea style={{ ...inputStyle, minHeight: '60px' }} value={natijaForm.izoh} onChange={setN('izoh')} />
            </div>

            {natija && (
              <div style={{ marginTop: '16px', backgroundColor: '#0f1f14', border: '1px solid #166534', borderRadius: '10px', padding: '14px' }}>
                <p style={{ margin: 0, color: '#4ade80', fontWeight: 600 }}>Tavsiya: {natija.tavsiya}</p>
                <p style={{ margin: '4px 0 0', color: '#9ca3af', fontSize: '13px' }}>{natija.sabab}</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button onClick={handleNatijaSave} disabled={saving} style={{
                backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '10px',
                padding: '12px 24px', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 600,
                opacity: saving ? 0.7 : 1,
              }}>
                {saving ? 'Saqlanmoqda...' : 'Tavsiya olish va saqlash'}
              </button>
              <button onClick={() => setNatijaTashrifId(null)} style={{
                backgroundColor: '#1e1e2e', color: '#9ca3af', border: '1px solid #2e2e3e', borderRadius: '10px',
                padding: '12px 24px', cursor: 'pointer', fontSize: '14px',
              }}>
                Yopish
              </button>
            </div>
          </div>
        )}

        {/* 3-bosqich: dori va muolaja */}
        {yakunlashTashrifId && (
          <div style={{ backgroundColor: '#111118', border: '1px solid #1e1e2e', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ marginTop: 0, fontSize: '15px', color: '#9ca3af' }}>Tavsiya varaqasi — dori va muolaja</h3>
            <textarea style={{ ...inputStyle, minHeight: '120px' }} value={doriMuolaja} onChange={(e) => setDoriMuolaja(e.target.value)} placeholder="Dorilar, dozalar, muolajalar, tavsiyalar..." />
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button onClick={handleYakunlashSave} disabled={saving} style={{
                backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '10px',
                padding: '12px 24px', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 600,
                opacity: saving ? 0.7 : 1,
              }}>
                {saving ? 'Saqlanmoqda...' : 'Varaqani yakunlash'}
              </button>
              <button onClick={() => setYakunlashTashrifId(null)} style={{
                backgroundColor: '#1e1e2e', color: '#9ca3af', border: '1px solid #2e2e3e', borderRadius: '10px',
                padding: '12px 24px', cursor: 'pointer', fontSize: '14px',
              }}>
                Yopish
              </button>
            </div>
          </div>
        )}

        <h3 style={{ fontSize: '16px', color: '#9ca3af', marginBottom: '12px' }}>Qabullar tarixi</h3>
        {tashriflar.length === 0 ? (
          <p style={{ color: '#9ca3af' }}>Hozircha qabul yo&apos;q.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tashriflar.map((t) => {
              const holat = holatLabel[t.holat] ?? holatLabel.yangi
              return (
                <div key={t.id} style={{ backgroundColor: '#111118', border: '1px solid #1e1e2e', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ color: '#6b7280', fontSize: '13px' }}>{new Date(t.sana).toLocaleString()}</span>
                    <span style={{ color: holat.color, fontSize: '13px', fontWeight: 600 }}>{holat.text}</span>
                  </div>
                  {t.shikoyat && <p style={{ margin: '0 0 4px 0', fontSize: '14px' }}><strong>Shikoyat:</strong> {t.shikoyat}</p>}
                  {t.anamnez && <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#9ca3af' }}><strong>Anamnez:</strong> {t.anamnez}</p>}
                  {t.buyurilgan_tekshiruvlar && <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#fbbf24' }}><strong>Buyurilgan tekshiruvlar:</strong> {t.buyurilgan_tekshiruvlar}</p>}
                  {t.tavsiya && <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#60a5fa' }}><strong>Tavsiya:</strong> {t.tavsiya} ({t.daraja}-daraja, {t.tomon})</p>}
                  {t.dori_muolaja && <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#4ade80' }}><strong>Dori/muolaja:</strong> {t.dori_muolaja}</p>}

                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    {(t.holat === 'yangi' || t.holat === 'tekshiruv_buyurildi') && (
                      <button onClick={() => window.open(`/doctor/print/referral/${t.id}`, '_blank')} style={{
                        backgroundColor: '#1e1e2e', color: '#fbbf24', border: '1px solid #2e2e3e', borderRadius: '8px',
                        padding: '8px 14px', cursor: 'pointer', fontSize: '13px',
                      }}>
                        🖨️ Yo&apos;llanma chop etish
                      </button>
                    )}
                    {(t.holat === 'yangi' || t.holat === 'tekshiruv_buyurildi') && (
                      <button onClick={() => openNatijaForm(t.id)} style={{
                        backgroundColor: '#1e1e2e', color: '#60a5fa', border: '1px solid #2e2e3e', borderRadius: '8px',
                        padding: '8px 14px', cursor: 'pointer', fontSize: '13px',
                      }}>
                        Tekshiruv natijalarini kiritish
                      </button>
                    )}
                    {t.holat === 'natija_kiritildi' && (
                      <button onClick={() => openYakunlash(t.id, t.dori_muolaja)} style={{
                        backgroundColor: '#1e1e2e', color: '#4ade80', border: '1px solid #2e2e3e', borderRadius: '8px',
                        padding: '8px 14px', cursor: 'pointer', fontSize: '13px',
                      }}>
                        Tavsiya varaqasini yakunlash
                      </button>
                    )}
                    {t.holat === 'yakunlandi' && (
                      <button onClick={() => window.open(`/doctor/print/${t.id}`, '_blank')} style={{
                        backgroundColor: '#1e1e2e', color: '#9ca3af', border: '1px solid #2e2e3e', borderRadius: '8px',
                        padding: '8px 14px', cursor: 'pointer', fontSize: '13px',
                      }}>
                        🖨️ Chop etish / PDF
                      </button>
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
