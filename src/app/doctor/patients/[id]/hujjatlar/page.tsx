'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { AppShell } from '@/components/AppShell'
import { createClient } from '@/lib/supabase'
import { shablonTop, type HujjatBlok, type Maydon } from '@/lib/shablonlar'

const SHABLON_ID = 'prostatit'

const input = {
  width: '100%', background: 'var(--surface-2)', color: 'var(--ink)', border: '1px solid var(--line)',
  borderRadius: '8px', padding: '8px 10px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' as const,
}
const lbl = { color: 'var(--ink-soft)', fontSize: '12px', display: 'block', marginBottom: '4px' }

const chip = (active: boolean): React.CSSProperties => ({
  border: 'none', borderRadius: '16px', padding: '5px 11px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
  background: active ? 'var(--accent)' : 'var(--surface-2)', color: active ? 'white' : 'var(--ink-soft)',
})

export default function HujjatlarPage() {
  const { id } = useParams<{ id: string }>()
  const supabase = createClient()
  const shablon = shablonTop(SHABLON_ID)!

  const [bemor, setBemor] = useState<any>(null)
  const [shifokorIsmi, setShifokorIsmi] = useState('')
  const [data, setData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saqlandi, setSaqlandi] = useState(false)
  const [chopId, setChopId] = useState<string | null>(null)
  const [chapKeng, setChapKeng] = useState(380)
  const [faolIndex, setFaolIndex] = useState(0)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const [{ data: b }, { data: prof }, { data: hd }] = await Promise.all([
        supabase.from('bemorlar').select('*').eq('id', id).single(),
        supabase.from('profiles').select('full_name').eq('id', user?.id).single(),
        supabase.from('hujjat_malumotlari').select('malumot').eq('bemor_id', id).eq('doctor_id', user?.id).eq('shablon', SHABLON_ID).maybeSingle(),
      ])
      setBemor(b)
      setShifokorIsmi(prof?.full_name ?? '')

      // boshlang'ich qiymatlar: saqlangan -> default
      const boshlang: Record<string, any> = {}
      for (const g of shablon.guruhlar) for (const m of g.maydonlar) {
        if (m.default) boshlang[m.key] = m.default
        if (m.type === 'checklist') boshlang[m.key] = []
      }
      // pasport ma'lumotlarini bemordan avtomatik to'ldirish
      if (b?.tugilgan_sana) boshlang.tugilgan_yil = String(b.tugilgan_sana).slice(0, 4)
      if (b?.manzil) boshlang.manzil = b.manzil
      setData({ ...boshlang, ...(hd?.malumot ?? {}) })
      setLoading(false)
    }
    load()
  }, [id])

  // o'rtadagi ajratgichni sudrash
  const sudrashBoshla = (e: React.MouseEvent) => {
    e.preventDefault()
    const boshX = e.clientX
    const boshKeng = chapKeng
    const harakat = (ev: MouseEvent) => {
      const yangi = Math.min(Math.max(boshKeng + (ev.clientX - boshX), 280), 640)
      setChapKeng(yangi)
    }
    const tugat = () => {
      window.removeEventListener('mousemove', harakat)
      window.removeEventListener('mouseup', tugat)
      document.body.style.userSelect = ''
    }
    document.body.style.userSelect = 'none'
    window.addEventListener('mousemove', harakat)
    window.addEventListener('mouseup', tugat)
  }

  const set = (key: string, val: any) => { setData((d) => ({ ...d, [key]: val })); setSaqlandi(false) }
  const toggleChecklist = (key: string, val: string) => {
    setData((d) => {
      const cur: string[] = Array.isArray(d[key]) ? d[key] : []
      return { ...d, [key]: cur.includes(val) ? cur.filter((x) => x !== val) : [...cur, val] }
    })
    setSaqlandi(false)
  }

  const saqla = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setSaving(true)
    await supabase.from('hujjat_malumotlari').upsert({
      bemor_id: id, doctor_id: user.id, shablon: SHABLON_ID, malumot: data, updated_at: new Date().toISOString(),
    }, { onConflict: 'bemor_id,doctor_id,shablon' })
    setSaving(false)
    setSaqlandi(true)
  }

  const chopEt = (hid: string) => {
    setChopId(hid)
    setTimeout(() => { window.print(); setChopId(null) }, 100)
  }

  const hujjatlar = useMemo(
    () => shablon.hujjatlar.map((h) => ({ ...h, bloklar: h.render(data, bemor, shifokorIsmi) })),
    [shablon, data, bemor, shifokorIsmi]
  )

  if (loading) return (
    <AppShell title="Hujjatlar"><div className="px-8 py-8"><p style={{ color: 'var(--muted)' }}>Yuklanmoqda...</p></div></AppShell>
  )

  return (
    <AppShell title={`Hujjatlar — ${bemor?.fio ?? ''}`}>
      <style>{`
        .ajratgich:hover > div { background: var(--accent) !important; width: 3px !important; }
        @media print {
          .no-print { display: none !important; }
          .hujjat-doc { display: none !important; }
          .hujjat-doc.chop { display: block !important; box-shadow: none !important; border: none !important; }
          body { background: white !important; }
        }
      `}</style>

      <div className="no-print px-8 py-6" style={{ display: 'flex', gap: '0', alignItems: 'start' }}>
        {/* CHAP PANEL — forma */}
        <div style={{ width: chapKeng, flexShrink: 0, position: 'sticky', top: '80px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ margin: 0, fontSize: '15px' }}>Ma&apos;lumotlar</h3>
            <button onClick={saqla} disabled={saving} className="btn-animated" style={{
              background: saqlandi ? 'var(--good)' : 'var(--accent)', color: 'white', border: 'none', borderRadius: '8px',
              padding: '7px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
            }}>
              {saving ? 'Saqlanmoqda...' : saqlandi ? '✓ Saqlandi' : 'Saqlash'}
            </button>
          </div>

          <div style={{ maxHeight: 'calc(100vh - 160px)', overflowY: 'auto', paddingRight: '6px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {shablon.guruhlar.map((g) => (
              <div key={g.nom}>
                <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--muted)', margin: '0 0 8px 0' }}>{g.nom}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {g.maydonlar.map((m) => <MaydonRender key={m.key} m={m} value={data[m.key]} set={set} toggle={toggleChecklist} />)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SURILADIGAN AJRATGICH */}
        <div
          className="ajratgich"
          onMouseDown={sudrashBoshla}
          title="O'lchamni o'zgartirish uchun suring"
          style={{
            width: '10px', flexShrink: 0, cursor: 'col-resize', alignSelf: 'stretch',
            display: 'flex', justifyContent: 'center', position: 'sticky', top: '80px',
          }}
        >
          <div style={{ width: '2px', background: 'var(--line)', borderRadius: '2px', minHeight: '120px' }} />
        </div>

        {/* O'NG PANEL — hujjatlar (bittadan, tab bilan) */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Tab qatori */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {hujjatlar.map((h, i) => (
              <button key={h.id} onClick={() => setFaolIndex(i)} className="btn-animated" style={{
                border: 'none', borderRadius: '999px', padding: '7px 14px', cursor: 'pointer', fontSize: '12.5px', fontWeight: 600,
                background: i === faolIndex ? 'var(--accent)' : 'var(--surface-2)', color: i === faolIndex ? 'white' : 'var(--ink-soft)',
              }}>
                {i + 1}. {h.nom}
              </button>
            ))}
          </div>

          {hujjatlar[faolIndex] && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--accent)' }}>{hujjatlar[faolIndex].nom}</h4>
                <button onClick={() => chopEt(hujjatlar[faolIndex].id)} className="btn-animated" style={{
                  background: 'var(--surface-2)', color: 'var(--ink-soft)', border: '1px solid var(--line)', borderRadius: '8px',
                  padding: '6px 14px', cursor: 'pointer', fontSize: '12.5px',
                }}>
                  🖨️ Chop etish
                </button>
              </div>
              <HujjatVaraq bloklar={hujjatlar[faolIndex].bloklar} chop={chopId === hujjatlar[faolIndex].id} />

              {/* Oldingi / Keyingi */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px' }}>
                <button onClick={() => setFaolIndex((i) => Math.max(i - 1, 0))} disabled={faolIndex === 0} className="btn-animated" style={{
                  background: 'var(--surface-2)', color: 'var(--ink-soft)', border: '1px solid var(--line)', borderRadius: '8px',
                  padding: '9px 18px', cursor: faolIndex === 0 ? 'not-allowed' : 'pointer', fontSize: '13px', opacity: faolIndex === 0 ? 0.5 : 1,
                }}>
                  ← Oldingi hujjat
                </button>
                <button onClick={() => setFaolIndex((i) => Math.min(i + 1, hujjatlar.length - 1))} disabled={faolIndex === hujjatlar.length - 1} className="btn-animated" style={{
                  background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '8px',
                  padding: '9px 18px', cursor: faolIndex === hujjatlar.length - 1 ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 600,
                  opacity: faolIndex === hujjatlar.length - 1 ? 0.5 : 1,
                }}>
                  Keyingi hujjat →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chop uchun (alohida, faqat print rejimida ko'rinadi) */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }} aria-hidden>
        {hujjatlar.map((h) => (
          <div key={h.id} className={`hujjat-doc ${chopId === h.id ? 'chop' : ''}`}>
            <HujjatVaraq bloklar={h.bloklar} chop print />
          </div>
        ))}
      </div>
    </AppShell>
  )
}

function MaydonRender({ m, value, set, toggle }: { m: Maydon; value: any; set: (k: string, v: any) => void; toggle: (k: string, v: string) => void }) {
  if (m.type === 'checklist') {
    return (
      <div>
        <label style={lbl}>{m.label}</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {m.variantlar?.map((v) => (
            <button key={v} type="button" style={chip(Array.isArray(value) && value.includes(v))} onClick={() => toggle(m.key, v)}>{v}</button>
          ))}
        </div>
      </div>
    )
  }
  if (m.type === 'select') {
    return (
      <div>
        <label style={lbl}>{m.label}</label>
        <input list={`dl-${m.key}`} style={input} value={value ?? ''} onChange={(e) => set(m.key, e.target.value)} />
        <datalist id={`dl-${m.key}`}>{m.variantlar?.map((v) => <option key={v} value={v} />)}</datalist>
      </div>
    )
  }
  if (m.type === 'textarea') {
    return (
      <div>
        <label style={lbl}>{m.label}</label>
        <textarea style={{ ...input, minHeight: '60px' }} value={value ?? ''} onChange={(e) => set(m.key, e.target.value)} />
      </div>
    )
  }
  return (
    <div>
      <label style={lbl}>{m.label}{m.birlik ? ` (${m.birlik})` : ''}</label>
      <input type={m.type === 'date' ? 'date' : m.type === 'number' ? 'number' : 'text'} style={input} value={value ?? ''} onChange={(e) => set(m.key, e.target.value)} />
    </div>
  )
}

function HujjatVaraq({ bloklar, chop, print }: { bloklar: HujjatBlok[]; chop?: boolean; print?: boolean }) {
  return (
    <div style={{
      background: print ? 'white' : 'var(--surface)', color: print ? '#111' : 'var(--ink)',
      border: print ? 'none' : '1px solid var(--line)', borderRadius: print ? 0 : '12px',
      padding: print ? '40px' : '28px 32px', fontSize: '13.5px', lineHeight: 1.6,
      maxWidth: print ? '720px' : 'none', margin: print ? '0 auto' : 0,
    }}>
      {bloklar.map((b, i) => {
        if (b.tur === 'bosh') return <div key={i} style={{ height: '10px' }} />
        if (b.tur === 'sarlavha') return <h3 key={i} style={{ fontSize: '14px', fontWeight: 700, margin: '14px 0 6px', textTransform: b.matn === b.matn.toUpperCase() ? 'none' : undefined }}>{b.matn}</h3>
        if (b.tur === 'matn') return <p key={i} style={{ margin: '0 0 6px', whiteSpace: 'pre-wrap' }}>{b.matn}</p>
        if (b.tur === 'royxat') return <ul key={i} style={{ margin: '0 0 6px', paddingLeft: '20px' }}>{b.bandlar.map((x, j) => <li key={j}>{x}</li>)}</ul>
        // qator
        return (
          <div key={i} style={{ display: 'flex', gap: '10px', padding: '3px 0' }}>
            <span style={{ color: print ? '#555' : 'var(--muted)', minWidth: '170px', flexShrink: 0 }}>{b.chap}:</span>
            <span style={{ fontWeight: 500 }}>{b.ong}</span>
          </div>
        )
      })}
    </div>
  )
}
