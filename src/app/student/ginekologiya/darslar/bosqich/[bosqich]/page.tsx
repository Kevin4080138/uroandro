'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import {
  BookOpen, Video, Layers, ClipboardCheck, Building2, Award, GraduationCap,
  CheckCircle2, Lock, Clock, type LucideIcon,
} from 'lucide-react'
import { BOSQICH_RANG } from '@/lib/talim/darslar'

type GinDars = { slug: string; sarlavha: string; kategoriya: string | null; qisqa: string | null; daqiqa: number; test_savollar: unknown }

// Ginekologiya-ga xos matnlar; rang/gradient bosqich yagona manbasidan.
const BOSQICH_MA: Record<string, { nom: string; ost: string; emoji: string; tavsif: string; gradient: string; accent: string }> = {
  oson: {
    nom: 'Foundation', ost: 'Ginekologiya asoslari', emoji: '🌱',
    tavsif: 'Ginekologiyani noldan tushunish — anatomiya, fiziologiya, hayz sikli, tekshirish va kontratseptsiya asoslari.',
    gradient: BOSQICH_RANG['oson'].gradient, accent: BOSQICH_RANG['oson'].accent,
  },
  orta: {
    nom: 'Clinical', ost: 'Klinik ginekologiya', emoji: '🩺',
    tavsif: 'Kasallikni simptomdan tanish, differensial tashxis va asosiy diagnostika-davolash algoritmini o‘rganish.',
    gradient: BOSQICH_RANG["o'rta"].gradient, accent: BOSQICH_RANG["o'rta"].accent,
  },
  qiyin: {
    nom: 'Advanced Gynecology', ost: 'Murakkab klinik fikrlash', emoji: '👑',
    tavsif: 'Murakkab klinik vaziyatlarni tahlil qilish — PCOS, onkologiya, bepushtlik, homiladorlik va menopauza.',
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

export default function GinBosqichDarslar() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const bosqich = String(params?.bosqich ?? '')
  const ma = BOSQICH_MA[bosqich]
  const [darslar, setDarslar] = useState<GinDars[]>([])
  const [tugallangan, setTugallangan] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [filtr, setFiltr] = useState('Hammasi')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const [{ data: d }, natRes] = await Promise.all([
        supabase.from('gin_darslar').select('slug, sarlavha, kategoriya, qisqa, daqiqa, test_savollar')
          .eq('faol', true).eq('bolim', 'darslar').eq('bosqich', bosqich).order('sort_order').order('created_at'),
        user ? supabase.from('gin_natijalar').select('dars_slug').eq('student_id', user.id) : Promise.resolve({ data: [] }),
      ])
      setDarslar((d ?? []) as GinDars[])
      setTugallangan(new Set(((natRes.data ?? []) as { dars_slug: string }[]).map((r) => r.dars_slug)))
      setLoading(false)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bosqich])

  const bolimlar = bosqichBolimlar(bosqich)
  const kategoriyalar = useMemo(
    () => ['Hammasi', ...Array.from(new Set(darslar.map((d) => d.kategoriya).filter(Boolean) as string[]))],
    [darslar]
  )
  const royxat = filtr === 'Hammasi' ? darslar : darslar.filter((d) => d.kategoriya === filtr)

  // Dars "bajarilgan" — test natijasi bor yoki testi yo'q (bloklamaydi)
  const bajarildi = (d: GinDars) => tugallangan.has(d.slug) || !(Array.isArray(d.test_savollar) && d.test_savollar.length > 0)

  if (!ma) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
        <Header backHref="/student/ginekologiya/darslar" backLabel="Ginekologiya darslari" />
        <div className="mx-auto max-w-[760px] px-8 py-12"><p>Bosqich topilmadi.</p></div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
      <Header backHref="/student/ginekologiya/darslar" backLabel="Ginekologiya darslari" />

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
              { qiymat: `${darslar.length} ta`, tavsif: 'modul' },
              bosqich === 'oson' ? { qiymat: '100%', tavsif: 'bepul' } : { qiymat: bosqich === 'qiyin' ? 'PRO' : 'Klinik', tavsif: 'daraja' },
              { qiymat: `${bolimlar.length} ta`, tavsif: "bo'lim" },
            ].map((s) => (
              <div key={s.tavsif} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '14px', padding: '10px 18px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 900 }}>{s.qiymat}</div>
                <div style={{ fontSize: '11px', opacity: 0.8, fontWeight: 600 }}>{s.tavsif}</div>
              </div>
            ))}
          </div>

          {/* Bo'limlar chiplari */}
          <div>
            <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 700, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Har bir darsda mavjud</p>
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
        {/* Kategoriya filtri */}
        {kategoriyalar.length > 2 && (
          <div className="rise" style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {kategoriyalar.map((kat) => (
              <button key={kat} onClick={() => setFiltr(kat)} className="soft-press" style={{
                background: filtr === kat ? ma.accent : 'var(--surface-2)', color: filtr === kat ? 'white' : 'var(--ink-soft)',
                border: filtr === kat ? 'none' : '1px solid var(--line)', borderRadius: '999px', padding: '8px 16px',
                fontSize: '12.5px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
              }}>{kat}</button>
            ))}
          </div>
        )}

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
              <span style={{ minWidth: '24px', height: '24px', borderRadius: '999px', background: 'var(--ink)', color: 'var(--bg)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, padding: '0 7px' }}>{royxat.length}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {royxat.map((d) => {
                const indeks = darslar.indexOf(d)
                const yopiq = indeks > 0 && !bajarildi(darslar[indeks - 1])
                const tugadi = tugallangan.has(d.slug)
                return (
                  <div key={d.slug} onClick={yopiq ? undefined : () => router.push(`/student/ginekologiya/darslar/${d.slug}`)}
                    className={yopiq ? 'rise' : 'rise lift'} style={{
                      background: tugadi ? 'linear-gradient(135deg, #16a34a10, #05966910)' : 'var(--surface)',
                      border: tugadi ? '1.5px solid #16a34a88' : '1px solid var(--line)',
                      borderLeft: `4px solid ${ma.accent}`, borderRadius: '18px', padding: '18px 20px',
                      cursor: yopiq ? 'not-allowed' : 'pointer', opacity: yopiq ? 0.55 : 1, position: 'relative',
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '10px', flexShrink: 0, background: ma.accent + '18', color: ma.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800 }}>{indeks + 1}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            {tugadi && <span style={{ fontSize: '10px', fontWeight: 800, color: '#16a34a', background: '#16a34a18', borderRadius: '999px', padding: '2px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={12} strokeWidth={2.2} /> Tugallangan</span>}
                            {yopiq && <span style={{ fontSize: '10px', fontWeight: 800, color: '#6b7280', background: 'var(--surface-2)', borderRadius: '999px', padding: '2px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Lock size={11} strokeWidth={2.2} /> Oldingi darsni tugating</span>}
                          </div>
                          <h3 style={{ margin: '2px 0 0', fontSize: '15px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.35, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{d.sarlavha}</h3>
                        </div>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--muted)', whiteSpace: 'nowrap', flexShrink: 0, paddingTop: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={12} strokeWidth={2} /> {d.daqiqa} daqiqa</span>
                    </div>

                    {d.qisqa && <p style={{ margin: '0 0 12px', fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.55, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{d.qisqa}</p>}

                    <div style={{ height: '1px', background: 'var(--line)', margin: '0 0 12px' }} />

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                      {bolimlar.map((b) => (
                        <span key={b.nom} style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)', background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '999px', padding: '3px 10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <b.Icon size={12} strokeWidth={2} /> {b.nom}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      {d.kategoriya && <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600, border: '1px solid var(--line)', borderRadius: '999px', padding: '3px 10px' }}>{d.kategoriya}</span>}
                      <span style={{ marginLeft: 'auto', fontSize: '12px', color: ma.accent, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        {yopiq ? <><Lock size={12} strokeWidth={2} /> Yopiq</> : tugadi ? 'Takrorlash →' : 'Ochish →'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
