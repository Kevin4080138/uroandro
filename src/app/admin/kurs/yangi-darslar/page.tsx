'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'

// «Yangi darslar» to'ldirish — eski darslar admini uslubida: mavzu qidiruv →
// tanlash → barcha bo'lim maydonlari bir sahifada → saqlash. Kurs tizimiga
// (kurs_darslar + kurs_savollar[tezkor/amaliy] + kurs_flashcardlar) yozadi.
// EASY qolipi: Nazariya · Video · O'quv natijalari · Tezkor (3) · Amaliy · Flashcard.

type DarsMini = { id: string; slug: string; sarlavha: string; kategoriya: string | null; bosqich: string; modul_nom: string | null }

const YONALISH = 'urologiya'
const BOSQICH_NOM: Record<string, string> = { oson: 'Foundation', orta: 'Clinical', qiyin: 'Advanced' }

const inp: React.CSSProperties = {
  width: '100%', background: 'var(--surface-2)', color: 'var(--ink)', border: '1px solid var(--line)',
  borderRadius: '10px', padding: '11px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
}
const lab: React.CSSProperties = { fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '6px' }
const mono: React.CSSProperties = { ...inp, fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '12px', resize: 'vertical' }

type Savol = { savol: string; variantlar: string[]; togri: number; izoh: string | null }
type Flash = { old: string; yangi: string; kategoriya: string | null }

// JSON savol massivini o'qish + validatsiya
function savollarniOqi(matn: string): { qiymat: Savol[]; xato: string | null } {
  const t = matn.trim()
  if (!t) return { qiymat: [], xato: null }
  let p: unknown
  try { p = JSON.parse(t) } catch (e) { return { qiymat: [], xato: e instanceof Error ? e.message : 'JSON xato' } }
  if (!Array.isArray(p)) return { qiymat: [], xato: 'Massiv [ ] bo‘lishi kerak' }
  const out: Savol[] = []
  for (let i = 0; i < p.length; i++) {
    const o = (p[i] ?? {}) as Record<string, unknown>
    if (typeof o.savol !== 'string' || !o.savol.trim()) return { qiymat: [], xato: `#${i + 1}: "savol" matn kerak` }
    if (!Array.isArray(o.variantlar) || o.variantlar.length < 2) return { qiymat: [], xato: `#${i + 1}: "variantlar" ≥2 kerak` }
    const togri = Number(o.togri)
    if (!Number.isInteger(togri) || togri < 0 || togri >= o.variantlar.length) return { qiymat: [], xato: `#${i + 1}: "togri" diapazonda emas` }
    out.push({ savol: o.savol.trim(), variantlar: o.variantlar.map((v) => String(v)), togri, izoh: typeof o.izoh === 'string' ? o.izoh.trim() || null : null })
  }
  return { qiymat: out, xato: null }
}

function flashniOqi(matn: string): { qiymat: Flash[]; xato: string | null } {
  const t = matn.trim()
  if (!t) return { qiymat: [], xato: null }
  let p: unknown
  try { p = JSON.parse(t) } catch (e) { return { qiymat: [], xato: e instanceof Error ? e.message : 'JSON xato' } }
  if (!Array.isArray(p)) return { qiymat: [], xato: 'Massiv [ ] bo‘lishi kerak' }
  const out: Flash[] = []
  for (let i = 0; i < p.length; i++) {
    const o = (p[i] ?? {}) as Record<string, unknown>
    if (typeof o.old !== 'string' || !o.old.trim()) return { qiymat: [], xato: `#${i + 1}: "old" (savol) kerak` }
    if (typeof o.yangi !== 'string' || !o.yangi.trim()) return { qiymat: [], xato: `#${i + 1}: "yangi" (javob) kerak` }
    out.push({ old: o.old.trim(), yangi: o.yangi.trim(), kategoriya: typeof o.kategoriya === 'string' ? o.kategoriya.trim() || null : null })
  }
  return { qiymat: out, xato: null }
}

function JsonMaydon({ nom, izoh, qiymat, ozgartir, soni, xato }: {
  nom: string; izoh: string; qiymat: string; ozgartir: (v: string) => void; soni: number; xato: string | null
}) {
  return (
    <div>
      <label style={lab}>{nom}
        <span style={{ color: xato ? 'var(--danger)' : 'var(--muted)', marginLeft: '8px', fontSize: '11px', fontWeight: 600 }}>
          {xato ? 'JSON xato' : qiymat.trim() ? `${soni} ta` : "bo'sh"}
        </span>
      </label>
      <p style={{ margin: '0 0 6px', fontSize: '11px', color: 'var(--muted)' }}>{izoh}</p>
      <textarea rows={7} value={qiymat} onChange={(e) => ozgartir(e.target.value)} placeholder="[]"
        style={{ ...mono, borderColor: xato ? 'var(--danger)' : 'var(--line)' }} />
      {xato && <p style={{ margin: '6px 0 0', fontSize: '12px', color: 'var(--danger)' }}>⚠️ {xato}</p>}
    </div>
  )
}

export default function AdminYangiDarslar() {
  const router = useRouter()
  const supabase = createClient()
  const [darslar, setDarslar] = useState<DarsMini[]>([])
  const [qidiruv, setQidiruv] = useState('')
  const [tanlangan, setTanlangan] = useState<DarsMini | null>(null)
  const [yuklanmoqda, setYuklanmoqda] = useState(false)
  const [saqlanmoqda, setSaqlanmoqda] = useState(false)
  const [xabar, setXabar] = useState('')

  // Dars maydonlari
  const [nazariya, setNazariya] = useState('')
  const [video, setVideo] = useState('')
  const [natijalar, setNatijalar] = useState('') // har qatorda bitta
  const [xulosa, setXulosa] = useState('')
  const [tezkorMatn, setTezkorMatn] = useState('')
  const [amaliyMatn, setAmaliyMatn] = useState('')
  const [flashMatn, setFlashMatn] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data: p } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
      if (p?.role !== 'admin') { router.push('/student/dashboard'); return }
      const { data } = await supabase.from('kurs_darslar')
        .select('id, slug, sarlavha, kategoriya, bosqich, modul_nom')
        .eq('yonalish', YONALISH).order('bosqich').order('modul_no').order('sort_order')
      setDarslar((data ?? []) as DarsMini[])
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const royxat = useMemo(() => {
    const q = qidiruv.trim().toLowerCase()
    return q ? darslar.filter((d) => d.sarlavha.toLowerCase().includes(q) || d.slug.includes(q)) : darslar
  }, [qidiruv, darslar])

  const tanla = async (d: DarsMini) => {
    setTanlangan(d); setXabar(''); setYuklanmoqda(true)
    const chiroyli = (rows: Savol[]) => rows.length ? JSON.stringify(rows.map((r) => ({ savol: r.savol, variantlar: r.variantlar, togri: r.togri, izoh: r.izoh ?? '' })), null, 2) : ''
    const [darsRes, savolRes, flashRes] = await Promise.all([
      supabase.from('kurs_darslar').select('nazariya_html, video_url, dars_natijalari, xulosa').eq('id', d.id).maybeSingle(),
      supabase.from('kurs_savollar').select('tur, savol, variantlar, togri, izoh, sort_order').eq('dars_id', d.id).in('tur', ['tezkor', 'amaliy']).order('sort_order'),
      supabase.from('kurs_flashcardlar').select('old, yangi, kategoriya, sort_order').eq('dars_id', d.id).order('sort_order'),
    ])
    const dr = darsRes.data as { nazariya_html: string | null; video_url: string | null; dars_natijalari: unknown; xulosa: string | null } | null
    setNazariya(dr?.nazariya_html ?? '')
    setVideo(dr?.video_url ?? '')
    setNatijalar(Array.isArray(dr?.dars_natijalari) ? (dr!.dars_natijalari as string[]).join('\n') : '')
    setXulosa(dr?.xulosa ?? '')
    const savollar = (savolRes.data ?? []) as { tur: string; savol: string; variantlar: string[]; togri: number; izoh: string | null }[]
    const tez = savollar.filter((s) => s.tur === 'tezkor').map((s) => ({ savol: s.savol, variantlar: s.variantlar, togri: s.togri, izoh: s.izoh }))
    const ama = savollar.filter((s) => s.tur === 'amaliy').map((s) => ({ savol: s.savol, variantlar: s.variantlar, togri: s.togri, izoh: s.izoh }))
    setTezkorMatn(chiroyli(tez))
    setAmaliyMatn(chiroyli(ama))
    const flash = (flashRes.data ?? []) as { old: string; yangi: string; kategoriya: string | null }[]
    setFlashMatn(flash.length ? JSON.stringify(flash.map((f) => ({ old: f.old, yangi: f.yangi, kategoriya: f.kategoriya ?? '' })), null, 2) : '')
    setYuklanmoqda(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const tez = savollarniOqi(tezkorMatn)
  const ama = savollarniOqi(amaliyMatn)
  const fl = flashniOqi(flashMatn)

  const saqla = async () => {
    if (!tanlangan) return
    setXabar('')
    if (tez.xato) { setXabar('Tezkor: ' + tez.xato); return }
    if (ama.xato) { setXabar('Amaliy: ' + ama.xato); return }
    if (fl.xato) { setXabar('Flashcard: ' + fl.xato); return }
    if (tezkorMatn.trim() && tez.qiymat.length !== 3) { setXabar('Tezkor test aynan 3 savol bo‘lishi kerak (yoki bo‘sh)'); return }

    setSaqlanmoqda(true)
    const darsId = tanlangan.id
    try {
      // 1) Dars maydonlari
      const { error: dErr } = await supabase.from('kurs_darslar').update({
        nazariya_html: nazariya.trim() || null,
        video_url: video.trim() || null,
        dars_natijalari: natijalar.split('\n').map((s) => s.trim()).filter(Boolean),
        xulosa: xulosa.trim() || null,
        updated_at: new Date().toISOString(),
      }).eq('id', darsId)
      if (dErr) throw dErr

      // 2) Tezkor + Amaliy — almashtirish (eskisini o'chirib qayta yozamiz)
      const { error: delErr } = await supabase.from('kurs_savollar').delete().eq('dars_id', darsId).in('tur', ['tezkor', 'amaliy'])
      if (delErr) throw delErr
      const savolRows = [
        ...tez.qiymat.map((s, i) => ({ tur: 'tezkor', dars_id: darsId, savol: s.savol, variantlar: s.variantlar, togri: s.togri, izoh: s.izoh, sort_order: i })),
        ...ama.qiymat.map((s, i) => ({ tur: 'amaliy', dars_id: darsId, savol: s.savol, variantlar: s.variantlar, togri: s.togri, izoh: s.izoh, sort_order: i })),
      ]
      if (savolRows.length) {
        const { error } = await supabase.from('kurs_savollar').insert(savolRows)
        if (error) throw error
      }

      // 3) Flashcard — almashtirish
      const { error: fDelErr } = await supabase.from('kurs_flashcardlar').delete().eq('dars_id', darsId)
      if (fDelErr) throw fDelErr
      if (fl.qiymat.length) {
        const { error } = await supabase.from('kurs_flashcardlar').insert(
          fl.qiymat.map((f, i) => ({ dars_id: darsId, old: f.old, yangi: f.yangi, kategoriya: f.kategoriya, sort_order: i }))
        )
        if (error) throw error
      }

      setXabar('✅ Saqlandi')
    } catch (e) {
      setXabar('Xato: ' + (e instanceof Error ? e.message : "noma'lum"))
    }
    setSaqlanmoqda(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '40px' }}>
      <Header backHref="/admin/dashboard" backLabel="Admin panel" />
      <div className="mx-auto max-w-[760px] px-5 py-6" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: 800 }}>📝 Yangi darslar — to‘ldirish</h2>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>Mavzuni tanlang, so‘ng bo‘limlarni to‘ldiring. Bank bo‘sh bo‘lsa o‘sha bo‘lim talabaga ko‘rinmaydi.</p>
        </div>

        {/* Qidiruv */}
        <div>
          <label style={lab}>Mavzu qidirish</label>
          <input value={qidiruv} onChange={(e) => setQidiruv(e.target.value)} placeholder="masalan: urologiya, buyrak…" style={inp} />
        </div>
        <div style={{ maxHeight: '230px', overflowY: 'auto', border: '1px solid var(--line)', borderRadius: '12px', background: 'var(--surface)' }}>
          {royxat.length === 0 ? (
            <p style={{ padding: '14px', margin: 0, fontSize: '13px', color: 'var(--muted)' }}>Mavzu topilmadi.</p>
          ) : royxat.map((d) => (
            <button key={d.id} onClick={() => tanla(d)} style={{
              display: 'block', width: '100%', textAlign: 'left', padding: '11px 14px', cursor: 'pointer',
              border: 'none', borderBottom: '1px solid var(--line)', fontSize: '13.5px',
              background: tanlangan?.id === d.id ? 'var(--accent-soft)' : 'transparent', color: 'var(--ink)',
            }}>
              <strong>{d.sarlavha}</strong>
              <span style={{ color: 'var(--muted)', fontSize: '11.5px', marginLeft: '8px' }}>
                {BOSQICH_NOM[d.bosqich] ?? d.bosqich}{d.modul_nom ? ` · ${d.modul_nom}` : ''}
              </span>
            </button>
          ))}
        </div>

        {tanlangan && (yuklanmoqda ? (
          <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Yuklanmoqda…</p>
        ) : (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--accent)' }}>{tanlangan.sarlavha}</h3>

            <div>
              <label style={lab}>Nazariya (HTML)
                <span style={{ color: 'var(--muted)', marginLeft: '8px', fontSize: '11px', fontWeight: 600 }}>
                  {nazariya ? `${(new Blob([nazariya]).size / 1024).toFixed(1)} KB` : "bo'sh"}
                </span>
              </label>
              <textarea rows={10} value={nazariya} onChange={(e) => setNazariya(e.target.value)} placeholder={'<h2>Bu nima?</h2>\n<p>…</p>'} style={mono} />
            </div>

            <div>
              <label style={lab}>Asosiy video (YouTube havolasi)</label>
              <input value={video} onChange={(e) => setVideo(e.target.value)} placeholder="https://youtube.com/watch?v=…" style={inp} />
            </div>

            <div>
              <label style={lab}>O‘quv natijalari (har qatorda bitta)</label>
              <textarea rows={3} value={natijalar} onChange={(e) => setNatijalar(e.target.value)} placeholder={'Urologiya nima ekanini tushunadi\nUrolog va nefrolog farqini biladi'} style={{ ...inp, resize: 'vertical' }} />
            </div>

            <JsonMaydon nom="Tezkor tekshiruv (aynan 3 savol)" izoh='[{"savol":"…","variantlar":["A","B","C"],"togri":0,"izoh":"…"}]' qiymat={tezkorMatn} ozgartir={setTezkorMatn} soni={tez.qiymat.length} xato={tez.xato} />
            <JsonMaydon nom="Amaliy test (Qo‘llash)" izoh="Formativ — baholanmaydi, izohli. Savol formati tezkor bilan bir xil." qiymat={amaliyMatn} ozgartir={setAmaliyMatn} soni={ama.qiymat.length} xato={ama.xato} />
            <JsonMaydon nom="Flashcard (Eslab qolish)" izoh='[{"old":"savol/atama","yangi":"javob","kategoriya":"ixtiyoriy"}]' qiymat={flashMatn} ozgartir={setFlashMatn} soni={fl.qiymat.length} xato={fl.xato} />

            <div>
              <label style={lab}>Xulosa (ixtiyoriy)</label>
              <textarea rows={2} value={xulosa} onChange={(e) => setXulosa(e.target.value)} style={{ ...inp, resize: 'vertical' }} />
            </div>

            <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--muted)', lineHeight: 1.5 }}>
              USMLE, klinik case va sertifikat nazorati — O‘rta/Qiyin bosqichlar uchun; ular modul darajasida{' '}
              <code style={{ fontSize: '11px' }}>/admin/kurs/praktikum</code> da boshqariladi.
            </p>

            {xabar && <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: xabar.startsWith('✅') ? 'var(--good)' : 'var(--danger)' }}>{xabar}</p>}

            <button onClick={saqla} disabled={saqlanmoqda} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '11px', padding: '13px', fontSize: '14.5px', fontWeight: 800, cursor: saqlanmoqda ? 'not-allowed' : 'pointer', opacity: saqlanmoqda ? 0.6 : 1 }}>
              {saqlanmoqda ? 'Saqlanmoqda…' : 'Saqlash'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
