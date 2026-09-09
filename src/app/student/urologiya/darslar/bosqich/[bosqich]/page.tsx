'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import {
  BookOpen, Video, Layers, ClipboardCheck, Building2, Award, GraduationCap,
  CheckCircle2, Lock, Clock, ChevronDown, type LucideIcon,
} from 'lucide-react'
import { BOSQICH_RANG } from '@/lib/talim/darslar'

type KursDars = {
  id: string; modul_id: string | null; slug: string; sarlavha: string; kategoriya: string | null; qisqa: string | null
  daqiqa: number; modul_no: number; modul_nom: string | null
}

const YONALISH = 'urologiya'

// Urologiya-ga xos matnlar; rang/gradient bosqich yagona manbasidan.
const BOSQICH_MA: Record<string, { nom: string; ost: string; emoji: string; tavsif: string; gradient: string; accent: string }> = {
  oson: {
    nom: 'Foundation', ost: 'Urologiya asoslari', emoji: '🌱',
    tavsif: 'Urologiyani noldan tushunish — anatomiya, fiziologiya, simptomlar, bemorni tekshirish va asosiy tekshiruvlar.',
    gradient: BOSQICH_RANG['oson'].gradient, accent: BOSQICH_RANG['oson'].accent,
  },
  orta: {
    nom: 'Clinical', ost: 'Klinik urologiya', emoji: '🩺',
    tavsif: 'Kasallikni simptomdan tanish, differensial tashxis va asosiy diagnostika-davolash algoritmini o‘rganish.',
    gradient: BOSQICH_RANG["o'rta"].gradient, accent: BOSQICH_RANG["o'rta"].accent,
  },
  qiyin: {
    nom: 'Advanced Urology', ost: 'Murakkab klinik fikrlash', emoji: '👑',
    tavsif: 'Murakkab klinik vaziyatlarni tahlil qilish — onkologiya, endourologiya, neyro-urologiya va bepushtlik.',
    gradient: BOSQICH_RANG['qiyin'].gradient, accent: BOSQICH_RANG['qiyin'].accent,
  },
}

function bosqichBolimlar(bosqich: string): { Icon: LucideIcon; nom: string }[] {
  const asos = [
    { Icon: BookOpen, nom: 'Nazariya' },
    { Icon: Video, nom: 'Video' },
    { Icon: Layers, nom: 'Flashcard' },
    { Icon: ClipboardCheck, nom: 'Test' },
  ]
  if (bosqich === 'orta') return [...asos, { Icon: Building2, nom: 'Klinik holat' }, { Icon: GraduationCap, nom: 'Sertifikat' }]
  if (bosqich === 'qiyin') return [...asos, { Icon: Building2, nom: 'Klinik holat' }, { Icon: Award, nom: 'USMLE' }]
  return asos
}

type Modul = { no: number; id: string | null; nom: string; list: KursDars[] }

export default function UroBosqichDarslar() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const bosqich = String(params?.bosqich ?? '')
  const ma = BOSQICH_MA[bosqich]
  const [darslar, setDarslar] = useState<KursDars[]>([])
  const [tugallangan, setTugallangan] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  // undefined — foydalanuvchi tegmagan (birinchi tugamagan modul avtomatik ochiq);
  // number — o'sha modul ochiq; null — foydalanuvchi hammasini yopgan.
  const [ochiqModul, setOchiqModul] = useState<number | null | undefined>(undefined)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const [{ data: d }, progRes] = await Promise.all([
        supabase.from('kurs_darslar').select('id, modul_id, slug, sarlavha, kategoriya, qisqa, daqiqa, modul_no, modul_nom')
          .eq('yonalish', YONALISH).eq('faol', true).eq('bolim', 'darslar').eq('bosqich', bosqich)
          .order('modul_no').order('sort_order').order('created_at'),
        user ? supabase.from('kurs_progress').select('dars_id, korildi').eq('student_id', user.id) : Promise.resolve({ data: [] }),
      ])
      const darslarData = (d ?? []) as KursDars[]
      // kurs_progress dars_id bo'yicha — slug'ga xaritalaymiz (korildi = ko'rib chiqilgan)
      const korilganIds = new Set(((progRes.data ?? []) as { dars_id: string; korildi: boolean }[]).filter((r) => r.korildi).map((r) => r.dars_id))
      setDarslar(darslarData)
      setTugallangan(new Set(darslarData.filter((x) => korilganIds.has(x.id)).map((x) => x.slug)))
      setLoading(false)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bosqich])

  const bolimlar = bosqichBolimlar(bosqich)

  // Dars "bajarilgan" — nazariyasi ko'rib chiqilgan (kurs_progress.korildi)
  const bajarildi = (d: KursDars) => tugallangan.has(d.slug)

  // Ketma-ket qulf: darslar (modul_no, sort_order) bo'yicha tekis tartibda.
  // Dars ochiladi — undan oldingi tekis dars bajarilgan bo'lsa.
  const yopiqBelgi = (globalIndeks: number) => globalIndeks > 0 && !bajarildi(darslar[globalIndeks - 1])

  // Modullarga guruhlash — tekis indeksni saqlagan holda
  const modullar: Modul[] = useMemo(() => {
    const m = new Map<number, Modul>()
    for (const d of darslar) {
      const g = m.get(d.modul_no) ?? { no: d.modul_no, id: d.modul_id, nom: d.modul_nom ?? `${d.modul_no}-modul`, list: [] }
      if ((!g.nom || /-modul$/.test(g.nom)) && d.modul_nom) g.nom = d.modul_nom
      g.list.push(d)
      m.set(d.modul_no, g)
    }
    return Array.from(m.values()).sort((a, b) => a.no - b.no)
  }, [darslar])

  // Standart ochiq modul — birinchi tugallanmagan (foydalanuvchi tegmaguncha)
  const standartOchiq = useMemo(() => {
    if (modullar.length === 0) return null
    const birinchiTugamagan = modullar.find((m) => m.list.some((d) => !bajarildi(d)))
    return (birinchiTugamagan ?? modullar[0]).no
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modullar, tugallangan])

  const ochiqNo = ochiqModul === undefined ? standartOchiq : ochiqModul

  if (!ma) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
        <Header backHref="/student/urologiya/darslar" backLabel="Urologiya darslari" />
        <div className="mx-auto max-w-[760px] px-8 py-12"><p>Bosqich topilmadi.</p></div>
      </div>
    )
  }

  const modulTugadi = (m: Modul) => m.list.every((d) => bajarildi(d))
  const modulProgress = (m: Modul) => m.list.filter((d) => tugallangan.has(d.slug)).length

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
      <Header backHref="/student/urologiya/darslar" backLabel="Urologiya darslari" />

      {/* Hero banner */}
      <div style={{ background: ma.gradient, color: 'white', padding: '36px 24px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-20px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        <div className="mx-auto max-w-[760px]" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', flexShrink: 0 }}>
              {ma.emoji}
            </div>
            <div>
              <p style={{ margin: '0 0 2px', fontSize: '11px', fontWeight: 700, opacity: 0.75, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Bosqich</p>
              <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 900, lineHeight: 1.2 }}>{ma.nom}</h1>
              <p style={{ margin: '2px 0 0', fontSize: '12.5px', opacity: 0.85 }}>{ma.ost}</p>
            </div>
          </div>

          <p style={{ margin: '0 0 20px', fontSize: '14px', opacity: 0.9, lineHeight: 1.6, maxWidth: '520px' }}>{ma.tavsif}</p>

          {/* Statistika */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '22px' }}>
            {[
              { qiymat: `${modullar.length} ta`, tavsif: 'modul' },
              { qiymat: `${darslar.length} ta`, tavsif: 'dars' },
              bosqich === 'oson' ? { qiymat: '100%', tavsif: 'bepul' } : { qiymat: bosqich === 'qiyin' ? 'PRO' : 'Klinik', tavsif: 'daraja' },
            ].map((s) => (
              <div key={s.tavsif} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '14px', padding: '10px 18px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 900 }}>{s.qiymat}</div>
                <div style={{ fontSize: '11px', opacity: 0.8, fontWeight: 600 }}>{s.tavsif}</div>
              </div>
            ))}
          </div>

          {/* Bo'limlar chiplari */}
          <div>
            <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 700, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bu bosqichda</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {bolimlar.map((b) => (
                <span key={b.nom} style={{ background: 'rgba(255,255,255,0.18)', borderRadius: '999px', padding: '5px 14px', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <b.Icon size={13} strokeWidth={2} /> {b.nom}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[760px] px-6 py-6">
        {loading ? (
          <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Yuklanmoqda…</p>
        ) : darslar.length === 0 ? (
          <div style={{ background: 'var(--surface)', border: '1px dashed var(--line)', borderRadius: '16px', padding: '28px 22px', textAlign: 'center' }}>
            <div style={{ fontSize: '30px', marginBottom: '10px' }}>🌱</div>
            <p style={{ margin: '0 0 6px', fontWeight: 800, fontSize: '14.5px' }}>Bu bosqich tayyorlanmoqda</p>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.65 }}>Modullar tez orada shu yerda paydo bo&apos;ladi.</p>
          </div>
        ) : (
          <>
            <div className="rise" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 14px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800 }}>Modullar</h3>
              <span style={{ minWidth: '24px', height: '24px', borderRadius: '999px', background: 'var(--ink)', color: 'var(--bg)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, padding: '0 7px' }}>{modullar.length}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {modullar.map((m) => {
                const ochiq = ochiqNo === m.no
                const tugadi = modulTugadi(m)
                const nechta = modulProgress(m)
                return (
                  <div key={m.no} style={{
                    background: 'var(--surface)', border: '1px solid var(--line)',
                    borderRadius: '18px', overflow: 'hidden',
                  }}>
                    {/* Modul sarlavhasi — bosiladigan */}
                    <button onClick={() => setOchiqModul(ochiq ? null : m.no)} className="soft-press" style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left',
                      background: ochiq ? ma.accent + '10' : 'transparent', border: 'none', cursor: 'pointer',
                      padding: '15px 18px',
                    }}>
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '11px', flexShrink: 0,
                        background: tugadi ? '#16a34a18' : ma.accent + '18', color: tugadi ? '#16a34a' : ma.accent,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 800,
                      }}>{tugadi ? <CheckCircle2 size={20} strokeWidth={2.2} /> : m.no}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--ink)', lineHeight: 1.3 }}>{m.nom}</div>
                        <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '2px' }}>
                          {nechta}/{m.list.length} dars {tugadi ? '· tugallangan' : ''}
                        </div>
                      </div>
                      <ChevronDown size={18} strokeWidth={2.2} style={{ color: 'var(--muted)', flexShrink: 0, transform: ochiq ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
                    </button>

                    {/* Modul ichidagi darslar */}
                    {ochiq && (
                      <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {m.list.map((d) => {
                          const gi = darslar.indexOf(d)
                          const yopiq = yopiqBelgi(gi)
                          const dTugadi = tugallangan.has(d.slug)
                          return (
                            <div key={d.slug} onClick={yopiq ? undefined : () => router.push(`/student/urologiya/darslar/${d.slug}`)}
                              className={yopiq ? '' : 'soft-press'} style={{
                                display: 'flex', alignItems: 'center', gap: '11px',
                                background: dTugadi ? 'linear-gradient(135deg, #16a34a10, #05966910)' : 'var(--surface-2)',
                                border: dTugadi ? '1px solid #16a34a55' : '1px solid var(--line)',
                                borderLeft: `3px solid ${ma.accent}`, borderRadius: '12px', padding: '12px 14px',
                                cursor: yopiq ? 'not-allowed' : 'pointer', opacity: yopiq ? 0.55 : 1,
                              }}>
                              <div style={{
                                width: '26px', height: '26px', borderRadius: '8px', flexShrink: 0,
                                background: dTugadi ? '#16a34a20' : ma.accent + '15',
                                color: dTugadi ? '#16a34a' : ma.accent,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800,
                              }}>
                                {dTugadi ? <CheckCircle2 size={15} strokeWidth={2.4} /> : yopiq ? <Lock size={13} strokeWidth={2.4} /> : gi + 1}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.35, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{d.sarlavha}</div>
                                <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <Clock size={11} strokeWidth={2} /> {d.daqiqa} daq {yopiq ? '· oldingi darsni tugating' : ''}
                                </div>
                              </div>
                              <span style={{ fontSize: '12px', color: yopiq ? 'var(--muted)' : ma.accent, fontWeight: 700, flexShrink: 0 }}>
                                {yopiq ? '' : dTugadi ? '↻' : '→'}
                              </span>
                            </div>
                          )
                        })}

                        {/* Modul mashq markazi — bilimni mustahkamlash */}
                        {m.id && (
                          <button onClick={() => router.push(`/student/urologiya/darslar/modul/${m.id}`)} className="soft-press"
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', textAlign: 'left', marginTop: '2px', background: ma.accent + '12', border: `1px dashed ${ma.accent}66`, borderRadius: '12px', padding: '12px 14px', cursor: 'pointer' }}>
                            <div style={{ width: '26px', height: '26px', borderRadius: '8px', flexShrink: 0, background: ma.accent + '20', color: ma.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Layers size={15} strokeWidth={2.2} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '13px', fontWeight: 800, color: ma.accent }}>Bilimni mustahkamlash</div>
                              <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '1px' }}>Flashcard · test · case</div>
                            </div>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}

        {!loading && darslar.length > 0 && bosqich !== 'oson' && (
          <SertifikatKarti bosqich={bosqich} rang={ma.accent} />
        )}
      </div>

      <BottomNav />
    </div>
  )
}

// ─────────────────────────── Bosqich sertifikati ───────────────────────────

type SertHolat = {
  amaldagi: boolean; jami: number; otgan: number; bankSiz: number
  tayyorlanmoqda: boolean; loyiqmi: boolean; ortachaFoiz: number; sertifikat: string | null
}

function SertifikatKarti({ bosqich, rang }: { bosqich: string; rang: string }) {
  const router = useRouter()
  const [holat, setHolat] = useState<SertHolat | null>(null)
  const [yuklandi, setYuklandi] = useState(false)
  const [olinmoqda, setOlinmoqda] = useState(false)
  const [xato, setXato] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/kurs/sertifikat', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amal: 'holat', yonalish: YONALISH, bosqich }),
        })
        if (res.ok) setHolat((await res.json()) as SertHolat)
      } catch { /* jim */ }
      setYuklandi(true)
    }
    load()
  }, [bosqich])

  const ol = async () => {
    setOlinmoqda(true); setXato('')
    try {
      const res = await fetch('/api/kurs/sertifikat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amal: 'ber', yonalish: YONALISH, bosqich }),
      })
      const j = await res.json()
      if (!res.ok) { setXato(j.error ?? 'Sertifikat olinmadi'); setOlinmoqda(false); return }
      router.push(`/sertifikat/${j.kod}`)
    } catch { setXato('Sertifikat olinmadi — qayta urining.'); setOlinmoqda(false) }
  }

  if (!yuklandi || !holat || !holat.amaldagi) return null

  const foiz = holat.jami > 0 ? Math.round((holat.otgan / holat.jami) * 100) : 0

  return (
    <div style={{ marginTop: '22px', background: 'var(--surface)', border: `1px solid ${holat.sertifikat ? '#16a34a55' : 'var(--line)'}`, borderRadius: '18px', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '12px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '11px', flexShrink: 0, background: holat.sertifikat ? '#16a34a18' : rang + '18', color: holat.sertifikat ? '#16a34a' : rang, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Award size={22} strokeWidth={2} />
        </div>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 800 }}>Bosqich sertifikati</div>
          <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '1px' }}>{holat.otgan}/{holat.jami} majburiy modul testi o‘tildi</div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ height: '8px', borderRadius: '999px', background: 'var(--surface-2)', overflow: 'hidden', marginBottom: '14px' }}>
        <div style={{ height: '100%', width: `${foiz}%`, background: holat.sertifikat ? '#16a34a' : rang, borderRadius: '999px', transition: 'width .3s' }} />
      </div>

      {xato && <p role="alert" style={{ margin: '0 0 10px', fontSize: '12.5px', color: 'var(--danger)', fontWeight: 600 }}>{xato}</p>}

      {holat.sertifikat ? (
        <button onClick={() => router.push(`/sertifikat/${holat.sertifikat}`)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '12px', padding: '13px', fontSize: '14.5px', fontWeight: 700, cursor: 'pointer' }}>
          <CheckCircle2 size={17} strokeWidth={2.2} /> Sertifikatni ko‘rish
        </button>
      ) : holat.tayyorlanmoqda ? (
        <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.55 }}>
          Bu bosqich hali tayyorlanmoqda — {holat.bankSiz} ta majburiy modulda test banki yoki nashr yo‘q. To‘liq bo‘lgach sertifikat ochiladi.
        </p>
      ) : holat.loyiqmi ? (
        <button onClick={ol} disabled={olinmoqda}
          style={{ width: '100%', background: rang, color: '#fff', border: 'none', borderRadius: '12px', padding: '13px', fontSize: '14.5px', fontWeight: 700, cursor: olinmoqda ? 'not-allowed' : 'pointer', opacity: olinmoqda ? 0.6 : 1 }}>
          {olinmoqda ? 'Olinmoqda…' : 'Sertifikatni olish'}
        </button>
      ) : (
        <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.55 }}>
          Barcha majburiy modul testlaridan (70%) o‘tsangiz, bosqich sertifikati ochiladi.
        </p>
      )}
    </div>
  )
}
