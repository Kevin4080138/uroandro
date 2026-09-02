'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'

type TestSavol = { savol: string; variantlar: string[]; togri: number; izoh?: string }
type KursDars = {
  id: string
  yonalish: string
  bosqich: string
  modul_no: number
  modul_nom: string | null
  slug: string
  sarlavha: string
  kategoriya: string | null
  bolim: string
  qisqa: string | null
  video_url: string | null
  nazariya_html: string | null
  test_savollar: TestSavol[]
  daqiqa: number
  sort_order: number
  faol: boolean
}

const YONALISH = 'urologiya'

const BOLIMLAR = [
  { id: 'darslar', nom: 'Darslar' },
  { id: 'klassifikatsiyalar', nom: 'Klassifikatsiyalar' },
  { id: 'operativ', nom: 'Operativ urologiya' },
]

const BOSQICHLAR = [
  { id: 'oson', nom: 'Level 1 — Foundation', rang: '#16a34a' },
  { id: 'orta', nom: 'Level 2 — Clinical', rang: '#d97706' },
  { id: 'qiyin', nom: 'Level 3 — Advanced', rang: '#dc2626' },
]

const inp: React.CSSProperties = {
  width: '100%', background: 'var(--surface-2)', color: 'var(--ink)',
  border: '1px solid var(--line)', borderRadius: '10px',
  padding: '11px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
}
const lab: React.CSSProperties = { fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '6px' }

function slugla(s: string) {
  return s.toLowerCase().trim()
    .replace(/['’`]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function AdminUroDarslarPage() {
  const router = useRouter()
  const supabase = createClient()
  const [darslar, setDarslar] = useState<KursDars[]>([])
  const [editId, setEditId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [xabar, setXabar] = useState('')
  const slugTegildi = useRef(false)

  // Form
  const [slug, setSlug] = useState('')
  const [sarlavha, setSarlavha] = useState('')
  const [kategoriya, setKategoriya] = useState('')
  const [bosqich, setBosqich] = useState('oson')
  const [bolim, setBolim] = useState('darslar')
  const [modulNo, setModulNo] = useState(1)
  const [modulNom, setModulNom] = useState('')
  const [qisqa, setQisqa] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [daqiqa, setDaqiqa] = useState(10)
  const [nazariyaHtml, setNazariyaHtml] = useState('')
  const [testMatn, setTestMatn] = useState('')
  const [faol, setFaol] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data: p } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
      if (p?.role !== 'admin') { router.push('/student/dashboard'); return }
      yukla()
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const yukla = async () => {
    const { data } = await supabase.from('kurs_darslar').select('*')
      .eq('yonalish', YONALISH)
      .order('bosqich').order('modul_no').order('sort_order').order('created_at')
    setDarslar((data ?? []) as KursDars[])
  }

  const reset = () => {
    setEditId(null); setSlug(''); setSarlavha(''); setKategoriya(''); setBosqich('oson'); setBolim('darslar')
    setModulNo(1); setModulNom('')
    setQisqa(''); setVideoUrl(''); setDaqiqa(10); setNazariyaHtml(''); setTestMatn(''); setFaol(true); setXabar('')
    slugTegildi.current = false
  }

  const tahrirla = (d: KursDars) => {
    setEditId(d.id); setSlug(d.slug); setSarlavha(d.sarlavha); setKategoriya(d.kategoriya ?? '')
    setBosqich(d.bosqich); setBolim(d.bolim ?? 'darslar'); setModulNo(d.modul_no ?? 1); setModulNom(d.modul_nom ?? '')
    setQisqa(d.qisqa ?? ''); setVideoUrl(d.video_url ?? ''); setDaqiqa(d.daqiqa); setNazariyaHtml(d.nazariya_html ?? '')
    setTestMatn(d.test_savollar?.length ? JSON.stringify(d.test_savollar, null, 2) : '')
    setFaol(d.faol); setXabar(''); slugTegildi.current = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Modul nomini bir moduldagi boshqa darsdan avtomatik to'ldirish (qulaylik)
  const modulNomlariXaritasi = useMemo(() => {
    const m = new Map<string, string>()
    for (const d of darslar) {
      if (d.modul_nom) m.set(`${d.bosqich}:${d.modul_no}`, d.modul_nom)
    }
    return m
  }, [darslar])

  const saqla = async () => {
    setXabar('')
    if (!sarlavha.trim()) { setXabar('Sarlavha kiriting'); return }
    const finalSlug = (slug.trim() || slugla(sarlavha)).trim()
    if (!finalSlug) { setXabar('Slug kiriting'); return }

    let testSavollar: TestSavol[] = []
    if (testMatn.trim()) {
      try {
        const parsed = JSON.parse(testMatn)
        if (!Array.isArray(parsed)) throw new Error('massiv emas')
        for (const [i, q] of parsed.entries()) {
          if (!q.savol || !Array.isArray(q.variantlar) || typeof q.togri !== 'number') {
            setXabar(`Test #${i + 1}: savol, variantlar[], togri (raqam) kerak`); return
          }
        }
        testSavollar = parsed
      } catch (e) {
        setXabar('Test JSON xato: ' + (e instanceof Error ? e.message : '')); return
      }
    }

    setLoading(true)
    // Bir moduldagi darslar soni — yangi dars uchun modul ichida oxiriga qo'yamiz
    const modulDarslarSoni = darslar.filter((d) => d.bosqich === bosqich && d.modul_no === Number(modulNo)).length
    const payload = {
      yonalish: YONALISH,
      slug: finalSlug, sarlavha: sarlavha.trim(), kategoriya: kategoriya.trim() || null,
      bosqich, bolim, modul_no: Number(modulNo) || 1, modul_nom: modulNom.trim() || null,
      qisqa: qisqa.trim() || null, video_url: videoUrl.trim() || null, daqiqa: Number(daqiqa) || 10,
      nazariya_html: nazariyaHtml.trim() || null, test_savollar: testSavollar, faol,
      sort_order: editId ? undefined : modulDarslarSoni, updated_at: new Date().toISOString(),
    }
    const res = editId
      ? await supabase.from('kurs_darslar').update(payload).eq('id', editId)
      : await supabase.from('kurs_darslar').insert(payload)
    if (res.error) {
      setXabar(/duplicate|unique/i.test(res.error.message) ? 'Bu slug band — boshqasini tanlang' : 'Xato: ' + res.error.message)
      setLoading(false); return
    }
    setXabar(editId ? '✅ Yangilandi' : '✅ Dars qo\'shildi')
    reset(); yukla(); setLoading(false)
  }

  const ochir = async (d: KursDars) => {
    if (!confirm(`"${d.sarlavha}" darsini o'chirasizmi?`)) return
    await supabase.from('kurs_darslar').delete().eq('id', d.id)
    setDarslar((p) => p.filter((x) => x.id !== d.id))
    if (editId === d.id) reset()
  }

  // Bosqich → modul → darslar
  const guruhlangan = useMemo(() => BOSQICHLAR.map((b) => {
    const bList = darslar.filter((d) => d.bosqich === b.id)
    const modullar = new Map<number, { no: number; nom: string; list: KursDars[] }>()
    for (const d of bList) {
      const g = modullar.get(d.modul_no) ?? { no: d.modul_no, nom: d.modul_nom ?? '', list: [] }
      if (!g.nom && d.modul_nom) g.nom = d.modul_nom
      g.list.push(d)
      modullar.set(d.modul_no, g)
    }
    return { ...b, jami: bList.length, modullar: Array.from(modullar.values()).sort((x, y) => x.no - y.no) }
  }), [darslar])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '40px' }}>
      <Header backHref="/admin/dashboard" backLabel="Admin panel" />
      <div className="mx-auto max-w-[720px] px-5 py-6" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>🔷 Urologiya darslari (3-Level)</h2>

        {/* Forma */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>{editId ? '✏️ Darsni tahrirlash' : '➕ Yangi dars'}</h3>

          <div>
            <label style={lab}>Sarlavha *</label>
            <input value={sarlavha} onChange={(e) => { setSarlavha(e.target.value); if (!slugTegildi.current) setSlug(slugla(e.target.value)) }} placeholder="Masalan: Urologiya nima?" style={inp} />
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '180px' }}>
              <label style={lab}>Slug (ID) — o&apos;zgartirmang</label>
              <input value={slug} onChange={(e) => { slugTegildi.current = true; setSlug(slugla(e.target.value)) }} placeholder="urologiya-nima" style={inp} />
            </div>
            <div style={{ width: '110px' }}>
              <label style={lab}>Daqiqa</label>
              <input type="number" min={1} value={daqiqa} onChange={(e) => setDaqiqa(Number(e.target.value))} style={inp} />
            </div>
          </div>

          <div>
            <label style={lab}>Bosqich (Level)</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {BOSQICHLAR.map((b) => (
                <button key={b.id} type="button" onClick={() => setBosqich(b.id)} style={{
                  flex: 1, minWidth: '150px', padding: '9px', borderRadius: '9px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer',
                  border: `1.5px solid ${bosqich === b.id ? b.rang : 'var(--line)'}`,
                  background: bosqich === b.id ? b.rang : 'var(--surface-2)', color: bosqich === b.id ? '#fff' : 'var(--muted)',
                }}>{b.nom}</button>
              ))}
            </div>
          </div>

          {/* Modul — yangi qatlam */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', background: 'var(--accent-soft)', borderRadius: '12px', padding: '12px', border: '1px solid var(--line)' }}>
            <div style={{ width: '90px' }}>
              <label style={lab}>Modul №</label>
              <input type="number" min={1} value={modulNo} onChange={(e) => {
                const n = Number(e.target.value)
                setModulNo(n)
                const bor = modulNomlariXaritasi.get(`${bosqich}:${n}`)
                if (bor && !modulNom.trim()) setModulNom(bor)
              }} style={inp} />
            </div>
            <div style={{ flex: 1, minWidth: '180px' }}>
              <label style={lab}>Modul nomi</label>
              <input value={modulNom} onChange={(e) => setModulNom(e.target.value)} placeholder="Masalan: Urologiyaga kirish" style={inp} />
              <p style={{ margin: '5px 0 0', fontSize: '11px', color: 'var(--muted)' }}>
                Bir moduldagi darslar bir xil № va nomga ega bo&apos;lsin — akkordeon shu bo&apos;yicha guruhlaydi.
              </p>
            </div>
          </div>

          <div>
            <label style={lab}>Bo&apos;lim</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {BOLIMLAR.map((b) => (
                <button key={b.id} type="button" onClick={() => setBolim(b.id)} style={{
                  flex: 1, minWidth: '120px', padding: '9px', borderRadius: '9px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer',
                  border: `1.5px solid ${bolim === b.id ? 'var(--accent)' : 'var(--line)'}`,
                  background: bolim === b.id ? 'var(--accent)' : 'var(--surface-2)', color: bolim === b.id ? '#fff' : 'var(--muted)',
                }}>{b.nom}</button>
              ))}
            </div>
          </div>

          <div>
            <label style={lab}>Kategoriya (ixtiyoriy)</label>
            <input value={kategoriya} onChange={(e) => setKategoriya(e.target.value)} placeholder="Masalan: Anatomiya" style={inp} />
          </div>

          <div>
            <label style={lab}>Qisqa tavsif (ixtiyoriy)</label>
            <input value={qisqa} onChange={(e) => setQisqa(e.target.value)} placeholder="Bir-ikki jumla — dars nima haqida" style={inp} />
          </div>

          <div>
            <label style={lab}>🎥 Video havolasi (YouTube yoki to&apos;g&apos;ridan-to&apos;g&apos;ri .mp4)</label>
            <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtu.be/... yoki https://.../video.mp4" style={inp} />
          </div>

          <div>
            <label style={lab}>Nazariya (HTML)</label>
            <textarea value={nazariyaHtml} onChange={(e) => setNazariyaHtml(e.target.value)} rows={10}
              placeholder="<h2>...</h2><p>...</p> — .maqola-html uslubi avtomatik qo'llanadi" style={{ ...inp, resize: 'vertical', fontFamily: 'monospace', fontSize: '12.5px', lineHeight: 1.5 }} />
            <p style={{ margin: '6px 0 0', fontSize: '11.5px', color: 'var(--muted)' }}>
              Uslub avtomatik qo&apos;llanadi — <code>&lt;style&gt;</code> yozmang. Faqat <code>&lt;h2&gt; &lt;p&gt; &lt;ul&gt; &lt;table&gt;</code> kabi teglar.
            </p>
          </div>

          <div>
            <label style={lab}>Test savollari (JSON, ixtiyoriy)</label>
            <textarea value={testMatn} onChange={(e) => setTestMatn(e.target.value)} rows={7}
              placeholder={'[\n  { "savol": "...", "variantlar": ["A", "B", "C", "D"], "togri": 0, "izoh": "..." }\n]'}
              style={{ ...inp, resize: 'vertical', fontFamily: 'monospace', fontSize: '12px', lineHeight: 1.5 }} />
            <p style={{ margin: '6px 0 0', fontSize: '11.5px', color: 'var(--muted)' }}>
              <code>togri</code> — to&apos;g&apos;ri variant tartibi (0 dan boshlanadi). Bo&apos;sh qoldirsangiz test bo&apos;lmaydi.
            </p>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
            <input type="checkbox" checked={faol} onChange={(e) => setFaol(e.target.checked)} /> Faol (talabaga ko&apos;rinadi)
          </label>

          {xabar && <p style={{ margin: 0, fontSize: '13px', color: xabar.startsWith('✅') ? 'var(--good)' : 'var(--danger)' }}>{xabar}</p>}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={saqla} disabled={loading} style={{ flex: 1, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '10px', padding: '13px', fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Saqlanmoqda...' : editId ? '✅ Saqlash' : '➕ Qo\'shish'}
            </button>
            {editId && <button onClick={reset} style={{ background: 'var(--surface-2)', color: 'var(--ink)', border: '1px solid var(--line)', borderRadius: '10px', padding: '13px 18px', fontSize: '14px', cursor: 'pointer' }}>Bekor</button>}
          </div>
        </div>

        {/* Ro'yxat — bosqich → modul */}
        {guruhlangan.map((g) => g.jami > 0 && (
          <div key={g.id}>
            <h3 style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 800, color: g.rang }}>{g.nom} ({g.jami})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {g.modullar.map((m) => (
                <div key={m.no}>
                  <p style={{ margin: '0 0 6px', fontSize: '12px', fontWeight: 700, color: 'var(--muted)' }}>
                    {m.no}-modul{m.nom ? ` · ${m.nom}` : ''} ({m.list.length})
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {m.list.map((d) => (
                      <div key={d.id} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '12px 14px', opacity: d.faol ? 1 : 0.6 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'flex-start' }}>
                          <div style={{ minWidth: 0 }}>
                            <p style={{ margin: '0 0 2px', fontSize: '13.5px', fontWeight: 700 }}>{d.sarlavha}</p>
                            <p style={{ margin: 0, fontSize: '11px', color: 'var(--muted)' }}>{BOLIMLAR.find((x) => x.id === d.bolim)?.nom ?? 'Darslar'} · {d.slug} {d.kategoriya ? `· ${d.kategoriya}` : ''} {d.faol ? '' : '· yashirin'}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '9px' }}>
                          <button onClick={() => tahrirla(d)} style={{ background: 'var(--surface-2)', border: '1px solid var(--accent)', color: 'var(--accent)', borderRadius: '8px', padding: '5px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>✏️ Tahrir</button>
                          <button onClick={() => ochir(d)} style={{ background: 'var(--surface-2)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: '8px', padding: '5px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>🗑 O&apos;chir</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
