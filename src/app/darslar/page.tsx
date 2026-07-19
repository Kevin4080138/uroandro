import type { Metadata } from 'next'
import Link from 'next/link'
import { DARSLAR, BOSQICHLAR, bosqichBoyichaTartibla, type Bosqich } from '@/lib/talim/darslar'
import { nazariyasiBorSluglar } from '@/lib/talim/nazariyaPreview'
import { SAYT_URL } from '@/lib/saytUrl'

// Ochiq darslar katalogi — Google uchun kirish nuqtasi va ichki havolalar manbai.
export const revalidate = 3600

export const metadata: Metadata = {
  title: "Urologiya darslari o'zbek tilida — Urosfera",
  description:
    "Urologiya va andrologiya bo'yicha o'zbek tilidagi darslar: asosiy tushunchalardan " +
    "Campbell-Walsh darajasidagi murakkab klinik holatlarga qadar. Nazariya, flashcard, test va videodarslar.",
  keywords: ["urologiya o'zbek tilida", 'urologiya darslari', 'andrologiya', 'tibbiyot talabalari', 'Urosfera'],
  alternates: { canonical: `${SAYT_URL}/darslar` },
  openGraph: {
    type: 'website',
    title: "Urologiya darslari o'zbek tilida — Urosfera",
    description: "Urologiya va andrologiya bo'yicha o'zbek tilidagi to'liq kurs.",
    url: `${SAYT_URL}/darslar`,
    siteName: 'Urosfera',
    locale: 'uz_UZ',
  },
}

export default async function OchiqDarslarRoyxati() {
  const tayyor = await nazariyasiBorSluglar()
  const bor = (slug: string, iframe?: string) => !!iframe || tayyor.has(slug)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '30px 20px 60px' }}>
        <h1 style={{ fontSize: '30px', lineHeight: 1.2, margin: '0 0 12px' }}>
          Urologiya darslari — o&apos;zbek tilida
        </h1>
        <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink-soft)', margin: '0 0 26px' }}>
          Urologiya va andrologiya bo&apos;yicha bosqichma-bosqich kurs: asosiy tushunchalardan
          Campbell-Walsh darajasidagi murakkab klinik holatlarga qadar. Har darsda nazariya,
          flashcardlar, amaliy test va materiallar bor.
        </p>

        {BOSQICHLAR.map((b) => {
          const darslar = bosqichBoyichaTartibla(
            DARSLAR.filter((d) => d.bosqich === (b.id as Bosqich) && bor(d.slug, d.nazariyaIframe)),
            b.id as Bosqich
          )
          if (darslar.length === 0) return null

          return (
            <section key={b.id} style={{ marginBottom: '34px' }}>
              <h2 style={{ fontSize: '20px', margin: '0 0 4px' }}>{b.emoji} {b.nom}</h2>
              <p style={{ fontSize: '13.5px', color: 'var(--muted)', margin: '0 0 14px' }}>{b.tavsif}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {darslar.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/darslar/${d.slug}`}
                    style={{
                      display: 'block', textDecoration: 'none', color: 'inherit',
                      background: 'var(--surface)', border: '1px solid var(--line)',
                      borderRadius: '13px', padding: '14px 16px',
                    }}
                  >
                    <div style={{ fontSize: '14.5px', fontWeight: 700, marginBottom: '3px' }}>{d.sarlavha}</div>
                    <div style={{ fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.6 }}>{d.qisqa}</div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}

        <div style={{
          background: 'linear-gradient(120deg, var(--accent), var(--accent-2))', color: 'white',
          borderRadius: '18px', padding: '26px 24px', marginTop: '10px',
        }}>
          <h2 style={{ fontSize: '19px', margin: '0 0 8px', color: 'white' }}>Bepul boshlang</h2>
          <p style={{ fontSize: '14px', lineHeight: 1.7, margin: '0 0 16px', color: 'rgba(255,255,255,.9)' }}>
            Ro&apos;yxatdan o&apos;tib darslarni to&apos;liq oching: testlar, flashcardlar,
            videodarslar va bosqich sertifikati.
          </p>
          <Link
            href="/auth/register"
            style={{
              display: 'inline-block', background: 'white', color: 'var(--accent)',
              padding: '11px 22px', borderRadius: '11px', fontWeight: 800, fontSize: '14px', textDecoration: 'none',
            }}
          >
            Bepul ro&apos;yxatdan o&apos;tish →
          </Link>
        </div>
      </div>
    </div>
  )
}
