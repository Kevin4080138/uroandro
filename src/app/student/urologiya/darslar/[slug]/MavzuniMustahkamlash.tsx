'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Layers, ClipboardCheck, ChevronRight, CheckCircle2, XCircle, Lightbulb, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'

// Dars ichidagi «Mavzuni mustahkamlash» — bitta bo'lim, guruhlangan (ketma-ket
// 11 qadam EMAS). EASY: flashcard (Eslab qolish) + amaliy test (Qo'llash).
// Bank bo'sh bo'lsa bo'lim/karta ko'rsatilmaydi.

type Flashcard = { old: string; yangi: string; kategoriya: string | null }
type Savol = { id: string; savol: string; variantlar: string[] }
type AmaliyNatija = { togri: number; jami: number; natijalar: { savol_id: string; togri: number; izoh: string | null }[] }

export function MavzuniMustahkamlash({ darsId, rang }: { darsId: string; rang: string }) {
  const supabase = createClient()
  const [flashcardlar, setFlashcardlar] = useState<Flashcard[]>([])
  const [amaliy, setAmaliy] = useState<Savol[] | null>(null)   // null — yo'q/409
  const [yuklandi, setYuklandi] = useState(false)
  const [ochiq, setOchiq] = useState(false)

  useEffect(() => {
    const load = async () => {
      const [fRes, aRes] = await Promise.all([
        supabase.from('kurs_flashcardlar').select('old, yangi, kategoriya').eq('dars_id', darsId).order('sort_order', { ascending: true }),
        fetch('/api/kurs/amaliy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amal: 'boshla', dars_id: darsId }) }),
      ])
      setFlashcardlar((fRes.data ?? []) as Flashcard[])
      if (aRes.ok) { const j = await aRes.json(); setAmaliy((j.savollar ?? []) as Savol[]) }
      else setAmaliy(null)
      setYuklandi(true)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [darsId])

  const bor = flashcardlar.length > 0 || (amaliy && amaliy.length > 0)
  if (!yuklandi || !bor) return null

  return (
    <div style={{ marginTop: '30px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px' }}>Mavzuni mustahkamlash</h2>
      <p style={{ margin: '0 0 14px', color: 'var(--muted)', fontSize: '13px' }}>Nazariyani mustahkamlang — bir joyda, ketma-ketlik shart emas.</p>

      <button onClick={() => setOchiq((p) => !p)} aria-expanded={ochiq}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', background: ochiq ? rang + '12' : rang, color: ochiq ? 'var(--ink)' : '#fff', border: ochiq ? `1px solid ${rang}44` : 'none', borderRadius: '15px', padding: '15px 16px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', boxShadow: ochiq ? 'none' : `0 8px 20px -10px ${rang}88` }}>
        <span style={{ width: '38px', height: '38px', borderRadius: '11px', flexShrink: 0, background: ochiq ? rang + '22' : 'rgba(255,255,255,0.2)', color: ochiq ? rang : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={20} strokeWidth={2} />
        </span>
        <span style={{ flex: 1 }}>
          Mustahkamlash bo‘limi
          <small style={{ display: 'block', opacity: 0.82, fontSize: '12px', fontWeight: 600, color: 'inherit' }}>
            {[flashcardlar.length > 0 ? 'Flashcard' : null, amaliy && amaliy.length > 0 ? 'Amaliy test' : null].filter(Boolean).join(' · ')}
          </small>
        </span>
        <ChevronRight size={18} strokeWidth={2.2} style={{ flexShrink: 0, transform: ochiq ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }} />
      </button>

      {ochiq && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginTop: '14px' }}>
          {flashcardlar.length > 0 && (
            <Guruh nom="Eslab qolish">
              <FlashcardDeck kartalar={flashcardlar} rang={rang} />
            </Guruh>
          )}
          {amaliy && amaliy.length > 0 && (
            <Guruh nom="Qo'llash">
              <AmaliyTest darsId={darsId} savollar={amaliy} rang={rang} />
            </Guruh>
          )}
        </div>
      )}
    </div>
  )
}

function Guruh({ nom, children }: { nom: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ margin: '2px 0 8px', fontSize: '11.5px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{nom}</p>
      {children}
    </div>
  )
}

// ── Flashcard ──
function FlashcardDeck({ kartalar, rang }: { kartalar: Flashcard[]; rang: string }) {
  const [i, setI] = useState(0)
  const [flip, setFlip] = useState(false)
  const k = kartalar[i]
  const oxirgi = i >= kartalar.length - 1

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '15px', padding: '15px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '11px', fontWeight: 800, color: rang, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '11px' }}>
        <Layers size={14} strokeWidth={2} /> Flashcard · {i + 1}/{kartalar.length}
      </div>
      <div role="button" tabIndex={0} onClick={() => setFlip((p) => !p)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlip((p) => !p) } }}
        aria-label={flip ? 'Javobni yashirish' : 'Javobni ko‘rsatish'}
        style={{ minHeight: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '9px', textAlign: 'center', cursor: 'pointer', background: flip ? rang + '0e' : 'var(--surface-2)', border: `1.5px solid ${flip ? rang + '55' : 'var(--line)'}`, borderRadius: '13px', padding: '20px 16px' }}>
        {k.kategoriya && <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k.kategoriya}</span>}
        <p style={{ margin: 0, fontSize: '16px', fontWeight: 800, lineHeight: 1.4 }}>{k.old}</p>
        {flip ? <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.55 }}>{k.yangi}</p>
          : <span style={{ fontSize: '12px', color: rang, fontWeight: 700 }}>Javobni ko‘rish uchun bosing</span>}
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
        <button onClick={() => { setFlip(false); setI((p) => Math.max(p - 1, 0)) }} disabled={i === 0} style={navBtn(i === 0, false, rang)}>
          <ArrowLeft size={15} strokeWidth={2.2} /> Oldingi
        </button>
        <button onClick={() => { setFlip(false); setI((p) => Math.min(p + 1, kartalar.length - 1)) }} disabled={oxirgi} style={navBtn(oxirgi, true, rang)}>
          Keyingi <ArrowRight size={15} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  )
}

function navBtn(disabled: boolean, primary: boolean, rang: string): React.CSSProperties {
  return {
    flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
    background: disabled ? 'var(--surface-2)' : primary ? rang : 'var(--surface-2)',
    color: disabled ? 'var(--muted)' : primary ? '#fff' : 'var(--ink)',
    border: primary && !disabled ? 'none' : '1px solid var(--line)', borderRadius: '11px', padding: '11px',
    fontSize: '13.5px', fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1,
  }
}

// ── Amaliy test (formativ) ──
function AmaliyTest({ darsId, savollar, rang }: { darsId: string; savollar: Savol[]; rang: string }) {
  const [javoblar, setJavoblar] = useState<Record<string, number>>({})
  const [natija, setNatija] = useState<AmaliyNatija | null>(null)
  const [yuborilmoqda, setYuborilmoqda] = useState(false)
  const [xato, setXato] = useState('')

  const hamma = savollar.every((s) => javoblar[s.id] !== undefined)
  const togriIndeks = (id: string) => natija?.natijalar.find((n) => n.savol_id === id)?.togri
  const izoh = (id: string) => natija?.natijalar.find((n) => n.savol_id === id)?.izoh

  const tekshir = async () => {
    setYuborilmoqda(true); setXato('')
    try {
      const res = await fetch('/api/kurs/amaliy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amal: 'yakunla', dars_id: darsId, javoblar: savollar.map((s) => ({ savol_id: s.id, tanlov: javoblar[s.id] })) }) })
      if (!res.ok) { setXato('Tekshirilmadi — qayta urining.'); setYuborilmoqda(false); return }
      setNatija((await res.json()) as AmaliyNatija)
    } catch { setXato('Tekshirilmadi — qayta urining.') }
    setYuborilmoqda(false)
  }

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '15px', padding: '15px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '11px', fontWeight: 800, color: rang, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '13px' }}>
        <ClipboardCheck size={14} strokeWidth={2} /> Amaliy test · {savollar.length} savol
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {savollar.map((q, qi) => {
          const togri = togriIndeks(q.id)
          return (
            <div key={q.id}>
              <p style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 700, lineHeight: 1.4 }}>{qi + 1}. {q.savol}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {q.variantlar.map((v, vi) => {
                  const tanlangan = javoblar[q.id] === vi
                  const buTogri = natija != null && togri === vi
                  let bg = 'var(--surface-2)', bd = 'var(--line)', col = 'var(--ink-soft)'
                  if (natija != null) {
                    if (buTogri) { bg = 'rgba(5,150,105,0.12)'; bd = 'var(--good)'; col = 'var(--good)' }
                    else if (tanlangan) { bg = 'rgba(220,38,38,0.10)'; bd = 'var(--danger)'; col = 'var(--danger)' }
                  } else if (tanlangan) { bg = rang + '16'; bd = rang; col = rang }
                  return (
                    <button key={vi} disabled={natija != null} aria-pressed={tanlangan} onClick={() => setJavoblar((p) => ({ ...p, [q.id]: vi }))}
                      style={{ display: 'flex', alignItems: 'center', gap: '9px', textAlign: 'left', width: '100%', background: bg, border: `1.5px solid ${bd}`, color: col, borderRadius: '10px', padding: '10px 12px', fontSize: '13px', fontWeight: 600, cursor: natija != null ? 'default' : 'pointer' }}>
                      {natija != null && buTogri && <CheckCircle2 size={14} strokeWidth={2.4} style={{ flexShrink: 0 }} />}
                      {natija != null && tanlangan && !buTogri && <XCircle size={14} strokeWidth={2.4} style={{ flexShrink: 0 }} />}
                      <span>{v}</span>
                    </button>
                  )
                })}
              </div>
              {natija != null && izoh(q.id) && (
                <p style={{ margin: '8px 0 0', fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.5, background: 'var(--surface-2)', borderRadius: '9px', padding: '9px 11px', display: 'flex', gap: '7px' }}>
                  <Lightbulb size={13} strokeWidth={2} style={{ flexShrink: 0, marginTop: '1px', color: rang }} />
                  <span>{izoh(q.id)}</span>
                </p>
              )}
            </div>
          )
        })}
      </div>

      {xato && <p role="alert" style={{ margin: '12px 0 0', fontSize: '12.5px', color: 'var(--danger)', fontWeight: 600 }}>{xato}</p>}

      {natija == null ? (
        <button onClick={tekshir} disabled={!hamma || yuborilmoqda}
          style={{ marginTop: '14px', width: '100%', background: rang, color: '#fff', border: 'none', borderRadius: '11px', padding: '13px', fontSize: '14.5px', fontWeight: 700, cursor: !hamma || yuborilmoqda ? 'not-allowed' : 'pointer', opacity: !hamma || yuborilmoqda ? 0.6 : 1 }}>
          {yuborilmoqda ? 'Tekshirilmoqda…' : `Tekshirish ${hamma ? '' : `(${Object.keys(javoblar).length}/${savollar.length})`}`}
        </button>
      ) : (
        <div style={{ marginTop: '14px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 10px', fontSize: '15px', fontWeight: 800, color: natija.togri === natija.jami ? 'var(--good)' : rang }}>{natija.togri} / {natija.jami} to‘g‘ri</p>
          <button onClick={() => { setJavoblar({}); setNatija(null) }}
            style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: '10px', padding: '9px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Qayta ishlash</button>
        </div>
      )}
    </div>
  )
}
