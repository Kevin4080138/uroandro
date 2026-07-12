'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AppShell } from '@/components/AppShell'
import { createClient } from '@/lib/supabase'
import { HujjatVaraq } from '@/components/HujjatVaraq'
import type { Maydon, MaydonGuruh } from '@/lib/shablonlar'
import {
  kalitYasa, shaxsiyShablonga,
  type DeklarativBlok, type DeklarativHujjat, type ShablonTuzilma,
} from '@/lib/shablonlar/deklarativ'

const input = {
  width: '100%', background: 'var(--surface-2)', color: 'var(--ink)', border: '1.5px solid var(--line)',
  borderRadius: '9px', padding: '8px 10px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' as const,
}
const lbl = { color: 'var(--ink-soft)', fontSize: '11.5px', fontWeight: 600 as const, display: 'block', marginBottom: '4px' }
const kichikTugma = {
  background: 'var(--surface-2)', color: 'var(--ink-soft)', border: '1px solid var(--line)', borderRadius: '7px',
  padding: '5px 9px', cursor: 'pointer', fontSize: '12px',
} as React.CSSProperties

const MAYDON_TURLARI: { v: Maydon['type']; nom: string }[] = [
  { v: 'text', nom: 'Matn' },
  { v: 'textarea', nom: 'Katta matn' },
  { v: 'number', nom: 'Raqam' },
  { v: 'date', nom: 'Sana' },
  { v: 'select', nom: 'Tanlov (bitta)' },
  { v: 'checklist', nom: "Belgilash (bir nechta)" },
]

const BLOK_TURLARI: { v: DeklarativBlok['tur']; nom: string }[] = [
  { v: 'matn', nom: 'Matn (paragraf)' },
  { v: 'band', nom: 'Band (Etiket: matn)' },
  { v: 'sarlavha', nom: 'Sarlavha' },
  { v: 'qator', nom: 'Qator (chap: o‘ng)' },
  { v: 'royxat', nom: "Ro'yxat (belgilashdan)" },
  { v: 'imzo', nom: 'Imzo qatori' },
  { v: 'bosh', nom: "Bo'sh joy" },
]

function boshBlok(tur: DeklarativBlok['tur']): DeklarativBlok {
  switch (tur) {
    case 'bosh': return { tur: 'bosh' }
    case 'sarlavha': return { tur: 'sarlavha', matn: '' }
    case 'matn': return { tur: 'matn', matn: '' }
    case 'band': return { tur: 'band', etiket: '', matn: '' }
    case 'qator': return { tur: 'qator', chap: '', ong: '' }
    case 'imzo': return { tur: 'imzo', chap: 'Даволовчи врач', ong: '{{davolovchi}}' }
    case 'royxat': return { tur: 'royxat', kalit: 'davo' }
  }
}

export default function ShablonTahrirlashPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = createClient()

  const [kasallik, setKasallik] = useState('')
  const [tuzilma, setTuzilma] = useState<ShablonTuzilma>({ guruhlar: [], hujjatlar: [] })
  const [shifokorIsmi, setShifokorIsmi] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saqlandi, setSaqlandi] = useState(true)
  const [tab, setTab] = useState<'maydonlar' | 'hujjatlar'>('maydonlar')
  const [faolHujjat, setFaolHujjat] = useState(0)
  const [korinishIndex, setKorinishIndex] = useState(0)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const [{ data: row }, { data: prof }] = await Promise.all([
        supabase.from('shifokor_shablonlari').select('kasallik, tuzilma').eq('id', id).maybeSingle(),
        supabase.from('profiles').select('full_name').eq('id', user.id).single(),
      ])
      if (!row) { router.push('/doctor/shablonlarim'); return }
      setKasallik(row.kasallik)
      setTuzilma(row.tuzilma ?? { guruhlar: [], hujjatlar: [] })
      setShifokorIsmi(prof?.full_name ?? '')
      setLoading(false)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const ozgartir = (fn: (t: ShablonTuzilma) => ShablonTuzilma) => {
    setTuzilma((t) => fn(structuredClone(t)))
    setSaqlandi(false)
  }

  const saqla = async () => {
    setSaving(true)
    await supabase.from('shifokor_shablonlari')
      .update({ kasallik, tuzilma, updated_at: new Date().toISOString() })
      .eq('id', id)
    setSaving(false)
    setSaqlandi(true)
  }

  // Mavjud maydon kalitlari — hujjat matnida o'rinbosar sifatida ishlatiladi
  const kalitlar = useMemo(
    () => tuzilma.guruhlar.flatMap((g) => g.maydonlar.map((m) => m.key)),
    [tuzilma]
  )

  // Jonli ko'rinish uchun namunaviy ma'lumot: default'lar + checklist'dan birinchi 2 tanlov
  const namunaData = useMemo(() => {
    const d: Record<string, any> = {}
    for (const g of tuzilma.guruhlar) for (const m of g.maydonlar) {
      if (m.type === 'checklist') d[m.key] = (m.variantlar ?? []).slice(0, 2)
      else if (m.default) d[m.key] = m.default
      else if (m.type === 'select' && m.variantlar?.length) d[m.key] = m.variantlar[0]
    }
    if (!d.davolovchi) d.davolovchi = shifokorIsmi
    return d
  }, [tuzilma, shifokorIsmi])

  const korinishBloklar = useMemo(() => {
    const shablon = shaxsiyShablonga({ id: String(id), kasallik, tuzilma })
    const h = shablon.hujjatlar[Math.min(korinishIndex, shablon.hujjatlar.length - 1)]
    return h ? h.render(namunaData, { fio: 'ABDULLAYEV ABDULLA' }, shifokorIsmi) : []
  }, [id, kasallik, tuzilma, korinishIndex, namunaData, shifokorIsmi])

  const orqaga = (
    <button onClick={() => router.push('/doctor/shablonlarim')} className="btn-animated soft-press" style={{
      background: 'var(--surface-2)', color: 'var(--ink-soft)', border: '1px solid var(--line)', borderRadius: '999px',
      padding: '8px 16px', cursor: 'pointer', fontSize: '13.5px', fontWeight: 600,
    }}>
      ← Shablonlarim
    </button>
  )

  if (loading) return (
    <AppShell title="Shablon" actions={orqaga}><div className="px-8 py-8"><p style={{ color: 'var(--muted)' }}>Yuklanmoqda...</p></div></AppShell>
  )

  return (
    <AppShell title={`Shablon — ${kasallik}`} actions={orqaga}>
      <div className="fade-in px-4 py-5 sm:px-8" style={{ display: 'flex', gap: '18px', alignItems: 'start', flexWrap: 'wrap' }}>
        {/* CHAP — tahrirlagich */}
        <div style={{ flex: '1 1 460px', minWidth: '340px', maxWidth: '620px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'end', marginBottom: '14px' }}>
            <div style={{ flex: 1 }}>
              <label style={lbl}>Kasallik nomi</label>
              <input style={input} value={kasallik} onChange={(e) => { setKasallik(e.target.value); setSaqlandi(false) }} />
            </div>
            <button onClick={saqla} disabled={saving} className="btn-animated soft-press" style={{
              background: saqlandi ? 'var(--good)' : 'var(--accent)', color: 'white', border: 'none', borderRadius: '999px',
              padding: '9px 20px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap',
            }}>
              {saving ? 'Saqlanmoqda...' : saqlandi ? '✓ Saqlandi' : 'Saqlash'}
            </button>
          </div>

          {/* Tab: Maydonlar / Hujjatlar */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
            {([['maydonlar', '🧩 Maydonlar'], ['hujjatlar', '📄 Hujjat matnlari']] as const).map(([v, nom]) => (
              <button key={v} onClick={() => setTab(v)} className="btn-animated" style={{
                border: 'none', borderRadius: '999px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                background: tab === v ? 'var(--accent)' : 'var(--surface-2)', color: tab === v ? 'white' : 'var(--ink-soft)',
              }}>{nom}</button>
            ))}
          </div>

          {tab === 'maydonlar' ? (
            <MaydonlarEditor tuzilma={tuzilma} ozgartir={ozgartir} />
          ) : (
            <HujjatlarEditor
              tuzilma={tuzilma} ozgartir={ozgartir}
              faolHujjat={faolHujjat} setFaolHujjat={setFaolHujjat}
              kalitlar={kalitlar}
            />
          )}
        </div>

        {/* O'NG — jonli ko'rinish */}
        <div style={{ flex: '1 1 420px', minWidth: '320px', position: 'sticky', top: '80px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', color: 'var(--muted)', fontWeight: 700 }}>Jonli ko&apos;rinish (namunaviy ma&apos;lumot bilan)</h3>
          </div>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
            {tuzilma.hujjatlar.map((h, i) => (
              <button key={h.id + i} onClick={() => setKorinishIndex(i)} className="btn-animated" style={{
                border: 'none', borderRadius: '999px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                background: i === korinishIndex ? 'var(--accent)' : 'var(--surface-2)', color: i === korinishIndex ? 'white' : 'var(--ink-soft)',
              }}>{h.nom || `${i + 1}-hujjat`}</button>
            ))}
          </div>
          <HujjatVaraq bloklar={korinishBloklar} />
        </div>
      </div>
    </AppShell>
  )
}

// ---------- Maydonlar tahrirlagichi ----------
function MaydonlarEditor({ tuzilma, ozgartir }: {
  tuzilma: ShablonTuzilma
  ozgartir: (fn: (t: ShablonTuzilma) => ShablonTuzilma) => void
}) {
  const guruhYangila = (gi: number, fn: (g: MaydonGuruh) => void) =>
    ozgartir((t) => { fn(t.guruhlar[gi]); return t })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {tuzilma.guruhlar.map((g, gi) => (
        <div key={gi} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '14px 16px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
            <input
              style={{ ...input, fontWeight: 700 }}
              value={g.nom}
              onChange={(e) => guruhYangila(gi, (gg) => { gg.nom = e.target.value })}
            />
            <button title="Guruhni o'chirish" onClick={() => ozgartir((t) => { t.guruhlar.splice(gi, 1); return t })}
              style={{ ...kichikTugma, color: 'var(--danger)' }}>🗑️</button>
          </div>

          {g.maydonlar.map((m, mi) => (
            <div key={mi} style={{ border: '1px dashed var(--line)', borderRadius: '10px', padding: '10px 12px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ flex: '2 1 160px' }}>
                  <label style={lbl}>Nomi (label)</label>
                  <input style={input} value={m.label} onChange={(e) => guruhYangila(gi, (gg) => {
                    const eski = gg.maydonlar[mi]
                    const avtoKalit = eski.key === kalitYasa(eski.label)
                    eski.label = e.target.value
                    if (avtoKalit) eski.key = kalitYasa(e.target.value)
                  })} />
                </div>
                <div style={{ flex: '1 1 120px' }}>
                  <label style={lbl}>Kalit (matnda {'{{kalit}}'})</label>
                  <input style={{ ...input, fontFamily: 'monospace', fontSize: '12px' }} value={m.key}
                    onChange={(e) => guruhYangila(gi, (gg) => { gg.maydonlar[mi].key = e.target.value.replace(/\s/g, '_') })} />
                </div>
                <div style={{ flex: '1 1 130px' }}>
                  <label style={lbl}>Turi</label>
                  <select style={{ ...input, cursor: 'pointer' }} value={m.type}
                    onChange={(e) => guruhYangila(gi, (gg) => { gg.maydonlar[mi].type = e.target.value as Maydon['type'] })}>
                    {MAYDON_TURLARI.map((t) => <option key={t.v} value={t.v}>{t.nom}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'end', paddingBottom: '2px' }}>
                  <button title="Maydonni o'chirish" onClick={() => guruhYangila(gi, (gg) => { gg.maydonlar.splice(mi, 1) })}
                    style={{ ...kichikTugma, color: 'var(--danger)' }}>🗑️</button>
                </div>
                {(m.type === 'select' || m.type === 'checklist') && (
                  <div style={{ flex: '1 1 100%' }}>
                    <label style={lbl}>Variantlar (har biri yangi qatordan)</label>
                    <textarea style={{ ...input, minHeight: '56px' }} value={(m.variantlar ?? []).join('\n')}
                      onChange={(e) => guruhYangila(gi, (gg) => {
                        gg.maydonlar[mi].variantlar = e.target.value.split('\n').map((s) => s.trim()).filter(Boolean)
                      })} />
                  </div>
                )}
                {m.type !== 'checklist' && (
                  <div style={{ flex: '1 1 100%' }}>
                    <label style={lbl}>Standart qiymat (ixtiyoriy)</label>
                    {m.type === 'textarea' ? (
                      <textarea style={{ ...input, minHeight: '56px' }} value={m.default ?? ''}
                        onChange={(e) => guruhYangila(gi, (gg) => { gg.maydonlar[mi].default = e.target.value })} />
                    ) : (
                      <input style={input} value={m.default ?? ''}
                        onChange={(e) => guruhYangila(gi, (gg) => { gg.maydonlar[mi].default = e.target.value })} />
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          <button onClick={() => guruhYangila(gi, (gg) => {
            gg.maydonlar.push({ key: `maydon_${gg.maydonlar.length + 1}`, label: 'Yangi maydon', type: 'text' })
          })} className="btn-animated" style={{ ...kichikTugma, color: 'var(--accent)', borderStyle: 'dashed', borderColor: 'var(--accent)' }}>
            + Maydon qo&apos;shish
          </button>
        </div>
      ))}

      <button onClick={() => ozgartir((t) => { t.guruhlar.push({ nom: 'Yangi guruh', maydonlar: [] }); return t })}
        className="btn-animated soft-press" style={{
          background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px dashed var(--accent)', borderRadius: '10px',
          padding: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
        }}>
        + Yangi guruh qo&apos;shish
      </button>
    </div>
  )
}

// ---------- Hujjat matnlari tahrirlagichi ----------
function HujjatlarEditor({ tuzilma, ozgartir, faolHujjat, setFaolHujjat, kalitlar }: {
  tuzilma: ShablonTuzilma
  ozgartir: (fn: (t: ShablonTuzilma) => ShablonTuzilma) => void
  faolHujjat: number
  setFaolHujjat: (i: number) => void
  kalitlar: string[]
}) {
  const h: DeklarativHujjat | undefined = tuzilma.hujjatlar[faolHujjat]

  const hujjatYangila = (fn: (h: DeklarativHujjat) => void) =>
    ozgartir((t) => { fn(t.hujjatlar[faolHujjat]); return t })

  const checklistKalitlar = tuzilma.guruhlar.flatMap((g) => g.maydonlar.filter((m) => m.type === 'checklist').map((m) => m.key))

  return (
    <div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
        {tuzilma.hujjatlar.map((hh, i) => (
          <button key={hh.id + i} onClick={() => setFaolHujjat(i)} className="btn-animated" style={{
            border: 'none', borderRadius: '999px', padding: '7px 14px', cursor: 'pointer', fontSize: '12.5px', fontWeight: 600,
            background: i === faolHujjat ? 'var(--accent)' : 'var(--surface-2)', color: i === faolHujjat ? 'white' : 'var(--ink-soft)',
          }}>{i + 1}. {hh.nom || 'Nomsiz'}</button>
        ))}
        <button onClick={() => {
          ozgartir((t) => {
            t.hujjatlar.push({ id: `hujjat_${Date.now()}`, nom: 'Yangi hujjat', bloklar: [] })
            return t
          })
          setFaolHujjat(tuzilma.hujjatlar.length)
        }} className="btn-animated" style={{ ...kichikTugma, color: 'var(--accent)', borderStyle: 'dashed', borderColor: 'var(--accent)', borderRadius: '999px' }}>
          + Hujjat
        </button>
      </div>

      {!h ? (
        <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Hujjat qo&apos;shing.</p>
      ) : (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '14px 16px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
            <input style={{ ...input, fontWeight: 700 }} value={h.nom}
              onChange={(e) => hujjatYangila((hh) => { hh.nom = e.target.value })} />
            <button title="Hujjatni o'chirish" onClick={() => {
              ozgartir((t) => { t.hujjatlar.splice(faolHujjat, 1); return t })
              setFaolHujjat(Math.max(0, faolHujjat - 1))
            }} style={{ ...kichikTugma, color: 'var(--danger)' }}>🗑️</button>
          </div>

          <p style={{ fontSize: '11.5px', color: 'var(--muted)', margin: '0 0 10px' }}>
            Matnda o&apos;rinbosarlar: {kalitlar.slice(0, 8).map((k) => (
              <code key={k} style={{ background: 'var(--surface-2)', borderRadius: '4px', padding: '1px 5px', marginRight: '4px', fontSize: '11px' }}>{`{{${k}}}`}</code>
            ))}
            <code style={{ background: 'var(--surface-2)', borderRadius: '4px', padding: '1px 5px', marginRight: '4px', fontSize: '11px' }}>{'{{bemor.fio}}'}</code>
            <code style={{ background: 'var(--surface-2)', borderRadius: '4px', padding: '1px 5px', fontSize: '11px' }}>{'{{shifokor}}'}</code>
          </p>

          {(h.bloklar ?? []).map((b, bi) => (
            <div key={bi} style={{ border: '1px dashed var(--line)', borderRadius: '10px', padding: '10px 12px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: b.tur === 'bosh' ? 0 : '8px' }}>
                <select style={{ ...input, width: 'auto', cursor: 'pointer', fontSize: '12px' }} value={b.tur}
                  onChange={(e) => hujjatYangila((hh) => { hh.bloklar[bi] = boshBlok(e.target.value as DeklarativBlok['tur']) })}>
                  {BLOK_TURLARI.map((t) => <option key={t.v} value={t.v}>{t.nom}</option>)}
                </select>
                <span style={{ flex: 1 }} />
                <button title="Yuqoriga" disabled={bi === 0} onClick={() => hujjatYangila((hh) => {
                  const [x] = hh.bloklar.splice(bi, 1); hh.bloklar.splice(bi - 1, 0, x)
                })} style={{ ...kichikTugma, opacity: bi === 0 ? 0.4 : 1 }}>↑</button>
                <button title="Pastga" disabled={bi === h.bloklar.length - 1} onClick={() => hujjatYangila((hh) => {
                  const [x] = hh.bloklar.splice(bi, 1); hh.bloklar.splice(bi + 1, 0, x)
                })} style={{ ...kichikTugma, opacity: bi === h.bloklar.length - 1 ? 0.4 : 1 }}>↓</button>
                <button title="Blokni o'chirish" onClick={() => hujjatYangila((hh) => { hh.bloklar.splice(bi, 1) })}
                  style={{ ...kichikTugma, color: 'var(--danger)' }}>🗑️</button>
              </div>

              {(b.tur === 'sarlavha' || b.tur === 'matn') && (
                <textarea style={{ ...input, minHeight: b.tur === 'matn' ? '64px' : '36px' }} value={b.matn}
                  placeholder="Matn... ({{kalit}} o'rinbosarlar ishlaydi)"
                  onChange={(e) => hujjatYangila((hh) => { (hh.bloklar[bi] as any).matn = e.target.value })} />
              )}
              {b.tur === 'band' && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <input style={{ ...input, flex: '1 1 140px' }} value={b.etiket} placeholder="Etiket (masalan: Ташхис)"
                    onChange={(e) => hujjatYangila((hh) => { (hh.bloklar[bi] as any).etiket = e.target.value })} />
                  <textarea style={{ ...input, flex: '2 1 220px', minHeight: '36px' }} value={b.matn} placeholder="Matn"
                    onChange={(e) => hujjatYangila((hh) => { (hh.bloklar[bi] as any).matn = e.target.value })} />
                </div>
              )}
              {(b.tur === 'qator' || b.tur === 'imzo') && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input style={input} value={b.chap} placeholder="Chap (yorliq)"
                    onChange={(e) => hujjatYangila((hh) => { (hh.bloklar[bi] as any).chap = e.target.value })} />
                  <input style={input} value={b.ong} placeholder="O'ng (qiymat)"
                    onChange={(e) => hujjatYangila((hh) => { (hh.bloklar[bi] as any).ong = e.target.value })} />
                </div>
              )}
              {b.tur === 'royxat' && (
                <div>
                  <label style={lbl}>Qaysi belgilash maydonidan ro&apos;yxat chiqadi</label>
                  <select style={{ ...input, cursor: 'pointer' }} value={b.kalit}
                    onChange={(e) => hujjatYangila((hh) => { (hh.bloklar[bi] as any).kalit = e.target.value })}>
                    {checklistKalitlar.length === 0 && <option value="">— checklist maydon yo&apos;q —</option>}
                    {checklistKalitlar.map((k) => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
              )}
            </div>
          ))}

          <button onClick={() => hujjatYangila((hh) => { hh.bloklar.push(boshBlok('matn')) })}
            className="btn-animated" style={{ ...kichikTugma, color: 'var(--accent)', borderStyle: 'dashed', borderColor: 'var(--accent)' }}>
            + Blok qo&apos;shish
          </button>
        </div>
      )}
    </div>
  )
}
