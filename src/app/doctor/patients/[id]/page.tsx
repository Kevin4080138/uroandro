'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { tavsiyaBerish } from '@/lib/tavsiya'

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

const emptyForm = {
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
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [natija, setNatija] = useState<{ tavsiya: string; sabab: string } | null>(null)

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

  const set = (key: string) => (e: any) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const { tavsiya, sabab } = tavsiyaBerish(
      form.daraja, form.tomon, form.ogriq, form.oldin_operatsiya,
      Number(form.sperm_konts), Number(form.sperm_harakat)
    )

    setSaving(true)
    const { error } = await supabase.from('tashriflar').insert({
      bemor_id: id,
      doctor_id: user.id,
      fio: bemor.fio,
      tomon: form.tomon,
      daraja: form.daraja,
      vena_diametri: Number(form.vena_diametri),
      reflux: form.reflux,
      ogriq: form.ogriq,
      oldin_operatsiya: form.oldin_operatsiya,
      sperm_konts: Number(form.sperm_konts),
      sperm_harakat: Number(form.sperm_harakat),
      sperm_morf: Number(form.sperm_morf),
      testosteron: Number(form.testosteron),
      fsh: Number(form.fsh),
      lh: Number(form.lh),
      tavsiya,
      izoh: form.izoh,
    })
    setSaving(false)

    if (!error) {
      setNatija({ tavsiya, sabab })
      setForm(emptyForm)
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
          <button onClick={() => { setShowForm(!showForm); setNatija(null) }} style={{
            backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '10px',
            padding: '10px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap',
          }}>
            {showForm ? 'Bekor qilish' : '+ Yangi tashrif'}
          </button>
        </div>

        {showForm && (
          <div style={{
            backgroundColor: '#111118', border: '1px solid #1e1e2e', borderRadius: '12px',
            padding: '24px', marginBottom: '24px',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Tomoni</label>
                <select style={inputStyle} value={form.tomon} onChange={set('tomon')}>
                  <option value="chap">chap</option>
                  <option value="o'ng">o&apos;ng</option>
                  <option value="ikki tomonlama">ikki tomonlama</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Darajasi (Dubin)</label>
                <select style={inputStyle} value={form.daraja} onChange={set('daraja')}>
                  <option value="I">I</option>
                  <option value="II">II</option>
                  <option value="III">III</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Vena diametri (mm)</label>
                <input type="number" step="0.1" style={inputStyle} value={form.vena_diametri} onChange={set('vena_diametri')} />
              </div>
              <div>
                <label style={labelStyle}>Reflux</label>
                <select style={inputStyle} value={form.reflux} onChange={set('reflux')}>
                  <option value="bor">bor</option>
                  <option value="yo'q">yo&apos;q</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Og&apos;riq / simptom</label>
                <select style={inputStyle} value={form.ogriq} onChange={set('ogriq')}>
                  <option value="yo'q">yo&apos;q</option>
                  <option value="bor">bor</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Oldin operatsiya bo&apos;lganmi?</label>
                <select style={inputStyle} value={form.oldin_operatsiya} onChange={set('oldin_operatsiya')}>
                  <option value="yo'q">yo&apos;q</option>
                  <option value="ha">ha</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Sperma konsentratsiyasi (mln/ml)</label>
                <input type="number" style={inputStyle} value={form.sperm_konts} onChange={set('sperm_konts')} />
              </div>
              <div>
                <label style={labelStyle}>Harakatchanlik (%)</label>
                <input type="number" style={inputStyle} value={form.sperm_harakat} onChange={set('sperm_harakat')} />
              </div>
              <div>
                <label style={labelStyle}>Normal morfologiya (%)</label>
                <input type="number" style={inputStyle} value={form.sperm_morf} onChange={set('sperm_morf')} />
              </div>
              <div>
                <label style={labelStyle}>Testosteron (nmol/l)</label>
                <input type="number" style={inputStyle} value={form.testosteron} onChange={set('testosteron')} />
              </div>
              <div>
                <label style={labelStyle}>FSH (mIU/ml)</label>
                <input type="number" style={inputStyle} value={form.fsh} onChange={set('fsh')} />
              </div>
              <div>
                <label style={labelStyle}>LH (mIU/ml)</label>
                <input type="number" style={inputStyle} value={form.lh} onChange={set('lh')} />
              </div>
            </div>
            <div style={{ marginTop: '16px' }}>
              <label style={labelStyle}>Izoh / kasallik tarixi</label>
              <textarea style={{ ...inputStyle, minHeight: '60px' }} value={form.izoh} onChange={set('izoh')} />
            </div>

            {natija && (
              <div style={{
                marginTop: '16px', backgroundColor: '#0f1f14', border: '1px solid #166534',
                borderRadius: '10px', padding: '14px',
              }}>
                <p style={{ margin: 0, color: '#4ade80', fontWeight: 600 }}>Tavsiya: {natija.tavsiya}</p>
                <p style={{ margin: '4px 0 0', color: '#9ca3af', fontSize: '13px' }}>{natija.sabab}</p>
              </div>
            )}

            <button onClick={handleSave} disabled={saving} style={{
              marginTop: '16px', backgroundColor: '#2563eb', color: 'white', border: 'none',
              borderRadius: '10px', padding: '12px 24px', cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '14px', fontWeight: 600, opacity: saving ? 0.7 : 1,
            }}>
              {saving ? 'Saqlanmoqda...' : 'Tavsiya olish va saqlash'}
            </button>
          </div>
        )}

        <h3 style={{ fontSize: '16px', color: '#9ca3af', marginBottom: '12px' }}>Mening tashriflarim</h3>
        {tashriflar.length === 0 ? (
          <p style={{ color: '#9ca3af' }}>Hozircha tashrif yo&apos;q.</p>
        ) : (
          <div style={{ backgroundColor: '#111118', border: '1px solid #1e1e2e', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#1a1a24', textAlign: 'left' }}>
                  {['Sana', 'Tomon', 'Daraja', 'Tavsiya', 'Izoh'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', color: '#9ca3af', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tashriflar.map((t) => (
                  <tr key={t.id} style={{ borderTop: '1px solid #1e1e2e' }}>
                    <td style={{ padding: '12px 16px', color: '#6b7280' }}>{new Date(t.sana).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 16px' }}>{t.tomon}</td>
                    <td style={{ padding: '12px 16px' }}>{t.daraja}</td>
                    <td style={{ padding: '12px 16px', color: '#60a5fa' }}>{t.tavsiya}</td>
                    <td style={{ padding: '12px 16px', color: '#9ca3af' }}>{t.izoh || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
