'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '@/components/Header'
import { createClient } from '@/lib/supabase'
import { darsTop, shuffleVaTanla, variantlarniAralashtir, BOSQICHLAR, type TestSavoli, type UsmleSavoli } from '@/lib/talim/darslar'
import { useMeningObunalarim } from '@/lib/talim/useObuna'

type Tab = 'nazariya' | 'video' | 'yuklab' | 'amaliy' | 'usmle' | 'nazorat'

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
  const usmleBank = tarkib?.usmle_savollar ?? dars?.usmleSavollar ?? []
  const nazoratBank = tarkib?.nazorat_savollar ?? dars?.nazoratSavollar ?? []
  const nazoratSavolSoni = tarkib?.nazorat_savol_soni ?? dars?.nazoratSavolSoni ?? 20
  const nazoratVaqtDaqiqa = tarkib?.nazorat_vaqt_daqiqa ?? dars?.nazoratVaqtDaqiqa ?? 15
  const sertifikatOtishFoizi = tarkib?.sertifikat_otish_foizi ?? dars?.sertifikatOtishFoizi ?? 70

  const tabMavjud: Record<Tab, boolean> = {
    nazariya: true,
    video: !!asosiyVideo || videoLinklar.length > 0,
    yuklab: !!(konspektYoli || prezentatsiyaYoli),
    amaliy: amaliyBank.length > 0,
    usmle: usmleBank.length > 0,
    nazorat: nazoratBank.length > 0,
  }
  const TAB_NOMI: Record<Tab, string> = {
    nazariya: '📖 Nazariya',
    video: '🎥 Video',
    yuklab: '📂 Materiallar',
    amaliy: '✅ Amaliy test',
    usmle: '🏅 USMLE',
    nazorat: '🔒 Nazorat',
  }

  const [tab, setTab] = useState<Tab>('nazariya')

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
        <div className="mx-auto max-w-[600px] px-8 py-12">
          <div className="rise" style={{
            background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '18px',
            padding: '40px 32px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔒</div>
            <h2 style={{ margin: '0 0 8px', fontSize: '19px', fontWeight: 800 }}>{dars.sarlavha}</h2>
            <p style={{ margin: '0 0 18px', fontSize: '13.5px', color: 'var(--muted)' }}>
              Bu dars <strong>{bosqichMa?.emoji} {bosqichMa?.nom}</strong> bosqichiga tegishli — uni ko&apos;rish uchun shu bosqichni sotib olishingiz kerak.
            </p>
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

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/student/darslar" backLabel="Darslar" />
      <div className="mx-auto max-w-[760px] px-8 py-8">
        <div className="rise" style={{
          background: 'linear-gradient(135deg, #2563eb, #0891b2)', color: 'white',
          borderRadius: '18px', padding: '26px 28px', marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, opacity: 0.85, textTransform: 'uppercase', letterSpacing: '.04em' }}>{dars.kategoriya}</span>
            {dars.bepulNamuna && (
              <span style={{
                fontSize: '10.5px', fontWeight: 800, background: 'rgba(255,255,255,.22)', borderRadius: '999px',
                padding: '2px 10px', letterSpacing: '.02em',
              }}>
                🎁 BEPUL NAMUNA
              </span>
            )}
          </div>
          <h1 style={{ margin: '6px 0 0', fontSize: '22px', fontWeight: 800, lineHeight: 1.3 }}>{dars.sarlavha}</h1>
          <p style={{ margin: '10px 0 0', fontSize: '13.5px', opacity: 0.92 }}>⏱ {dars.daqiqa} daqiqa o&apos;qish</p>
        </div>

        <div className="rise" style={{ display: 'flex', gap: '8px', marginBottom: '22px', flexWrap: 'wrap' }}>
          {(Object.keys(TAB_NOMI) as Tab[]).filter((t) => tabMavjud[t]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="soft-press"
              style={{
                background: tab === t ? 'var(--accent)' : 'var(--surface-2)',
                color: tab === t ? 'white' : 'var(--ink-soft)',
                border: tab === t ? 'none' : '1px solid var(--line)',
                borderRadius: '10px', padding: '9px 16px', fontSize: '13px', fontWeight: 700,
                cursor: 'pointer', transition: 'all .18s ease', whiteSpace: 'nowrap',
              }}
            >
              {TAB_NOMI[t]}
            </button>
          ))}
        </div>

        {tab === 'nazariya' && !yuklandi && <BoshUlash matn="Yuklanmoqda..." />}
        {tab === 'nazariya' && yuklandi && <NazariyaBolimi dars={dars} nazariyaHtml={nazariyaHtml} />}
        {tab === 'video' && <VideoBolimi asosiyVideo={asosiyVideo} linklar={videoLinklar} />}
        {tab === 'yuklab' && <YuklabOlishBolimi konspektYoli={konspektYoli} prezentatsiyaYoli={prezentatsiyaYoli} />}
        {tab === 'amaliy' && (
          <AmaliyTestBolimi
            darsSlug={dars.slug}
            darsNomi={dars.sarlavha}
            bank={amaliyBank}
          />
        )}
        {tab === 'usmle' && (
          <UsmleTestBolimi
            darsSlug={dars.slug}
            darsNomi={dars.sarlavha}
            bank={usmleBank}
          />
        )}
        {tab === 'nazorat' && (
          <NazoratTestBolimi
            darsSlug={dars.slug}
            darsNomi={dars.sarlavha}
            bank={nazoratBank}
            savolSoni={nazoratSavolSoni}
            vaqtDaqiqa={nazoratVaqtDaqiqa}
            otishFoizi={sertifikatOtishFoizi}
          />
        )}
      </div>
    </div>
  )
}

function NazariyaBolimi({ dars, nazariyaHtml }: { dars: NonNullable<ReturnType<typeof darsTop>>; nazariyaHtml?: string | null }) {
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

function AmaliyTestBolimi({ darsSlug, darsNomi, bank }: { darsSlug: string; darsNomi: string; bank: TestSavoli[] }) {
  const supabase = createClient()
  const savollar = useMemo(
    () => shuffleVaTanla(bank, Math.min(20, bank.length)).map(variantlarniAralashtir),
    [bank]
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
  }, [darsSlug, bank, savolSoni])

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
