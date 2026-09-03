'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { KebabMenu } from '@/components/KebabMenu'
import { Pencil, Trash2 } from 'lucide-react'

// Kurs praktikum muharriri (Faza 4.3c) — modul bo'yicha:
//  • Flashcard (kurs_flashcardlar)
//  • Test/USMLE savol banki (kurs_savollar, tur='test'|'usmle', modul_id)
//  • Case (kurs_caselar)
// Admin RLS orqali. Eski sahifalar SAQLANADI (additiv).

type ModulMini = { id: string; bosqich: string; modul_no: number; nom: string }
type Flashcard = { id: string; old: string; yangi: string; kategoriya: string | null; sort_order: number }
type Savol = { id: string; tur: string; savol: string; variantlar: unknown; togri: number; izoh: string | null; sort_order: number }
type Kase = { id: string; sarlavha: string; bosqichlar: unknown; sort_order: number }

const YONALISHLAR = [
  { id: 'urologiya', nom: 'Urologiya' },
  { id: 'ginekologiya', nom: 'Ginekologiya' },
]
const TABLAR = [
  { id: 'flashcard', nom: '🃏 Flashcard' },
  { id: 'savol', nom: '📝 Test savollari' },
  { id: 'case', nom: '🧪 Case' },
]

const inp: React.CSSProperties = {
  width: '100%', background: 'var(--surface-2)', color: 'var(--ink)',
  border: '1px solid var(--line)', borderRadius: '10px',
  padding: '11px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
}
const lab: React.CSSProperties = { fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '6px' }
const btnAsosiy: React.CSSProperties = { padding: '12px', borderRadius: '11px', fontSize: '14px', fontWeight: 800, cursor: 'pointer', border: 'none', background: 'var(--accent)', color: '#fff' }
const kartaStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '12px 14px' }
const formStyle: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }

function xabarRang(m: string): string { return m.startsWith('✅') ? '#16a34a' : '#dc2626' }

export default function AdminKursPraktikumPage() {
  const router = useRouter()
  const supabase = createClient()
  const [yonalish, setYonalish] = useState('urologiya')
  const [modullar, setModullar] = useState<ModulMini[]>([])
  const [modulId, setModulId] = useState('')
  const [tab, setTab] = useState('flashcard')
  const [yuklanmoqda, setYuklanmoqda] = useState(false)

  // Flashcard
  const [flashcardlar, setFlashcardlar] = useState<Flashcard[]>([])
  const [fOld, setFOld] = useState('')
  const [fYangi, setFYangi] = useState('')
  const [fKat, setFKat] = useState('')
  const [fEditId, setFEditId] = useState<string | null>(null)
  const [fXabar, setFXabar] = useState('')

  // Savol
  const [savollar, setSavollar] = useState<Savol[]>([])
  const [sTur, setSTur] = useState('test')
  const [sSavol, setSSavol] = useState('')
  const [sVariantlar, setSVariantlar] = useState('')
  const [sTogri, setSTogri] = useState(0)
  const [sIzoh, setSIzoh] = useState('')
  const [sEditId, setSEditId] = useState<string | null>(null)
  const [sXabar, setSXabar] = useState('')

  // Case
  const [caselar, setCaselar] = useState<Kase[]>([])
  const [cSarlavha, setCSarlavha] = useState('')
  const [cBosqichlar, setCBosqichlar] = useState('')
  const [cEditId, setCEditId] = useState<string | null>(null)
  const [cXabar, setCXabar] = useState('')

  const modullarYukla = async (yon: string) => {
    const { data } = await supabase.from('kurs_modullar').select('id, bosqich, modul_no, nom')
      .eq('yonalish', yon).order('bosqich').order('modul_no')
    setModullar((data ?? []) as ModulMini[])
  }

  const modulKontentYukla = async (mid: string) => {
    if (!mid) { setFlashcardlar([]); setSavollar([]); setCaselar([]); return }
    setYuklanmoqda(true)
    const [{ data: fData }, { data: sData }, { data: cData }] = await Promise.all([
      supabase.from('kurs_flashcardlar').select('id, old, yangi, kategoriya, sort_order').eq('modul_id', mid).order('sort_order'),
      supabase.from('kurs_savollar').select('id, tur, savol, variantlar, togri, izoh, sort_order').eq('modul_id', mid).in('tur', ['test', 'usmle']).order('sort_order'),
      supabase.from('kurs_caselar').select('id, sarlavha, bosqichlar, sort_order').eq('modul_id', mid).order('sort_order'),
    ])
    setFlashcardlar((fData ?? []) as Flashcard[])
    setSavollar((sData ?? []) as Savol[])
    setCaselar((cData ?? []) as Kase[])
    setYuklanmoqda(false)
  }

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data: p } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
      if (p?.role !== 'admin') { router.push('/student/dashboard'); return }
      modullarYukla(yonalish)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yonalish])

  const modulTanla = (mid: string) => {
    setModulId(mid)
    fReset(); sReset(); cReset()
    modulKontentYukla(mid)
  }

  // ── Flashcard CRUD ──
  const fReset = () => { setFEditId(null); setFOld(''); setFYangi(''); setFKat(''); setFXabar('') }
  const fTahrir = (f: Flashcard) => { setFEditId(f.id); setFOld(f.old); setFYangi(f.yangi); setFKat(f.kategoriya ?? ''); setFXabar('') }
  const fSaqla = async () => {
    setFXabar('')
    if (!fOld.trim() || !fYangi.trim()) { setFXabar('Old va yangi tomonni kiriting'); return }
    const payload = { modul_id: modulId, old: fOld.trim(), yangi: fYangi.trim(), kategoriya: fKat.trim() || null, sort_order: fEditId ? undefined : flashcardlar.length }
    const res = fEditId
      ? await supabase.from('kurs_flashcardlar').update(payload).eq('id', fEditId)
      : await supabase.from('kurs_flashcardlar').insert(payload)
    if (res.error) { setFXabar('Xato: ' + res.error.message); return }
    setFXabar(fEditId ? '✅ Yangilandi' : '✅ Qo‘shildi'); fReset(); modulKontentYukla(modulId)
  }
  const fOchir = async (f: Flashcard) => {
    if (!confirm('Flashcardni o‘chirasizmi?')) return
    await supabase.from('kurs_flashcardlar').delete().eq('id', f.id)
    setFlashcardlar((p) => p.filter((x) => x.id !== f.id)); if (fEditId === f.id) fReset()
  }

  // ── Savol CRUD ──
  const sReset = () => { setSEditId(null); setSSavol(''); setSVariantlar(''); setSTogri(0); setSIzoh(''); setSXabar('') }
  const sTahrir = (q: Savol) => {
    setSEditId(q.id); setSTur(q.tur); setSSavol(q.savol)
    setSVariantlar(Array.isArray(q.variantlar) ? (q.variantlar as string[]).join('\n') : '')
    setSTogri(q.togri); setSIzoh(q.izoh ?? ''); setSXabar('')
  }
  const sVariantSoni = () => sVariantlar.split('\n').map((x) => x.trim()).filter(Boolean).length
  const sSaqla = async () => {
    setSXabar('')
    if (sTur !== 'test' && sTur !== 'usmle') { setSXabar('Tur noto‘g‘ri'); return }
    if (!sSavol.trim()) { setSXabar('Savol matnini kiriting'); return }
    const variantlar = sVariantlar.split('\n').map((x) => x.trim()).filter(Boolean)
    if (variantlar.length < 2) { setSXabar('Kamida 2 variant kerak (har qatorda bittadan)'); return }
    if (sTogri < 0 || sTogri >= variantlar.length) { setSXabar('To‘g‘ri javob diapazondan tashqarida'); return }
    const payload = { tur: sTur, modul_id: modulId, savol: sSavol.trim(), variantlar, togri: sTogri, izoh: sIzoh.trim() || null, sort_order: sEditId ? undefined : savollar.length }
    const res = sEditId
      ? await supabase.from('kurs_savollar').update(payload).eq('id', sEditId)
      : await supabase.from('kurs_savollar').insert(payload)
    if (res.error) { setSXabar('Xato: ' + res.error.message); return }
    setSXabar(sEditId ? '✅ Yangilandi' : '✅ Qo‘shildi'); sReset(); modulKontentYukla(modulId)
  }
  const sOchir = async (q: Savol) => {
    if (!confirm('Savolni o‘chirasizmi?')) return
    await supabase.from('kurs_savollar').delete().eq('id', q.id)
    setSavollar((p) => p.filter((x) => x.id !== q.id)); if (sEditId === q.id) sReset()
  }

  // ── Case CRUD ──
  const cReset = () => { setCEditId(null); setCSarlavha(''); setCBosqichlar(''); setCXabar('') }
  const cTahrir = (k: Kase) => {
    setCEditId(k.id); setCSarlavha(k.sarlavha)
    setCBosqichlar(Array.isArray(k.bosqichlar) ? JSON.stringify(k.bosqichlar, null, 2) : ''); setCXabar('')
  }
  const cSaqla = async () => {
    setCXabar('')
    if (!cSarlavha.trim()) { setCXabar('Sarlavha kiriting'); return }
    let bosqichlar: unknown[] = []
    if (cBosqichlar.trim()) {
      try {
        const parsed = JSON.parse(cBosqichlar)
        if (!Array.isArray(parsed)) throw new Error('massiv emas')
        for (const [i, b] of parsed.entries()) {
          if (!Array.isArray(b?.variantlar) || typeof b?.togri !== 'number') {
            setCXabar(`Bosqich #${i + 1}: variantlar[] va togri (raqam) kerak`); return
          }
        }
        bosqichlar = parsed
      } catch (e) { setCXabar('Bosqichlar JSON xato: ' + (e instanceof Error ? e.message : '')); return }
    }
    const payload = { modul_id: modulId, sarlavha: cSarlavha.trim(), bosqichlar, sort_order: cEditId ? undefined : caselar.length }
    const res = cEditId
      ? await supabase.from('kurs_caselar').update(payload).eq('id', cEditId)
      : await supabase.from('kurs_caselar').insert(payload)
    if (res.error) { setCXabar('Xato: ' + res.error.message); return }
    setCXabar(cEditId ? '✅ Yangilandi' : '✅ Qo‘shildi'); cReset(); modulKontentYukla(modulId)
  }
  const cOchir = async (k: Kase) => {
    if (!confirm('Case-ni o‘chirasizmi?')) return
    await supabase.from('kurs_caselar').delete().eq('id', k.id)
    setCaselar((p) => p.filter((x) => x.id !== k.id)); if (cEditId === k.id) cReset()
  }

  const korinadiganSavollar = savollar.filter((q) => q.tur === sTur)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '40px' }}>
      <Header backHref="/admin/dashboard" backLabel="Admin panel" />
      <div className="mx-auto max-w-[720px] px-5 py-6" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>🧪 Kurs praktikumi</h2>
          <select value={yonalish} onChange={(e) => { setYonalish(e.target.value); setModulId('') }} style={{ ...inp, width: 'auto', padding: '8px 12px' }}>
            {YONALISHLAR.map((y) => <option key={y.id} value={y.id}>{y.nom}</option>)}
          </select>
        </div>

        <div>
          <label style={lab}>Modul</label>
          <select value={modulId} onChange={(e) => modulTanla(e.target.value)} style={inp}>
            <option value="">— Modul tanlang —</option>
            {modullar.map((m) => <option key={m.id} value={m.id}>№{m.modul_no} · {m.nom} ({m.bosqich})</option>)}
          </select>
        </div>

        {!modulId ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--muted)', fontSize: '14px' }}>Praktikum kontentini boshqarish uchun modul tanlang.</div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {TABLAR.map((t) => (
                <button key={t.id} type="button" onClick={() => setTab(t.id)} style={{
                  flex: 1, minWidth: '110px', padding: '9px', borderRadius: '9px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer',
                  border: `1.5px solid ${tab === t.id ? 'var(--accent)' : 'var(--line)'}`,
                  background: tab === t.id ? 'var(--accent)' : 'var(--surface-2)', color: tab === t.id ? '#fff' : 'var(--muted)',
                }}>{t.nom}</button>
              ))}
            </div>

            {yuklanmoqda && <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Yuklanmoqda…</p>}

            {/* FLASHCARD */}
            {tab === 'flashcard' && (
              <>
                <div style={formStyle}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>{fEditId ? '✏️ Flashcard' : '➕ Yangi flashcard'}</h3>
                  <div><label style={lab}>Old tomon (savol/atama)</label><input value={fOld} onChange={(e) => setFOld(e.target.value)} style={inp} /></div>
                  <div><label style={lab}>Yangi tomon (javob/izoh)</label><textarea value={fYangi} onChange={(e) => setFYangi(e.target.value)} rows={2} style={{ ...inp, resize: 'vertical' }} /></div>
                  <div><label style={lab}>Kategoriya (ixtiyoriy)</label><input value={fKat} onChange={(e) => setFKat(e.target.value)} style={inp} /></div>
                  {fXabar && <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: xabarRang(fXabar) }}>{fXabar}</p>}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={fSaqla} style={{ ...btnAsosiy, flex: 1 }}>{fEditId ? 'Yangilash' : 'Qo‘shish'}</button>
                    {fEditId && <button onClick={fReset} style={{ padding: '12px 18px', borderRadius: '11px', fontWeight: 700, cursor: 'pointer', border: '1px solid var(--line)', background: 'var(--surface-2)', color: 'var(--muted)' }}>Bekor</button>}
                  </div>
                </div>
                {flashcardlar.length === 0 ? <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Hali flashcard yo‘q.</p> : flashcardlar.map((f) => (
                  <div key={f.id} style={kartaStyle}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '13.5px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.old}</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.yangi}</div>
                    </div>
                    <KebabMenu amallar={[{ label: 'Tahrirlash', icon: <Pencil size={15} />, onClick: () => fTahrir(f) }, { label: 'O‘chirish', icon: <Trash2 size={15} />, danger: true, onClick: () => fOchir(f) }]} />
                  </div>
                ))}
              </>
            )}

            {/* SAVOL */}
            {tab === 'savol' && (
              <>
                <div style={formStyle}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>{sEditId ? '✏️ Savol' : '➕ Yangi savol'}</h3>
                  <div>
                    <label style={lab}>Tur</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {['test', 'usmle'].map((tt) => (
                        <button key={tt} type="button" onClick={() => setSTur(tt)} style={{ flex: 1, padding: '9px', borderRadius: '9px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', border: `1.5px solid ${sTur === tt ? 'var(--accent)' : 'var(--line)'}`, background: sTur === tt ? 'var(--accent)' : 'var(--surface-2)', color: sTur === tt ? '#fff' : 'var(--muted)' }}>{tt.toUpperCase()}</button>
                      ))}
                    </div>
                  </div>
                  <div><label style={lab}>Savol</label><textarea value={sSavol} onChange={(e) => setSSavol(e.target.value)} rows={2} style={{ ...inp, resize: 'vertical' }} /></div>
                  <div><label style={lab}>Variantlar (har qatorda bittadan)</label><textarea value={sVariantlar} onChange={(e) => setSVariantlar(e.target.value)} rows={4} style={{ ...inp, resize: 'vertical' }} /></div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <div style={{ width: '150px' }}>
                      <label style={lab}>To‘g‘ri javob №</label>
                      <select value={sTogri} onChange={(e) => setSTogri(Number(e.target.value))} style={inp}>
                        {Array.from({ length: Math.max(sVariantSoni(), 1) }, (_, k) => <option key={k} value={k}>{k + 1}-variant</option>)}
                      </select>
                    </div>
                    <div style={{ flex: 1, minWidth: '160px' }}><label style={lab}>Izoh (ixtiyoriy)</label><input value={sIzoh} onChange={(e) => setSIzoh(e.target.value)} style={inp} /></div>
                  </div>
                  {sXabar && <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: xabarRang(sXabar) }}>{sXabar}</p>}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={sSaqla} style={{ ...btnAsosiy, flex: 1 }}>{sEditId ? 'Yangilash' : 'Qo‘shish'}</button>
                    {sEditId && <button onClick={sReset} style={{ padding: '12px 18px', borderRadius: '11px', fontWeight: 700, cursor: 'pointer', border: '1px solid var(--line)', background: 'var(--surface-2)', color: 'var(--muted)' }}>Bekor</button>}
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>{sTur.toUpperCase()} savollari: {korinadiganSavollar.length} ta</p>
                {korinadiganSavollar.map((q) => (
                  <div key={q.id} style={kartaStyle}>
                    <div style={{ fontSize: '13.5px', fontWeight: 600, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{q.savol}</div>
                    <KebabMenu amallar={[{ label: 'Tahrirlash', icon: <Pencil size={15} />, onClick: () => sTahrir(q) }, { label: 'O‘chirish', icon: <Trash2 size={15} />, danger: true, onClick: () => sOchir(q) }]} />
                  </div>
                ))}
              </>
            )}

            {/* CASE */}
            {tab === 'case' && (
              <>
                <div style={formStyle}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>{cEditId ? '✏️ Case' : '➕ Yangi case'}</h3>
                  <div><label style={lab}>Sarlavha</label><input value={cSarlavha} onChange={(e) => setCSarlavha(e.target.value)} style={inp} /></div>
                  <div>
                    <label style={lab}>Bosqichlar (JSON massiv)</label>
                    <textarea value={cBosqichlar} onChange={(e) => setCBosqichlar(e.target.value)} rows={8} placeholder={'[\n  { "matn": "Bemor keldi…", "variantlar": ["A","B"], "togri": 0, "izoh": "…" }\n]'} style={{ ...inp, resize: 'vertical', fontFamily: 'monospace', fontSize: '12.5px' }} />
                    <p style={{ margin: '5px 0 0', fontSize: '11px', color: 'var(--muted)' }}>Har bosqich: variantlar[] va togri (raqam) majburiy; matn/izoh ixtiyoriy.</p>
                  </div>
                  {cXabar && <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: xabarRang(cXabar) }}>{cXabar}</p>}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={cSaqla} style={{ ...btnAsosiy, flex: 1 }}>{cEditId ? 'Yangilash' : 'Qo‘shish'}</button>
                    {cEditId && <button onClick={cReset} style={{ padding: '12px 18px', borderRadius: '11px', fontWeight: 700, cursor: 'pointer', border: '1px solid var(--line)', background: 'var(--surface-2)', color: 'var(--muted)' }}>Bekor</button>}
                  </div>
                </div>
                {caselar.length === 0 ? <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Hali case yo‘q.</p> : caselar.map((k) => (
                  <div key={k.id} style={kartaStyle}>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{k.sarlavha} <span style={{ color: 'var(--muted)', fontWeight: 500 }}>({Array.isArray(k.bosqichlar) ? (k.bosqichlar as unknown[]).length : 0} bosqich)</span></div>
                    <KebabMenu amallar={[{ label: 'Tahrirlash', icon: <Pencil size={15} />, onClick: () => cTahrir(k) }, { label: 'O‘chirish', icon: <Trash2 size={15} />, danger: true, onClick: () => cOchir(k) }]} />
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
