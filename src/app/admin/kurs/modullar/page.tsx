'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { KebabMenu } from '@/components/KebabMenu'
import { Pencil, Trash2 } from 'lucide-react'

// Kurs modul muharriri (Faza 4.3a). kurs_modullar CRUD — admin RLS orqali.
// Eski /admin/urologiya-darslar sahifasi SAQLANADI; bu additiv yangi sahifa.

type KursModul = {
  id: string
  yonalish: string
  bosqich: string
  modul_no: number
  nom: string
  tavsif: string | null
  track: string | null
  majburiy: boolean
  bepul: boolean
  kredit: number
  holat: string
  sort_order: number
}

const YONALISHLAR = [
  { id: 'urologiya', nom: 'Urologiya' },
  { id: 'ginekologiya', nom: 'Ginekologiya' },
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

export default function AdminKursModullarPage() {
  const router = useRouter()
  const supabase = createClient()
  const [modullar, setModullar] = useState<KursModul[]>([])
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [saqlanmoqda, setSaqlanmoqda] = useState(false)
  const [xabar, setXabar] = useState('')
  const [editId, setEditId] = useState<string | null>(null)

  // Filtr + forma yonalishi
  const [yonalish, setYonalish] = useState('urologiya')

  // Forma
  const [bosqich, setBosqich] = useState('oson')
  const [modulNo, setModulNo] = useState(1)
  const [nom, setNom] = useState('')
  const [tavsif, setTavsif] = useState('')
  const [track, setTrack] = useState('')
  const [kredit, setKredit] = useState(1)
  const [majburiy, setMajburiy] = useState(true)
  const [bepul, setBepul] = useState(false)
  const [holat, setHolat] = useState('draft')
  const [sortOrder, setSortOrder] = useState(0)

  const yukla = async () => {
    setYuklanmoqda(true)
    const { data } = await supabase.from('kurs_modullar').select('*')
      .eq('yonalish', yonalish)
      .order('bosqich').order('modul_no')
    setModullar((data ?? []) as KursModul[])
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
    setEditId(null); setBosqich('oson'); setModulNo(1); setNom(''); setTavsif(''); setTrack('')
    setKredit(1); setMajburiy(true); setBepul(false); setHolat('draft'); setSortOrder(0); setXabar('')
  }

  const tahrirla = (m: KursModul) => {
    setEditId(m.id); setBosqich(m.bosqich); setModulNo(m.modul_no); setNom(m.nom)
    setTavsif(m.tavsif ?? ''); setTrack(m.track ?? ''); setKredit(m.kredit); setMajburiy(m.majburiy)
    setBepul(m.bepul); setHolat(m.holat); setSortOrder(m.sort_order); setXabar('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // L2/L3 nashri DB CHECK bilan bloklangan (paywall tayyor bo'lmaguncha)
  const nashrMumkin = bosqich === 'oson'

  const saqla = async () => {
    setXabar('')
    if (!nom.trim()) { setXabar('Modul nomini kiriting'); return }
    if (holat === 'nashr' && !nashrMumkin) {
      setXabar('L2/L3 modulini nashr qilib bo‘lmaydi — paywall tayyor bo‘lmaguncha bloklangan')
      return
    }
    setSaqlanmoqda(true)
    const payload = {
      yonalish, bosqich, modul_no: Number(modulNo) || 1, nom: nom.trim(),
      tavsif: tavsif.trim() || null, track: track.trim() || null,
      kredit: Number(kredit) || 1, majburiy, bepul, holat, sort_order: Number(sortOrder) || 0,
    }
    const res = editId
      ? await supabase.from('kurs_modullar').update(payload).eq('id', editId)
      : await supabase.from('kurs_modullar').insert(payload)
    if (res.error) {
      const m = res.error.message
      if (/kurs_modullar_natural_key|duplicate|unique/i.test(m)) {
        setXabar('Bu bosqichda bu № modul band — boshqa № tanlang')
      } else if (/kurs_modullar_nashr_bloki/i.test(m)) {
        setXabar('L2/L3 nashri DB tomonidan rad etildi (paywall tayyor emas)')
      } else {
        setXabar('Xato: ' + m)
      }
      setSaqlanmoqda(false); return
    }
    setXabar(editId ? '✅ Yangilandi' : '✅ Modul qo‘shildi')
    reset(); yukla(); setSaqlanmoqda(false)
  }

  const ochir = async (m: KursModul) => {
    if (!confirm(`"${m.nom}" modulini o‘chirasizmi?`)) return
    const { error } = await supabase.from('kurs_modullar').delete().eq('id', m.id)
    if (error) {
      // ON DELETE RESTRICT — darsi bor modul o'chmaydi
      if (/foreign key|restrict|violates/i.test(error.message)) {
        setXabar('Bu modulda darslar bor — avval darslarni boshqa modulga ko‘chiring yoki o‘chiring')
      } else {
        setXabar('O‘chirilmadi: ' + error.message)
      }
      return
    }
    setModullar((p) => p.filter((x) => x.id !== m.id))
    if (editId === m.id) reset()
  }

  const guruhlangan = useMemo(() => BOSQICHLAR.map((b) => ({
    ...b,
    list: modullar.filter((m) => m.bosqich === b.id),
  })), [modullar])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '40px' }}>
      <Header backHref="/admin/dashboard" backLabel="Admin panel" />
      <div className="mx-auto max-w-[720px] px-5 py-6" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>🧩 Kurs modullari</h2>
          <select value={yonalish} onChange={(e) => { setYonalish(e.target.value); reset() }}
            style={{ ...inp, width: 'auto', padding: '8px 12px' }}>
            {YONALISHLAR.map((y) => <option key={y.id} value={y.id}>{y.nom}</option>)}
          </select>
        </div>

        {/* Forma */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>{editId ? '✏️ Modulni tahrirlash' : '➕ Yangi modul'}</h3>

          <div>
            <label style={lab}>Modul nomi *</label>
            <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Masalan: Siydik yo‘llari infeksiyalari" style={inp} />
          </div>

          <div>
            <label style={lab}>Bosqich (Level)</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {BOSQICHLAR.map((b) => (
                <button key={b.id} type="button" onClick={() => { setBosqich(b.id); if (b.id !== 'oson' && holat === 'nashr') setHolat('draft') }} style={{
                  flex: 1, minWidth: '150px', padding: '9px', borderRadius: '9px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer',
                  border: `1.5px solid ${bosqich === b.id ? b.rang : 'var(--line)'}`,
                  background: bosqich === b.id ? b.rang : 'var(--surface-2)', color: bosqich === b.id ? '#fff' : 'var(--muted)',
                }}>{b.nom}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ width: '90px' }}>
              <label style={lab}>Modul №</label>
              <input type="number" min={1} value={modulNo} onChange={(e) => setModulNo(Number(e.target.value))} style={inp} />
            </div>
            <div style={{ width: '90px' }}>
              <label style={lab}>Kredit</label>
              <input type="number" min={1} value={kredit} onChange={(e) => setKredit(Number(e.target.value))} style={inp} />
            </div>
            <div style={{ width: '90px' }}>
              <label style={lab}>Tartib</label>
              <input type="number" min={0} value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} style={inp} />
            </div>
          </div>

          <div>
            <label style={lab}>Tavsif (ixtiyoriy)</label>
            <textarea value={tavsif} onChange={(e) => setTavsif(e.target.value)} rows={2} placeholder="Modul haqida qisqacha" style={{ ...inp, resize: 'vertical' }} />
          </div>

          <div>
            <label style={lab}>Track (ixtiyoriy)</label>
            <input value={track} onChange={(e) => setTrack(e.target.value)} placeholder="Masalan: onkologiya" style={inp} />
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <label style={{ display: 'flex', gap: '7px', alignItems: 'center', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              <input type="checkbox" checked={majburiy} onChange={(e) => setMajburiy(e.target.checked)} /> Majburiy
            </label>
            <label style={{ display: 'flex', gap: '7px', alignItems: 'center', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              <input type="checkbox" checked={bepul} onChange={(e) => setBepul(e.target.checked)} /> Bepul
            </label>
          </div>

          {/* Holat: draft/nashr. Nashr faqat Foundation uchun (DB CHECK) */}
          <div>
            <label style={lab}>Holat</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" onClick={() => setHolat('draft')} style={{
                flex: 1, padding: '9px', borderRadius: '9px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer',
                border: `1.5px solid ${holat === 'draft' ? 'var(--accent)' : 'var(--line)'}`,
                background: holat === 'draft' ? 'var(--accent)' : 'var(--surface-2)', color: holat === 'draft' ? '#fff' : 'var(--muted)',
              }}>Qoralama (draft)</button>
              <button type="button" disabled={!nashrMumkin} onClick={() => nashrMumkin && setHolat('nashr')} style={{
                flex: 1, padding: '9px', borderRadius: '9px', fontSize: '12.5px', fontWeight: 700, cursor: nashrMumkin ? 'pointer' : 'not-allowed',
                border: `1.5px solid ${holat === 'nashr' ? '#16a34a' : 'var(--line)'}`,
                background: holat === 'nashr' ? '#16a34a' : 'var(--surface-2)',
                color: holat === 'nashr' ? '#fff' : 'var(--muted)', opacity: nashrMumkin ? 1 : 0.5,
              }}>Nashr</button>
            </div>
            {!nashrMumkin && (
              <p style={{ margin: '6px 0 0', fontSize: '11px', color: 'var(--muted)' }}>
                L2/L3 modulini nashr qilib bo‘lmaydi — paywall tayyor bo‘lmaguncha bloklangan (DB himoyasi).
              </p>
            )}
          </div>

          {xabar && <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: xabar.startsWith('✅') ? '#16a34a' : '#dc2626' }}>{xabar}</p>}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={saqla} disabled={saqlanmoqda} style={{
              flex: 1, padding: '12px', borderRadius: '11px', fontSize: '14px', fontWeight: 800, cursor: 'pointer',
              border: 'none', background: 'var(--accent)', color: '#fff', opacity: saqlanmoqda ? 0.6 : 1,
            }}>{saqlanmoqda ? 'Saqlanmoqda…' : editId ? 'Yangilash' : 'Qo‘shish'}</button>
            {editId && (
              <button onClick={reset} style={{
                padding: '12px 18px', borderRadius: '11px', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                border: '1px solid var(--line)', background: 'var(--surface-2)', color: 'var(--muted)',
              }}>Bekor</button>
            )}
          </div>
        </div>

        {/* Ro'yxat */}
        {yuklanmoqda ? (
          <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Yuklanmoqda…</p>
        ) : modullar.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--muted)' }}>
            <p style={{ fontSize: '14px' }}>Hali modul yo‘q. Yuqoridagi forma orqali birinchi modulni qo‘shing.</p>
          </div>
        ) : (
          guruhlangan.map((b) => b.list.length > 0 && (
            <div key={b.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h3 style={{ margin: '4px 0', fontSize: '13px', fontWeight: 800, color: b.rang }}>{b.nom} ({b.list.length})</h3>
              {b.list.map((m) => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '12px 14px' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>№{m.modul_no}. {m.nom}</div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '10.5px', fontWeight: 700, padding: '2px 7px', borderRadius: '6px', background: m.holat === 'nashr' ? '#16a34a22' : 'var(--surface-2)', color: m.holat === 'nashr' ? '#16a34a' : 'var(--muted)' }}>{m.holat === 'nashr' ? 'Nashr' : 'Qoralama'}</span>
                      <span style={{ fontSize: '10.5px', fontWeight: 700, padding: '2px 7px', borderRadius: '6px', background: 'var(--surface-2)', color: 'var(--muted)' }}>{m.bepul ? 'Bepul' : 'Pullik'}</span>
                      {m.majburiy && <span style={{ fontSize: '10.5px', fontWeight: 700, padding: '2px 7px', borderRadius: '6px', background: 'var(--surface-2)', color: 'var(--muted)' }}>Majburiy</span>}
                    </div>
                  </div>
                  <KebabMenu amallar={[
                    { label: 'Tahrirlash', icon: <Pencil size={15} />, onClick: () => tahrirla(m) },
                    { label: 'O‘chirish', icon: <Trash2 size={15} />, danger: true, onClick: () => ochir(m) },
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
