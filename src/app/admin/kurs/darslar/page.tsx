'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { KebabMenu } from '@/components/KebabMenu'
import { Pencil, Trash2 } from 'lucide-react'

// Kurs dars muharriri (Faza 4.3b). kurs_darslar CRUD + tezkor savollar
// (kurs_savollar, tur='tezkor', dars_id, aynan 3 ta). Admin RLS orqali.
// Qaror: dars darajasida `faol` (yangi dars faol=false yaratiladi); modul
// darajasida holat. Eski /admin/urologiya-darslar SAQLANADI (additiv).

type ModulMini = { id: string; bosqich: string; modul_no: number; nom: string }

type KursDars = {
  id: string
  modul_id: string | null
  bosqich: string
  modul_no: number
  modul_nom: string | null
  slug: string
  sarlavha: string
  kategoriya: string | null
  tur: string
  klinik_kirish: string | null
  nazariya_html: string | null
  video_url: string | null
  xulosa: string | null
  daqiqa: number
  bepul_namuna: boolean
  faol: boolean
  sort_order: number
}

type TezkorForma = { savol: string; variantlarText: string; togri: number; izoh: string }

const YONALISHLAR = [
  { id: 'urologiya', nom: 'Urologiya' },
  { id: 'ginekologiya', nom: 'Ginekologiya' },
]
const BOSQICH_RANG: Record<string, string> = { oson: '#16a34a', orta: '#d97706', qiyin: '#dc2626' }
const TEZKOR_SONI = 3

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

function boshlangichTezkor(): TezkorForma[] {
  return Array.from({ length: TEZKOR_SONI }, () => ({ savol: '', variantlarText: '', togri: 0, izoh: '' }))
}

export default function AdminKursDarslarPage() {
  const router = useRouter()
  const supabase = createClient()
  const [darslar, setDarslar] = useState<KursDars[]>([])
  const [modullar, setModullar] = useState<ModulMini[]>([])
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [saqlanmoqda, setSaqlanmoqda] = useState(false)
  const [xabar, setXabar] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [yonalish, setYonalish] = useState('urologiya')
  const [slugTegildi, setSlugTegildi] = useState(false)

  // Dars formasi
  const [modulId, setModulId] = useState('')
  const [slug, setSlug] = useState('')
  const [sarlavha, setSarlavha] = useState('')
  const [kategoriya, setKategoriya] = useState('')
  const [tur, setTur] = useState('asosiy')
  const [klinikKirish, setKlinikKirish] = useState('')
  const [nazariyaHtml, setNazariyaHtml] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [xulosa, setXulosa] = useState('')
  const [daqiqa, setDaqiqa] = useState(10)
  const [bepulNamuna, setBepulNamuna] = useState(false)
  const [faol, setFaol] = useState(false)

  // Tezkor savollar (faqat mavjud darsni tahrirlashda)
  const [tezkor, setTezkor] = useState<TezkorForma[]>(boshlangichTezkor())
  const [tezkorXabar, setTezkorXabar] = useState('')
  const [tezkorSaqlanmoqda, setTezkorSaqlanmoqda] = useState(false)

  const yukla = async () => {
    setYuklanmoqda(true)
    const [{ data: dData }, { data: mData }] = await Promise.all([
      supabase.from('kurs_darslar').select(
        'id, modul_id, bosqich, modul_no, modul_nom, slug, sarlavha, kategoriya, tur, klinik_kirish, nazariya_html, video_url, xulosa, daqiqa, bepul_namuna, faol, sort_order'
      ).eq('yonalish', yonalish).order('bosqich').order('modul_no').order('sort_order'),
      supabase.from('kurs_modullar').select('id, bosqich, modul_no, nom').eq('yonalish', yonalish).order('bosqich').order('modul_no'),
    ])
    setDarslar((dData ?? []) as KursDars[])
    setModullar((mData ?? []) as ModulMini[])
    setYuklanmoqda(false)
  }

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
  }, [yonalish])

  const reset = () => {
    setEditId(null); setModulId(''); setSlug(''); setSarlavha(''); setKategoriya(''); setTur('asosiy')
    setKlinikKirish(''); setNazariyaHtml(''); setVideoUrl(''); setXulosa(''); setDaqiqa(10)
    setBepulNamuna(false); setFaol(false); setXabar(''); setSlugTegildi(false)
    setTezkor(boshlangichTezkor()); setTezkorXabar('')
  }

  const loadTezkor = async (darsId: string) => {
    const { data } = await supabase.from('kurs_savollar')
      .select('savol, variantlar, togri, izoh, sort_order')
      .eq('dars_id', darsId).eq('tur', 'tezkor').order('sort_order')
    const rows = (data ?? []) as { savol: string; variantlar: unknown; togri: number; izoh: string | null }[]
    const forma = boshlangichTezkor()
    rows.slice(0, TEZKOR_SONI).forEach((r, i) => {
      const variantlar = Array.isArray(r.variantlar) ? (r.variantlar as string[]) : []
      forma[i] = { savol: r.savol, variantlarText: variantlar.join('\n'), togri: r.togri, izoh: r.izoh ?? '' }
    })
    setTezkor(forma)
  }

  const tahrirla = async (d: KursDars) => {
    setEditId(d.id); setModulId(d.modul_id ?? ''); setSlug(d.slug); setSarlavha(d.sarlavha)
    setKategoriya(d.kategoriya ?? ''); setTur(d.tur ?? 'asosiy'); setKlinikKirish(d.klinik_kirish ?? '')
    setNazariyaHtml(d.nazariya_html ?? ''); setVideoUrl(d.video_url ?? ''); setXulosa(d.xulosa ?? '')
    setDaqiqa(d.daqiqa); setBepulNamuna(d.bepul_namuna); setFaol(d.faol); setXabar(''); setTezkorXabar('')
    setSlugTegildi(true)
    await loadTezkor(d.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const saqla = async () => {
    setXabar('')
    if (!modulId) { setXabar('Modul tanlang'); return }
    if (!sarlavha.trim()) { setXabar('Sarlavha kiriting'); return }
    const finalSlug = (slug.trim() || slugla(sarlavha)).trim()
    if (!finalSlug) { setXabar('Slug kiriting'); return }
    const modul = modullar.find((m) => m.id === modulId)
    if (!modul) { setXabar('Modul topilmadi'); return }

    setSaqlanmoqda(true)
    const darsSoniModulda = darslar.filter((d) => d.modul_id === modulId).length
    const payload = {
      yonalish, modul_id: modulId,
      bosqich: modul.bosqich, modul_no: modul.modul_no, modul_nom: modul.nom, bolim: 'darslar',
      slug: finalSlug, sarlavha: sarlavha.trim(), kategoriya: kategoriya.trim() || null, tur: tur.trim() || 'asosiy',
      klinik_kirish: klinikKirish.trim() || null, nazariya_html: nazariyaHtml.trim() || null,
      video_url: videoUrl.trim() || null, xulosa: xulosa.trim() || null, daqiqa: Number(daqiqa) || 10,
      bepul_namuna: bepulNamuna, faol,
      sort_order: editId ? undefined : darsSoniModulda, updated_at: new Date().toISOString(),
    }
    const res = editId
      ? await supabase.from('kurs_darslar').update(payload).eq('id', editId)
      : await supabase.from('kurs_darslar').insert(payload)
    if (res.error) {
      setXabar(/duplicate|unique/i.test(res.error.message) ? 'Bu slug band — boshqasini tanlang' : 'Xato: ' + res.error.message)
      setSaqlanmoqda(false); return
    }
    setXabar(editId ? '✅ Yangilandi' : '✅ Dars qo‘shildi (faol=false — tayyor bo‘lgach faollashtiring)')
    reset(); yukla(); setSaqlanmoqda(false)
  }

  const ochir = async (d: KursDars) => {
    if (!confirm(`"${d.sarlavha}" darsini o‘chirasizmi? (tezkor savollari ham o‘chadi)`)) return
    const { error } = await supabase.from('kurs_darslar').delete().eq('id', d.id)
    if (error) { setXabar('O‘chirilmadi: ' + error.message); return }
    setDarslar((p) => p.filter((x) => x.id !== d.id))
    if (editId === d.id) reset()
  }

  const tezkorSaqla = async () => {
    if (!editId) return
    setTezkorXabar('')
    // Validatsiya: aynan 3 savol, har birida savol + ≥2 variant + to‘g‘ri diapazonda
    const tayyor: { savol: string; variantlar: string[]; togri: number; izoh: string | null }[] = []
    for (let i = 0; i < TEZKOR_SONI; i++) {
      const t = tezkor[i]
      const variantlar = t.variantlarText.split('\n').map((s) => s.trim()).filter(Boolean)
      if (!t.savol.trim()) { setTezkorXabar(`Savol #${i + 1}: matn kiriting`); return }
      if (variantlar.length < 2) { setTezkorXabar(`Savol #${i + 1}: kamida 2 variant kerak (har qatorda bittadan)`); return }
      if (t.togri < 0 || t.togri >= variantlar.length) { setTezkorXabar(`Savol #${i + 1}: to‘g‘ri javob diapazondan tashqarida`); return }
      tayyor.push({ savol: t.savol.trim(), variantlar, togri: t.togri, izoh: t.izoh.trim() || null })
    }

    setTezkorSaqlanmoqda(true)
    // Almashtirish strategiyasi: eski tezkorlarni o‘chirib, 3 tasini qayta yozamiz
    const { error: delErr } = await supabase.from('kurs_savollar').delete().eq('dars_id', editId).eq('tur', 'tezkor')
    if (delErr) { setTezkorXabar('Xato: ' + delErr.message); setTezkorSaqlanmoqda(false); return }
    const rows = tayyor.map((t, i) => ({
      tur: 'tezkor', dars_id: editId, savol: t.savol, variantlar: t.variantlar,
      togri: t.togri, izoh: t.izoh, sort_order: i,
    }))
    const { error: insErr } = await supabase.from('kurs_savollar').insert(rows)
    if (insErr) { setTezkorXabar('Xato: ' + insErr.message); setTezkorSaqlanmoqda(false); return }
    setTezkorXabar('✅ Tezkor savollar saqlandi')
    setTezkorSaqlanmoqda(false)
  }

  const modulTanla = (id: string) => {
    setModulId(id)
  }

  const yangilaTezkor = (i: number, patch: Partial<TezkorForma>) => {
    setTezkor((p) => p.map((t, idx) => (idx === i ? { ...t, ...patch } : t)))
  }

  const guruhlangan = useMemo(() => {
    const m = new Map<string, KursDars[]>()
    for (const d of darslar) {
      const key = `${d.bosqich}:${d.modul_no}:${d.modul_nom ?? ''}`
      const arr = m.get(key) ?? []
      arr.push(d); m.set(key, arr)
    }
    return Array.from(m.entries()).map(([key, list]) => ({ key, nom: list[0]?.modul_nom ?? key, bosqich: list[0]?.bosqich ?? 'oson', list }))
  }, [darslar])

  const variantlarSoni = (i: number) => tezkor[i].variantlarText.split('\n').map((s) => s.trim()).filter(Boolean).length

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '40px' }}>
      <Header backHref="/admin/dashboard" backLabel="Admin panel" />
      <div className="mx-auto max-w-[720px] px-5 py-6" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>📘 Kurs darslari</h2>
          <select value={yonalish} onChange={(e) => { setYonalish(e.target.value); reset() }} style={{ ...inp, width: 'auto', padding: '8px 12px' }}>
            {YONALISHLAR.map((y) => <option key={y.id} value={y.id}>{y.nom}</option>)}
          </select>
        </div>

        {/* Dars formasi */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>{editId ? '✏️ Darsni tahrirlash' : '➕ Yangi dars'}</h3>

          <div>
            <label style={lab}>Modul *</label>
            <select value={modulId} onChange={(e) => modulTanla(e.target.value)} style={inp}>
              <option value="">— Modul tanlang —</option>
              {modullar.map((m) => (
                <option key={m.id} value={m.id}>№{m.modul_no} · {m.nom} ({m.bosqich})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={lab}>Sarlavha *</label>
            <input value={sarlavha} onChange={(e) => { setSarlavha(e.target.value); if (!slugTegildi) setSlug(slugla(e.target.value)) }} placeholder="Masalan: Sistit" style={inp} />
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '180px' }}>
              <label style={lab}>Slug (ID) — o‘zgartirmang</label>
              <input value={slug} onChange={(e) => { setSlugTegildi(true); setSlug(slugla(e.target.value)) }} placeholder="sistit" style={inp} />
            </div>
            <div style={{ width: '110px' }}>
              <label style={lab}>Daqiqa</label>
              <input type="number" min={1} value={daqiqa} onChange={(e) => setDaqiqa(Number(e.target.value))} style={inp} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '160px' }}>
              <label style={lab}>Tur</label>
              <input value={tur} onChange={(e) => setTur(e.target.value)} placeholder="asosiy" style={inp} />
            </div>
            <div style={{ flex: 1, minWidth: '160px' }}>
              <label style={lab}>Kategoriya (ixtiyoriy)</label>
              <input value={kategoriya} onChange={(e) => setKategoriya(e.target.value)} placeholder="Masalan: Infeksiya" style={inp} />
            </div>
          </div>

          <div>
            <label style={lab}>Klinik kirish (ixtiyoriy)</label>
            <textarea value={klinikKirish} onChange={(e) => setKlinikKirish(e.target.value)} rows={2} placeholder="Bemor keldi…" style={{ ...inp, resize: 'vertical' }} />
          </div>

          <div>
            <label style={lab}>Nazariya (HTML)</label>
            <textarea value={nazariyaHtml} onChange={(e) => setNazariyaHtml(e.target.value)} rows={6} placeholder="<h2>…</h2>" style={{ ...inp, resize: 'vertical', fontFamily: 'monospace', fontSize: '12.5px' }} />
          </div>

          <div>
            <label style={lab}>Xulosa (ixtiyoriy)</label>
            <textarea value={xulosa} onChange={(e) => setXulosa(e.target.value)} rows={2} style={{ ...inp, resize: 'vertical' }} />
          </div>

          <div>
            <label style={lab}>Video URL (ixtiyoriy)</label>
            <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://…" style={inp} />
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <label style={{ display: 'flex', gap: '7px', alignItems: 'center', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              <input type="checkbox" checked={bepulNamuna} onChange={(e) => setBepulNamuna(e.target.checked)} /> Bepul namuna
            </label>
            <label style={{ display: 'flex', gap: '7px', alignItems: 'center', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              <input type="checkbox" checked={faol} onChange={(e) => setFaol(e.target.checked)} /> Faol (talabaga ko‘rinadi)
            </label>
          </div>

          {xabar && <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: xabar.startsWith('✅') ? '#16a34a' : '#dc2626' }}>{xabar}</p>}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={saqla} disabled={saqlanmoqda} style={{ flex: 1, padding: '12px', borderRadius: '11px', fontSize: '14px', fontWeight: 800, cursor: 'pointer', border: 'none', background: 'var(--accent)', color: '#fff', opacity: saqlanmoqda ? 0.6 : 1 }}>
              {saqlanmoqda ? 'Saqlanmoqda…' : editId ? 'Yangilash' : 'Qo‘shish'}
            </button>
            {editId && (
              <button onClick={reset} style={{ padding: '12px 18px', borderRadius: '11px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', border: '1px solid var(--line)', background: 'var(--surface-2)', color: 'var(--muted)' }}>Bekor</button>
            )}
          </div>
        </div>

        {/* Tezkor savollar — faqat mavjud darsni tahrirlashda */}
        {editId && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>⚡ Tezkor savollar (aynan {TEZKOR_SONI} ta)</h3>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>Dars oxirida: 3 savoldan ≥2 to‘g‘ri bo‘lsa dars tugatilgan hisoblanadi.</p>
            {tezkor.map((t, i) => (
              <div key={i} style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--muted)' }}>Savol #{i + 1}</div>
                <input value={t.savol} onChange={(e) => yangilaTezkor(i, { savol: e.target.value })} placeholder="Savol matni" style={inp} />
                <div>
                  <label style={lab}>Variantlar (har qatorda bittadan)</label>
                  <textarea value={t.variantlarText} onChange={(e) => yangilaTezkor(i, { variantlarText: e.target.value })} rows={3} placeholder={'Variant A\nVariant B\nVariant C'} style={{ ...inp, resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ width: '150px' }}>
                    <label style={lab}>To‘g‘ri javob №</label>
                    <select value={t.togri} onChange={(e) => yangilaTezkor(i, { togri: Number(e.target.value) })} style={inp}>
                      {Array.from({ length: Math.max(variantlarSoni(i), 1) }, (_, k) => (
                        <option key={k} value={k}>{k + 1}-variant</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex: 1, minWidth: '160px' }}>
                    <label style={lab}>Izoh (ixtiyoriy)</label>
                    <input value={t.izoh} onChange={(e) => yangilaTezkor(i, { izoh: e.target.value })} placeholder="Nega to‘g‘ri" style={inp} />
                  </div>
                </div>
              </div>
            ))}
            {tezkorXabar && <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: tezkorXabar.startsWith('✅') ? '#16a34a' : '#dc2626' }}>{tezkorXabar}</p>}
            <button onClick={tezkorSaqla} disabled={tezkorSaqlanmoqda} style={{ padding: '12px', borderRadius: '11px', fontSize: '14px', fontWeight: 800, cursor: 'pointer', border: 'none', background: 'var(--accent)', color: '#fff', opacity: tezkorSaqlanmoqda ? 0.6 : 1 }}>
              {tezkorSaqlanmoqda ? 'Saqlanmoqda…' : 'Tezkor savollarni saqlash'}
            </button>
          </div>
        )}

        {/* Ro'yxat */}
        {yuklanmoqda ? (
          <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Yuklanmoqda…</p>
        ) : darslar.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--muted)' }}>
            <p style={{ fontSize: '14px' }}>Hali dars yo‘q. Avval modul yarating, so‘ng shu yerda dars qo‘shing.</p>
          </div>
        ) : (
          guruhlangan.map((g) => (
            <div key={g.key} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h3 style={{ margin: '4px 0', fontSize: '13px', fontWeight: 800, color: BOSQICH_RANG[g.bosqich] ?? 'var(--ink)' }}>{g.nom} ({g.list.length})</h3>
              {g.list.map((d) => (
                <div key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '12px 14px' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.sarlavha}</div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '10.5px', fontWeight: 700, padding: '2px 7px', borderRadius: '6px', background: d.faol ? '#16a34a22' : 'var(--surface-2)', color: d.faol ? '#16a34a' : 'var(--muted)' }}>{d.faol ? 'Faol' : 'Nofaol'}</span>
                      {d.bepul_namuna && <span style={{ fontSize: '10.5px', fontWeight: 700, padding: '2px 7px', borderRadius: '6px', background: 'var(--surface-2)', color: 'var(--muted)' }}>Bepul namuna</span>}
                      {!d.modul_id && <span style={{ fontSize: '10.5px', fontWeight: 700, padding: '2px 7px', borderRadius: '6px', background: '#dc262622', color: '#dc2626' }}>Modulsiz</span>}
                    </div>
                  </div>
                  <KebabMenu amallar={[
                    { label: 'Tahrirlash', icon: <Pencil size={15} />, onClick: () => { tahrirla(d) } },
                    { label: 'O‘chirish', icon: <Trash2 size={15} />, danger: true, onClick: () => ochir(d) },
                  ]} />
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
