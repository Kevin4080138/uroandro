'use client'

import { useEffect, useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { createClient } from '@/lib/supabase'
import {
  DARSLAR, shuffleVaTanla, variantlarniAralashtir,
  type TestSavoli, type UsmleSavoli, type Bosqich,
} from '@/lib/talim/darslar'
import { useMeningObunalarim } from '@/lib/talim/useObuna'
import { flashcardlarOl, type Flashcard } from '@/lib/talim/flashcardlar'
import { klinikHolatlarOl, type KlinikHolat } from '@/lib/talim/klinikHolatlar'

// Barcha darslardan yig'ilgan, manbasi bilan belgilangan tuzilmalar
type Savol = TestSavoli & { _dars: string; _tur: 'Amaliy' | 'USMLE' | 'Nazorat'; vinyetka?: string }
type Karta = Flashcard & { _dars: string }
type Holat = KlinikHolat & { _dars: string }

type Rejim = 'hub' | 'savol' | 'flashcard' | 'klinik'

const TESTDA = 20 // aralash testda ko'rsatiladigan savollar soni

export default function OzingizniTekshiringPage() {
  const { egami, yuklandi: obunaYuklandi } = useMeningObunalarim()
  const supabase = createClient()
  const [dbMap, setDbMap] = useState<Record<string, { savollar_banki?: TestSavoli[] | null; usmle_savollar?: UsmleSavoli[] | null; nazorat_savollar?: TestSavoli[] | null }> | null>(null)
  const [rejim, setRejim] = useState<Rejim>('hub')

  useEffect(() => {
    const yukla = async () => {
      const { data } = await supabase
        .from('dars_tarkibi')
        .select('dars_slug, savollar_banki, usmle_savollar, nazorat_savollar')
      const map: Record<string, any> = {}
      for (const r of data ?? []) map[(r as any).dars_slug] = r
      setDbMap(map)
    }
    yukla()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Foydalanuvchi ega bo'lgan darslardan barcha kontentni yig'amiz
  const { savollar, kartalar, holatlar } = useMemo(() => {
    const savollar: Savol[] = []
    const kartalar: Karta[] = []
    const holatlar: Holat[] = []
    if (!dbMap) return { savollar, kartalar, holatlar }

    for (const dars of DARSLAR) {
      if (!egami(dars.bosqich)) continue
      const t = dbMap[dars.slug]

      const amaliy = (t?.savollar_banki?.length ? t.savollar_banki : dars.savollarBanki) ?? dars.test ?? []
      for (const s of amaliy) savollar.push({ ...s, _dars: dars.sarlavha, _tur: 'Amaliy' })

      const usmle = (t?.usmle_savollar ?? dars.usmleSavollar) ?? []
      for (const s of usmle) savollar.push({ ...s, _dars: dars.sarlavha, _tur: 'USMLE' })

      const nazorat = (t?.nazorat_savollar ?? dars.nazoratSavollar) ?? []
      for (const s of nazorat) savollar.push({ ...s, _dars: dars.sarlavha, _tur: 'Nazorat' })

      for (const k of flashcardlarOl(dars.slug)) kartalar.push({ ...k, _dars: dars.sarlavha })
      for (const h of klinikHolatlarOl(dars.slug)) holatlar.push({ ...h, _dars: dars.sarlavha })
    }
    return { savollar, kartalar, holatlar }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbMap, obunaYuklandi])

  const yuklanmoqda = !obunaYuklandi || dbMap === null
  const bosh = savollar.length + kartalar.length + holatlar.length === 0

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
      <Header backHref="/student/dashboard" backLabel="Bosh sahifa" />
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '24px 20px' }}>
        <div className="rise" style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px' }}>🎯 O&apos;zingizni tekshiring</h1>
          <p style={{ color: 'var(--muted)', fontSize: '13.5px', margin: 0 }}>
            Turli mavzulardagi savollar, kartalar va klinik holatlar aralashtirilib chiqadi.
          </p>
        </div>

        {yuklanmoqda ? (
          <p style={{ color: 'var(--muted)' }}>Yuklanmoqda...</p>
        ) : bosh ? (
          <div className="rise" style={{
            background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
            padding: '32px 24px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔒</div>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--muted)' }}>
              Hozircha kontent yo&apos;q. Bosqichга obuna bo&apos;lganingizdan so&apos;ng bu yerда savollar,
              flashcard va klinik holatlar aralash chiqadi.
            </p>
          </div>
        ) : rejim === 'hub' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <RejimKarta emoji="🎲" nom="Aralash savollar" izoh={`${savollar.length} ta savol (Amaliy + USMLE + Nazorat)`} rang="var(--accent)" onClick={() => savollar.length && setRejim('savol')} ochiq={savollar.length > 0} />
            <RejimKarta emoji="🃏" nom="Flashcardlar" izoh={`${kartalar.length} ta karta — barcha mavzudan`} rang="var(--accent-2)" onClick={() => kartalar.length && setRejim('flashcard')} ochiq={kartalar.length > 0} />
            <RejimKarta emoji="🏥" nom="Klinik holatlar" izoh={`${holatlar.length} ta bemor scenariysi`} rang="var(--danger)" onClick={() => holatlar.length && setRejim('klinik')} ochiq={holatlar.length > 0} />
          </div>
        ) : rejim === 'savol' ? (
          <SavolRejimi pool={savollar} orqaga={() => setRejim('hub')} />
        ) : rejim === 'flashcard' ? (
          <FlashcardRejimi pool={kartalar} orqaga={() => setRejim('hub')} />
        ) : (
          <KlinikRejimi pool={holatlar} orqaga={() => setRejim('hub')} />
        )}
      </div>
      <BottomNav />
    </div>
  )
}

function RejimKarta({ emoji, nom, izoh, rang, onClick, ochiq }: { emoji: string; nom: string; izoh: string; rang: string; onClick: () => void; ochiq: boolean }) {
  return (
    <div
      onClick={ochiq ? onClick : undefined}
      className={ochiq ? 'dash-card rise' : 'rise'}
      style={{
        ['--c' as any]: rang,
        cursor: ochiq ? 'pointer' : 'default', opacity: ochiq ? 1 : 0.5,
        background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px',
      }}
    >
      <div style={{ fontSize: '30px', marginBottom: '8px' }}>{emoji}</div>
      <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 800 }}>{nom}</h3>
      <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)' }}>{izoh}</p>
    </div>
  )
}

// ─── Aralash savollar (MCQ) ───────────────────────────────
function SavolRejimi({ pool, orqaga }: { pool: Savol[]; orqaga: () => void }) {
  const [savollar, setSavollar] = useState<Savol[]>(() => shuffleVaTanla(pool, Math.min(TESTDA, pool.length)).map((s) => variantlarniAralashtir(s)))
  const [joriy, setJoriy] = useState(0)
  const [tanlangan, setTanlangan] = useState<number | null>(null)
  const [ball, setBall] = useState(0)
  const [tugadi, setTugadi] = useState(false)

  const s = savollar[joriy]
  const tanla = (i: number) => {
    if (tanlangan !== null) return
    setTanlangan(i)
    if (i === s.togri) setBall((b) => b + 1)
  }
  const keyingi = () => {
    if (joriy + 1 >= savollar.length) { setTugadi(true); return }
    setJoriy((j) => j + 1)
    setTanlangan(null)
  }
  const qaytadan = () => {
    setSavollar(shuffleVaTanla(pool, Math.min(TESTDA, pool.length)).map((x) => variantlarniAralashtir(x)))
    setJoriy(0); setTanlangan(null); setBall(0); setTugadi(false)
  }

  if (tugadi) {
    const foiz = Math.round((ball / savollar.length) * 100)
    return (
      <div className="rise" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '52px', marginBottom: '12px' }}>{foiz >= 70 ? '🎉' : foiz >= 50 ? '👍' : '📚'}</div>
        <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 6px' }}>{ball} / {savollar.length} ({foiz}%)</h2>
        <p style={{ color: 'var(--muted)', fontSize: '13.5px', marginBottom: '22px' }}>Aralash test yakunlandi</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button onClick={qaytadan} style={btnPrimary}>Qaytadan</button>
          <button onClick={orqaga} style={btnSoft}>← Bosh menyu</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '12px', color: 'var(--muted)' }}>
        <button onClick={orqaga} style={{ ...btnLink }}>← Menyu</button>
        <span>{joriy + 1} / {savollar.length} · ✅ {ball}</span>
      </div>
      <div style={{ height: '5px', borderRadius: '999px', background: 'var(--surface-2)', overflow: 'hidden', marginBottom: '16px' }}>
        <div style={{ height: '100%', width: `${(joriy / savollar.length) * 100}%`, background: 'var(--accent)', transition: 'width .3s' }} />
      </div>

      <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px 22px' }}>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
          <span style={pill('var(--accent)')}>{s._tur}</span>
          <span style={pill('var(--muted)')}>{s._dars}</span>
        </div>
        {s.vinyetka && (
          <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--ink-soft)', background: 'var(--surface-2)', borderRadius: '10px', padding: '12px 14px', margin: '0 0 12px' }}>{s.vinyetka}</p>
        )}
        <p style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 14px', lineHeight: 1.5 }}>{s.savol}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {s.variantlar.map((v, i) => {
            const togri = i === s.togri
            const tanlandi = tanlangan === i
            let bg = 'var(--surface)', bd = 'var(--line)', col = 'var(--ink)'
            if (tanlangan !== null) {
              if (togri) { bg = '#16a34a12'; bd = '#16a34a'; col = '#15803d' }
              else if (tanlandi) { bg = '#dc262612'; bd = '#dc2626'; col = '#b91c1c' }
            }
            return (
              <button key={i} onClick={() => tanla(i)} disabled={tanlangan !== null} className="soft-press"
                style={{ textAlign: 'left', background: bg, border: `1.5px solid ${bd}`, color: col, borderRadius: '12px', padding: '12px 14px', fontSize: '14px', fontWeight: 600, cursor: tanlangan === null ? 'pointer' : 'default', lineHeight: 1.45 }}>
                {v} {tanlangan !== null && togri ? ' ✓' : ''}{tanlangan !== null && tanlandi && !togri ? ' ✗' : ''}
              </button>
            )
          })}
        </div>
        {tanlangan !== null && (
          <div className="rise" style={{ marginTop: '14px' }}>
            <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--ink-soft)', background: 'var(--surface-2)', borderRadius: '10px', padding: '12px 14px', margin: '0 0 12px' }}>💡 {s.izoh}</p>
            <button onClick={keyingi} style={btnPrimary}>{joriy + 1 >= savollar.length ? 'Yakunlash' : 'Keyingi →'}</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Flashcard ────────────────────────────────────────────
function FlashcardRejimi({ pool, orqaga }: { pool: Karta[]; orqaga: () => void }) {
  const [kartalar, setKartalar] = useState<Karta[]>(() => shuffleVaTanla(pool, pool.length))
  const [joriy, setJoriy] = useState(0)
  const [ochiq, setOchiq] = useState(false)
  const [bildim, setBildim] = useState(0)

  const k = kartalar[joriy]
  const tugadi = joriy >= kartalar.length
  const oldinga = (bildiMi: boolean) => {
    if (bildiMi) setBildim((b) => b + 1)
    setOchiq(false)
    setTimeout(() => setJoriy((j) => j + 1), 80)
  }
  const qaytadan = () => { setKartalar(shuffleVaTanla(pool, pool.length)); setJoriy(0); setOchiq(false); setBildim(0) }

  if (tugadi) {
    return (
      <div className="rise" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '52px', marginBottom: '12px' }}>🃏</div>
        <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 6px' }}>{bildim} / {kartalar.length} bildim</h2>
        <p style={{ color: 'var(--muted)', fontSize: '13.5px', marginBottom: '22px' }}>Barcha kartalar ko&apos;rib chiqildi</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button onClick={qaytadan} style={btnPrimary}>Qaytadan</button>
          <button onClick={orqaga} style={btnSoft}>← Bosh menyu</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '12px', color: 'var(--muted)' }}>
        <button onClick={orqaga} style={btnLink}>← Menyu</button>
        <span>{joriy + 1} / {kartalar.length} · ✅ {bildim}</span>
      </div>
      <div onClick={() => setOchiq((o) => !o)} className="rise"
        style={{ cursor: 'pointer', minHeight: '220px', background: ochiq ? 'var(--surface-2)' : 'var(--surface)', border: `2px solid ${ochiq ? 'var(--accent)' : 'var(--line)'}`, borderRadius: '20px', padding: '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', userSelect: 'none', marginBottom: '14px' }}>
        <div style={{ position: 'absolute', top: '14px', right: '16px', fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>
          {ochiq ? '🔵 Orqa' : '⚪ Old'} · {k.kategoriya}
        </div>
        <div style={{ position: 'absolute', top: '14px', left: '16px', fontSize: '10.5px', color: 'var(--muted)', fontWeight: 600, maxWidth: '55%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{k._dars}</div>
        {!ochiq ? (
          <div>
            <p style={{ fontSize: '17px', fontWeight: 700, margin: '10px 0 0', lineHeight: 1.5 }}>{k.old}</p>
            <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '12px 0 0' }}>👆 Bosing — javob</p>
          </div>
        ) : (
          <p style={{ fontSize: '15px', fontWeight: 500, margin: '10px 0 0', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{k.yangi}</p>
        )}
      </div>
      {ochiq && (
        <div className="rise" style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => oldinga(false)} style={{ flex: 1, background: '#dc262612', color: '#dc2626', border: '1.5px solid #dc2626', borderRadius: '12px', padding: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>✗ Bilmadim</button>
          <button onClick={() => oldinga(true)} style={{ flex: 1, background: '#16a34a12', color: '#16a34a', border: '1.5px solid #16a34a', borderRadius: '12px', padding: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>✓ Bildim</button>
        </div>
      )}
    </div>
  )
}

// ─── Klinik holatlar ──────────────────────────────────────
function KlinikRejimi({ pool, orqaga }: { pool: Holat[]; orqaga: () => void }) {
  const [holatlar] = useState<Holat[]>(() => shuffleVaTanla(pool, pool.length))
  const [idx, setIdx] = useState(0)
  const [qadam, setQadam] = useState(0)
  const [tanlangan, setTanlangan] = useState<number | null>(null)

  const h = holatlar[idx]
  const bordi = idx >= holatlar.length
  if (bordi) {
    return (
      <div className="rise" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '52px', marginBottom: '12px' }}>🏥</div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 6px' }}>Barcha holatlar tugadi</h2>
        <button onClick={orqaga} style={{ ...btnSoft, marginTop: '14px' }}>← Bosh menyu</button>
      </div>
    )
  }

  const q = h.qadamlar[qadam]
  const oxirgiQadam = qadam + 1 >= h.qadamlar.length
  const tanla = (i: number) => { if (tanlangan === null) setTanlangan(i) }
  const keyingiQadam = () => {
    if (oxirgiQadam) { setQadam(h.qadamlar.length); return } // xulosaga o'tish
    setQadam((s) => s + 1); setTanlangan(null)
  }
  const keyingiHolat = () => { setIdx((i) => i + 1); setQadam(0); setTanlangan(null) }
  const xulosada = qadam >= h.qadamlar.length

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', fontSize: '12px', color: 'var(--muted)' }}>
        <button onClick={orqaga} style={btnLink}>← Menyu</button>
        <span>Holat {idx + 1} / {holatlar.length}</span>
      </div>

      <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px 22px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <span style={pill('var(--danger)')}>{h.emoji} {h.sarlavha}</span>
          <span style={pill('var(--muted)')}>{h._dars}</span>
        </div>
        <p style={{ fontSize: '13.5px', margin: '0 0 6px', lineHeight: 1.6 }}><strong>Bemor:</strong> {h.bemor}</p>
        <p style={{ fontSize: '13.5px', margin: '0 0 6px', lineHeight: 1.6 }}><strong>Shikoyat:</strong> {h.shikoyat}</p>
        <p style={{ fontSize: '13.5px', margin: 0, lineHeight: 1.6 }}><strong>Tekshiruv:</strong> {h.tekshiruv}</p>
      </div>

      {xulosada ? (
        <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px 22px' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: 800, color: 'var(--good)' }}>📋 Xulosa</h3>
          <p style={{ fontSize: '13.5px', lineHeight: 1.7, color: 'var(--ink-soft)', margin: '0 0 16px' }}>{h.xulosa}</p>
          <button onClick={keyingiHolat} style={btnPrimary}>{idx + 1 >= holatlar.length ? 'Yakunlash' : 'Keyingi holat →'}</button>
        </div>
      ) : (
        <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px 22px' }}>
          <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>Qadam {qadam + 1} / {h.qadamlar.length}</div>
          <p style={{ fontSize: '15.5px', fontWeight: 700, margin: '0 0 14px', lineHeight: 1.5 }}>{q.savol}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {q.variantlar.map((v, i) => {
              const togri = i === q.togri
              const tanlandi = tanlangan === i
              let bg = 'var(--surface)', bd = 'var(--line)', col = 'var(--ink)'
              if (tanlangan !== null) {
                if (togri) { bg = '#16a34a12'; bd = '#16a34a'; col = '#15803d' }
                else if (tanlandi) { bg = '#dc262612'; bd = '#dc2626'; col = '#b91c1c' }
              }
              return (
                <button key={i} onClick={() => tanla(i)} disabled={tanlangan !== null} className="soft-press"
                  style={{ textAlign: 'left', background: bg, border: `1.5px solid ${bd}`, color: col, borderRadius: '12px', padding: '12px 14px', fontSize: '14px', fontWeight: 600, cursor: tanlangan === null ? 'pointer' : 'default', lineHeight: 1.45 }}>
                  {v}{tanlangan !== null && togri ? ' ✓' : ''}{tanlangan !== null && tanlandi && !togri ? ' ✗' : ''}
                </button>
              )
            })}
          </div>
          {tanlangan !== null && (
            <div className="rise" style={{ marginTop: '14px' }}>
              <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--ink-soft)', background: 'var(--surface-2)', borderRadius: '10px', padding: '12px 14px', margin: '0 0 12px' }}>💡 {q.izoh}</p>
              <button onClick={keyingiQadam} style={btnPrimary}>{oxirgiQadam ? 'Xulosani ko\'rish' : 'Keyingi qadam →'}</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── uslublar ─────────────────────────────────────────────
const btnPrimary: React.CSSProperties = { background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '12px', padding: '12px 24px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }
const btnSoft: React.CSSProperties = { background: 'var(--surface-2)', color: 'var(--ink-soft)', border: '1px solid var(--line)', borderRadius: '12px', padding: '12px 24px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }
const btnLink: React.CSSProperties = { background: 'none', border: 'none', color: 'var(--muted)', fontSize: '12px', fontWeight: 700, cursor: 'pointer', padding: 0 }
function pill(rang: string): React.CSSProperties {
  return { fontSize: '10.5px', fontWeight: 700, color: rang, background: 'var(--surface-2)', borderRadius: '999px', padding: '3px 10px' }
}
