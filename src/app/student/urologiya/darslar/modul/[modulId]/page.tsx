'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import {
  Layers, ClipboardCheck, GraduationCap, Building2, ArrowLeft, ArrowRight,
  CheckCircle2, XCircle, RotateCcw, Lightbulb, Trophy,
} from 'lucide-react'
import { BOSQICH_RANG } from '@/lib/talim/darslar'
import { bolimKorinadi } from '@/lib/kurs/matritsa'

type Banklar = { flashcard: number; test: number; usmle: number }
type CaseMini = { id: string; sarlavha: string; jami: number }
type Summary = {
  modul: { id: string; nom: string; bosqich: string; holat: string; mavzu_turi: string | null; bolim_override: Partial<Record<'flashcard' | 'test' | 'usmle' | 'case', boolean>> }
  banklar: Banklar; caselar: CaseMini[]
}
type Flashcard = { old: string; yangi: string; kategoriya: string | null }
type Savol = { id: string; savol: string; variantlar: string[] }
type Faol =
  | { tur: 'flashcard' }
  | { tur: 'test' | 'usmle' }
  | { tur: 'case'; caseId: string; sarlavha: string }
  | null

const YONALISH = 'urologiya'

function bosqichKey(b: string) {
  return b === 'orta' ? "o'rta" as const : b === 'qiyin' ? 'qiyin' as const : 'oson' as const
}

function api(body: unknown): Promise<Response> {
  return fetch('/api/kurs/' + (body as { _yol: string })._yol, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export default function ModulMarkaz() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const modulId = String(params?.modulId ?? '')

  const [xul, setXul] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [xato, setXato] = useState('')
  const [natijalar, setNatijalar] = useState<Partial<Record<'test' | 'usmle', { foiz: number; otdi: boolean }>>>({})
  const [faol, setFaol] = useState<Faol>(null)

  const rang = BOSQICH_RANG[bosqichKey(xul?.modul.bosqich ?? 'oson')].accent

  const natijalarniYukla = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('kurs_urinishlar')
      .select('tur, foiz, otdi, yakunlangan_at')
      .eq('student_id', user.id).eq('modul_id', modulId)
      .not('yakunlangan_at', 'is', null)
    const rows = (data ?? []) as { tur: string; foiz: number | null; otdi: boolean }[]
    const eng: Partial<Record<'test' | 'usmle', { foiz: number; otdi: boolean }>> = {}
    for (const r of rows) {
      if (r.tur !== 'test' && r.tur !== 'usmle') continue
      const f = r.foiz ?? 0
      if (!eng[r.tur] || f > eng[r.tur]!.foiz) eng[r.tur] = { foiz: f, otdi: r.otdi }
    }
    setNatijalar(eng)
  }, [modulId, supabase])

  useEffect(() => {
    const load = async () => {
      setLoading(true); setXato('')
      try {
        const res = await fetch('/api/kurs/modul', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ modul_id: modulId }),
        })
        if (!res.ok) {
          setXato(res.status === 403 ? 'Bu modulga kirish yo‘q.' : 'Modul topilmadi yoki hali nashr qilinmagan.')
          setLoading(false); return
        }
        setXul((await res.json()) as Summary)
      } catch {
        setXato('Yuklashda xatolik.')
      }
      setLoading(false)
      natijalarniYukla()
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modulId])

  // Runner yopilganda natijalarni yangilaymiz (test o'tgan bo'lishi mumkin)
  const runnerYop = () => { setFaol(null); natijalarniYukla() }

  const b = xul?.banklar
  const caselar = xul?.caselar ?? []
  // Adaptiv ko'rinish: matritsa tavsiyasi (admin override bilan) ∩ bank bo'sh emas
  const mt = xul?.modul.mavzu_turi
  const bq = xul?.modul.bosqich ?? 'oson'
  const ov = xul?.modul.bolim_override
  const koFlash = !!b && b.flashcard > 0 && bolimKorinadi('flashcard', mt, bq, ov)
  const koTest = !!b && b.test > 0 && bolimKorinadi('test', mt, bq, ov)
  const koUsmle = !!b && b.usmle > 0 && bolimKorinadi('usmle', mt, bq, ov)
  const koCase = caselar.length > 0 && bolimKorinadi('case', mt, bq, ov)
  const hechnima = !!b && !koFlash && !koTest && !koUsmle && !koCase

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
      <Header backHref={`/student/urologiya/darslar/bosqich/${xul?.modul.bosqich ?? ''}`} backLabel={xul?.modul.nom ?? 'Modul'} />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '20px 20px 40px' }}>
        {loading ? (
          <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Yuklanmoqda…</p>
        ) : xato ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--muted)' }}>
            <p style={{ margin: '0 0 16px' }}>{xato}</p>
            <button onClick={() => router.push('/student/urologiya/darslar')} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '10px', padding: '11px 22px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
              Darslar ro&apos;yxati
            </button>
          </div>
        ) : faol ? (
          <>
            <button onClick={runnerYop} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--muted)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', padding: '4px 0', marginBottom: '14px' }}>
              <ArrowLeft size={15} strokeWidth={2.2} /> Mashqlar
            </button>
            {faol.tur === 'flashcard' && <FlashcardDeck modulId={modulId} rang={rang} />}
            {(faol.tur === 'test' || faol.tur === 'usmle') && <TestRunner modulId={modulId} tur={faol.tur} rang={rang} onTugadi={natijalarniYukla} />}
            {faol.tur === 'case' && <CaseRunner caseId={faol.caseId} sarlavha={faol.sarlavha} rang={rang} />}
          </>
        ) : (
          <>
            <span style={{ display: 'inline-block', background: rang + '16', color: rang, borderRadius: '999px', padding: '3px 11px', fontSize: '11px', fontWeight: 700, marginBottom: '10px' }}>
              Bilimni mustahkamlash
            </span>
            <h1 style={{ margin: '0 0 6px', fontSize: '23px', fontWeight: 800, lineHeight: 1.25 }}>{xul?.modul.nom}</h1>
            <p style={{ margin: '0 0 22px', color: 'var(--muted)', fontSize: '13px' }}>Xohlagan mashqni tanlang — ketma-ketlik shart emas.</p>

            {hechnima ? (
              <div style={{ background: 'var(--surface)', border: '1px dashed var(--line)', borderRadius: '16px', padding: '28px 22px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 6px', fontWeight: 800, fontSize: '14.5px' }}>Mashqlar tez orada</p>
                <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.65 }}>Bu modul uchun flashcard va testlar tayyorlanmoqda.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                {koFlash && (
                  <Guruh nom="Eslab qolish">
                    <MashqKarta Icon={Layers} rang={rang} sarlavha="Flashcard" tavsif={`${b!.flashcard} ta karta`} onClick={() => setFaol({ tur: 'flashcard' })} />
                  </Guruh>
                )}
                {(koTest || koCase) && (
                  <Guruh nom="Qo'llash">
                    {koTest && (
                      <MashqKarta Icon={ClipboardCheck} rang={rang} sarlavha="Amaliy test" tavsif={`${b!.test} ta savol · 70% o'tish`} natija={natijalar.test} onClick={() => setFaol({ tur: 'test' })} />
                    )}
                    {koCase && caselar.map((c) => (
                      <MashqKarta key={c.id} Icon={Building2} rang={rang} sarlavha={c.sarlavha} tavsif={`Klinik case · ${c.jami} bosqich`} onClick={() => setFaol({ tur: 'case', caseId: c.id, sarlavha: c.sarlavha })} />
                    ))}
                  </Guruh>
                )}
                {koUsmle && (
                  <Guruh nom="Tahlil qilish">
                    <MashqKarta Icon={GraduationCap} rang={rang} sarlavha="USMLE savollari" tavsif={`${b!.usmle} ta savol`} natija={natijalar.usmle} onClick={() => setFaol({ tur: 'usmle' })} />
                  </Guruh>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <BottomNav />
    </div>
  )
}

// ─────────────────────────── Kichik komponentlar ───────────────────────────

function Guruh({ nom, children }: { nom: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{nom}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>{children}</div>
    </div>
  )
}

function MashqKarta({ Icon, rang, sarlavha, tavsif, natija, onClick }: {
  Icon: typeof Layers; rang: string; sarlavha: string; tavsif: string
  natija?: { foiz: number; otdi: boolean }; onClick: () => void
}) {
  return (
    <button onClick={onClick} className="soft-press" style={{
      display: 'flex', alignItems: 'center', gap: '13px', textAlign: 'left', width: '100%',
      background: 'var(--surface)', border: '1px solid var(--line)', borderLeft: `3px solid ${rang}`,
      borderRadius: '14px', padding: '15px 16px', cursor: 'pointer',
    }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '11px', flexShrink: 0, background: rang + '18', color: rang, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={20} strokeWidth={2} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--ink)' }}>{sarlavha}</div>
        <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>{tavsif}</div>
      </div>
      {natija && (
        <span style={{ fontSize: '12px', fontWeight: 800, color: natija.otdi ? 'var(--good)' : 'var(--muted)', flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          {natija.otdi && <CheckCircle2 size={14} strokeWidth={2.4} />} {natija.foiz}%
        </span>
      )}
      <ArrowRight size={17} strokeWidth={2.2} style={{ color: 'var(--muted)', flexShrink: 0 }} />
    </button>
  )
}

// ─────────────────────────── Flashcard ───────────────────────────

function FlashcardDeck({ modulId, rang }: { modulId: string; rang: string }) {
  const supabase = createClient()
  const [kartalar, setKartalar] = useState<Flashcard[] | null>(null)
  const [i, setI] = useState(0)
  const [ochiq, setOchiq] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('kurs_flashcardlar')
        .select('old, yangi, kategoriya').eq('modul_id', modulId).order('sort_order', { ascending: true })
      setKartalar((data ?? []) as Flashcard[])
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modulId])

  if (!kartalar) return <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Yuklanmoqda…</p>
  if (kartalar.length === 0) return <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Flashcard yo‘q.</p>

  const k = kartalar[i]
  const oxirgi = i >= kartalar.length - 1
  const keyingi = () => { setOchiq(false); setI((p) => Math.min(p + 1, kartalar.length - 1)) }
  const oldingi = () => { setOchiq(false); setI((p) => Math.max(p - 1, 0)) }

  return (
    <div>
      <p style={{ margin: '0 0 12px', fontSize: '13px', color: 'var(--muted)', fontWeight: 700 }}>{i + 1} / {kartalar.length}</p>
      <div role="button" tabIndex={0} onClick={() => setOchiq((p) => !p)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOchiq((p) => !p) } }}
        aria-label={ochiq ? 'Javobni yashirish' : 'Javobni ko‘rsatish'}
        style={{
          minHeight: '190px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', gap: '10px', background: ochiq ? rang + '0e' : 'var(--surface)',
          border: `1.5px solid ${ochiq ? rang + '55' : 'var(--line)'}`, borderRadius: '18px', padding: '26px 22px', cursor: 'pointer',
        }}>
        {k.kategoriya && <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k.kategoriya}</span>}
        <p style={{ margin: 0, fontSize: '17px', fontWeight: 800, lineHeight: 1.4 }}>{k.old}</p>
        {ochiq ? (
          <p style={{ margin: '6px 0 0', fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.55 }}>{k.yangi}</p>
        ) : (
          <span style={{ fontSize: '12px', color: rang, fontWeight: 700 }}>Javobni ko‘rish uchun bosing</span>
        )}
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
        <button onClick={oldingi} disabled={i === 0} style={navBtn(i === 0)}>
          <ArrowLeft size={16} strokeWidth={2.2} /> Oldingi
        </button>
        <button onClick={keyingi} disabled={oxirgi} style={{ ...navBtn(oxirgi), background: oxirgi ? 'var(--surface-2)' : rang, color: oxirgi ? 'var(--muted)' : '#fff', border: 'none' }}>
          Keyingi <ArrowRight size={16} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  )
}

function navBtn(disabled: boolean): React.CSSProperties {
  return {
    flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
    background: 'var(--surface-2)', color: disabled ? 'var(--muted)' : 'var(--ink)',
    border: '1px solid var(--line)', borderRadius: '11px', padding: '12px', fontSize: '13.5px',
    fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1,
  }
}

// ─────────────────────────── Test / USMLE ───────────────────────────

function TestRunner({ modulId, tur, rang, onTugadi }: { modulId: string; tur: 'test' | 'usmle'; rang: string; onTugadi: () => void }) {
  const [urinishId, setUrinishId] = useState<string | null>(null)
  const [savollar, setSavollar] = useState<Savol[] | null>(null)
  const [javoblar, setJavoblar] = useState<Record<string, number>>({})
  const [natija, setNatija] = useState<{ ball: number; jami: number; foiz: number; otdi: boolean } | null>(null)
  const [holat, setHolat] = useState<'boshlanmagan' | 'yuklanmoqda' | 'ishlanmoqda' | 'yuborilmoqda'>('boshlanmagan')
  const [xato, setXato] = useState('')

  const boshlash = async () => {
    setHolat('yuklanmoqda'); setXato('')
    try {
      const res = await api({ _yol: 'test', amal: 'boshlash', modul_id: modulId, tur })
      if (res.status === 409) { setXato('Bu test hali tayyor emas.'); setHolat('boshlanmagan'); return }
      if (!res.ok) { setXato('Test boshlanmadi.'); setHolat('boshlanmagan'); return }
      const j = await res.json()
      setUrinishId(j.urinish_id); setSavollar((j.savollar ?? []) as Savol[]); setJavoblar({}); setNatija(null); setHolat('ishlanmoqda')
    } catch { setXato('Test boshlanmadi.'); setHolat('boshlanmagan') }
  }

  const topshir = async () => {
    if (!urinishId || !savollar) return
    setHolat('yuborilmoqda'); setXato('')
    try {
      const res = await api({ _yol: 'test', amal: 'topshirish', urinish_id: urinishId, javoblar: savollar.map((s) => javoblar[s.id]) })
      if (!res.ok) { setXato('Javob saqlanmadi — qayta urining.'); setHolat('ishlanmoqda'); return }
      const j = await res.json()
      setNatija({ ball: j.ball, jami: j.jami, foiz: j.foiz, otdi: j.otdi })
      setHolat('ishlanmoqda'); onTugadi()
    } catch { setXato('Javob saqlanmadi — qayta urining.'); setHolat('ishlanmoqda') }
  }

  const nom = tur === 'usmle' ? 'USMLE savollari' : 'Amaliy test'

  if (holat === 'boshlanmagan') {
    return (
      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
        <h2 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 800 }}>{nom}</h2>
        <p style={{ margin: '0 0 18px', fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5 }}>Savollar aralashtiriladi. O‘tish chegarasi — 70%.</p>
        {xato && <p role="alert" style={{ margin: '0 0 12px', fontSize: '13px', color: 'var(--danger)', fontWeight: 600 }}>{xato}</p>}
        <button onClick={boshlash} style={{ background: rang, color: '#fff', border: 'none', borderRadius: '12px', padding: '13px 26px', fontSize: '14.5px', fontWeight: 700, cursor: 'pointer' }}>Boshlash</button>
      </div>
    )
  }
  if (holat === 'yuklanmoqda' || !savollar) return <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Yuklanmoqda…</p>

  const hammaJavob = savollar.every((s) => javoblar[s.id] !== undefined)

  return (
    <div>
      <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 800 }}>{nom}</h2>
      <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--muted)' }}>{savollar.length} ta savol</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {savollar.map((q, qi) => (
          <div key={q.id} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '16px' }}>
            <p style={{ margin: '0 0 12px', fontSize: '14.5px', fontWeight: 700, lineHeight: 1.4 }}>{qi + 1}. {q.savol}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {q.variantlar.map((v, vi) => {
                const tanlangan = javoblar[q.id] === vi
                return (
                  <button key={vi} disabled={natija != null} aria-pressed={tanlangan}
                    onClick={() => setJavoblar((p) => ({ ...p, [q.id]: vi }))}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '9px', textAlign: 'left', width: '100%',
                      background: tanlangan ? rang + '16' : 'var(--surface-2)', border: `1.5px solid ${tanlangan ? rang : 'var(--line)'}`,
                      color: tanlangan ? rang : 'var(--ink-soft)', borderRadius: '10px', padding: '11px 13px',
                      fontSize: '13.5px', fontWeight: 600, cursor: natija != null ? 'default' : 'pointer',
                    }}>
                    <span>{v}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {xato && <p role="alert" style={{ margin: '12px 0 0', fontSize: '13px', color: 'var(--danger)', fontWeight: 600 }}>{xato}</p>}

      {natija == null ? (
        <button onClick={topshir} disabled={!hammaJavob || holat === 'yuborilmoqda'}
          style={{ marginTop: '16px', width: '100%', background: rang, color: '#fff', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: !hammaJavob || holat === 'yuborilmoqda' ? 'not-allowed' : 'pointer', opacity: !hammaJavob || holat === 'yuborilmoqda' ? 0.6 : 1 }}>
          {holat === 'yuborilmoqda' ? 'Yuborilmoqda…' : `Topshirish ${hammaJavob ? '' : `(${Object.keys(javoblar).length}/${savollar.length})`}`}
        </button>
      ) : (
        <div style={{ marginTop: '16px', textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '20px' }}>
          {natija.otdi && <Trophy size={28} strokeWidth={2} style={{ color: 'var(--good)', marginBottom: '6px' }} />}
          <p style={{ margin: '0 0 2px', fontSize: '24px', fontWeight: 800, color: natija.otdi ? 'var(--good)' : rang }}>{natija.foiz}%</p>
          <p style={{ margin: '0 0 14px', fontSize: '13px', color: 'var(--muted)' }}>{natija.ball} / {natija.jami} · {natija.otdi ? 'o‘tdingiz ✓' : 'o‘tish uchun 70% kerak'}</p>
          <button onClick={boshlash} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: '10px', padding: '10px 20px', fontSize: '13.5px', fontWeight: 700, cursor: 'pointer' }}>
            <RotateCcw size={15} strokeWidth={2.2} /> Qayta urinish
          </button>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────── Klinik case ───────────────────────────

type CaseBosqich = { bosqich_no: number; jami_bosqich: number; matn: string; variantlar: string[] }

function CaseRunner({ caseId, sarlavha, rang }: { caseId: string; sarlavha: string; rang: string }) {
  const [urinishId, setUrinishId] = useState<string | null>(null)
  const [bosqich, setBosqich] = useState<CaseBosqich | null>(null)
  const [keyingiBosqich, setKeyingiBosqich] = useState<CaseBosqich | null>(null)
  const [tanlov, setTanlov] = useState<number | null>(null)
  const [fikr, setFikr] = useState<{ togri: boolean; izoh: string | null } | null>(null)
  const [natija, setNatija] = useState<{ togri: number; jami: number } | null>(null)
  const [holat, setHolat] = useState<'boshlanmagan' | 'yuklanmoqda' | 'ishlanmoqda' | 'yuborilmoqda'>('boshlanmagan')
  const [xato, setXato] = useState('')

  const boshlash = async () => {
    setHolat('yuklanmoqda'); setXato(''); setNatija(null); setKeyingiBosqich(null); setFikr(null); setTanlov(null)
    try {
      const res = await api({ _yol: 'case', amal: 'boshlash', case_id: caseId })
      if (res.status === 409) { setXato('Bu case hali tayyor emas.'); setHolat('boshlanmagan'); return }
      if (!res.ok) { setXato('Case boshlanmadi.'); setHolat('boshlanmagan'); return }
      const j = await res.json()
      setUrinishId(j.urinish_id)
      if (j.tugadi) { setBosqich(null); setNatija({ togri: 0, jami: 0 }); setHolat('ishlanmoqda'); return }
      setBosqich(j.bosqich as CaseBosqich); setTanlov(null); setFikr(null); setHolat('ishlanmoqda')
    } catch { setXato('Case boshlanmadi.'); setHolat('boshlanmagan') }
  }

  const javobBer = async () => {
    if (!urinishId || !bosqich || tanlov == null) return
    setHolat('yuborilmoqda'); setXato('')
    try {
      const res = await api({ _yol: 'case', amal: 'javob', urinish_id: urinishId, bosqich_no: bosqich.bosqich_no, tanlov })
      if (!res.ok) { setXato('Javob saqlanmadi — qayta urining.'); setHolat('ishlanmoqda'); return }
      const j = await res.json()
      // Fikr JORIY bosqichga tegishli — hozircha shu bosqichni ekranда qoldiramiz.
      setFikr({ togri: j.joriy?.togri ?? false, izoh: j.joriy?.izoh ?? null })
      if (j.tugadi) { setNatija(j.natija ?? { togri: 0, jami: bosqich.jami_bosqich }); setKeyingiBosqich(null) }
      else { setKeyingiBosqich(j.keyingi as CaseBosqich) }
      setHolat('ishlanmoqda')
    } catch { setXato('Javob saqlanmadi — qayta urining.'); setHolat('ishlanmoqda') }
  }

  const keyingiga = () => { setBosqich(keyingiBosqich); setKeyingiBosqich(null); setTanlov(null); setFikr(null) }

  if (holat === 'boshlanmagan') {
    return (
      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
        <Building2 size={26} strokeWidth={2} style={{ color: rang, marginBottom: '6px' }} />
        <h2 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 800 }}>{sarlavha}</h2>
        <p style={{ margin: '0 0 18px', fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5 }}>Bosqichma-bosqich klinik holat. Har qadamda qaror qabul qilasiz.</p>
        {xato && <p role="alert" style={{ margin: '0 0 12px', fontSize: '13px', color: 'var(--danger)', fontWeight: 600 }}>{xato}</p>}
        <button onClick={boshlash} style={{ background: rang, color: '#fff', border: 'none', borderRadius: '12px', padding: '13px 26px', fontSize: '14.5px', fontWeight: 700, cursor: 'pointer' }}>Boshlash</button>
      </div>
    )
  }
  if (holat === 'yuklanmoqda') return <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Yuklanmoqda…</p>

  // Yakuniy natija
  if (natija) {
    return (
      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
        <Trophy size={28} strokeWidth={2} style={{ color: rang, marginBottom: '6px' }} />
        <h2 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 800 }}>Case tugadi</h2>
        {fikr?.izoh && (
          <p style={{ margin: '0 auto 12px', maxWidth: '440px', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.55, background: 'var(--surface-2)', borderRadius: '10px', padding: '11px 13px', textAlign: 'left' }}>{fikr.izoh}</p>
        )}
        {natija.jami > 0 && <p style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: 700 }}>{natija.togri} / {natija.jami} to‘g‘ri qaror</p>}
        <button onClick={boshlash} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: '10px', padding: '10px 20px', fontSize: '13.5px', fontWeight: 700, cursor: 'pointer' }}>
          <RotateCcw size={15} strokeWidth={2.2} /> Qaytadan
        </button>
      </div>
    )
  }

  if (!bosqich) return <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Yuklanmoqda…</p>

  return (
    <div>
      <p style={{ margin: '0 0 10px', fontSize: '13px', color: 'var(--muted)', fontWeight: 700 }}>Bosqich {bosqich.bosqich_no + 1} / {bosqich.jami_bosqich}</p>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '18px' }}>
        <p style={{ margin: '0 0 16px', fontSize: '14.5px', fontWeight: 600, lineHeight: 1.55 }}>{bosqich.matn}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {bosqich.variantlar.map((v, vi) => {
            const tanlangan = tanlov === vi
            const belgilangan = fikr != null
            let bg = 'var(--surface-2)', bd = 'var(--line)', col = 'var(--ink-soft)'
            if (belgilangan && tanlangan) {
              if (fikr!.togri) { bg = 'rgba(5,150,105,0.12)'; bd = 'var(--good)'; col = 'var(--good)' }
              else { bg = 'rgba(220,38,38,0.10)'; bd = 'var(--danger)'; col = 'var(--danger)' }
            } else if (tanlangan) { bg = rang + '16'; bd = rang; col = rang }
            return (
              <button key={vi} disabled={belgilangan} aria-pressed={tanlangan} onClick={() => setTanlov(vi)}
                style={{ display: 'flex', alignItems: 'center', gap: '9px', textAlign: 'left', width: '100%', background: bg, border: `1.5px solid ${bd}`, color: col, borderRadius: '10px', padding: '11px 13px', fontSize: '13.5px', fontWeight: 600, cursor: belgilangan ? 'default' : 'pointer' }}>
                {belgilangan && tanlangan && (fikr!.togri ? <CheckCircle2 size={15} strokeWidth={2.4} style={{ flexShrink: 0 }} /> : <XCircle size={15} strokeWidth={2.4} style={{ flexShrink: 0 }} />)}
                <span>{v}</span>
              </button>
            )
          })}
        </div>
        {fikr?.izoh && (
          <p style={{ margin: '12px 0 0', fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5, background: 'var(--surface-2)', borderRadius: '10px', padding: '10px 12px', display: 'flex', gap: '7px' }}>
            <Lightbulb size={14} strokeWidth={2} style={{ flexShrink: 0, marginTop: '1px', color: rang }} />
            <span>{fikr.izoh}</span>
          </p>
        )}
      </div>

      {xato && <p role="alert" style={{ margin: '12px 0 0', fontSize: '13px', color: 'var(--danger)', fontWeight: 600 }}>{xato}</p>}

      {fikr == null ? (
        <button onClick={javobBer} disabled={tanlov == null || holat === 'yuborilmoqda'}
          style={{ marginTop: '16px', width: '100%', background: rang, color: '#fff', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: tanlov == null || holat === 'yuborilmoqda' ? 'not-allowed' : 'pointer', opacity: tanlov == null || holat === 'yuborilmoqda' ? 0.6 : 1 }}>
          {holat === 'yuborilmoqda' ? 'Yuborilmoqda…' : 'Tasdiqlash'}
        </button>
      ) : (
        <button onClick={keyingiga}
          style={{ marginTop: '16px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', background: rang, color: '#fff', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}>
          Keyingi bosqich <ArrowRight size={17} strokeWidth={2.2} />
        </button>
      )}
    </div>
  )
}
