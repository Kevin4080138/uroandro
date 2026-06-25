'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useParams, useRouter } from 'next/navigation'
import { AppShell } from '@/components/AppShell'
import { createClient } from '@/lib/supabase'
import { shablonTop, SHABLONLAR, type HujjatBlok, type Maydon } from '@/lib/shablonlar'

const ASOS_HUJJAT = 'birlamchi'   // boshqa hujjatlar shundan boshlang'ich ma'lumot oladi

const input = {
  width: '100%', background: 'var(--surface-2)', color: 'var(--ink)', border: '1.5px solid var(--line)',
  borderRadius: '9px', padding: '9px 11px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' as const,
}
const lbl = { color: 'var(--ink-soft)', fontSize: '12px', fontWeight: 600 as const, display: 'block', marginBottom: '5px' }

const chip = (active: boolean): React.CSSProperties => ({
  border: 'none', borderRadius: '16px', padding: '5px 11px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
  background: active ? 'var(--accent)' : 'var(--surface-2)', color: active ? 'white' : 'var(--ink-soft)',
})

export default function HujjatlarPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = createClient()

  const [shablonId, setShablonId] = useState('prostatit')
  const shablon = shablonTop(shablonId)!

  const [bemor, setBemor] = useState<any>(null)
  const [shifokorIsmi, setShifokorIsmi] = useState('')
  const [defaults, setDefaults] = useState<Record<string, any>>({})
  const [docData, setDocData] = useState<Record<string, Record<string, any>>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saqlandi, setSaqlandi] = useState(false)
  const [chopId, setChopId] = useState<string | null>(null)
  const [chapKeng, setChapKeng] = useState(380)
  const [faolIndex, setFaolIndex] = useState(0)
  const [bosmaScale, setBosmaScale] = useState(1)
  const bosmaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLoading(true)
    setFaolIndex(0)
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const [{ data: b }, { data: prof }, { data: hd }] = await Promise.all([
        supabase.from('bemorlar').select('*').eq('id', id).single(),
        supabase.from('profiles').select('full_name').eq('id', user?.id).single(),
        supabase.from('hujjat_malumotlari').select('malumot').eq('bemor_id', id).eq('doctor_id', user?.id).eq('shablon', shablonId).maybeSingle(),
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
      setDefaults(boshlang)

      // saqlangan ma'lumot: yangi (hujjat bo'yicha) yoki eski (yassi) format
      const saqlangan = hd?.malumot ?? {}
      const hujjatIdlar = shablon.hujjatlar.map((h) => h.id)
      const yangiFormat = Object.keys(saqlangan).some((k) => hujjatIdlar.includes(k))
      setDocData(yangiFormat ? saqlangan : { [ASOS_HUJJAT]: saqlangan })
      setLoading(false)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, shablonId])

  const faolId = shablon.hujjatlar[faolIndex]?.id ?? ASOS_HUJJAT
  const maydonVariant = (key: string): string[] => {
    for (const g of shablon.guruhlar) for (const m of g.maydonlar) if (m.key === key) return m.variantlar ?? []
    return []
  }

  // hujjat uchun amaldagi ma'lumot: default + asos hujjat + shu hujjat o'zgarishlari
  const effective = (docId: string) => ({ ...defaults, ...(docData[ASOS_HUJJAT] ?? {}), ...(docData[docId] ?? {}) })
  const faolData = effective(faolId)

  // hujjat to'ldirilganlik darajasi — tab'larda progress ko'rsatish uchun
  const hujjatHolati = (h: { id: string; kunlik?: boolean }): 'bosh' | 'qisman' | 'toldi' => {
    const data = effective(h.id)
    if (h.kunlik) return Array.isArray(data.kunlar) && data.kunlar.length > 0 ? 'toldi' : 'bosh'
    const maydonlar = shablon.guruhlar.flatMap((g) => g.maydonlar).filter((m) => !m.faqat || m.faqat.includes(h.id))
    if (maydonlar.length === 0) return 'bosh'
    const toldirilgan = maydonlar.filter((m) => {
      const v = data[m.key]
      if (Array.isArray(v)) return v.length > 0
      return v !== undefined && v !== null && String(v).trim() !== ''
    }).length
    const nisbat = toldirilgan / maydonlar.length
    if (nisbat === 0) return 'bosh'
    if (nisbat >= 0.7) return 'toldi'
    return 'qisman'
  }

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

  // o'zgartirishlar faqat faol hujjatga yoziladi (boshqalariga ta'sir qilmaydi)
  const set = (key: string, val: any) => {
    setDocData((d) => ({ ...d, [faolId]: { ...(d[faolId] ?? {}), [key]: val } }))
    setSaqlandi(false)
  }
  const toggleChecklist = (key: string, val: string) => {
    setDocData((d) => {
      const cur: string[] = Array.isArray(faolData[key]) ? faolData[key] : []
      const yangi = cur.includes(val) ? cur.filter((x) => x !== val) : [...cur, val]
      return { ...d, [faolId]: { ...(d[faolId] ?? {}), [key]: yangi } }
    })
    setSaqlandi(false)
  }

  const saqla = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setSaving(true)
    await supabase.from('hujjat_malumotlari').upsert({
      bemor_id: id, doctor_id: user.id, shablon: shablonId, malumot: docData, updated_at: new Date().toISOString(),
    }, { onConflict: 'bemor_id,doctor_id,shablon' })
    setSaving(false)
    setSaqlandi(true)
  }

  const chopEt = (hid: string) => {
    setChopId(hid)
    setBosmaScale(1)
    // avval scale=1 da render bo'lsin, keyin balandlikni o'lchab bitta betga moslaymiz
    setTimeout(() => {
      const el = bosmaRef.current
      const target = 1015 // A4 chop maydoni balandligi (~px, 96dpi, 11mm chet)
      if (el) {
        const h = el.scrollHeight
        setBosmaScale(h > target ? target / h : 1)
      }
      setTimeout(() => { window.print(); setChopId(null); setBosmaScale(1) }, 120)
    }, 80)
  }

  const hujjatlar = useMemo(
    () => shablon.hujjatlar.map((h) => ({ ...h, bloklar: h.render(effective(h.id), bemor, shifokorIsmi) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shablon, defaults, docData, bemor, shifokorIsmi]
  )

  const orqagaTugmasi = (
    <button
      onClick={() => router.push(`/doctor/patients/${id}`)}
      className="btn-animated soft-press"
      style={{
        background: 'var(--surface-2)', color: 'var(--ink-soft)', border: '1px solid var(--line)', borderRadius: '999px',
        padding: '8px 16px', cursor: 'pointer', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px',
      }}
    >
      ← Bemorga qaytish
    </button>
  )

  if (loading) return (
    <AppShell title="Hujjatlar" actions={orqagaTugmasi}><div className="px-8 py-8"><p style={{ color: 'var(--muted)' }}>Yuklanmoqda...</p></div></AppShell>
  )

  return (
    <AppShell title={`Hujjatlar — ${bemor?.fio ?? ''}`} actions={orqagaTugmasi}>
      <style>{`
        .ajratgich:hover > div { background: var(--accent) !important; width: 3px !important; }
        .bosma-portal { position: fixed; left: -10000px; top: 0; width: 680px; background: #fff; }
        @media print {
          body > *:not(.bosma-portal) { display: none !important; }
          .bosma-portal { position: static !important; left: 0 !important; width: auto !important; }
          @page { size: A4; margin: 11mm 14mm; }
          html, body { background: #fff !important; }
        }
      `}</style>

      <div className="no-print hujjat-split px-4 py-4 sm:px-8 sm:py-6" style={{ display: 'flex', gap: '0', alignItems: 'start' }}>
        {/* CHAP PANEL — forma */}
        <div className="hujjat-chap" style={{ width: chapKeng, flexShrink: 0, position: 'sticky', top: '80px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Ma&apos;lumotlar</h3>
            <button onClick={saqla} disabled={saving} className="btn-animated soft-press" style={{
              background: saqlandi ? 'var(--good)' : 'var(--accent)', color: 'white', border: 'none', borderRadius: '999px',
              padding: '8px 18px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
            }}>
              {saving ? 'Saqlanmoqda...' : saqlandi ? '✓ Saqlandi' : 'Saqlash'}
            </button>
          </div>

          {/* Kasallik shabloni tanlash */}
          <div style={{ marginBottom: '14px' }}>
            <label style={lbl}>Kasallik shabloni</label>
            <select value={shablonId} onChange={(e) => setShablonId(e.target.value)} style={{ ...input, cursor: 'pointer' }}>
              {SHABLONLAR.map((s) => <option key={s.id} value={s.id}>{s.kasallik}</option>)}
            </select>
          </div>

          <div style={{ maxHeight: 'calc(100vh - 160px)', overflowY: 'auto', paddingRight: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {shablon.hujjatlar[faolIndex]?.kunlik ? (
              <KunlikEditor
                kunlar={Array.isArray(faolData.kunlar) ? faolData.kunlar : []}
                onChange={(arr) => set('kunlar', arr)}
                shikoyatVariant={maydonVariant('shikoyatlar')}
                haroratVariant={maydonVariant('harorat')}
                pulsVariant={maydonVariant('puls')}
                akbVariant={maydonVariant('akb')}
                vaqtVariant={maydonVariant('korik_vaqt')}
              />
            ) : (
              shablon.guruhlar.map((g) => {
                const maydonlar = g.maydonlar.filter((m) => !m.faqat || (faolId && m.faqat.includes(faolId)))
                if (maydonlar.length === 0) return null
                return (
                  <div key={g.nom} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '14px 16px' }}>
                    <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)', fontWeight: 700, margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <span style={{ width: '3px', height: '12px', background: 'var(--accent)', borderRadius: '2px', display: 'inline-block' }} />
                      {g.nom}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 10px' }}>
                      {maydonlar.map((m) => (
                        <div key={m.key} style={{ flex: m.keng || m.type === 'checklist' || m.type === 'textarea' || m.type === 'olcham' ? '1 1 100%' : '1 1 calc(50% - 5px)', minWidth: 0 }}>
                          <MaydonRender m={m} value={faolData[m.key]} set={set} toggle={toggleChecklist} />
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* SURILADIGAN AJRATGICH */}
        <div
          className="ajratgich hujjat-ajratgich"
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
            {hujjatlar.map((h, i) => {
              const holat = hujjatHolati(h)
              const faol = i === faolIndex
              return (
                <button key={h.id} onClick={() => setFaolIndex(i)} className="btn-animated" style={{
                  border: 'none', borderRadius: '999px', padding: '7px 14px', cursor: 'pointer', fontSize: '12.5px', fontWeight: 600,
                  background: faol ? 'var(--accent)' : 'var(--surface-2)', color: faol ? 'white' : 'var(--ink-soft)',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '16px', height: '16px', borderRadius: '50%', fontSize: '10px', flexShrink: 0,
                    background: holat === 'toldi' ? 'var(--good)' : holat === 'qisman' ? 'var(--warn)' : (faol ? 'rgba(255,255,255,.25)' : 'var(--surface)'),
                    color: holat === 'bosh' ? (faol ? 'white' : 'var(--muted)') : 'white',
                    border: holat === 'bosh' ? `1px solid ${faol ? 'rgba(255,255,255,.5)' : 'var(--line)'}` : 'none',
                  }}>
                    {holat === 'toldi' ? '✓' : holat === 'qisman' ? '•' : ''}
                  </span>
                  {i + 1}. {h.nom}
                </button>
              )
            })}
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

      {/* Bosma — body'ga portal, faqat chop rejimida ko'rinadi (boshqa hammasi yashiriladi) */}
      {chopId && typeof document !== 'undefined' && createPortal(
        <div className="bosma-portal">
          <div ref={bosmaRef} style={{ zoom: bosmaScale }}>
            {(() => {
              const h = hujjatlar.find((x) => x.id === chopId)
              return h ? <HujjatVaraq bloklar={h.bloklar} print /> : null
            })()}
          </div>
        </div>,
        document.body
      )}
    </AppShell>
  )
}

function MaydonRender({ m, value, set, toggle }: { m: Maydon; value: any; set: (k: string, v: any) => void; toggle: (k: string, v: string) => void }) {
  if (m.type === 'checklist') {
    return (
      <div>
        <label style={lbl}>{m.label}</label>
        <MultiSelect tanlangan={Array.isArray(value) ? value : []} variantlar={m.variantlar ?? []} toggle={(v) => toggle(m.key, v)} />
      </div>
    )
  }
  if (m.type === 'olcham') {
    return (
      <div>
        <label style={lbl}>{m.label}</label>
        <Olcham value={value ?? ''} onChange={(olcham, hajm) => { set(m.key, olcham); set('prostata_hajm', hajm) }} />
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

// Kompakt ko'p tanlovli: tanlanganlar kichik teg, qo'shish uchun dropdown
function MultiSelect({ tanlangan, variantlar, toggle }: { tanlangan: string[]; variantlar: string[]; toggle: (v: string) => void }) {
  const [ochiq, setOchiq] = useState(false)
  const qoldiq = variantlar.filter((v) => !tanlangan.includes(v))
  return (
    <div>
      {tanlangan.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '6px' }}>
          {tanlangan.map((v) => (
            <span key={v} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'var(--accent)', color: 'white', borderRadius: '14px', padding: '4px 6px 4px 10px', fontSize: '12px' }}>
              {v}
              <button type="button" onClick={() => toggle(v)} style={{ background: 'rgba(255,255,255,.25)', border: 'none', borderRadius: '50%', width: '16px', height: '16px', cursor: 'pointer', color: 'white', fontSize: '11px', lineHeight: 1 }}>×</button>
            </span>
          ))}
        </div>
      )}
      <div style={{ position: 'relative' }}>
        <button type="button" onClick={() => setOchiq((o) => !o)} style={{ ...input, textAlign: 'left', cursor: 'pointer', color: 'var(--muted)' }}>
          + Tanlash...
        </button>
        {ochiq && (
          <>
            <div onClick={() => setOchiq(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
            <div style={{ position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0, zIndex: 41, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '8px', boxShadow: 'var(--shadow)', maxHeight: '220px', overflowY: 'auto', padding: '4px' }}>
              {qoldiq.length === 0 ? (
                <div style={{ padding: '8px 10px', fontSize: '12.5px', color: 'var(--muted)' }}>Hammasi tanlangan</div>
              ) : qoldiq.map((v) => (
                <div key={v} onClick={() => { toggle(v); setOchiq(false) }} style={{ padding: '7px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: 'var(--ink)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >{v}</div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Prostata o'lchami: 3 raqam (a×b×c) → hajm avtomatik (ellipsoid: 0.52)
function Olcham({ value, onChange }: { value: string; onChange: (olcham: string, hajm: string) => void }) {
  const qismlar = value.split(/[х×x]/).map((s) => s.trim())
  const [a, setA] = useState(qismlar[0] ?? '')
  const [b, setB] = useState(qismlar[1] ?? '')
  const [c, setC] = useState(qismlar[2] ?? '')

  // boshlang'ichda hajmni hisoblab qo'yish
  useEffect(() => {
    if (a && b && c) {
      const A = parseFloat(a), B = parseFloat(b), C = parseFloat(c)
      if (A && B && C) onChange([a, b, c].join('х'), ((A / 10) * (B / 10) * (C / 10) * 0.52).toFixed(1).replace('.', ','))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const yangila = (na: string, nb: string, nc: string) => {
    setA(na); setB(nb); setC(nc)
    const olcham = [na, nb, nc].filter(Boolean).join('х')
    const A = parseFloat(na), B = parseFloat(nb), C = parseFloat(nc)
    let hajm = ''
    if (A && B && C) hajm = ((A / 10) * (B / 10) * (C / 10) * 0.52).toFixed(1).replace('.', ',')
    onChange(olcham, hajm)
  }

  const A = parseFloat(a), B = parseFloat(b), C = parseFloat(c)
  const hajm = A && B && C ? ((A / 10) * (B / 10) * (C / 10) * 0.52).toFixed(1).replace('.', ',') : '—'

  const num = { ...input, textAlign: 'center' as const, padding: '8px 4px' }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <input style={num} value={a} onChange={(e) => yangila(e.target.value, b, c)} placeholder="40" />
      <span style={{ color: 'var(--muted)' }}>×</span>
      <input style={num} value={b} onChange={(e) => yangila(a, e.target.value, c)} placeholder="30" />
      <span style={{ color: 'var(--muted)' }}>×</span>
      <input style={num} value={c} onChange={(e) => yangila(a, b, e.target.value)} placeholder="32" />
      <span style={{ fontSize: '12px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>мм → <strong style={{ color: 'var(--accent)' }}>{hajm}</strong> см³</span>
    </div>
  )
}

// Bir nechta kunlik yozuvni boshqarish
function KunlikEditor({ kunlar, onChange, shikoyatVariant, haroratVariant, pulsVariant, akbVariant, vaqtVariant }: {
  kunlar: any[]; onChange: (arr: any[]) => void
  shikoyatVariant: string[]; haroratVariant: string[]; pulsVariant: string[]; akbVariant: string[]; vaqtVariant: string[]
}) {
  const yangila = (i: number, key: string, val: any) => {
    const arr = kunlar.map((k, j) => (j === i ? { ...k, [key]: val } : k))
    onChange(arr)
  }
  const toggleShik = (i: number, v: string) => {
    const cur: string[] = Array.isArray(kunlar[i]?.shikoyatlar) ? kunlar[i].shikoyatlar : []
    yangila(i, 'shikoyatlar', cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v])
  }
  const qoshish = () => onChange([...kunlar, { harorat: '36,6', puls: '72', akb: '110/70', tavsiya: 'Даво муолажаларини давом эттириш.', shikoyatlar: [] }])
  const ochirish = (i: number) => onChange(kunlar.filter((_, j) => j !== i))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {kunlar.length === 0 && (
        <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>Hali kunlik yozuv yo&apos;q. Quyidan qo&apos;shing.</p>
      )}
      {kunlar.map((k, i) => (
        <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)' }}>{i + 1}-kun</span>
            <button onClick={() => ochirish(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: '14px' }}>🗑️</button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ flex: '1 1 calc(50% - 5px)' }}>
              <label style={lbl}>Sana</label>
              <input type="date" style={input} value={k.sana ?? ''} onChange={(e) => yangila(i, 'sana', e.target.value)} />
            </div>
            <div style={{ flex: '1 1 calc(50% - 5px)' }}>
              <label style={lbl}>Vaqt</label>
              <VariantSelect value={k.vaqt ?? '08:30'} variantlar={vaqtVariant} onChange={(v) => yangila(i, 'vaqt', v)} />
            </div>
            <div style={{ flex: '1 1 100%' }}>
              <label style={lbl}>Shikoyatlari</label>
              <MultiSelect tanlangan={Array.isArray(k.shikoyatlar) ? k.shikoyatlar : []} variantlar={shikoyatVariant} toggle={(v) => toggleShik(i, v)} />
            </div>
            <div style={{ flex: '1 1 calc(33% - 7px)' }}>
              <label style={lbl}>Harorat</label>
              <VariantSelect value={k.harorat ?? '36,6'} variantlar={haroratVariant} onChange={(v) => yangila(i, 'harorat', v)} />
            </div>
            <div style={{ flex: '1 1 calc(33% - 7px)' }}>
              <label style={lbl}>Puls</label>
              <VariantSelect value={k.puls ?? '72'} variantlar={pulsVariant} onChange={(v) => yangila(i, 'puls', v)} />
            </div>
            <div style={{ flex: '1 1 calc(33% - 7px)' }}>
              <label style={lbl}>AKB</label>
              <VariantSelect value={k.akb ?? '110/70'} variantlar={akbVariant} onChange={(v) => yangila(i, 'akb', v)} />
            </div>
            <div style={{ flex: '1 1 100%' }}>
              <label style={lbl}>Tavsiya</label>
              <VariantSelect value={k.tavsiya ?? 'Даво муолажаларини давом эттириш.'} variantlar={['Даво муолажаларини давом эттириш.', 'Амбулатор даво.']} onChange={(v) => yangila(i, 'tavsiya', v)} />
            </div>
          </div>
        </div>
      ))}
      <button onClick={qoshish} className="btn-animated soft-press" style={{
        background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px dashed var(--accent)', borderRadius: '10px',
        padding: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
      }}>
        + Yangi kun qo&apos;shish
      </button>
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
  const fs = print ? '10.5px' : '13.5px'
  const lh = print ? 1.28 : 1.6
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
