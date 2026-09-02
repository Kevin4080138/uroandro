'use client'

// Kontent-iste'mol bo'limlari: nazariya, qo'shimcha adabiyotlar, video,
// yuklab olinadigan materiallar va flashcard. (Ilgari DarsClient.tsx ichida edi.)

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { darsTop } from '@/lib/talim/darslar'
import { type Flashcard } from '@/lib/talim/flashcardlar'
import { FileText, BarChart3, type LucideIcon } from 'lucide-react'
import { type Adabiyot } from './types'
import { BoshUlash } from './BoshUlash'

export function NazariyaBolimi({ dars, nazariyaHtml, adabiyotlar = [] }: {
  dars: NonNullable<ReturnType<typeof darsTop>>; nazariyaHtml?: string | null; adabiyotlar?: Adabiyot[]
}) {
  // Nazariyaning asosiy mazmuni — quyidagi variantlardan biri. Adabiyotlar bloki
  // har qanday variant ostida bir marta qo'shiladi (hammasi <> ichida qaytadi).
  let asosiy: React.ReactNode

  if (dars.nazariyaIframe) {
    asosiy = (
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
  } else if (nazariyaHtml) {
    asosiy = <div className="maqola-html" dangerouslySetInnerHTML={{ __html: nazariyaHtml }} />
  } else if (dars.bolimlar.length === 0) {
    // Tarkib `dars_tarkibi` jadvalidan keladi; hali to'ldirilmagan darslar uchun
    // bo'sh sahifa o'rniga tushunarli holat ko'rsatiladi.
    asosiy = (
      <div className="rise" style={{
        background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
        padding: '28px 24px', textAlign: 'center',
      }}>
        <div style={{ fontSize: '30px', marginBottom: '8px' }}>📝</div>
        <h3 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 800 }}>Nazariya tayyorlanmoqda</h3>
        <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.7, color: 'var(--muted)' }}>
          {"Bu darsning nazariy qismi hozir tayyorlanyapti. Tayyor bo'lgach shu yerda paydo bo'ladi — bosqichdagi boshqa darslar bilan davom etishingiz mumkin."}
        </p>
      </div>
    )
  } else {
    asosiy = (
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

  return (
    <>
      {asosiy}
      <AdabiyotlarBloki adabiyotlar={adabiyotlar} />
    </>
  )
}

function adabiyotHost(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return 'havola' }
}

// Nazariya ostida — talaba chuqurroq o'qishi uchun kitob/maqola havolalari.
// Admin panelidan qo'shiladi; video kartalari uslubiga mos.
function AdabiyotlarBloki({ adabiyotlar }: { adabiyotlar: Adabiyot[] }) {
  if (adabiyotlar.length === 0) return null
  return (
    <div className="rise" style={{ marginTop: '20px' }}>
      <p style={{ margin: '0 0 10px', fontSize: '12.5px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
        Qo&apos;shimcha adabiyotlar
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {adabiyotlar.map((a, i) => (
          <a
            key={`${a.url}-${i}`}
            href={a.url}
            target="_blank"
            rel="noopener noreferrer"
            className="lift"
            style={{
              display: 'flex', alignItems: 'center', gap: '13px',
              background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
              padding: '14px 18px', textDecoration: 'none', color: 'var(--ink)',
            }}
          >
            <span style={{
              width: '38px', height: '38px', borderRadius: '10px', background: 'var(--accent-soft)', color: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', flexShrink: 0,
            }}>📖</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, lineHeight: 1.35 }}>
                {a.nom || adabiyotHost(a.url)}
              </span>
              <span style={{ display: 'block', fontSize: '11.5px', color: 'var(--muted)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {adabiyotHost(a.url)}
              </span>
            </span>
            <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 700, flexShrink: 0 }}>Ochish ↗</span>
          </a>
        ))}
      </div>
    </div>
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

export function VideoBolimi({ asosiyVideo, linklar }: { asosiyVideo: string | null; linklar: string[] }) {
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

export function YuklabOlishBolimi({ konspektYoli, prezentatsiyaYoli }: { konspektYoli?: string | null; prezentatsiyaYoli?: string | null }) {
  const supabase = createClient()
  const [ochilgan, setOchilgan] = useState<{ signedUrl: string; asliyYol: string; nom: string } | null>(null)
  const [ochilmoqda, setOchilmoqda] = useState(false)
  const [xato, setXato] = useState<string | null>(null)

  const fayllar = [
    konspektYoli && { yol: konspektYoli, nom: 'Konspekt (PDF)', Icon: FileText },
    prezentatsiyaYoli && { yol: prezentatsiyaYoli, nom: 'Prezentatsiya', Icon: BarChart3 },
  ].filter(Boolean) as { yol: string; nom: string; Icon: LucideIcon }[]

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
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}><f.Icon size={19} strokeWidth={2} /></span>
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

export function FlashcardBolimi({ kartalar }: { kartalar: Flashcard[] }) {
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
