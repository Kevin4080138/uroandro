'use client'

import { useEffect, useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { createClient } from '@/lib/supabase'
import { SkeletonCard } from '@/components/Skeleton'
import {
  DARSLAR, shuffleVaTanla, variantlarniAralashtir, BOSQICHLAR,
  type TestSavoli, type UsmleSavoli, type Bosqich,
} from '@/lib/talim/darslar'
import { useMeningObunalarim } from '@/lib/talim/useObuna'
import { type Flashcard } from '@/lib/talim/flashcardlar'
import { klinikHolatlarOl, type KlinikHolat } from '@/lib/talim/klinikHolatlar'

// Kontent turlari
type Turi = 'amaliy' | 'usmle' | 'nazorat' | 'klinik' | 'flashcard'
const TUR_NOMI: Record<Turi, string> = {
  amaliy: '✅ Amaliy test',
  usmle: '🏅 USMLE',
  nazorat: '🔒 Nazorat',
  klinik: '🏥 Klinik holat',
  flashcard: '🃏 Flashcard',
}
const TUR_TARTIBI: Turi[] = ['amaliy', 'usmle', 'nazorat', 'klinik', 'flashcard']

// Har element manbasi (dars, bosqich) va turi bilan belgilangan
type Savol = TestSavoli & { vinyetka?: string }
type Element =
  | { turi: 'amaliy' | 'usmle' | 'nazorat'; bosqich: Bosqich; dars: string; savol: Savol }
  | { turi: 'klinik'; bosqich: Bosqich; dars: string; holat: KlinikHolat }
  | { turi: 'flashcard'; bosqich: Bosqich; dars: string; karta: Flashcard }

const SESSIYA_HAJMI = 20 // aralash sessiyada ko'rsatiladigan elementlar soni

export default function OzingizniTekshiringPage() {
  const { egami, yuklandi: obunaYuklandi } = useMeningObunalarim()
  const supabase = createClient()
  const [dbMap, setDbMap] = useState<Record<string, any> | null>(null)

  useEffect(() => {
    const yukla = async () => {
      const { data } = await supabase
        .from('dars_tarkibi')
        .select('dars_slug, savollar_banki, usmle_savollar, nazorat_savollar, flashcardlar')
      const map: Record<string, any> = {}
      for (const r of data ?? []) map[(r as any).dars_slug] = r
      setDbMap(map)
    }
    yukla()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Ega bo'lgan darslardan barcha elementlarni yig'amiz
  const elementlar = useMemo<Element[]>(() => {
    const res: Element[] = []
    if (!dbMap) return res
    for (const dars of DARSLAR) {
      if (!egami(dars.bosqich)) continue
      const t = dbMap[dars.slug]
      const b = dars.bosqich, dn = dars.sarlavha

      const amaliy = (t?.savollar_banki?.length ? t.savollar_banki : dars.savollarBanki) ?? dars.test ?? []
      for (const s of amaliy) res.push({ turi: 'amaliy', bosqich: b, dars: dn, savol: s })
      const usmle = (t?.usmle_savollar ?? dars.usmleSavollar) ?? []
      for (const s of usmle) res.push({ turi: 'usmle', bosqich: b, dars: dn, savol: s })
      const nazorat = (t?.nazorat_savollar ?? dars.nazoratSavollar) ?? []
      for (const s of nazorat) res.push({ turi: 'nazorat', bosqich: b, dars: dn, savol: s })
      for (const h of klinikHolatlarOl(dars.slug)) res.push({ turi: 'klinik', bosqich: b, dars: dn, holat: h })
      for (const k of t?.flashcardlar ?? []) res.push({ turi: 'flashcard', bosqich: b, dars: dn, karta: k })
    }
    return res
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbMap, obunaYuklandi])

  const egaBosqichlar = BOSQICHLAR.filter((b) => egami(b.id))

  // Sozlash holati
  const [tanlanganBosqich, setTanlanganBosqich] = useState<Set<Bosqich>>(new Set())
  const [tanlanganTur, setTanlanganTur] = useState<Set<Turi>>(new Set(TUR_TARTIBI))
  const [sessiya, setSessiya] = useState<Element[] | null>(null)

  // Ega bo'lgan bosqichlar aniqlangach — hammasini default belgilaymiz
  useEffect(() => {
    if (obunaYuklandi && tanlanganBosqich.size === 0 && egaBosqichlar.length) {
      setTanlanganBosqich(new Set(egaBosqichlar.map((b) => b.id)))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [obunaYuklandi, dbMap])

  // Tanlangan bosqichlar bo'yicha har tur uchun mavjud son
  const turSanoq = useMemo(() => {
    const s: Record<Turi, number> = { amaliy: 0, usmle: 0, nazorat: 0, klinik: 0, flashcard: 0 }
    for (const e of elementlar) if (tanlanganBosqich.has(e.bosqich)) s[e.turi]++
    return s
  }, [elementlar, tanlanganBosqich])

  const tanlangan = useMemo(
    () => elementlar.filter((e) => tanlanganBosqich.has(e.bosqich) && tanlanganTur.has(e.turi)),
    [elementlar, tanlanganBosqich, tanlanganTur],
  )

  const boshla = () => {
    const aralash = shuffleVaTanla(tanlangan, Math.min(SESSIYA_HAJMI, tanlangan.length))
      .map((e) => (e.turi === 'klinik' || e.turi === 'flashcard' ? e : { ...e, savol: variantlarniAralashtir(e.savol) }))
    setSessiya(aralash)
  }

  const yuklanmoqda = !obunaYuklandi || dbMap === null
  const hechnarsa = elementlar.length === 0

  const bosqichToggle = (id: Bosqich) => setTanlanganBosqich((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n })
  const turToggle = (t: Turi) => setTanlanganTur((p) => { const n = new Set(p); n.has(t) ? n.delete(t) : n.add(t); return n })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
      <Header backHref="/student/dashboard" backLabel="Bosh sahifa" />
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '24px 20px' }}>
        <div className="rise" style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px' }}>🎯 O&apos;zingizni tekshiring</h1>
          <p style={{ color: 'var(--muted)', fontSize: '13.5px', margin: 0 }}>
            Daraja va kontent turini tanlang — tanlanganlar aralashib chiqadi.
          </p>
        </div>

        {yuklanmoqda ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} h="100px" />)}
          </div>
        ) : hechnarsa ? (
          <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '32px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔒</div>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--muted)' }}>
              Hozircha kontent yo&apos;q. Bosqichga obuna bo&apos;lganingizdan so&apos;ng bu yerда savol, flashcard va klinik holatlar aralash chiqadi.
            </p>
          </div>
        ) : sessiya ? (
          <Sessiya elementlar={sessiya} orqaga={() => setSessiya(null)} />
        ) : (
          <>
            {/* Daraja tanlash */}
            <div className="rise" style={{ marginBottom: '18px' }}>
              <p style={sekLabel}>1. Daraja</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {BOSQICHLAR.map((b) => {
                  const ega = egami(b.id)
                  const faol = tanlanganBosqich.has(b.id)
                  return (
                    <button key={b.id} onClick={() => ega && bosqichToggle(b.id)} disabled={!ega} className="soft-press"
                      style={{ ...chipStyle(faol), opacity: ega ? 1 : 0.45, cursor: ega ? 'pointer' : 'default' }}>
                      {b.emoji} {b.nom.split(' — ')[0]} {!ega && '🔒'}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Tur tanlash */}
            <div className="rise" style={{ marginBottom: '20px' }}>
              <p style={sekLabel}>2. Nimalar chiqsin</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {TUR_TARTIBI.map((t) => {
                  const soni = turSanoq[t]
                  const bor = soni > 0
                  const faol = tanlanganTur.has(t) && bor
                  return (
                    <button key={t} onClick={() => bor && turToggle(t)} disabled={!bor} className="soft-press"
                      style={{ ...chipStyle(faol), opacity: bor ? 1 : 0.4, cursor: bor ? 'pointer' : 'default' }}>
                      {TUR_NOMI[t]} <span style={{ opacity: 0.7 }}>· {soni}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Boshlash */}
            <div className="rise" style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <button onClick={boshla} disabled={tanlangan.length === 0} style={{ ...btnPrimary, opacity: tanlangan.length ? 1 : 0.5, cursor: tanlangan.length ? 'pointer' : 'default' }}>
                Boshlash →
              </button>
              <span style={{ fontSize: '12.5px', color: 'var(--muted)' }}>
                {tanlangan.length === 0 ? 'Kamida bitta tur tanlang' : `${tanlangan.length} elementdan ${Math.min(SESSIYA_HAJMI, tanlangan.length)} tasi aralash chiqadi`}
              </span>
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  )
}

// ─── Aralash sessiya ──────────────────────────────────────
function Sessiya({ elementlar, orqaga }: { elementlar: Element[]; orqaga: () => void }) {
  const [idx, setIdx] = useState(0)
  const [togri, setTogri] = useState(0)
  const [savolSoni, setSavolSoni] = useState(0) // baholanadigan (MCQ) elementlar soni

  const jami = elementlar.length
  const tugadi = idx >= jami
  const e = elementlar[idx]

  const oldinga = (natija?: 'togri' | 'xato' | null) => {
    if (natija === 'togri') { setTogri((t) => t + 1); setSavolSoni((s) => s + 1) }
    else if (natija === 'xato') setSavolSoni((s) => s + 1)
    setIdx((i) => i + 1)
  }

  if (tugadi) {
    const foiz = savolSoni ? Math.round((togri / savolSoni) * 100) : null
    return (
      <div className="rise" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '52px', marginBottom: '12px' }}>{foiz === null ? '🎉' : foiz >= 70 ? '🎉' : foiz >= 50 ? '👍' : '📚'}</div>
        <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 6px' }}>{jami} element yakunlandi</h2>
        {foiz !== null && (
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '4px' }}>Test/USMLE/Nazorat: {togri} / {savolSoni} to&apos;g&apos;ri ({foiz}%)</p>
        )}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '18px' }}>
          <button onClick={orqaga} style={btnPrimary}>← Yangi sessiya</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '12px', color: 'var(--muted)' }}>
        <button onClick={orqaga} style={btnLink}>← Sozlash</button>
        <span>{idx + 1} / {jami}{savolSoni > 0 ? ` · ✅ ${togri}/${savolSoni}` : ''}</span>
      </div>
      <div style={{ height: '5px', borderRadius: '999px', background: 'var(--surface-2)', overflow: 'hidden', marginBottom: '16px' }}>
        <div style={{ height: '100%', width: `${(idx / jami) * 100}%`, background: 'var(--accent)', transition: 'width .3s' }} />
      </div>

      {e.turi === 'flashcard' ? (
        <KartaBitta key={idx} karta={e.karta} dars={e.dars} onTugadi={() => oldinga(null)} />
      ) : e.turi === 'klinik' ? (
        <KlinikBitta key={idx} holat={e.holat} dars={e.dars} onTugadi={() => oldinga(null)} />
      ) : (
        <SavolBitta key={idx} savol={e.savol} turi={e.turi} dars={e.dars} onTugadi={(n) => oldinga(n)} />
      )}
    </div>
  )
}

// ─── Bitta MCQ savol ──────────────────────────────────────
function SavolBitta({ savol, turi, dars, onTugadi }: { savol: Savol; turi: Turi; dars: string; onTugadi: (n: 'togri' | 'xato') => void }) {
  const [tanlangan, setTanlangan] = useState<number | null>(null)
  const tanla = (i: number) => { if (tanlangan === null) setTanlangan(i) }
  return (
    <div className="rise" style={cardStyle}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
        <span style={pill('var(--accent)')}>{TUR_NOMI[turi]}</span>
        <span style={pill('var(--muted)')}>{dars}</span>
      </div>
      {savol.vinyetka && (
        <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--ink-soft)', background: 'var(--surface-2)', borderRadius: '10px', padding: '12px 14px', margin: '0 0 12px' }}>{savol.vinyetka}</p>
      )}
      <p style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 14px', lineHeight: 1.5 }}>{savol.savol}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {savol.variantlar.map((v, i) => (
          <button key={i} onClick={() => tanla(i)} disabled={tanlangan !== null} className="soft-press" style={variantStyle(tanlangan, i, savol.togri)}>
            {v}{tanlangan !== null && i === savol.togri ? ' ✓' : ''}{tanlangan !== null && tanlangan === i && i !== savol.togri ? ' ✗' : ''}
          </button>
        ))}
      </div>
      {tanlangan !== null && (
        <div className="rise" style={{ marginTop: '14px' }}>
          <p style={izohStyle}>💡 {savol.izoh}</p>
          <button onClick={() => onTugadi(tanlangan === savol.togri ? 'togri' : 'xato')} style={btnPrimary}>Keyingi →</button>
        </div>
      )}
    </div>
  )
}

// ─── Bitta flashcard ──────────────────────────────────────
function KartaBitta({ karta, dars, onTugadi }: { karta: Flashcard; dars: string; onTugadi: () => void }) {
  const [ochiq, setOchiq] = useState(false)
  return (
    <div>
      <div onClick={() => setOchiq((o) => !o)} className="rise"
        style={{ cursor: 'pointer', minHeight: '200px', background: ochiq ? 'var(--surface-2)' : 'var(--surface)', border: `2px solid ${ochiq ? 'var(--accent)' : 'var(--line)'}`, borderRadius: '20px', padding: '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', userSelect: 'none', marginBottom: '14px' }}>
        <div style={{ position: 'absolute', top: '14px', right: '16px', fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>🃏 {karta.kategoriya}</div>
        <div style={{ position: 'absolute', top: '14px', left: '16px', fontSize: '10.5px', color: 'var(--muted)', fontWeight: 600, maxWidth: '55%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dars}</div>
        {!ochiq ? (
          <div>
            <p style={{ fontSize: '17px', fontWeight: 700, margin: '10px 0 0', lineHeight: 1.5 }}>{karta.old}</p>
            <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '12px 0 0' }}>👆 Bosing — javob</p>
          </div>
        ) : (
          <p style={{ fontSize: '15px', fontWeight: 500, margin: '10px 0 0', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{karta.yangi}</p>
        )}
      </div>
      {ochiq && (
        <button onClick={onTugadi} className="rise" style={btnPrimary}>Keyingi →</button>
      )}
    </div>
  )
}

// ─── Bitta klinik holat ───────────────────────────────────
function KlinikBitta({ holat, dars, onTugadi }: { holat: KlinikHolat; dars: string; onTugadi: () => void }) {
  const [qadam, setQadam] = useState(0)
  const [tanlangan, setTanlangan] = useState<number | null>(null)
  const xulosada = qadam >= holat.qadamlar.length
  const q = holat.qadamlar[qadam]
  const oxirgi = qadam + 1 >= holat.qadamlar.length

  return (
    <div>
      <div className="rise" style={{ ...cardStyle, marginBottom: '14px' }}>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <span style={pill('var(--danger)')}>{holat.emoji} {holat.sarlavha}</span>
          <span style={pill('var(--muted)')}>{dars}</span>
        </div>
        <p style={{ fontSize: '13.5px', margin: '0 0 6px', lineHeight: 1.6 }}><strong>Bemor:</strong> {holat.bemor}</p>
        <p style={{ fontSize: '13.5px', margin: '0 0 6px', lineHeight: 1.6 }}><strong>Shikoyat:</strong> {holat.shikoyat}</p>
        <p style={{ fontSize: '13.5px', margin: 0, lineHeight: 1.6 }}><strong>Tekshiruv:</strong> {holat.tekshiruv}</p>
      </div>

      {xulosada ? (
        <div className="rise" style={cardStyle}>
          <h3 style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: 800, color: 'var(--good)' }}>📋 Xulosa</h3>
          <p style={{ fontSize: '13.5px', lineHeight: 1.7, color: 'var(--ink-soft)', margin: '0 0 16px' }}>{holat.xulosa}</p>
          <button onClick={onTugadi} style={btnPrimary}>Keyingi →</button>
        </div>
      ) : (
        <div className="rise" style={cardStyle}>
          <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>Qadam {qadam + 1} / {holat.qadamlar.length}</div>
          <p style={{ fontSize: '15.5px', fontWeight: 700, margin: '0 0 14px', lineHeight: 1.5 }}>{q.savol}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {q.variantlar.map((v, i) => (
              <button key={i} onClick={() => tanlangan === null && setTanlangan(i)} disabled={tanlangan !== null} className="soft-press" style={variantStyle(tanlangan, i, q.togri)}>
                {v}{tanlangan !== null && i === q.togri ? ' ✓' : ''}{tanlangan !== null && tanlangan === i && i !== q.togri ? ' ✗' : ''}
              </button>
            ))}
          </div>
          {tanlangan !== null && (
            <div className="rise" style={{ marginTop: '14px' }}>
              <p style={izohStyle}>💡 {q.izoh}</p>
              <button onClick={() => { if (oxirgi) setQadam(holat.qadamlar.length); else { setQadam((s) => s + 1); setTanlangan(null) } }} style={btnPrimary}>
                {oxirgi ? 'Xulosani ko\'rish' : 'Keyingi qadam →'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── uslublar ─────────────────────────────────────────────
const cardStyle: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px 22px' }
const izohStyle: React.CSSProperties = { fontSize: '13px', lineHeight: 1.6, color: 'var(--ink-soft)', background: 'var(--surface-2)', borderRadius: '10px', padding: '12px 14px', margin: '0 0 12px' }
const sekLabel: React.CSSProperties = { fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 700, margin: '0 0 10px' }
const btnPrimary: React.CSSProperties = { background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '12px', padding: '12px 24px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }
const btnLink: React.CSSProperties = { background: 'none', border: 'none', color: 'var(--muted)', fontSize: '12px', fontWeight: 700, cursor: 'pointer', padding: 0 }
function chipStyle(faol: boolean): React.CSSProperties {
  return { background: faol ? 'var(--accent)' : 'var(--surface)', color: faol ? 'white' : 'var(--muted)', border: `1.5px solid ${faol ? 'var(--accent)' : 'var(--line)'}`, borderRadius: '999px', padding: '8px 14px', fontSize: '12.5px', fontWeight: 700 }
}
function variantStyle(tanlangan: number | null, i: number, togri: number): React.CSSProperties {
  let bg = 'var(--surface)', bd = 'var(--line)', col = 'var(--ink)'
  if (tanlangan !== null) {
    if (i === togri) { bg = '#16a34a12'; bd = '#16a34a'; col = '#15803d' }
    else if (tanlangan === i) { bg = '#dc262612'; bd = '#dc2626'; col = '#b91c1c' }
  }
  return { textAlign: 'left', background: bg, border: `1.5px solid ${bd}`, color: col, borderRadius: '12px', padding: '12px 14px', fontSize: '14px', fontWeight: 600, cursor: tanlangan === null ? 'pointer' : 'default', lineHeight: 1.45 }
}
function pill(rang: string): React.CSSProperties {
  return { fontSize: '10.5px', fontWeight: 700, color: rang, background: 'var(--surface-2)', borderRadius: '999px', padding: '3px 10px' }
}
