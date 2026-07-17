'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '@/components/Header'
import { createClient } from '@/lib/supabase'
import { darsTop, shuffleVaTanla, variantlarniAralashtir, BOSQICHLAR, type TestSavoli, type UsmleSavoli } from '@/lib/talim/darslar'
import { useMeningObunalarim } from '@/lib/talim/useObuna'
import { useDarsProgress, BOSQICH_QADAMLARI } from '@/lib/talim/useDarsProgress'
import { useTariflar, narxFmt } from '@/lib/talim/tariflar'
import { klinikHolatlarOl, type KlinikHolat } from '@/lib/talim/klinikHolatlar'
import { interaktivCaselarOl, type InteraktivCase } from '@/lib/talim/interaktivCaselar'
import { xatolarTahliliOl, type XatoTahlil } from '@/lib/talim/xatolarTahlili'
import { vaziyatliMasalalarOl, type VaziyatliMasala } from '@/lib/talim/vaziyatliMasalalar'
import { flashcardlarOl, type Flashcard } from '@/lib/talim/flashcardlar'

type Tab = 'nazariya' | 'video' | 'yuklab' | 'flashcard' | 'amaliy' | 'usmle' | 'klinik' | 'interaktiv' | 'vaziyatli' | 'xatolar' | 'nazorat'

// `dars_tarkibi` jadvalidan keladigan og'ir tarkib — har bir dars sahifasi faqat
// o'ziniki kerakli qatorini so'raydi, butun DARSLAR ro'yxati bilan birga yuklanmaydi.
type DarsTarkibi = {
  nazariya_html: string | null
  asosiy_video_url: string | null
  video_linklar: string[] | null
  konspekt_url: string | null
  prezentatsiya_url: string | null
  savollar_banki: TestSavoli[] | null
  usmle_savollar: UsmleSavoli[] | null
  nazorat_savollar: TestSavoli[] | null
  nazorat_savol_soni: number | null
  nazorat_vaqt_daqiqa: number | null
  sertifikat_otish_foizi: number | null
}

function useDarsTarkibi(slug: string) {
  const supabase = createClient()
  const [tarkib, setTarkib] = useState<DarsTarkibi | null>(null)
  const [yuklandi, setYuklandi] = useState(false)

  useEffect(() => {
    supabase
      .from('dars_tarkibi')
      .select('*')
      .eq('dars_slug', slug)
      .maybeSingle()
      .then(({ data }) => {
        // Jadval hali yaratilmagan/qator topilmagan bo'lsa ham sahifa buzilmasin — tarkibsiz qoladi.
        setTarkib((data as DarsTarkibi) ?? null)
        setYuklandi(true)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  return { tarkib, yuklandi }
}

export default function DarsDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const dars = darsTop(slug)
  const { tarkib, yuklandi } = useDarsTarkibi(slug)
  const { egami, yuklandi: obunaYuklandi } = useMeningObunalarim()

  const nazariyaHtml = tarkib?.nazariya_html ?? dars?.nazariyaHtml
  const asosiyVideo = tarkib?.asosiy_video_url ?? dars?.asosiyVideoUrl ?? null
  const videoLinklar = tarkib?.video_linklar ?? dars?.videoLinklar ?? []
  // Bular endi public URL emas — 'dars-materiallari' (yopiq bucket) ichidagi fayl yo'li.
  const konspektYoli = tarkib?.konspekt_url ?? dars?.konspektUrl
  const prezentatsiyaYoli = tarkib?.prezentatsiya_url ?? dars?.prezentatsiyaUrl
  const amaliyBank = tarkib?.savollar_banki?.length ? tarkib.savollar_banki : dars?.savollarBanki?.length ? dars.savollarBanki : dars?.test ?? []
  const amaliySavolSoni = dars?.amaliySavolSoni ?? 20
  const usmleBank = tarkib?.usmle_savollar ?? dars?.usmleSavollar ?? []
  const nazoratBank = tarkib?.nazorat_savollar ?? dars?.nazoratSavollar ?? []
  const nazoratSavolSoni = tarkib?.nazorat_savol_soni ?? dars?.nazoratSavolSoni ?? 20
  const nazoratVaqtDaqiqa = tarkib?.nazorat_vaqt_daqiqa ?? dars?.nazoratVaqtDaqiqa ?? 15
  const sertifikatOtishFoizi = tarkib?.sertifikat_otish_foizi ?? dars?.sertifikatOtishFoizi ?? 70

  const klinikHolatlar = klinikHolatlarOl(slug)
  const interaktivCaselar = interaktivCaselarOl(slug)
  const xatolarTahlili = xatolarTahliliOl(slug)
  const vaziyatliMasalalar = vaziyatliMasalalarOl(slug)
  const flashcardlar = flashcardlarOl(slug)

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
  const QADAM_NOMI: Record<Tab, { emoji: string; nom: string; turi: string }> = {
    nazariya:   { emoji: '📖', nom: 'Nazariya',         turi: "O'qish" },
    video:      { emoji: '🎥', nom: 'Video',            turi: 'Video' },
    yuklab:     { emoji: '📂', nom: 'Materiallar',      turi: 'Fayllar' },
    flashcard:  { emoji: '🃏', nom: 'Flashcard',        turi: 'Takrorlash' },
    amaliy:     { emoji: '✅', nom: 'Amaliy test',      turi: 'Mashq' },
    usmle:      { emoji: '🏅', nom: 'USMLE',            turi: 'Mashq' },
    klinik:     { emoji: '🏥', nom: 'Klinik holat',     turi: 'Klinika' },
    interaktiv: { emoji: '🧩', nom: 'Interaktiv case',  turi: 'Simulyatsiya' },
    vaziyatli:  { emoji: '📋', nom: 'Vaziyatli masala', turi: 'Masala' },
    xatolar:    { emoji: '🔍', nom: 'Xatolar tahlili',  turi: 'Tahlil' },
    nazorat:    { emoji: '🎓', nom: 'Nazorat',          turi: 'Imtihon' },
  }

  const BOSQICH_ACCENT: Record<string, string> = { oson: '#16a34a', "o'rta": '#d97706', qiyin: '#dc2626' }
  const accent = BOSQICH_ACCENT[dars?.bosqich ?? 'oson'] ?? '#16a34a'
  const accent2 = dars?.bosqich === 'oson' ? '#059669' : dars?.bosqich === "o'rta" ? '#f59e0b' : '#e11d48'

  // Qadamlar ketma-ketligi — bosqichga qarab (path-interfeys tartibi)
  const qadamlar = (BOSQICH_QADAMLARI[dars?.bosqich ?? 'oson'] as Tab[]).filter((t) => tabMavjud[t])

  const [joriy, setJoriy] = useState(0)
  const [tarkibOchiq, setTarkibOchiq] = useState(false)
  const { tugallangan, yakunla } = useDarsProgress(slug)
  const { bosqichniki: bosqichTariflari } = useTariflar()

  const qadam = qadamlar[Math.min(joriy, qadamlar.length - 1)]
  const progress = qadamlar.length ? Math.round((qadamlar.filter((t) => tugallangan.has(t)).length / qadamlar.length) * 100) : 0

  // Qadam ochiqmi: birinchisi har doim; keyingilari oldingi qadam yakunlangach
  const ochiqMi = (i: number) => i === 0 || tugallangan.has(qadamlar[i - 1]) || tugallangan.has(qadamlar[i])

  const qadamgaOt = (i: number) => {
    if (i < 0 || i >= qadamlar.length || !ochiqMi(i)) return
    setJoriy(i)
    setTarkibOchiq(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const yakunlaVaDavom = () => {
    yakunla(qadam)
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
          <div
            key={t}
            onClick={() => qadamgaOt(i)}
            style={{
              display: 'flex', alignItems: 'center', gap: '11px',
              padding: '11px 16px',
              cursor: ochiq ? 'pointer' : 'not-allowed',
              background: faol ? accent + '10' : 'transparent',
              borderLeft: faol ? `3px solid ${accent}` : '3px solid transparent',
              opacity: ochiq ? 1 : 0.45,
              transition: 'all .15s ease',
            }}
          >
            <div style={{
              width: '34px', height: '34px', borderRadius: '11px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
              background: tugadi ? '#16a34a1a' : faol ? accent + '1c' : 'var(--surface-2)',
              border: tugadi ? '1.5px solid #16a34a' : faol ? `1.5px solid ${accent}` : '1px solid var(--line)',
            }}>
              {tugadi ? '✅' : ochiq ? ma.emoji : '🔒'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '12.5px', fontWeight: faol ? 800 : 700, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {i + 1}. {ma.nom}
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--muted)', fontWeight: 600 }}>{ma.turi}</div>
            </div>
            {faol && !tugadi && <span style={{ fontSize: '10px', fontWeight: 900, color: accent }}>▶</span>}
          </div>
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
            {/* Qadam sarlavhasi */}
            <div className="rise" style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '11px', fontWeight: 900, color: accent, background: accent + '14',
                  borderRadius: '999px', padding: '4px 12px',
                }}>QADAM {joriy + 1}/{qadamlar.length}</span>
                <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700 }}>{QADAM_NOMI[qadam].turi}</span>
              </div>
              <h1 style={{ margin: '8px 0 0', fontSize: '22px', fontWeight: 900 }}>{QADAM_NOMI[qadam].emoji} {QADAM_NOMI[qadam].nom}</h1>
            </div>

            {qadam === 'nazariya' && !yuklandi && <BoshUlash matn="Yuklanmoqda..." />}
            {qadam === 'nazariya' && yuklandi && <NazariyaBolimi dars={dars} nazariyaHtml={nazariyaHtml} />}
            {qadam === 'video' && <VideoBolimi asosiyVideo={asosiyVideo} linklar={videoLinklar} />}
            {qadam === 'yuklab' && <YuklabOlishBolimi konspektYoli={konspektYoli} prezentatsiyaYoli={prezentatsiyaYoli} />}
            {qadam === 'amaliy' && (
              <AmaliyTestBolimi
                darsSlug={dars.slug}
                darsNomi={dars.sarlavha}
                bank={amaliyBank}
                savolSoni={amaliySavolSoni}
              />
            )}
            {qadam === 'usmle' && (usmleBank.length > 0
              ? <UsmleTestBolimi darsSlug={dars.slug} darsNomi={dars.sarlavha} bank={usmleBank} />
              : <BoshUlash matn="USMLE savollari tez orada qo'shiladi." />
            )}
            {qadam === 'nazorat' && (nazoratBank.length > 0
              ? <NazoratTestBolimi darsSlug={dars.slug} darsNomi={dars.sarlavha} bank={nazoratBank} savolSoni={nazoratSavolSoni} vaqtDaqiqa={nazoratVaqtDaqiqa} otishFoizi={sertifikatOtishFoizi} />
              : <BoshUlash matn="Nazorat testi tez orada qo'shiladi." />
            )}
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
            {qadam === 'flashcard' && <FlashcardBolimi kartalar={flashcardlar} />}
          </div>
        </main>
      </div>

      {/* Pastki navigatsiya paneli */}
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

          <div style={{ flex: 1, textAlign: 'center', fontSize: '11.5px', color: 'var(--muted)', fontWeight: 700 }} className="hidden sm:block">
            {tugallangan.has(qadam) ? '✅ Bu qadam tugallangan' : `${QADAM_NOMI[qadam].emoji} ${QADAM_NOMI[qadam].nom}`}
          </div>

          <button
            onClick={yakunlaVaDavom}
            className="soft-press"
            style={{
              background: tugallangan.has(qadam)
                ? 'var(--surface-2)'
                : `linear-gradient(135deg,${accent},${accent2})`,
              color: tugallangan.has(qadam) ? 'var(--ink-soft)' : 'white',
              border: tugallangan.has(qadam) ? '1px solid var(--line)' : 'none',
              borderRadius: '12px', padding: '11px 20px', fontSize: '13px', fontWeight: 800, cursor: 'pointer',
              flexShrink: 0, marginLeft: 'auto',
            }}
          >
            {joriy === qadamlar.length - 1
              ? (tugallangan.has(qadam) ? '🎉 Dars tugallandi' : 'Darsni yakunlash 🎉')
              : (tugallangan.has(qadam) ? 'Keyingisi →' : '✓ Yakunlash va davom etish')}
          </button>
        </div>
      </div>
    </div>
  )
}

function NazariyaBolimi({ dars, nazariyaHtml }: { dars: NonNullable<ReturnType<typeof darsTop>>; nazariyaHtml?: string | null }) {
  if (dars.nazariyaIframe) {
    return (
      <div className="rise" style={{ marginLeft: '-16px', marginRight: '-16px' }}>
        <iframe
          src={dars.nazariyaIframe}
          title={dars.sarlavha}
          style={{
            width: '100%',
            height: '90vh',
            border: '1px solid var(--line)',
            borderRadius: '12px',
            background: 'white',
            display: 'block',
          }}
          loading="lazy"
        />
      </div>
    )
  }

  if (nazariyaHtml) {
    return <div className="maqola-html" dangerouslySetInnerHTML={{ __html: nazariyaHtml }} />
  }

  return (
    <>
      {dars.bolimlar.map((b, i) => (
        <div key={i} className="rise" style={{
          animationDelay: `${Math.min(i * 0.06, 0.4)}s`,
          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
          padding: '20px 24px', marginBottom: '14px',
        }}>
          <h3 style={{ margin: '0 0 10px', fontSize: '15px', fontWeight: 800, color: 'var(--accent)' }}>{b.sarlavha}</h3>
          {b.matn.map((p, pi) => (
            <p key={pi} style={{ margin: pi === 0 ? 0 : '10px 0 0', fontSize: '14px', lineHeight: 1.7, color: 'var(--ink-soft)' }}>{p}</p>
          ))}
        </div>
      ))}

      {dars.manbalar.length > 0 && (
        <div className="rise" style={{
          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
          padding: '18px 22px',
        }}>
          <h3 style={{ margin: '0 0 10px', fontSize: '12px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.04em' }}>Manbalar</h3>
          <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {dars.manbalar.map((m) => (
              <li key={m} style={{ fontSize: '12.5px', color: 'var(--ink-soft)' }}>{m}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}

function videoPlatformasi(url: string): { belgi: string; nom: string } {
  const u = url.toLowerCase()
  if (u.includes('youtube.com') || u.includes('youtu.be')) return { belgi: '▶️', nom: 'YouTube' }
  if (u.includes('instagram.com')) return { belgi: '📷', nom: 'Instagram' }
  if (u.includes('facebook.com') || u.includes('fb.watch')) return { belgi: '📘', nom: 'Facebook' }
  return { belgi: '▶️', nom: 'Video' }
}

function VideoKartasi({ url, sarlavha, animationDelay }: { url: string; sarlavha: string; animationDelay?: string }) {
  const { belgi, nom } = videoPlatformasi(url)
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="rise lift" style={{
      animationDelay,
      display: 'flex', alignItems: 'center', gap: '14px',
      background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
      padding: '16px 20px', textDecoration: 'none', color: 'var(--ink)',
    }}>
      <span style={{
        width: '40px', height: '40px', borderRadius: '10px', background: 'var(--accent-soft)', color: 'var(--accent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0,
      }}>{belgi}</span>
      <span style={{ fontSize: '14px', fontWeight: 700, flex: 1 }}>{sarlavha}</span>
      <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>{nom}</span>
      <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 700 }}>Ko&apos;rish ↗</span>
    </a>
  )
}

function VideoBolimi({ asosiyVideo, linklar }: { asosiyVideo: string | null; linklar: string[] }) {
  if (!asosiyVideo && linklar.length === 0) {
    return <BoshUlash matn="Video darslik tez orada qo'shiladi." />
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {asosiyVideo && (
        <div>
          <p style={{ margin: '0 0 10px 0', fontSize: '12.5px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
            Asosiy dars
          </p>
          <VideoKartasi url={asosiyVideo} sarlavha="Asosiy dars videosi" />
        </div>
      )}

      {linklar.length > 0 && (
        <div>
          <p style={{ margin: '0 0 10px 0', fontSize: '12.5px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
            Qo&apos;shimcha videolar
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {linklar.map((url, i) => (
              <VideoKartasi key={url} url={url} sarlavha={`${i + 1}-qo'shimcha video`} animationDelay={`${Math.min(i * 0.06, 0.4)}s`} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function fayKengaytmasiniOl(yol: string) {
  return yol.split('.').pop()?.toLowerCase() ?? ''
}

function ViewerUrlOl(signedUrl: string, asliyYol: string) {
  const kengaytma = fayKengaytmasiniOl(asliyYol)
  if (kengaytma === 'pdf') return `${signedUrl}#toolbar=0&navpanes=0`
  // PPT/PPTX (va boshqa Office formatlari) — Microsoft Office Online ko'rgazmasi orqali ichkarida ochiladi
  return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(signedUrl)}`
}

function YuklabOlishBolimi({ konspektYoli, prezentatsiyaYoli }: { konspektYoli?: string | null; prezentatsiyaYoli?: string | null }) {
  const supabase = createClient()
  const [ochilgan, setOchilgan] = useState<{ signedUrl: string; asliyYol: string; nom: string } | null>(null)
  const [ochilmoqda, setOchilmoqda] = useState(false)
  const [xato, setXato] = useState<string | null>(null)

  const fayllar = [
    konspektYoli && { yol: konspektYoli, nom: 'Konspekt (PDF)', icon: '📄' },
    prezentatsiyaYoli && { yol: prezentatsiyaYoli, nom: 'Prezentatsiya', icon: '📊' },
  ].filter(Boolean) as { yol: string; nom: string; icon: string }[]

  if (fayllar.length === 0) {
    return <BoshUlash matn="Yuklab olinadigan materiallar tez orada qo'shiladi." />
  }

  const ochish = async (f: { yol: string; nom: string }) => {
    setOchilmoqda(true)
    setXato(null)
    // Vaqtinchalik (5 daqiqalik) havola — bucket yopiq, doimiy/ulashiladigan link berilmaydi.
    const { data, error } = await supabase.storage.from('dars-materiallari').createSignedUrl(f.yol, 300)
    setOchilmoqda(false)
    if (error) { setXato(`Faylni ochib bo'lmadi: ${error.message}`); return }
    if (data) setOchilgan({ signedUrl: data.signedUrl, asliyYol: f.yol, nom: f.nom })
  }

  if (ochilgan) {
    const ppt = fayKengaytmasiniOl(ochilgan.asliyYol) !== 'pdf'
    return (
      <div className="rise" onContextMenu={(e) => e.preventDefault()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => setOchilgan(null)} className="soft-press" style={{
            background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '10px',
            padding: '8px 14px', fontSize: '13px', fontWeight: 600, color: 'var(--ink-soft)', cursor: 'pointer',
          }}>
            ← Ortga
          </button>
          {ppt && (
            <span style={{ fontSize: '11.5px', color: 'var(--muted)' }}>
              Ko&apos;rinmasa, bir necha soniya kuting yoki qaytadan oching.
            </span>
          )}
        </div>
        <iframe
          src={ViewerUrlOl(ochilgan.signedUrl, ochilgan.asliyYol)}
          title={ochilgan.nom}
          style={{ width: '100%', height: '75vh', border: '1px solid var(--line)', borderRadius: '14px', background: 'white' }}
        />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {fayllar.map((f, i) => (
        <button
          key={f.yol}
          onClick={() => ochish(f)}
          disabled={ochilmoqda}
          className="rise lift"
          style={{
            animationDelay: `${Math.min(i * 0.06, 0.4)}s`,
            display: 'flex', alignItems: 'center', gap: '14px', width: '100%',
            background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
            padding: '16px 20px', color: 'var(--ink)', cursor: ochilmoqda ? 'wait' : 'pointer', textAlign: 'left',
          }}
        >
          <span style={{
            width: '40px', height: '40px', borderRadius: '10px', background: 'var(--accent-soft)', color: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0,
          }}>{f.icon}</span>
          <span style={{ fontSize: '14px', fontWeight: 700, flex: 1 }}>{f.nom}</span>
          <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 700 }}>{ochilmoqda ? 'Ochilmoqda...' : 'Ochish →'}</span>
        </button>
      ))}
      {xato && (
        <p style={{ color: 'var(--danger)', fontSize: '12.5px', margin: 0 }}>{xato}</p>
      )}
    </div>
  )
}

function BoshUlash({ matn }: { matn: string }) {
  return (
    <div className="rise" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--muted)' }}>
      <div style={{ fontSize: '36px', marginBottom: '10px' }}>🛠️</div>
      <p style={{ margin: 0 }}>{matn}</p>
    </div>
  )
}

// ============================================================
// Umumiy test mexanizmi — amaliy/USMLE/nazorat shu komponent ustida quriladi
// ============================================================

type TestNatija = { togriSon: number; jami: number }

function TestBlok({
  savollar,
  izohKorsat,
  vaqtDaqiqa,
  qaytaUrinishKorinsin,
  qattiqRejim,
  boshlashSarlavha,
  boshlashTugma,
  onTopshirish,
}: {
  savollar: (TestSavoli | UsmleSavoli)[]
  izohKorsat: boolean
  vaqtDaqiqa?: number
  qaytaUrinishKorinsin: boolean
  qattiqRejim?: boolean
  boshlashSarlavha: React.ReactNode
  boshlashTugma: string
  onTopshirish: (natija: TestNatija) => void | Promise<void>
}) {
  const [boshlandi, setBoshlandi] = useState(false)
  const [javoblar, setJavoblar] = useState<(number | null)[]>(Array(savollar.length).fill(null))
  const [topshirildi, setTopshirildi] = useState(false)
  const [qoldiSoniya, setQoldiSoniya] = useState(vaqtDaqiqa ? vaqtDaqiqa * 60 : 0)
  const [buzilishSoni, setBuzilishSoni] = useState(0)
  const [buzilishSababliYakunlandi, setBuzilishSababliYakunlandi] = useState(false)

  const tuldi = javoblar.every((v) => v !== null)
  const togriSon = useMemo(
    () => javoblar.reduce((s: number, v, i) => s + (v === savollar[i].togri ? 1 : 0), 0),
    [javoblar, savollar]
  )

  useEffect(() => {
    if (!boshlandi || topshirildi || !vaqtDaqiqa) return
    const interval = setInterval(() => {
      setQoldiSoniya((s) => {
        if (s <= 1) {
          clearInterval(interval)
          setTopshirildi(true)
          onTopshirish({ togriSon, jami: savollar.length })
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [boshlandi, topshirildi, vaqtDaqiqa, togriSon, savollar.length, onTopshirish])

  const javobBer = (i: number, val: number) => {
    if (topshirildi) return
    setJavoblar((arr) => arr.map((v, j) => (j === i ? val : v)))
  }

  const topshir = () => {
    setTopshirildi(true)
    onTopshirish({ togriSon, jami: savollar.length })
  }

  // Qattiq rejim — fullscreen majburlash va oyna/tab almashtirishni aniqlash.
  // Brauzer OS darajasida boshqa ilovaga o'tishni "bloklay" olmaydi, shu sabab
  // aniqlab, 1-marta ogohlantirib, 2-marta avtomatik yakunlaymiz.
  useEffect(() => {
    if (!qattiqRejim || !boshlandi || topshirildi) return

    const buzilish = () => {
      setBuzilishSoni((prev) => {
        const yangi = prev + 1
        if (yangi >= 2) {
          setBuzilishSababliYakunlandi(true)
          setTopshirildi(true)
          onTopshirish({ togriSon, jami: savollar.length })
        }
        return yangi
      })
    }

    const korinishOzgardi = () => { if (document.hidden) buzilish() }
    const fullscreenOzgardi = () => { if (!document.fullscreenElement) buzilish() }

    document.addEventListener('visibilitychange', korinishOzgardi)
    document.addEventListener('fullscreenchange', fullscreenOzgardi)
    return () => {
      document.removeEventListener('visibilitychange', korinishOzgardi)
      document.removeEventListener('fullscreenchange', fullscreenOzgardi)
    }
  }, [qattiqRejim, boshlandi, topshirildi, togriSon, savollar.length, onTopshirish])

  // Test tugagach (yoki sahifadan chiqilganda) fullscreen rejimidan chiqamiz.
  useEffect(() => {
    if (qattiqRejim && topshirildi && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
    }
  }, [qattiqRejim, topshirildi])

  const boshla = () => {
    setBoshlandi(true)
    if (qattiqRejim) {
      document.documentElement.requestFullscreen?.().catch(() => {})
    }
  }

  const qaytaUrinish = () => {
    setJavoblar(Array(savollar.length).fill(null))
    setTopshirildi(false)
    setQoldiSoniya(vaqtDaqiqa ? vaqtDaqiqa * 60 : 0)
    setBoshlandi(false)
    setBuzilishSoni(0)
    setBuzilishSababliYakunlandi(false)
  }

  if (savollar.length === 0) {
    return <BoshUlash matn="Bu bo'lim savollari tez orada qo'shiladi." />
  }

  if (!boshlandi) {
    return (
      <div className="rise" style={{
        background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
        padding: '26px 28px', textAlign: 'center',
      }}>
        <div style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '18px' }}>{boshlashSarlavha}</div>
        <button onClick={boshla} className="btn-animated soft-press" style={{
          background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '12px',
          padding: '14px 26px', fontSize: '14.5px', fontWeight: 700, cursor: 'pointer',
        }}>
          {boshlashTugma}
        </button>
      </div>
    )
  }

  const foiz = Math.round((togriSon / savollar.length) * 100)
  const natijaRang = foiz >= 80 ? '#16a34a' : foiz >= 60 ? '#d97706' : '#dc2626'
  const daqiqa = Math.floor(qoldiSoniya / 60)
  const soniya = qoldiSoniya % 60

  return (
    <>
      {vaqtDaqiqa && !topshirildi && (
        <div className="rise" style={{
          marginBottom: '16px', textAlign: 'center', fontSize: '15px', fontWeight: 800,
          color: qoldiSoniya <= 60 ? '#dc2626' : 'var(--ink)',
        }}>
          ⏱ Qolgan vaqt: {daqiqa}:{soniya.toString().padStart(2, '0')}
        </div>
      )}

      {qattiqRejim && buzilishSoni === 1 && !topshirildi && (
        <div className="rise" style={{
          marginBottom: '16px', background: '#fff4e0', border: '1px solid #f5c069', borderRadius: '12px',
          padding: '12px 16px', fontSize: '13px', fontWeight: 700, color: '#a86200', textAlign: 'center',
        }}>
          ⚠️ Diqqat! Siz testdan chiqib ketdingiz (oyna/tab almashtirildi yoki fullscreendan chiqildi).
          Yana takrorlansa, test avtomatik yakunlanadi.
        </div>
      )}

      {!topshirildi && (
        <div className="rise" style={{ marginBottom: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', fontWeight: 600 }}>
            <span>Javob berilgan: {javoblar.filter((v) => v !== null).length}/{savollar.length}</span>
            <span>{Math.round((javoblar.filter((v) => v !== null).length / savollar.length) * 100)}%</span>
          </div>
          <div style={{ height: '6px', borderRadius: '999px', background: 'var(--surface-2)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '999px', background: 'var(--accent)', transition: 'width .25s ease',
              width: `${(javoblar.filter((v) => v !== null).length / savollar.length) * 100}%`,
            }} />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {savollar.map((s, i) => {
          const vinyetka = (s as UsmleSavoli).vinyetka
          return (
            <div key={i} className="rise" style={{
              animationDelay: `${Math.min(i * 0.06, 0.4)}s`,
              background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '18px 20px',
            }}>
              {vinyetka && (
                <p style={{
                  margin: '0 0 12px', fontSize: '13px', fontStyle: 'italic', color: 'var(--ink-soft)',
                  background: 'var(--surface-2)', borderRadius: '8px', padding: '10px 12px', lineHeight: 1.6,
                }}>
                  {vinyetka}
                </p>
              )}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                <span style={{
                  width: '24px', height: '24px', borderRadius: '7px', background: 'var(--accent-soft)', color: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, flexShrink: 0,
                }}>{i + 1}</span>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, lineHeight: 1.4 }}>{s.savol}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '34px' }}>
                {s.variantlar.map((v, vi) => {
                  const tanlandi = javoblar[i] === vi
                  const togriJavob = izohKorsat && topshirildi && vi === s.togri
                  const notogriTanlandi = izohKorsat && topshirildi && tanlandi && vi !== s.togri
                  return (
                    <button
                      key={v}
                      onClick={() => javobBer(i, vi)}
                      disabled={topshirildi}
                      style={{
                        textAlign: 'left',
                        border: togriJavob ? '1px solid #16a34a' : notogriTanlandi ? '1px solid #dc2626' : tanlandi ? '1px solid var(--accent)' : '1px solid var(--line)',
                        background: togriJavob ? '#16a34a1a' : notogriTanlandi ? '#dc26261a' : tanlandi ? 'var(--accent-soft)' : 'var(--surface-2)',
                        color: 'var(--ink)',
                        borderRadius: '10px', padding: '9px 14px', fontSize: '13px', fontWeight: 600,
                        cursor: topshirildi ? 'default' : 'pointer',
                      }}
                    >
                      {v} {togriJavob && ' ✓'} {notogriTanlandi && ' ✗'}
                    </button>
                  )
                })}
              </div>
              {izohKorsat && topshirildi && (
                <p style={{
                  margin: '10px 0 0 34px', fontSize: '12.5px', color: 'var(--ink-soft)',
                  background: 'var(--surface-2)', borderRadius: '8px', padding: '8px 12px', lineHeight: 1.5,
                }}>
                  💡 {s.izoh}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {!topshirildi ? (
        <button
          onClick={topshir}
          disabled={!tuldi}
          className="btn-animated soft-press"
          style={{
            width: '100%', marginTop: '20px', background: tuldi ? 'var(--accent)' : 'var(--surface-2)',
            color: tuldi ? 'white' : 'var(--muted)', border: 'none', borderRadius: '12px',
            padding: '16px', fontSize: '15px', fontWeight: 700, cursor: tuldi ? 'pointer' : 'not-allowed',
          }}
        >
          Javoblarni topshirish
        </button>
      ) : (
        <div className="rise" style={{
          marginTop: '20px', background: 'var(--surface)', border: `2px solid ${natijaRang}33`, borderRadius: '16px',
          padding: '24px', textAlign: 'center',
        }}>
          {buzilishSababliYakunlandi && (
            <p style={{ margin: '0 0 12px', fontSize: '12.5px', fontWeight: 700, color: '#dc2626' }}>
              ⚠️ Test qoidabuzarlik (oyna/tab almashtirish) tufayli avtomatik yakunlandi.
            </p>
          )}
          <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '.04em' }}>Natijangiz</div>
          <div style={{ fontSize: '40px', fontWeight: 800, color: natijaRang, margin: '4px 0' }}>{togriSon} / {savollar.length}</div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: natijaRang }}>{foiz}% to&apos;g&apos;ri</div>
          {qaytaUrinishKorinsin && (
            <button onClick={qaytaUrinish} className="soft-press" style={{
              marginTop: '18px', background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '10px',
              padding: '10px 18px', fontSize: '13px', fontWeight: 600, color: 'var(--ink-soft)', cursor: 'pointer',
            }}>
              ↺ Qayta urinish
            </button>
          )}
        </div>
      )}
    </>
  )
}

function AmaliyTestBolimi({ darsSlug, darsNomi, bank, savolSoni = 20 }: { darsSlug: string; darsNomi: string; bank: TestSavoli[]; savolSoni?: number }) {
  const supabase = createClient()
  const savollar = useMemo(
    () => shuffleVaTanla(bank, Math.min(savolSoni, bank.length)).map(variantlarniAralashtir),
    [bank, savolSoni]
  )

  const saqla = async ({ togriSon, jami }: TestNatija) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('talim_natijalari').insert({
      student_id: user.id, dars_slug: darsSlug, dars_nomi: darsNomi,
      togri_son: togriSon, jami_savol: jami, foiz: Math.round((togriSon / jami) * 100), turi: 'amaliy',
    })
  }

  if (savollar.length === 0) return <BoshUlash matn="Savollar yuklanmoqda..." />

  return (
    <TestBlok
      key={savollar.map((s) => s.savol).join('|')}
      savollar={savollar}
      izohKorsat
      qaytaUrinishKorinsin
      boshlashSarlavha={<>Bankdan tasodifiy <strong>{savollar.length} ta</strong> savol tanlandi. Xohlagancha qayta urinishingiz mumkin.</>}
      boshlashTugma="Testni boshlash →"
      onTopshirish={saqla}
    />
  )
}

function UsmleTestBolimi({ darsSlug, darsNomi, bank }: { darsSlug: string; darsNomi: string; bank: UsmleSavoli[] }) {
  const supabase = createClient()
  const savollar = useMemo(
    () => shuffleVaTanla(bank, Math.min(5, bank.length)).map(variantlarniAralashtir),
    [bank]
  )

  const saqla = async ({ togriSon, jami }: TestNatija) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('talim_natijalari').insert({
      student_id: user.id, dars_slug: darsSlug, dars_nomi: darsNomi,
      togri_son: togriSon, jami_savol: jami, foiz: Math.round((togriSon / jami) * 100), turi: 'usmle',
    })
  }

  if (savollar.length === 0) return <BoshUlash matn="Savollar yuklanmoqda..." />

  return (
    <TestBlok
      key={savollar.map((s) => s.savol).join('|')}
      savollar={savollar}
      izohKorsat
      qaytaUrinishKorinsin
      boshlashSarlavha={<>USMLE uslubidagi bankdan tasodifiy <strong>{savollar.length} ta</strong> klinik vinyetka savoli tanlandi. Xohlagancha qayta urinishingiz mumkin.</>}
      boshlashTugma="USMLE testni boshlash →"
      onTopshirish={saqla}
    />
  )
}

function FlashcardBolimi({ kartalar }: { kartalar: Flashcard[] }) {
  const [tartib, setTartib] = useState<number[]>(() => kartalar.map((_, i) => i).sort(() => Math.random() - 0.5))
  const [joriy, setJoriy] = useState(0)
  const [ochiq, setOchiq] = useState(false)
  const [bilganlar, setBilganlar] = useState<Set<number>>(new Set())
  const [bilmaganlar, setBilmaganlar] = useState<Set<number>>(new Set())

  if (kartalar.length === 0) return <BoshUlash matn="Flashcardlar tez orada qo'shiladi." />

  const tartiblanganlar = tartib.map((i) => kartalar[i])
  const joriyKarta = tartiblanganlar[joriy]
  const jami = tartiblanganlar.length
  const tugadi = joriy >= jami

  const aralashtir = () => {
    setTartib(kartalar.map((_, i) => i).sort(() => Math.random() - 0.5))
    setJoriy(0); setOchiq(false); setBilganlar(new Set()); setBilmaganlar(new Set())
  }

  const bildi = () => {
    if (!joriyKarta) return
    setBilganlar((b) => new Set([...b, joriyKarta.id]))
    setOchiq(false)
    setTimeout(() => setJoriy((j) => j + 1), 100)
  }

  const bilmadi = () => {
    if (!joriyKarta) return
    setBilmaganlar((b) => new Set([...b, joriyKarta.id]))
    setOchiq(false)
    setTimeout(() => setJoriy((j) => j + 1), 100)
  }

  const qaytadan = () => {
    setTartib(kartalar.map((_, i) => i).sort(() => Math.random() - 0.5))
    setJoriy(0); setOchiq(false); setBilganlar(new Set()); setBilmaganlar(new Set())
  }

  if (tugadi) {
    return (
      <div className="rise" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '52px', marginBottom: '12px' }}>
          {bilmaganlar.size === 0 ? '🎉' : bilganlar.size > bilmaganlar.size ? '👍' : '📚'}
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 12px' }}>{jami} ta karta tugadi!</h3>
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#16a34a' }}>{bilganlar.size}</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Bildim</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#dc2626' }}>{bilmaganlar.size}</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Bilmadim</div>
          </div>
        </div>
        <button onClick={qaytadan} style={{
          background: 'var(--accent)', color: 'white', border: 'none',
          borderRadius: '12px', padding: '12px 24px', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
        }}>Qaytadan boshlash</button>
      </div>
    )
  }

  return (
    <>
      <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{joriy + 1} / {jami}</span>
          <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
            <span style={{ color: '#16a34a', fontWeight: 700 }}>✅ {bilganlar.size}</span>
            <span style={{ color: '#dc2626', fontWeight: 700 }}>❌ {bilmaganlar.size}</span>
            <button onClick={aralashtir} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--muted)', fontSize: '12px', fontWeight: 600, padding: 0,
            }}>🔀 Aralashtir</button>
          </div>
        </div>
        <div style={{ height: '4px', borderRadius: '999px', background: 'var(--surface-2)', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: '999px', width: `${(joriy / jami) * 100}%`, background: 'var(--accent)', transition: 'width .3s' }} />
        </div>
      </div>

      <div
        onClick={() => setOchiq((o) => !o)}
        className="rise"
        style={{
          cursor: 'pointer', minHeight: '200px',
          background: ochiq ? 'var(--accent-soft, #eff6ff)' : 'var(--surface)',
          border: `2px solid ${ochiq ? 'var(--accent)' : 'var(--line)'}`,
          borderRadius: '18px', padding: '24px 22px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          position: 'relative', transition: 'all .2s ease',
          userSelect: 'none', marginBottom: '12px',
        }}
      >
        <div style={{ position: 'absolute', top: '12px', right: '14px', fontSize: '10.5px', color: 'var(--muted)', fontWeight: 600 }}>
          {ochiq ? '🔵 Javob' : '⚪ Savol'} · {joriyKarta?.kategoriya}
        </div>
        {!ochiq ? (
          <div>
            <p style={{ fontSize: '16px', fontWeight: 700, margin: 0, lineHeight: 1.5 }}>{joriyKarta?.old}</p>
            <p style={{ fontSize: '11.5px', color: 'var(--muted)', margin: '10px 0 0' }}>👆 Bosing — javobni ko&apos;rish</p>
          </div>
        ) : (
          <p style={{ fontSize: '14px', fontWeight: 500, margin: 0, lineHeight: 1.7, whiteSpace: 'pre-line' }}>{joriyKarta?.yangi}</p>
        )}
      </div>

      {ochiq && (
        <div className="rise" style={{ display: 'flex', gap: '10px' }}>
          <button onClick={bilmadi} style={{
            flex: 1, background: '#dc262612', color: '#dc2626',
            border: '1.5px solid #dc2626', borderRadius: '12px', padding: '12px',
            fontSize: '14px', fontWeight: 700, cursor: 'pointer',
          }}>✗ Bilmadim</button>
          <button onClick={bildi} style={{
            flex: 1, background: '#16a34a12', color: '#16a34a',
            border: '1.5px solid #16a34a', borderRadius: '12px', padding: '12px',
            fontSize: '14px', fontWeight: 700, cursor: 'pointer',
          }}>✓ Bildim</button>
        </div>
      )}
    </>
  )
}

function KlinikHolatlarBolimi({ holatlar }: { holatlar: KlinikHolat[] }) {
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

function NazoratTestBolimi({
  darsSlug, darsNomi, bank, savolSoni, vaqtDaqiqa, otishFoizi,
}: {
  darsSlug: string; darsNomi: string; bank: TestSavoli[]; savolSoni: number; vaqtDaqiqa: number; otishFoizi: number
}) {
  const supabase = createClient()
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [avvalgiNatija, setAvvalgiNatija] = useState<{ togri_son: number; jami_savol: number; foiz: number; created_at: string } | null>(null)
  const [savollar, setSavollar] = useState<TestSavoli[]>([])
  const [yakunlandi, setYakunlandi] = useState<TestNatija | null>(null)

  useEffect(() => {
    const tekshir = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setYuklanmoqda(false); return }
      const { data } = await supabase
        .from('talim_natijalari')
        .select('togri_son, jami_savol, foiz, created_at')
        .eq('student_id', user.id)
        .eq('dars_slug', darsSlug)
        .eq('turi', 'nazorat')
        .maybeSingle()
      setAvvalgiNatija(data ?? null)
      setSavollar(shuffleVaTanla(bank, Math.min(savolSoni, bank.length)).map(variantlarniAralashtir))
      setYuklanmoqda(false)
    }
    tekshir()
  }, [darsSlug, bank, savolSoni, supabase])

  const saqla = async ({ togriSon, jami }: TestNatija) => {
    setYakunlandi({ togriSon, jami })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('talim_natijalari').insert({
      student_id: user.id, dars_slug: darsSlug, dars_nomi: darsNomi,
      togri_son: togriSon, jami_savol: jami, foiz: Math.round((togriSon / jami) * 100), turi: 'nazorat',
    })
  }

  if (yuklanmoqda) return <BoshUlash matn="Yuklanmoqda..." />
  if (bank.length === 0) return <BoshUlash matn="Nazorat testi savollari tez orada qo'shiladi." />

  if (avvalgiNatija) {
    const otdi = avvalgiNatija.foiz >= otishFoizi
    return (
      <div className="rise" style={{
        background: 'var(--surface)', border: `2px solid ${otdi ? '#16a34a' : '#dc2626'}33`, borderRadius: '16px',
        padding: '26px', textAlign: 'center',
      }}>
        <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>
          Siz bu nazorat testini allaqachon topshirgansiz
        </div>
        <div style={{ fontSize: '36px', fontWeight: 800, margin: '8px 0', color: otdi ? '#16a34a' : '#dc2626' }}>
          {avvalgiNatija.togri_son} / {avvalgiNatija.jami_savol} ({avvalgiNatija.foiz}%)
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-soft)' }}>
          {new Date(avvalgiNatija.created_at).toLocaleString('uz-UZ')}
        </p>
        <p style={{ margin: '14px 0 0', fontSize: '13.5px', fontWeight: 700, color: otdi ? '#16a34a' : '#dc2626' }}>
          {otdi ? `✓ Sertifikat olish chegarasi (${otishFoizi}%) bajarildi.` : `Sertifikat chegarasi (${otishFoizi}%) bajarilmadi.`}
        </p>
      </div>
    )
  }

  if (yakunlandi) {
    const foiz = Math.round((yakunlandi.togriSon / yakunlandi.jami) * 100)
    const otdi = foiz >= otishFoizi
    return (
      <div className="rise" style={{
        background: 'var(--surface)', border: `2px solid ${otdi ? '#16a34a' : '#dc2626'}33`, borderRadius: '16px',
        padding: '26px', textAlign: 'center',
      }}>
        <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>Yakuniy natija</div>
        <div style={{ fontSize: '40px', fontWeight: 800, margin: '8px 0', color: otdi ? '#16a34a' : '#dc2626' }}>
          {yakunlandi.togriSon} / {yakunlandi.jami} ({foiz}%)
        </div>
        <p style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: otdi ? '#16a34a' : '#dc2626' }}>
          {otdi ? `🏅 Tabriklaymiz! Sertifikat olish huquqiga ega bo'ldingiz.` : `Sertifikat chegarasi (${otishFoizi}%) bajarilmadi — qaytadan urinish admin/shifokor orqali rasmiylashtiriladi.`}
        </p>
      </div>
    )
  }

  return (
    <TestBlok
      savollar={savollar}
      izohKorsat={false}
      vaqtDaqiqa={vaqtDaqiqa}
      qaytaUrinishKorinsin={false}
      qattiqRejim
      boshlashSarlavha={
        <>
          Bu — <strong>yakkama-yakka, yopiq</strong> nazorat testi: <strong>{savollar.length} savol</strong>,{' '}
          <strong>{vaqtDaqiqa} daqiqa</strong>, hech qanday materialdan foydalanish mumkin emas, javoblar darhol
          ko&apos;rsatilmaydi va faqat <strong>bitta marta</strong> urinish huquqi beriladi. {otishFoizi}% va undan
          yuqori natija sertifikat olish huquqini beradi.
          <br /><br />
          🖥️ Test boshlanganda <strong>to&apos;liq ekran (fullscreen)</strong> rejimi yoqiladi. Boshqa tab/oynaga
          o&apos;tsangiz yoki fullscreendan chiqsangiz — <strong>1-marta ogohlantirilasiz</strong>, qaytarilsa{' '}
          <strong>test avtomatik yakunlanadi</strong>.
        </>
      }
      boshlashTugma="Nazorat testini boshlash"
      onTopshirish={saqla}
    />
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

function InteraktivCaseBolimi({ caselar }: { caselar: InteraktivCase[] }) {
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

function XatolarTahlilyBolimi({ tahlillar }: { tahlillar: XatoTahlil[] }) {
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

function VaziyatliMasalaBolimi({ masalalar }: { masalalar: VaziyatliMasala[] }) {
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
