'use client'

// Klinik "case-runner" bo'limlari: klinik holatlar, interaktiv case,
// xatolar tahlili, vaziyatli masala. Hammasi menyu → qadam → yakun oqimiga ega.

import { useState } from 'react'
import { type KlinikHolat } from '@/lib/talim/klinikHolatlar'
import { type InteraktivCase } from '@/lib/talim/interaktivCaselar'
import { type XatoTahlil } from '@/lib/talim/xatolarTahlili'
import { type VaziyatliMasala } from '@/lib/talim/vaziyatliMasalalar'
import { BoshUlash } from './BoshUlash'

export function KlinikHolatlarBolimi({ holatlar }: { holatlar: KlinikHolat[] }) {
  const [joriy, setJoriy] = useState<number | 'menu' | 'yakun'>('menu')
  const [qadam, setQadam] = useState(0)
  const [tanlangan, setTanlangan] = useState<number | null>(null)
  const [tekshirildi, setTekshirildi] = useState(false)
  const [togrilar, setTogrilar] = useState(0)
  const [yakunlangan, setYakunlangan] = useState<Set<number>>(new Set())

  const holat = typeof joriy === 'number' ? holatlar[joriy] : null
  const joriyQadam = holat?.qadamlar[qadam]

  const boshla = (i: number) => {
    setJoriy(i); setQadam(0); setTanlangan(null); setTekshirildi(false); setTogrilar(0)
  }

  const tekshir = () => {
    if (tanlangan === null) return
    setTekshirildi(true)
    if (tanlangan === joriyQadam?.togri) setTogrilar((t) => t + 1)
  }

  const keyingi = () => {
    if (!holat) return
    if (qadam < holat.qadamlar.length - 1) {
      setQadam((q) => q + 1); setTanlangan(null); setTekshirildi(false)
    } else {
      setYakunlangan((prev) => new Set([...prev, joriy as number]))
      setJoriy('yakun')
    }
  }

  if (joriy === 'yakun') {
    return (
      <div className="rise" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '52px', marginBottom: '12px' }}>
          {togrilar === holat?.qadamlar.length ? '🎉' : '👍'}
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 8px' }}>
          {togrilar}/{holat?.qadamlar.length} to&apos;g&apos;ri
        </h3>
        {holat?.xulosa && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '14px 18px', margin: '16px 0', textAlign: 'left' }}>
            <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase' }}>Klinik xulosa</div>
            <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{holat.xulosa}</p>
          </div>
        )}
        <button onClick={() => setJoriy('menu')} style={{
          background: 'var(--accent)', color: 'white', border: 'none',
          borderRadius: '12px', padding: '11px 22px', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
        }}>
          Ro&apos;yxatga qaytish
        </button>
      </div>
    )
  }

  if (joriy === 'menu' && holatlar.length === 0) {
    return <BoshUlash matn="Klinik holatlar tez orada qo'shiladi." />
  }

  if (joriy === 'menu') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {holatlar.map((h, i) => (
          <div key={h.id} onClick={() => boshla(i)} className="rise lift" style={{
            background: 'var(--surface)', border: `1.5px solid ${yakunlangan.has(i) ? 'var(--good)' : 'var(--line)'}`,
            borderRadius: '14px', padding: '18px 20px', cursor: 'pointer', animationDelay: `${i * 0.07}s`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '24px' }}>{h.emoji}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>{h.sarlavha}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>{h.qadamlar.length} ta savol</div>
                </div>
              </div>
              {yakunlangan.has(i) && <span style={{ fontSize: '18px' }}>✅</span>}
            </div>
            <div style={{ marginTop: '10px', fontSize: '13px', color: 'var(--ink-soft)', background: 'var(--surface-2)', borderRadius: '8px', padding: '8px 12px', lineHeight: 1.5 }}>
              🧑 {h.bemor}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!holat || !joriyQadam) return null

  const progress = (qadam / holat.qadamlar.length) * 100

  return (
    <>
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--muted)', marginBottom: '5px' }}>
          <span>{holat.sarlavha}</span>
          <span>{qadam + 1} / {holat.qadamlar.length}</span>
        </div>
        <div style={{ height: '5px', borderRadius: '999px', background: 'var(--surface-2)', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: '999px', width: `${progress}%`, background: 'var(--accent)', transition: 'width .3s' }} />
        </div>
      </div>

      {qadam === 0 && (
        <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '18px 20px', marginBottom: '14px' }}>
          <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>📋 Bemor historiyasi</div>
          <p style={{ margin: '0 0 6px', fontSize: '13.5px', lineHeight: 1.6 }}><strong>Bemor:</strong> {holat.bemor}</p>
          <p style={{ margin: '0 0 6px', fontSize: '13.5px', lineHeight: 1.6 }}><strong>Shikoyat:</strong> {holat.shikoyat}</p>
          <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.6 }}><strong>Ko&apos;rik:</strong> {holat.tekshiruv}</p>
        </div>
      )}

      <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '18px 20px', marginBottom: '12px' }}>
        <div style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 700, marginBottom: '8px' }}>Savol {qadam + 1}</div>
        <p style={{ fontSize: '14px', fontWeight: 600, margin: 0, lineHeight: 1.5 }}>{joriyQadam.savol}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '14px' }}>
        {joriyQadam.variantlar.map((v, i) => {
          const togri = i === joriyQadam.togri
          const tanlandi = tanlangan === i
          let bg = 'var(--surface-2)', border = 'var(--line)'
          if (tekshirildi) {
            if (togri) { bg = '#16a34a18'; border = '#16a34a' }
            else if (tanlandi) { bg = '#dc262618'; border = '#dc2626' }
          } else if (tanlandi) { bg = 'var(--accent-soft)'; border = 'var(--accent)' }
          return (
            <button key={i} onClick={() => !tekshirildi && setTanlangan(i)} style={{
              background: bg, border: `1.5px solid ${border}`, borderRadius: '10px',
              padding: '11px 14px', textAlign: 'left', cursor: tekshirildi ? 'default' : 'pointer',
              fontSize: '13.5px', color: 'var(--ink)', display: 'flex', gap: '8px', alignItems: 'center',
            }}>
              <span style={{ fontWeight: 700, color: tekshirildi && togri ? '#16a34a' : tekshirildi && tanlandi ? '#dc2626' : 'var(--muted)', minWidth: '16px' }}>
                {tekshirildi ? (togri ? '✓' : tanlandi ? '✗' : String.fromCharCode(65 + i)) : String.fromCharCode(65 + i)}
              </span>
              {v}
            </button>
          )
        })}
      </div>

      {tekshirildi && (
        <div className="rise" style={{
          background: tanlangan === joriyQadam.togri ? '#16a34a12' : '#dc262612',
          border: `1px solid ${tanlangan === joriyQadam.togri ? '#16a34a' : '#dc2626'}`,
          borderRadius: '10px', padding: '12px 14px', marginBottom: '12px',
        }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: tanlangan === joriyQadam.togri ? '#16a34a' : '#dc2626', marginBottom: '4px' }}>
            {tanlangan === joriyQadam.togri ? '✓ To\'g\'ri!' : '✗ Noto\'g\'ri'}
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{joriyQadam.izoh}</p>
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => setJoriy('menu')} style={{
          background: 'var(--surface-2)', color: 'var(--muted)', border: '1px solid var(--line)',
          borderRadius: '10px', padding: '11px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
        }}>← Ortga</button>
        {!tekshirildi ? (
          <button onClick={tekshir} disabled={tanlangan === null} style={{
            flex: 1, background: tanlangan !== null ? 'var(--accent)' : 'var(--surface-2)',
            color: tanlangan !== null ? 'white' : 'var(--muted)', border: 'none',
            borderRadius: '10px', padding: '11px', fontSize: '14px', fontWeight: 700, cursor: tanlangan !== null ? 'pointer' : 'not-allowed',
          }}>Tekshirish</button>
        ) : (
          <button onClick={keyingi} style={{
            flex: 1, background: 'var(--accent)', color: 'white', border: 'none',
            borderRadius: '10px', padding: '11px', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
          }}>{qadam < holat.qadamlar.length - 1 ? 'Keyingi →' : 'Yakunlash ✓'}</button>
        )}
      </div>
    </>
  )
}

const TUR_RANG: Record<string, string> = {
  anamnez:   '#16a34a',
  tekshiruv: '#2563eb',
  tahlil:    '#7c3aed',
  tashxis:   '#ea580c',
  davolash:  '#dc2626',
}

const TUR_NOMI: Record<string, string> = {
  anamnez:   'Anamnez',
  tekshiruv: "Ko'rik",
  tahlil:    'Tekshiruvlar',
  tashxis:   'Tashxis',
  davolash:  'Davolash',
}

export function InteraktivCaseBolimi({ caselar }: { caselar: InteraktivCase[] }) {
  const [joriy, setJoriy] = useState<number | 'menu' | 'yakun'>('menu')
  const [qadam, setQadam] = useState(0)
  const [tanlangan, setTanlangan] = useState<Set<number>>(new Set())
  const [tekshirildi, setTekshirildi] = useState(false)
  const [togrilar, setTogrilar] = useState(0)
  const [yakunlangan, setYakunlangan] = useState<Set<number>>(new Set())

  const ic = typeof joriy === 'number' ? caselar[joriy] : null
  const joriyQadam = ic?.qadamlar[qadam]

  const boshla = (i: number) => {
    setJoriy(i); setQadam(0); setTanlangan(new Set()); setTekshirildi(false); setTogrilar(0)
  }

  const tekshir = () => {
    if (tanlangan.size === 0 || !joriyQadam) return
    setTekshirildi(true)
    const togriIndekslar = joriyQadam.variantlar
      .map((v, i) => v.togri ? i : -1).filter((i) => i !== -1)
    const hammasi = togriIndekslar.every((i) => tanlangan.has(i)) &&
      [...tanlangan].every((i) => joriyQadam.variantlar[i]?.togri)
    if (hammasi) setTogrilar((t) => t + 1)
  }

  const keyingi = () => {
    if (!ic) return
    if (qadam < ic.qadamlar.length - 1) {
      setQadam((q) => q + 1); setTanlangan(new Set()); setTekshirildi(false)
    } else {
      setYakunlangan((prev) => new Set([...prev, joriy as number]))
      setJoriy('yakun')
    }
  }

  if (joriy === 'yakun') {
    return (
      <div className="rise" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '52px', marginBottom: '12px' }}>
          {togrilar === ic?.qadamlar.length ? '🏆' : togrilar >= (ic?.qadamlar.length ?? 0) / 2 ? '👍' : '📚'}
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 4px' }}>
          {togrilar}/{ic?.qadamlar.length} bosqich to&apos;g&apos;ri bajardingiz
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '0 0 16px' }}>
          {togrilar === ic?.qadamlar.length ? 'Ajoyib! Barcha klinik qarorlar to\'g\'ri.' : 'Xatolarni tahlil qilib, qayta urinib ko\'ring.'}
        </p>
        {ic?.xulosa && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '16px 18px', margin: '0 0 16px', textAlign: 'left' }}>
            <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>🎓 Klinik xulosa</div>
            <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>{ic.xulosa}</p>
          </div>
        )}
        <button onClick={() => setJoriy('menu')} style={{
          background: 'var(--accent)', color: 'white', border: 'none',
          borderRadius: '12px', padding: '11px 24px', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
        }}>
          Ro&apos;yxatga qaytish
        </button>
      </div>
    )
  }

  if (joriy === 'menu') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="rise" style={{
          background: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
          borderRadius: '16px', padding: '18px 20px', color: 'white', marginBottom: '4px',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 700, opacity: 0.8, marginBottom: '4px', textTransform: 'uppercase' }}>🧩 Interaktiv klinik case</div>
          <p style={{ margin: 0, fontSize: '13px', opacity: 0.9, lineHeight: 1.5 }}>
            Siz shifokor sifatida bemorni boshqarasiz. Har bir bosqichda eng to&apos;g&apos;ri klinik qarorlarni tanlang.
            Bir nechta to&apos;g&apos;ri javob bo&apos;lishi mumkin.
          </p>
        </div>
        {caselar.map((c, i) => (
          <div key={c.id} onClick={() => boshla(i)} className="rise lift" style={{
            background: 'var(--surface)', border: `1.5px solid ${yakunlangan.has(i) ? '#16a34a' : 'var(--line)'}`,
            borderRadius: '14px', padding: '18px 20px', cursor: 'pointer', animationDelay: `${i * 0.07}s`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flex: 1 }}>
                <span style={{ fontSize: '26px' }}>{c.emoji}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '2px' }}>{c.sarlavha}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{c.qadamlar.length} ta klinik bosqich</div>
                </div>
              </div>
              {yakunlangan.has(i) && <span style={{ fontSize: '18px' }}>✅</span>}
            </div>
            <div style={{ marginTop: '10px', fontSize: '13px', color: 'var(--ink-soft)', background: 'var(--surface-2)', borderRadius: '8px', padding: '10px 14px', lineHeight: 1.55 }}>
              {c.dastlabkiMalumot}
            </div>
            <div style={{ marginTop: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {c.qadamlar.map((q) => (
                <span key={q.tur} style={{
                  fontSize: '10.5px', fontWeight: 700, borderRadius: '999px', padding: '2px 9px',
                  color: TUR_RANG[q.tur] ?? '#555', background: (TUR_RANG[q.tur] ?? '#555') + '15',
                }}>
                  {TUR_NOMI[q.tur] ?? q.tur}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!ic || !joriyQadam) return null

  const progress = (qadam / ic.qadamlar.length) * 100
  const rang = TUR_RANG[joriyQadam.tur] ?? '#2563eb'
  const togriIndekslar = new Set(joriyQadam.variantlar.map((v, i) => v.togri ? i : -1).filter((i) => i !== -1))

  return (
    <>
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--muted)', marginBottom: '5px' }}>
          <span style={{ fontWeight: 700, color: rang }}>{joriyQadam.sarlavha}</span>
          <span>{qadam + 1} / {ic.qadamlar.length}</span>
        </div>
        <div style={{ height: '5px', borderRadius: '999px', background: 'var(--surface-2)', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: '999px', width: `${progress}%`, background: rang, transition: 'width .3s' }} />
        </div>
      </div>

      {qadam === 0 && (
        <div className="rise" style={{ background: 'linear-gradient(135deg, #1e3a5f11, #2563eb11)', border: '1px solid #2563eb33', borderRadius: '14px', padding: '16px 20px', marginBottom: '14px' }}>
          <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>🏥 Klinik vaziyat</div>
          <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.65, color: 'var(--ink)' }}>{ic.dastlabkiMalumot}</p>
        </div>
      )}

      <div className="rise" style={{ background: 'var(--surface)', border: `1px solid ${rang}33`, borderRadius: '14px', padding: '18px 20px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <span style={{ fontSize: '10.5px', fontWeight: 800, color: rang, background: rang + '15', borderRadius: '999px', padding: '3px 10px', textTransform: 'uppercase' }}>
            {TUR_NOMI[joriyQadam.tur] ?? joriyQadam.tur}
          </span>
          {!tekshirildi && (
            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>To&apos;g&apos;ri javoblar bir nechta bo&apos;lishi mumkin</span>
          )}
        </div>
        <p style={{ fontSize: '14px', fontWeight: 600, margin: 0, lineHeight: 1.5 }}>{joriyQadam.savol}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
        {joriyQadam.variantlar.map((v, i) => {
          const tanlanganMi = tanlangan.has(i)
          const togriMi = togriIndekslar.has(i)
          let bg = 'var(--surface)'
          let border = '1px solid var(--line)'
          let textColor = 'var(--ink)'
          if (tekshirildi) {
            if (togriMi) { bg = '#16a34a12'; border = '1.5px solid #16a34a'; }
            else if (tanlanganMi) { bg = '#dc262612'; border = '1.5px solid #dc2626'; textColor = '#dc2626'; }
          } else if (tanlanganMi) {
            bg = rang + '12'; border = `1.5px solid ${rang}`
          }
          return (
            <div
              key={i}
              onClick={() => {
                if (tekshirildi) return
                setTanlangan((prev) => {
                  const next = new Set(prev)
                  if (next.has(i)) next.delete(i)
                  else next.add(i)
                  return next
                })
              }}
              className={tekshirildi ? '' : 'soft-press'}
              style={{ background: bg, border, borderRadius: '12px', padding: '14px 16px', cursor: tekshirildi ? 'default' : 'pointer', transition: 'all .15s' }}
            >
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '6px', flexShrink: 0, marginTop: '1px',
                  background: tekshirildi ? (togriMi ? '#16a34a' : tanlanganMi ? '#dc2626' : 'var(--surface-2)') : (tanlanganMi ? rang : 'var(--surface-2)'),
                  border: tekshirildi ? 'none' : (tanlanganMi ? `2px solid ${rang}` : '2px solid var(--line)'),
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: 'white',
                }}>
                  {tekshirildi ? (togriMi ? '✓' : tanlanganMi ? '✗' : '') : (tanlanganMi ? '✓' : '')}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 4px', fontSize: '13.5px', color: textColor, lineHeight: 1.5 }}>{v.matn}</p>
                  {tekshirildi && (tanlanganMi || togriMi) && (
                    <p style={{ margin: 0, fontSize: '12px', color: togriMi ? '#16a34a' : '#dc2626', lineHeight: 1.5, fontStyle: 'italic' }}>
                      {v.izoh}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {!tekshirildi ? (
        <button
          onClick={tekshir}
          disabled={tanlangan.size === 0}
          style={{
            width: '100%', padding: '13px', borderRadius: '12px', border: 'none',
            background: tanlangan.size === 0 ? 'var(--surface-2)' : rang,
            color: tanlangan.size === 0 ? 'var(--muted)' : 'white',
            fontSize: '14px', fontWeight: 700, cursor: tanlangan.size === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          Tekshirish
        </button>
      ) : (
        <button onClick={keyingi} style={{
          width: '100%', padding: '13px', borderRadius: '12px', border: 'none',
          background: rang, color: 'white', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
        }}>
          {qadam < ic.qadamlar.length - 1 ? 'Keyingi bosqich →' : 'Yakunlash'}
        </button>
      )}

      <button onClick={() => { setJoriy('menu'); setQadam(0); setTanlangan(new Set()); setTekshirildi(false) }}
        style={{ width: '100%', marginTop: '8px', padding: '10px', borderRadius: '12px', border: '1px solid var(--line)', background: 'transparent', color: 'var(--muted)', fontSize: '13px', cursor: 'pointer' }}>
        ← Ro&apos;yxatga qaytish
      </button>
    </>
  )
}

export function XatolarTahlilyBolimi({ tahlillar }: { tahlillar: XatoTahlil[] }) {
  const [joriy, setJoriy] = useState<number | 'menu'>('menu')
  const [tanlangan, setTanlangan] = useState<number | null>(null)
  const [tekshirildi, setTekshirildi] = useState(false)
  const [yakunlangan, setYakunlangan] = useState<Set<number>>(new Set())

  const tahlil = typeof joriy === 'number' ? tahlillar[joriy] : null

  const boshla = (i: number) => {
    setJoriy(i); setTanlangan(null); setTekshirildi(false)
  }

  const tekshir = () => {
    if (tanlangan === null) return
    setTekshirildi(true)
    setYakunlangan((prev) => new Set([...prev, joriy as number]))
  }

  if (joriy === 'menu') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="rise" style={{
          background: 'linear-gradient(135deg, #7c1d1d, #dc2626)',
          borderRadius: '16px', padding: '18px 20px', color: 'white', marginBottom: '4px',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 700, opacity: 0.8, marginBottom: '4px', textTransform: 'uppercase' }}>🔍 Xatolar tahlili</div>
          <p style={{ margin: 0, fontSize: '13px', opacity: 0.9, lineHeight: 1.5 }}>
            Klinik amaliyotda tez-tez uchraydigan xatolarni ko&apos;rib chiqing. Har bir holatda xatoni toping va to&apos;g&apos;ri yo&apos;lni o&apos;rganing.
          </p>
        </div>
        {tahlillar.map((t, i) => (
          <div key={t.id} onClick={() => boshla(i)} className="rise lift" style={{
            background: 'var(--surface)', border: `1.5px solid ${yakunlangan.has(i) ? '#16a34a' : 'var(--line)'}`,
            borderRadius: '14px', padding: '18px 20px', cursor: 'pointer', animationDelay: `${i * 0.06}s`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flex: 1 }}>
                <span style={{ fontSize: '24px' }}>{t.emoji}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '2px' }}>{t.sarlavha}</div>
                  <div style={{ fontSize: '11.5px', color: '#dc2626', fontWeight: 600 }}>Xatoni toping</div>
                </div>
              </div>
              {yakunlangan.has(i) && <span style={{ fontSize: '18px' }}>✅</span>}
            </div>
            <div style={{ marginTop: '10px', fontSize: '13px', color: 'var(--ink-soft)', background: '#dc262608', border: '1px solid #dc262620', borderRadius: '8px', padding: '10px 14px', lineHeight: 1.55 }}>
              {t.vaziyat}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!tahlil) return null

  const togriIndex = tahlil.variantlar.findIndex((v) => v.togri)

  return (
    <>
      <button onClick={() => setJoriy('menu')} style={{
        background: 'transparent', border: 'none', color: 'var(--muted)', fontSize: '13px',
        cursor: 'pointer', padding: '0 0 12px', display: 'flex', alignItems: 'center', gap: '4px',
      }}>
        ← Ro&apos;yxatga qaytish
      </button>

      {/* Vaziyat */}
      <div className="rise" style={{ background: '#dc262608', border: '1.5px solid #dc262630', borderRadius: '14px', padding: '18px 20px', marginBottom: '14px' }}>
        <div style={{ fontSize: '11px', color: '#dc2626', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>⚠️ Klinik vaziyat</div>
        <p style={{ margin: '0 0 10px', fontSize: '13.5px', lineHeight: 1.65, color: 'var(--ink)' }}>{tahlil.vaziyat}</p>
        <div style={{ borderTop: '1px solid #dc262620', paddingTop: '10px' }}>
          <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, marginBottom: '4px' }}>NOTO&apos;G&apos;RI QAROR:</div>
          <p style={{ margin: 0, fontSize: '13px', color: '#dc2626', fontWeight: 600, lineHeight: 1.5 }}>{tahlil.notogriqaror}</p>
        </div>
      </div>

      {/* Savol */}
      <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '16px 20px', marginBottom: '12px' }}>
        <div style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 700, marginBottom: '6px' }}>🤔 Savol</div>
        <p style={{ fontSize: '14px', fontWeight: 600, margin: 0, lineHeight: 1.5 }}>{tahlil.savol}</p>
      </div>

      {/* Variantlar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
        {tahlil.variantlar.map((v, i) => {
          const tanlanganMi = tanlangan === i
          const togriMi = i === togriIndex
          let bg = 'var(--surface)'
          let border = '1px solid var(--line)'
          let textColor = 'var(--ink)'
          if (tekshirildi) {
            if (togriMi) { bg = '#16a34a12'; border = '1.5px solid #16a34a'; }
            else if (tanlanganMi) { bg = '#dc262612'; border = '1.5px solid #dc2626'; textColor = '#dc2626'; }
          } else if (tanlanganMi) {
            bg = '#dc262612'; border = '1.5px solid #dc2626'
          }
          return (
            <div key={i} onClick={() => { if (!tekshirildi) setTanlangan(i) }}
              className={tekshirildi ? '' : 'soft-press'}
              style={{ background: bg, border, borderRadius: '12px', padding: '14px 16px', cursor: tekshirildi ? 'default' : 'pointer', transition: 'all .15s' }}
            >
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, marginTop: '1px',
                  background: tekshirildi ? (togriMi ? '#16a34a' : tanlanganMi ? '#dc2626' : 'var(--surface-2)') : (tanlanganMi ? '#dc2626' : 'var(--surface-2)'),
                  border: !tekshirildi && !tanlanganMi ? '2px solid var(--line)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: 'white',
                }}>
                  {tekshirildi ? (togriMi ? '✓' : tanlanganMi ? '✗' : '') : (tanlanganMi ? '●' : '')}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 4px', fontSize: '13.5px', color: textColor, lineHeight: 1.5 }}>{v.matn}</p>
                  {tekshirildi && (tanlanganMi || togriMi) && (
                    <p style={{ margin: 0, fontSize: '12px', color: togriMi ? '#16a34a' : '#dc2626', lineHeight: 1.5, fontStyle: 'italic' }}>
                      {v.izoh}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {!tekshirildi ? (
        <button onClick={tekshir} disabled={tanlangan === null} style={{
          width: '100%', padding: '13px', borderRadius: '12px', border: 'none',
          background: tanlangan === null ? 'var(--surface-2)' : '#dc2626',
          color: tanlangan === null ? 'var(--muted)' : 'white',
          fontSize: '14px', fontWeight: 700, cursor: tanlangan === null ? 'not-allowed' : 'pointer',
        }}>
          Xatoni topish
        </button>
      ) : (
        <>
          {/* To'g'ri yo'l */}
          <div className="rise" style={{ background: '#16a34a12', border: '1.5px solid #16a34a40', borderRadius: '14px', padding: '16px 18px', marginBottom: '10px' }}>
            <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>✅ To&apos;g&apos;ri yo&apos;l</div>
            <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.65 }}>{tahlil.togriYol}</p>
          </div>
          <button onClick={() => setJoriy('menu')} style={{
            width: '100%', padding: '13px', borderRadius: '12px', border: 'none',
            background: '#16a34a', color: 'white', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
          }}>
            Keyingi holat →
          </button>
        </>
      )}
    </>
  )
}

export function VaziyatliMasalaBolimi({ masalalar }: { masalalar: VaziyatliMasala[] }) {
  const [joriy, setJoriy] = useState<number | 'menu'>('menu')
  const [qadam, setQadam] = useState(0)
  const [tanlangan, setTanlangan] = useState<number | null>(null)
  const [tekshirildi, setTekshirildi] = useState(false)
  const [yakunlangan, setYakunlangan] = useState<Set<number>>(new Set())

  const masala = typeof joriy === 'number' ? masalalar[joriy] : null
  const joriyS = masala?.savollar[qadam]

  const boshla = (i: number) => {
    setJoriy(i); setQadam(0); setTanlangan(null); setTekshirildi(false)
  }

  const tekshir = () => {
    if (tanlangan === null || !joriyS) return
    setTekshirildi(true)
  }

  const keyingi = () => {
    if (!masala) return
    if (qadam < masala.savollar.length - 1) {
      setQadam((q) => q + 1); setTanlangan(null); setTekshirildi(false)
    } else {
      setYakunlangan((prev) => new Set([...prev, joriy as number]))
      setJoriy('menu')
    }
  }

  if (joriy === 'menu') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="rise" style={{
          background: 'linear-gradient(135deg, #1e3a8a, #7c3aed)',
          borderRadius: '16px', padding: '18px 20px', color: 'white', marginBottom: '4px',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 700, opacity: 0.8, marginBottom: '4px', textTransform: 'uppercase' }}>📋 Vaziyatli masala</div>
          <p style={{ margin: 0, fontSize: '13px', opacity: 0.9, lineHeight: 1.5 }}>
            Bir klinik vaziyatga asoslangan bir nechta bog&apos;liq savollarga javob bering. Har bir savol oldingi ma&apos;lumotlar asosida klinik fikrlashni talab qiladi.
          </p>
        </div>
        {masalalar.map((m, i) => (
          <div key={m.id} onClick={() => boshla(i)} className="rise lift" style={{
            background: 'var(--surface)', border: `1.5px solid ${yakunlangan.has(i) ? '#16a34a' : 'var(--line)'}`,
            borderRadius: '14px', padding: '18px 20px', cursor: 'pointer', animationDelay: `${i * 0.07}s`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flex: 1 }}>
                <span style={{ fontSize: '26px' }}>{m.emoji}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '2px' }}>{m.sarlavha}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{m.savollar.length} ta savol • Bir vaziyat</div>
                </div>
              </div>
              {yakunlangan.has(i) ? <span style={{ fontSize: '18px' }}>✅</span> : (
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#7c3aed', background: '#7c3aed15', borderRadius: '999px', padding: '3px 10px' }}>Boshlash</span>
              )}
            </div>
            <div style={{ marginTop: '10px', fontSize: '13px', color: 'var(--ink-soft)', background: 'var(--surface-2)', borderRadius: '8px', padding: '10px 14px', lineHeight: 1.6 }}>
              {m.vaziyat.slice(0, 160)}…
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!masala || !joriyS) return null

  const progress = ((qadam + (tekshirildi ? 1 : 0)) / masala.savollar.length) * 100

  return (
    <>
      {/* Progress */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--muted)', marginBottom: '5px' }}>
          <span style={{ fontWeight: 700 }}>{masala.sarlavha}</span>
          <span>{qadam + 1} / {masala.savollar.length}</span>
        </div>
        <div style={{ height: '5px', borderRadius: '999px', background: 'var(--surface-2)', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: '999px', width: `${progress}%`, background: '#7c3aed', transition: 'width .3s' }} />
        </div>
      </div>

      {/* Vaziyat — har bir savol uchun ko'rinadi */}
      <div className="rise" style={{ background: 'linear-gradient(135deg, #1e3a8a0d, #7c3aed0d)', border: '1px solid #7c3aed30', borderRadius: '14px', padding: '16px 20px', marginBottom: '14px' }}>
        <div style={{ fontSize: '11px', color: '#7c3aed', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>📋 Klinik vaziyat</div>
        <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.7, color: 'var(--ink)' }}>{masala.vaziyat}</p>
      </div>

      {/* Savol */}
      <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '16px 20px', marginBottom: '12px' }}>
        <div style={{ fontSize: '11px', color: '#7c3aed', fontWeight: 700, marginBottom: '6px' }}>Savol {qadam + 1}</div>
        <p style={{ fontSize: '14px', fontWeight: 600, margin: 0, lineHeight: 1.5 }}>{joriyS.savol}</p>
      </div>

      {/* Variantlar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
        {joriyS.variantlar.map((v, i) => {
          const tanlanganMi = tanlangan === i
          const togriMi = i === joriyS.togri
          let bg = 'var(--surface)'
          let border = '1px solid var(--line)'
          if (tekshirildi) {
            if (togriMi) { bg = '#16a34a12'; border = '1.5px solid #16a34a'; }
            else if (tanlanganMi) { bg = '#dc262612'; border = '1.5px solid #dc2626'; }
          } else if (tanlanganMi) {
            bg = '#7c3aed12'; border = '1.5px solid #7c3aed'
          }
          return (
            <div key={i} onClick={() => { if (!tekshirildi) setTanlangan(i) }}
              className={tekshirildi ? '' : 'soft-press'}
              style={{ background: bg, border, borderRadius: '12px', padding: '14px 16px', cursor: tekshirildi ? 'default' : 'pointer', transition: 'all .15s' }}
            >
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0, marginTop: '1px',
                  background: tekshirildi ? (togriMi ? '#16a34a' : tanlanganMi ? '#dc2626' : 'var(--surface-2)') : (tanlanganMi ? '#7c3aed' : 'var(--surface-2)'),
                  border: !tekshirildi && !tanlanganMi ? '2px solid var(--line)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: 'white', fontWeight: 700,
                }}>
                  {['A','B','C','D'][i]}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 4px', fontSize: '13.5px', lineHeight: 1.5, color: 'var(--ink)' }}>{v}</p>
                  {tekshirildi && (tanlanganMi || togriMi) && (
                    <p style={{ margin: 0, fontSize: '12px', color: togriMi ? '#16a34a' : '#dc2626', lineHeight: 1.5, fontStyle: 'italic' }}>
                      {joriyS.izoh}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {!tekshirildi ? (
        <button onClick={tekshir} disabled={tanlangan === null} style={{
          width: '100%', padding: '13px', borderRadius: '12px', border: 'none',
          background: tanlangan === null ? 'var(--surface-2)' : '#7c3aed',
          color: tanlangan === null ? 'var(--muted)' : 'white',
          fontSize: '14px', fontWeight: 700, cursor: tanlangan === null ? 'not-allowed' : 'pointer',
        }}>
          Tekshirish
        </button>
      ) : (
        <button onClick={keyingi} style={{
          width: '100%', padding: '13px', borderRadius: '12px', border: 'none',
          background: '#7c3aed', color: 'white', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
        }}>
          {qadam < masala.savollar.length - 1 ? 'Keyingi savol →' : '✅ Yakunlash'}
        </button>
      )}

      <button onClick={() => { setJoriy('menu'); setQadam(0); setTanlangan(null); setTekshirildi(false) }}
        style={{ width: '100%', marginTop: '8px', padding: '10px', borderRadius: '12px', border: '1px solid var(--line)', background: 'transparent', color: 'var(--muted)', fontSize: '13px', cursor: 'pointer' }}>
        ← Ro&apos;yxatga qaytish
      </button>
    </>
  )
}
