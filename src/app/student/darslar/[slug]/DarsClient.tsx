'use client'

import { useEffect, useRef, useState } from 'react'
import { Header } from '@/components/Header'
import { createClient } from '@/lib/supabase'
import { darsTop, BOSQICHLAR, BOSQICH_RANG, type TestSavoli, type UsmleSavoli } from '@/lib/talim/darslar'
import { useMeningObunalarim } from '@/lib/talim/useObuna'
import { useDarsProgress, BOSQICH_QADAMLARI } from '@/lib/talim/useDarsProgress'
import { useTariflar, narxFmt } from '@/lib/talim/tariflar'
import { klinikHolatlarOl } from '@/lib/talim/klinikHolatlar'
import { interaktivCaselarOl } from '@/lib/talim/interaktivCaselar'
import { xatolarTahliliOl } from '@/lib/talim/xatolarTahlili'
import { vaziyatliMasalalarOl } from '@/lib/talim/vaziyatliMasalalar'
import { type Flashcard } from '@/lib/talim/flashcardlar'
import {
  BookOpen, Video, FolderDown, Layers, ClipboardCheck, Award, Building2, Puzzle,
  ClipboardList, Search, GraduationCap, CheckCircle2, Lock, type LucideIcon,
} from 'lucide-react'
import { type Tab, type Adabiyot } from './bolimlar/types'
import { BoshUlash } from './bolimlar/BoshUlash'
import { NazariyaBolimi, VideoBolimi, YuklabOlishBolimi, FlashcardBolimi } from './bolimlar/MateriallarBolimlari'
import { AmaliyTestBolimi, UsmleTestBolimi, NazoratTestBolimi } from './bolimlar/TestBolimlari'
import { KlinikHolatlarBolimi, InteraktivCaseBolimi, XatolarTahlilyBolimi, VaziyatliMasalaBolimi } from './bolimlar/CaseBolimlari'
import { KeyingiQadamFab } from './KeyingiQadamFab'

// FAB "keyingi qadam" prototipi. `true` — suzuvchi yetaklovchi tugma,
// `false` — eski keng pastki navigatsiya paneli.
const FAB_PROTOTIP = true

// Darsning "yengil" tarkibi — nazariya matni va havolalar. Buni server komponent
// (page.tsx) oldindan olib beradi, shuning uchun sahifa ochilishi bilan matn joyida
// bo'ladi: brauzer avval JS ni yuklab, keyin bazaga borishini kutmaydi.
export type DarsMatni = {
  nazariya_html: string | null
  asosiy_video_url: string | null
  video_linklar: string[] | null
  adabiyotlar: Adabiyot[] | null
  konspekt_url: string | null
  prezentatsiya_url: string | null
  nazorat_savol_soni: number | null
  nazorat_vaqt_daqiqa: number | null
  sertifikat_otish_foizi: number | null
}

type DarsBanklari = {
  savollar_banki: TestSavoli[] | null
  usmle_savollar: UsmleSavoli[] | null
  flashcardlar: Flashcard[] | null
}

const BOSH_BANKLAR: DarsBanklari = {
  savollar_banki: null, usmle_savollar: null, flashcardlar: null,
}

// Savol banklari va flashcardlar og'ir (dars bo'yicha 100+ savol, 20-40 karta)
// va faqat mashq qadamlari ochilganda kerak bo'ladi. Shuning uchun ular sahifa
// bilan birga emas, talaba o'sha qadamga o'tganda yuklanadi — nazariyani o'qib
// chiqib ketadigan talaba ularni umuman yuklab olmaydi.
//
// Flashcardlar ilgari `flashcardlar.ts` dan kelardi va u client komponentga
// import qilingani uchun BARCHA darslarning kartalari (149 KB) har bir
// talabaga tushardi. Endi ular ham shu yerdan, bittagina so'rov bilan keladi.
function useDarsBanklari(slug: string, kerakmi: boolean) {
  const supabase = createClient()
  const [banklar, setBanklar] = useState<DarsBanklari | null>(null)
  // Takroriy so'rovni to'sish uchun ref — state emas, chunki uni effekt ichida
  // sinxron o'zgartirish qayta render chaqiradi va keraksiz aylanish hosil qiladi.
  const sorovYuborildi = useRef<string | null>(null)

  useEffect(() => {
    if (!kerakmi || sorovYuborildi.current === slug) return
    sorovYuborildi.current = slug
    supabase
      .from('dars_tarkibi')
      .select('savollar_banki, usmle_savollar, flashcardlar')
      .eq('dars_slug', slug)
      .maybeSingle()
      .then(({ data }) => {
        // Qator topilmasa ham sahifa buzilmasin — bank bo'sh qoladi.
        setBanklar((data as DarsBanklari) ?? BOSH_BANKLAR)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, kerakmi])

  return { banklar, banklarYuklandi: banklar !== null }
}

export function DarsClient({ slug, tarkib }: { slug: string; tarkib: DarsMatni | null }) {
  const dars = darsTop(slug)
  const { egami, yuklandi: obunaYuklandi, adminmi } = useMeningObunalarim()

  const nazariyaHtml = tarkib?.nazariya_html ?? dars?.nazariyaHtml
  const asosiyVideo = tarkib?.asosiy_video_url ?? dars?.asosiyVideoUrl ?? null
  const videoLinklar = tarkib?.video_linklar ?? dars?.videoLinklar ?? []
  const adabiyotlar = tarkib?.adabiyotlar ?? []
  // Bular endi public URL emas — 'dars-materiallari' (yopiq bucket) ichidagi fayl yo'li.
  const konspektYoli = tarkib?.konspekt_url ?? dars?.konspektUrl
  const prezentatsiyaYoli = tarkib?.prezentatsiya_url ?? dars?.prezentatsiyaUrl
  const amaliySavolSoni = dars?.amaliySavolSoni ?? 20
  const nazoratVaqtDaqiqa = tarkib?.nazorat_vaqt_daqiqa ?? dars?.nazoratVaqtDaqiqa ?? 15
  const sertifikatOtishFoizi = tarkib?.sertifikat_otish_foizi ?? dars?.sertifikatOtishFoizi ?? 70

  const klinikHolatlar = klinikHolatlarOl(slug)
  const interaktivCaselar = interaktivCaselarOl(slug)
  const xatolarTahlili = xatolarTahliliOl(slug)
  const vaziyatliMasalalar = vaziyatliMasalalarOl(slug)

  const tabMavjud: Record<Tab, boolean> = {
    nazariya: true,
    video: true,
    yuklab: true,
    amaliy: true,
    flashcard: true,
    usmle: dars?.bosqich !== 'oson',
    nazorat: dars?.bosqich !== 'oson',
    klinik: dars?.bosqich === 'qiyin',
    interaktiv: dars?.bosqich === 'qiyin',
    vaziyatli: dars?.bosqich === 'qiyin',
    xatolar: dars?.bosqich === 'qiyin',
  }
  const QADAM_NOMI: Record<Tab, { Icon: LucideIcon; nom: string; turi: string }> = {
    nazariya:   { Icon: BookOpen,       nom: 'Nazariya',         turi: "O'qish" },
    video:      { Icon: Video,          nom: 'Video',            turi: 'Video' },
    yuklab:     { Icon: FolderDown,     nom: 'Materiallar',      turi: 'Fayllar' },
    flashcard:  { Icon: Layers,         nom: 'Flashcard',        turi: 'Takrorlash' },
    amaliy:     { Icon: ClipboardCheck, nom: 'Amaliy test',      turi: 'Mashq' },
    usmle:      { Icon: Award,          nom: 'USMLE',            turi: 'Mashq' },
    klinik:     { Icon: Building2,      nom: 'Klinik holat',     turi: 'Klinika' },
    interaktiv: { Icon: Puzzle,         nom: 'Interaktiv case',  turi: 'Simulyatsiya' },
    vaziyatli:  { Icon: ClipboardList,  nom: 'Vaziyatli masala', turi: 'Masala' },
    xatolar:    { Icon: Search,         nom: 'Xatolar tahlili',  turi: 'Tahlil' },
    nazorat:    { Icon: GraduationCap,  nom: 'Nazorat',          turi: 'Imtihon' },
  }

  const accent = BOSQICH_RANG[dars?.bosqich ?? 'oson'].accent
  const accent2 = dars?.bosqich === 'oson' ? '#059669' : dars?.bosqich === "o'rta" ? '#f59e0b' : '#e11d48'

  // Qadamlar ketma-ketligi — bosqichga qarab (path-interfeys tartibi)
  const qadamlar = (BOSQICH_QADAMLARI[dars?.bosqich ?? 'oson'] as Tab[]).filter((t) => tabMavjud[t])

  const [joriy, setJoriy] = useState(0)
  const [tarkibOchiq, setTarkibOchiq] = useState(false)
  const [progressSaqlanmoqda, setProgressSaqlanmoqda] = useState(false)
  const { tugallangan, yakunla, saqlashXatosi, saqlashXatosiniTozala } = useDarsProgress(slug)
  const { bosqichniki: bosqichTariflari } = useTariflar()

  const qadam = qadamlar[Math.min(joriy, qadamlar.length - 1)]
  const progress = qadamlar.length ? Math.round((qadamlar.filter((t) => tugallangan.has(t)).length / qadamlar.length) * 100) : 0

  // Banklar faqat mashq qadamlaridan biri ochilganda yuklanadi.
  const banklarKerak = qadam === 'flashcard' || qadam === 'amaliy' || qadam === 'usmle' || qadam === 'nazorat'
  const { banklar, banklarYuklandi } = useDarsBanklari(slug, banklarKerak)
  const amaliyBank = banklar?.savollar_banki?.length ? banklar.savollar_banki
    : dars?.savollarBanki?.length ? dars.savollarBanki : dars?.test ?? []
  const usmleBank = banklar?.usmle_savollar ?? dars?.usmleSavollar ?? []
  const flashcardlar = banklar?.flashcardlar ?? []

  // Qadam ochiqmi: birinchisi har doim; keyingilari oldingi qadam yakunlangach.
  // Admin — istisno: tarkibni tekshirish uchun qadamlarni ketma-ket
  // bosib o'tishga majbur bo'lmasin, istalgan bo'limni darrov ocha olsin.
  const ochiqMi = (i: number) =>
    adminmi || i === 0 || tugallangan.has(qadamlar[i - 1]) || tugallangan.has(qadamlar[i])

  const qadamgaOt = (i: number) => {
    if (i < 0 || i >= qadamlar.length || !ochiqMi(i)) return
    setJoriy(i)
    setTarkibOchiq(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const yakunlaVaDavom = async () => {
    if (progressSaqlanmoqda) return
    // Tugallangan qadamda DB yozuvi takrorlanmaydi; faqat keyingisiga o'tamiz.
    if (!tugallangan.has(qadam)) {
      setProgressSaqlanmoqda(true)
      const saqlandi = await yakunla(qadam)
      setProgressSaqlanmoqda(false)
      if (!saqlandi) return
    }
    if (joriy < qadamlar.length - 1) {
      setJoriy(joriy + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (!dars) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
        <Header backHref="/student/darslar" backLabel="Darslar" />
        <div className="mx-auto max-w-[760px] px-8 py-12">
          <p>Dars topilmadi.</p>
        </div>
      </div>
    )
  }

  if (!dars.bepulNamuna && obunaYuklandi && !egami(dars.bosqich)) {
    const bosqichMa = BOSQICHLAR.find((b) => b.id === dars.bosqich)
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
        <Header backHref="/student/darslar" backLabel="Darslar" />
        <div className="mx-auto max-w-[600px] px-5 py-10 sm:px-8 sm:py-12">
          <div className="rise" style={{
            background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '18px',
            padding: '40px 32px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔒</div>
            <h2 style={{ margin: '0 0 8px', fontSize: '19px', fontWeight: 800 }}>{dars.sarlavha}</h2>
            <p style={{ margin: '0 0 18px', fontSize: '13.5px', color: 'var(--muted)' }}>
              Bu dars <strong>{bosqichMa?.emoji} {bosqichMa?.nom}</strong> bosqichiga tegishli — uni ko&apos;rish uchun shu bosqichni sotib olishingiz kerak.
            </p>
            {bosqichTariflari(dars.bosqich).length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
                {bosqichTariflari(dars.bosqich).map((t) => (
                  <div key={t.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px',
                    background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '12px',
                    padding: '11px 16px', textAlign: 'left',
                  }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 800 }}>{t.nom}</div>
                      {t.tavsif && <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{t.tavsif}</div>}
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '13.5px', fontWeight: 900, color: 'var(--accent)' }}>{narxFmt(t.narx)}</div>
                      <div style={{ fontSize: '10.5px', color: 'var(--muted)', fontWeight: 600 }}>{t.muddat_oy ? `${t.muddat_oy} oy` : 'Muddatsiz'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <a href="https://t.me/urolog_arabboyev" target="_blank" rel="noopener noreferrer" className="btn-animated soft-press" style={{
              display: 'inline-block', background: 'var(--accent)', color: 'white', textDecoration: 'none',
              borderRadius: '12px', padding: '12px 26px', fontSize: '14px', fontWeight: 700,
            }}>
              Sotib olish uchun bog&apos;lanish →
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Har qadam yonidagi vaqt/son chipi — talaba nima kutishini biladi (Elevate uslubi)
  const FLASH_SONI: Record<string, number> = { oson: 10, "o'rta": 15, qiyin: 20 }
  const qadamChip = (t: Tab): string => {
    switch (t) {
      case 'nazariya': return `${dars.daqiqa} daq`
      case 'video': { const n = (dars.videoLinklar?.length ?? 0) + (dars.asosiyVideoUrl ? 1 : 0); return n ? `${n} video` : 'Video' }
      case 'yuklab': { const n = (konspektYoli ? 1 : 0) + (prezentatsiyaYoli ? 1 : 0); return n ? `${n} fayl` : 'Fayl' }
      case 'flashcard': return `${FLASH_SONI[dars.bosqich] ?? 10} karta`
      case 'amaliy': return `${amaliySavolSoni} savol`
      case 'usmle': return dars.usmleSavollar?.length ? `${dars.usmleSavollar.length} savol` : 'USMLE'
      case 'klinik': return `${klinikHolatlar.length} holat`
      case 'interaktiv': return `${interaktivCaselar.length} case`
      case 'vaziyatli': return `${vaziyatliMasalalar.length} masala`
      case 'xatolar': return `${xatolarTahlili.length} tahlil`
      case 'nazorat': return `${nazoratVaqtDaqiqa} daq`
    }
  }

  const Tarkib = (
    <div>
      <div style={{ padding: '16px 16px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: 900 }}>Tarkib</span>
        <span style={{
          fontSize: '10.5px', fontWeight: 800, color: accent, background: accent + '16',
          borderRadius: '999px', padding: '3px 10px',
        }}>{qadamlar.length} qadam</span>
      </div>

      <div style={{ padding: '0 16px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', fontWeight: 700, color: 'var(--muted)', marginBottom: '5px' }}>
          <span>Dars progressi</span><span style={{ color: accent }}>{progress}%</span>
        </div>
        <div style={{ height: '6px', background: 'var(--surface-2)', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{
            width: `${progress}%`, height: '100%', borderRadius: '999px',
            background: `linear-gradient(90deg, ${accent}, ${accent2})`, transition: 'width .4s ease',
          }} />
        </div>
      </div>

      {qadamlar.map((t, i) => {
        const ma = QADAM_NOMI[t]
        const tugadi = tugallangan.has(t)
        const faol = i === joriy
        const ochiq = ochiqMi(i)
        return (
          <button
            key={t}
            onClick={() => qadamgaOt(i)}
            disabled={!ochiq}
            aria-current={faol ? 'step' : undefined}
            aria-label={`${i + 1}. ${ma.nom} — ${tugadi ? 'tugallangan' : ochiq ? ma.turi : 'qulflangan, avval oldingi qadamni yakunlang'}`}
            className="soft-press"
            style={{
              display: 'flex', alignItems: 'center', gap: '11px', width: 'calc(100% - 24px)', boxSizing: 'border-box', textAlign: 'left', font: 'inherit',
              margin: '0 12px 8px', padding: '10px 12px', borderRadius: '14px',
              cursor: ochiq ? 'pointer' : 'not-allowed',
              background: tugadi ? 'color-mix(in srgb, var(--good) 8%, transparent)' : faol ? accent + '14' : 'var(--surface-2)',
              border: faol ? `1.5px solid ${accent}` : '1px solid transparent',
              opacity: ochiq ? 1 : 0.5,
              transition: 'all .15s ease',
            }}
          >
            <div style={{
              width: '34px', height: '34px', borderRadius: '11px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: tugadi ? 'color-mix(in srgb, var(--good) 12%, transparent)' : faol ? accent + '22' : 'var(--surface)',
              border: tugadi ? '1.5px solid var(--good)' : faol ? `1.5px solid ${accent}` : '1px solid var(--line)',
              color: tugadi ? 'var(--good)' : faol ? accent : 'var(--muted)',
            }}>
              {tugadi ? <CheckCircle2 size={17} strokeWidth={2} /> : ochiq ? <ma.Icon size={17} strokeWidth={2} /> : <Lock size={15} strokeWidth={2} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '12.5px', fontWeight: faol ? 800 : 700, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {i + 1}. {ma.nom}
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--muted)', fontWeight: 600 }}>{ma.turi}</div>
            </div>
            <span style={{
              fontSize: '10px', fontWeight: 800, flexShrink: 0, whiteSpace: 'nowrap',
              color: tugadi ? 'var(--good)' : faol ? accent : 'var(--muted)',
              background: 'var(--surface)', border: '1px solid var(--line)',
              borderRadius: '999px', padding: '3px 8px',
            }}>{qadamChip(t)}</span>
          </button>
        )
      })}

      {dars.bosqich !== 'oson' && (
        <div style={{
          margin: '12px 16px 16px',
          background: '#f59e0b14', border: '1px solid #f59e0b55',
          borderRadius: '12px', padding: '10px 12px', fontSize: '11px', lineHeight: 1.5, color: 'var(--ink-soft)', fontWeight: 600,
        }}>
          🏆 Nazoratdan o&apos;tsangiz — bosqich sertifikatiga bir qadam yaqinlashasiz
        </div>
      )}
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref={`/student/darslar/bosqich/${dars.bosqich === "o'rta" ? 'orta' : dars.bosqich}`} backLabel="Darslar" />

      {/* Yopishqoq dars paneli: sarlavha + progress + mobil Tarkib tugmasi */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'var(--surface)', borderBottom: '1px solid var(--line)',
        padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <button
          onClick={() => setTarkibOchiq(!tarkibOchiq)}
          className="soft-press lg:hidden"
          style={{
            background: accent + '14', color: accent, border: `1px solid ${accent}44`,
            borderRadius: '10px', padding: '7px 13px', fontSize: '12px', fontWeight: 800, cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          ☰ Tarkib
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: accent, letterSpacing: '.05em', textTransform: 'uppercase' }}>
            {dars.kategoriya}{dars.bepulNamuna ? ' · 🎁 Bepul namuna' : ''}
          </div>
          <div style={{ fontSize: '13px', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {dars.sarlavha}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <div style={{ width: '90px', height: '6px', background: 'var(--surface-2)', borderRadius: '999px', overflow: 'hidden' }} className="hidden sm:block">
            <div style={{ width: `${progress}%`, height: '100%', background: `linear-gradient(90deg,${accent},${accent2})`, borderRadius: '999px', transition: 'width .4s ease' }} />
          </div>
          <span style={{ fontSize: '12px', fontWeight: 900, color: accent }}>{progress}%</span>
        </div>
      </div>

      <div className="mx-auto max-w-[1140px]" style={{ display: 'flex' }}>
        {/* Chap panel — desktop */}
        <aside className="hidden lg:block" style={{
          width: '300px', flexShrink: 0,
          borderRight: '1px solid var(--line)',
          position: 'sticky', top: '57px', height: 'calc(100vh - 57px)', overflowY: 'auto',
          background: 'var(--surface)',
        }}>
          {Tarkib}
        </aside>

        {/* Mobil drawer */}
        {tarkibOchiq && (
          <div className="lg:hidden" style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
            <div onClick={() => setTarkibOchiq(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.45)' }} />
            <div style={{
              position: 'absolute', top: 0, left: 0, bottom: 0, width: 'min(320px, 85vw)',
              background: 'var(--surface)', overflowY: 'auto', boxShadow: '8px 0 30px rgba(0,0,0,.2)',
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 900, fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dars.sarlavha}</span>
                <button onClick={() => setTarkibOchiq(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'var(--muted)', flexShrink: 0 }}>✕</button>
              </div>
              {Tarkib}
            </div>
          </div>
        )}

        {/* Asosiy kontent */}
        <main style={{ flex: 1, minWidth: 0, padding: '24px 16px 120px' }}>
          <div className="mx-auto max-w-[760px]">
            {saqlashXatosi && (
              <div role="alert" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
                marginBottom: '16px', padding: '11px 14px', borderRadius: '12px',
                color: 'var(--danger)', background: 'color-mix(in srgb, var(--danger) 10%, var(--surface))',
                border: '1px solid color-mix(in srgb, var(--danger) 35%, var(--line))', fontSize: '13px', fontWeight: 700,
              }}>
                <span>{saqlashXatosi}</span>
                <button onClick={saqlashXatosiniTozala} aria-label="Xabarni yopish" style={{
                  border: 'none', background: 'transparent', color: 'inherit', cursor: 'pointer', fontSize: '16px', padding: '2px 5px',
                }}>×</button>
              </div>
            )}
            {/* Qadam sarlavhasi */}
            <div className="rise" style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '11px', fontWeight: 900, color: accent, background: accent + '14',
                  borderRadius: '999px', padding: '4px 12px',
                }}>QADAM {joriy + 1}/{qadamlar.length}</span>
                <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700 }}>{QADAM_NOMI[qadam].turi}</span>
              </div>
              <h1 style={{ margin: '8px 0 0', fontSize: '22px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '9px' }}>
                {(() => { const QI = QADAM_NOMI[qadam].Icon; return <QI size={22} strokeWidth={2.2} style={{ color: accent, flexShrink: 0 }} /> })()}
                {QADAM_NOMI[qadam].nom}
              </h1>
            </div>

            {/* Nazariya serverdan tayyor keladi — kutish holati kerak emas. */}
            {qadam === 'nazariya' && <NazariyaBolimi dars={dars} nazariyaHtml={nazariyaHtml} adabiyotlar={adabiyotlar} />}
            {qadam === 'video' && <VideoBolimi asosiyVideo={asosiyVideo} linklar={videoLinklar} />}
            {qadam === 'yuklab' && <YuklabOlishBolimi konspektYoli={konspektYoli} prezentatsiyaYoli={prezentatsiyaYoli} />}
            {/* Test qadamlarida bank shu yerda yuklanadi. "Tez orada qo'shiladi"
                xabari faqat bank kelib bo'lgach chiqadi — aks holda u yuklanish
                paytida noto'g'ri ko'rinib qolardi. */}
            {qadam === 'amaliy' && (!banklarYuklandi
              ? <BoshUlash matn="Savollar yuklanmoqda..." />
              : <AmaliyTestBolimi
                  darsSlug={dars.slug}
                  darsNomi={dars.sarlavha}
                  bank={amaliyBank}
                  savolSoni={amaliySavolSoni}
                />
            )}
            {qadam === 'usmle' && (!banklarYuklandi
              ? <BoshUlash matn="Savollar yuklanmoqda..." />
              : usmleBank.length > 0
              ? <UsmleTestBolimi darsSlug={dars.slug} darsNomi={dars.sarlavha} bank={usmleBank} />
              : <BoshUlash matn="USMLE savollari tez orada qo'shiladi." />
            )}
            {qadam === 'nazorat' && <NazoratTestBolimi darsSlug={dars.slug} vaqtDaqiqa={nazoratVaqtDaqiqa} otishFoizi={sertifikatOtishFoizi} />}
            {qadam === 'klinik' && (klinikHolatlar.length > 0
              ? <KlinikHolatlarBolimi holatlar={klinikHolatlar} />
              : <BoshUlash matn="Klinik holatlar tez orada qo'shiladi." />
            )}
            {qadam === 'interaktiv' && (interaktivCaselar.length > 0
              ? <InteraktivCaseBolimi caselar={interaktivCaselar} />
              : <BoshUlash matn="Interaktiv case tez orada qo'shiladi." />
            )}
            {qadam === 'vaziyatli' && (vaziyatliMasalalar.length > 0
              ? <VaziyatliMasalaBolimi masalalar={vaziyatliMasalalar} />
              : <BoshUlash matn="Vaziyatli masalalar tez orada qo'shiladi." />
            )}
            {qadam === 'xatolar' && (xatolarTahlili.length > 0
              ? <XatolarTahlilyBolimi tahlillar={xatolarTahlili} />
              : <BoshUlash matn="Xatolar tahlili tez orada qo'shiladi." />
            )}
            {qadam === 'flashcard' && (!banklarYuklandi
              ? <BoshUlash matn="Kartalar yuklanmoqda..." />
              : flashcardlar.length > 0
              ? <FlashcardBolimi kartalar={flashcardlar} />
              : <BoshUlash matn="Flashcardlar tez orada qo'shiladi." />
            )}
          </div>
        </main>
      </div>

      {/* FAB prototipi — bitta yetaklovchi suzuvchi tugma */}
      {FAB_PROTOTIP && (
        <KeyingiQadamFab
          qadamlar={qadamlar}
          joriy={joriy}
          tugallangan={tugallangan}
          QADAM_NOMI={QADAM_NOMI}
          accent={accent}
          accent2={accent2}
          ochiqMi={ochiqMi}
          qadamgaOt={qadamgaOt}
          yakunlaVaDavom={yakunlaVaDavom}
          progressSaqlanmoqda={progressSaqlanmoqda}
          qadamChip={qadamChip}
        />
      )}

      {/* Pastki navigatsiya paneli (eski) */}
      {!FAB_PROTOTIP && (
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
        background: 'var(--surface)', borderTop: '1px solid var(--line)',
        padding: '12px 16px',
      }}>
        <div className="mx-auto max-w-[1140px]" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => qadamgaOt(joriy - 1)}
            disabled={joriy === 0}
            className="soft-press"
            style={{
              background: 'var(--surface-2)', color: joriy === 0 ? 'var(--muted)' : 'var(--ink)',
              border: '1px solid var(--line)', borderRadius: '12px', padding: '11px 18px',
              fontSize: '13px', fontWeight: 800, cursor: joriy === 0 ? 'default' : 'pointer', opacity: joriy === 0 ? .5 : 1,
            }}
          >← Oldingi</button>

          <div style={{ flex: 1, textAlign: 'center', fontSize: '11.5px', color: 'var(--muted)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} className="hidden sm:flex">
            {tugallangan.has(qadam)
              ? <><CheckCircle2 size={14} strokeWidth={2} style={{ color: 'var(--good)' }} /> Bu qadam tugallangan</>
              : <>{(() => { const QI = QADAM_NOMI[qadam].Icon; return <QI size={14} strokeWidth={2} /> })()} {QADAM_NOMI[qadam].nom}</>}
          </div>

          <button
            onClick={yakunlaVaDavom}
            disabled={progressSaqlanmoqda}
            className="soft-press"
            style={{
              background: tugallangan.has(qadam)
                ? 'var(--surface-2)'
                : `linear-gradient(135deg,${accent},${accent2})`,
              color: tugallangan.has(qadam) ? 'var(--ink-soft)' : 'white',
              border: tugallangan.has(qadam) ? '1px solid var(--line)' : 'none',
              borderRadius: '12px', padding: '11px 20px', fontSize: '13px', fontWeight: 800, cursor: progressSaqlanmoqda ? 'wait' : 'pointer',
              flexShrink: 0, marginLeft: 'auto',
            }}
          >
            {progressSaqlanmoqda ? 'Saqlanmoqda…' : joriy === qadamlar.length - 1
              ? (tugallangan.has(qadam) ? '🎉 Dars tugallandi' : 'Darsni yakunlash 🎉')
              : (tugallangan.has(qadam) ? 'Keyingisi →' : '✓ Yakunlash va davom etish')}
          </button>
        </div>
      </div>
      )}
    </div>
  )
}
