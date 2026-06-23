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
      // vrach maydonlari — ro'yxatdan o'tgan shifokor ismi (o'zgartirsa bo'ladi)
      boshlang.davolovchi = prof?.full_name ?? ''
      boshlang.bolim_mudiri = prof?.full_name ?? ''
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
        .bosma { display: none; }
        @media print {
          body * { visibility: hidden !important; }
          .bosma, .bosma * { visibility: visible !important; }
          .bosma { display: block !important; position: absolute; left: 0; top: 0; width: 100%; }
          @page { size: A4; margin: 12mm 15mm; }
          html, body { background: #fff !important; }
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

          <div style={{ maxHeight: 'calc(100vh - 160px)', overflowY: 'auto', paddingRight: '6px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {shablon.guruhlar.map((g) => {
              const faolId = hujjatlar[faolIndex]?.id
              const maydonlar = g.maydonlar.filter((m) => !m.faqat || (faolId && m.faqat.includes(faolId)))
              if (maydonlar.length === 0) return null
              return (
                <div key={g.nom}>
                  <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--muted)', margin: '0 0 8px 0' }}>{g.nom}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 10px' }}>
                    {maydonlar.map((m) => (
                      <div key={m.key} style={{ flex: m.keng || m.type === 'checklist' || m.type === 'textarea' ? '1 1 100%' : '1 1 calc(50% - 5px)', minWidth: 0 }}>
                        <MaydonRender m={m} value={data[m.key]} set={set} toggle={toggleChecklist} />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
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

      {/* Bosma — faqat chop rejimida ko'rinadi, sidebar/header chiqmaydi */}
      <div className="bosma">
        {chopId && (() => {
          const h = hujjatlar.find((x) => x.id === chopId)
          return h ? <HujjatVaraq bloklar={h.bloklar} print /> : null
        })()}
      </div>
    </AppShell>
  )
}

function MaydonRender({ m, value, set, toggle }: { m: Maydon; value: any; set: (k: string, v: any) => void; toggle: (k: string, v: string) => void }) {
  if (m.type === 'checklist') {
    return (
      <div>
        <label style={lbl}>{m.label}</label>
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '130px', overflowY: 'auto',
          background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '10px', padding: '8px',
        }}>
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
        <label style={lbl}>{m.label}{m.birlik ? ` (${m.birlik})` : ''}</label>
        <VariantSelect value={value ?? ''} variantlar={m.variantlar ?? []} onChange={(v) => set(m.key, v)} />
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

function VariantSelect({ value, variantlar, onChange }: { value: string; variantlar: string[]; onChange: (v: string) => void }) {
  const [ochiq, setOchiq] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex' }}>
        <input
          style={{ ...input, borderRadius: '8px 0 0 8px', borderRight: 'none' }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setOchiq(true)}
        />
        <button type="button" onClick={() => setOchiq((o) => !o)} style={{
          background: 'var(--surface-2)', color: 'var(--ink-soft)', border: '1px solid var(--line)',
          borderRadius: '0 8px 8px 0', padding: '0 10px', cursor: 'pointer', fontSize: '11px',
        }}>▼</button>
      </div>
      {ochiq && (
        <>
          <div onClick={() => setOchiq(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
          <div style={{
            position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0, zIndex: 41,
            background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '8px',
            boxShadow: 'var(--shadow)', maxHeight: '200px', overflowY: 'auto', padding: '4px',
          }}>
            {variantlar.map((v) => (
              <div key={v} onClick={() => { onChange(v); setOchiq(false) }} style={{
                padding: '7px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px',
                background: v === value ? 'var(--accent-soft)' : 'transparent', color: v === value ? 'var(--accent)' : 'var(--ink)',
              }}
                onMouseEnter={(e) => { if (v !== value) (e.currentTarget.style.background = 'var(--surface-2)') }}
                onMouseLeave={(e) => { if (v !== value) (e.currentTarget.style.background = 'transparent') }}
              >
                {v}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function HujjatVaraq({ bloklar, print }: { bloklar: HujjatBlok[]; chop?: boolean; print?: boolean }) {
  // chop rejimida kompakt — bitta A4 varaqqa sig'sin
  const fs = print ? '11px' : '13.5px'
  const lh = print ? 1.32 : 1.6
  const pm = print ? '2px' : '4px'   // paragraf orasidagi masofa
  return (
    <div style={{
      background: print ? 'white' : 'var(--surface)', color: print ? '#000' : 'var(--ink)',
      border: print ? 'none' : '1px solid var(--line)', borderRadius: print ? 0 : '12px',
      padding: print ? 0 : '28px 32px', fontSize: fs, lineHeight: lh,
      maxWidth: 'none', margin: 0,
      fontFamily: print ? "'Times New Roman', Georgia, serif" : 'inherit',
    }}>
      {bloklar.map((b, i) => {
        if (b.tur === 'bosh') return <div key={i} style={{ height: print ? '8px' : '12px' }} />
        if (b.tur === 'sarlavha') return <h3 key={i} style={{ fontSize: print ? '12px' : '14px', fontWeight: 700, margin: print ? '8px 0 3px' : '12px 0 5px' }}>{b.matn}</h3>
        if (b.tur === 'matn') return <p key={i} style={{ margin: `0 0 ${pm}`, whiteSpace: 'pre-wrap', textAlign: 'justify' }}>{b.matn}</p>
        if (b.tur === 'band') return (
          <p key={i} style={{ margin: `0 0 ${pm}`, textAlign: 'justify', textIndent: print ? '1.2em' : 0 }}>
            <strong>{b.etiket}:</strong>{b.matn ? ' ' + b.matn : ''}
          </p>
        )
        if (b.tur === 'royxat') return <ul key={i} style={{ margin: `0 0 ${pm}`, paddingLeft: '24px' }}>{b.bandlar.map((x, j) => <li key={j} style={{ marginBottom: print ? '1px' : '2px' }}>{x}</li>)}</ul>
        if (b.tur === 'imzo') return (
          <div key={i} style={{ display: 'flex', justifyContent: 'flex-end', gap: '40px', padding: print ? '3px 0' : '6px 0' }}>
            <strong>{b.chap}:</strong>
            <span style={{ minWidth: '150px' }}>{b.ong}</span>
          </div>
        )
        // qator (label: value)
        return (
          <div key={i} style={{ display: 'flex', gap: '10px', padding: print ? '1px 0' : '2px 0' }}>
            <span style={{ color: print ? '#000' : 'var(--muted)', minWidth: '150px', flexShrink: 0 }}>{b.chap}:</span>
            <span style={{ fontWeight: 500 }}>{b.ong}</span>
          </div>
        )
      })}
    </div>
  )
}
