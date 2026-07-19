import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DARSLAR, darsTop, BOSQICHLAR } from '@/lib/talim/darslar'
import { nazariyaHtmlniOl, nazariyadanOnamoyish, nazariyasiBorSluglar } from '@/lib/talim/nazariyaPreview'
import { SAYT_URL } from '@/lib/saytUrl'

// Ochiq dars sahifasi: nazariyaning boshlang'ich qismi login talab qilmaydi.
// Maqsad — Google'dan organik oqim: o'zbek tilida urologiya bo'yicha qidiruv natijalari
// deyarli bo'sh, shu sabab indekslanadigan sifatli matn raqobatsiz maydon.
// To'liq nazariya, flashcard, test va sertifikat esa ro'yxatdan o'tgach ochiladi.

export const revalidate = 3600 // tarkib bazadan keladi — soatiga bir marta yangilanadi

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return DARSLAR.map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const dars = darsTop(slug)
  if (!dars) return {}

  // Tarkibi hali tayyor bo'lmagan darslar indekslanmasin — bo'sh sahifalar
  // saytning umumiy qidiruv sifatini tushiradi.
  const tayyor = dars.nazariyaIframe ? true : (await nazariyasiBorSluglar()).has(dars.slug)

  const bosqich = BOSQICHLAR.find((b) => b.id === dars.bosqich)
  const tavsif = dars.qisqa || `${dars.sarlavha} — urologiya darsi.`
  return {
    robots: tayyor ? undefined : { index: false, follow: true },
    title: `${dars.sarlavha} — Urosfera`,
    description: `${tavsif} O'zbek tilida, Campbell-Walsh asosida.`,
    keywords: [dars.sarlavha, dars.kategoriya, 'urologiya', "o'zbek tilida urologiya", 'Urosfera'],
    alternates: { canonical: `${SAYT_URL}/darslar/${dars.slug}` },
    openGraph: {
      type: 'article',
      title: `${dars.sarlavha} — Urosfera`,
      description: tavsif,
      url: `${SAYT_URL}/darslar/${dars.slug}`,
      siteName: 'Urosfera',
      locale: 'uz_UZ',
    },
    other: { 'article:section': bosqich?.nom ?? dars.kategoriya },
  }
}

export default async function OchiqDarsSahifasi({ params }: Props) {
  const { slug } = await params
  const dars = darsTop(slug)
  if (!dars) notFound()

  const html = await nazariyaHtmlniOl(dars.slug, dars.nazariyaIframe)
  const onamoyish = html ? nazariyadanOnamoyish(html, dars.sarlavha) : null
  const bosqich = BOSQICHLAR.find((b) => b.id === dars.bosqich)

  // Qidiruv tizimlari uchun strukturalangan ma'lumot
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: dars.sarlavha,
    description: dars.qisqa,
    inLanguage: 'uz',
    educationalLevel: bosqich?.nom,
    learningResourceType: 'Lesson',
    isAccessibleForFree: !!dars.bepulNamuna,
    provider: { '@type': 'Organization', name: 'Urosfera', url: SAYT_URL },
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '24px 20px 60px' }}>
        <Link href="/darslar" style={{ fontSize: '13px', color: 'var(--muted)', textDecoration: 'none', fontWeight: 600 }}>
          ← Barcha darslar
        </Link>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '18px 0 10px' }}>
          <span style={{
            fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '999px',
            background: 'var(--surface-2)', color: 'var(--ink-soft)',
          }}>
            {bosqich?.emoji} {bosqich?.nom}
          </span>
          <span style={{
            fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px',
            background: 'var(--surface-2)', color: 'var(--muted)',
          }}>
            {dars.kategoriya}
          </span>
        </div>

        <h1 style={{ fontSize: '27px', lineHeight: 1.25, margin: '0 0 10px' }}>{dars.sarlavha}</h1>
        <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--ink-soft)', margin: '0 0 26px' }}>{dars.qisqa}</p>

        {onamoyish && onamoyish.paragraflar.length > 0 ? (
          <article style={{ marginBottom: '10px' }}>
            {onamoyish.paragraflar.map((b, i) =>
              b.turi === 'sarlavha' ? (
                <h2 key={i} style={{ fontSize: '18px', margin: '26px 0 10px', color: 'var(--accent)' }}>{b.matn}</h2>
              ) : (
                <p key={i} style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--ink-soft)', margin: '0 0 13px' }}>{b.matn}</p>
              )
            )}
          </article>
        ) : (
          <p style={{ fontSize: '14px', color: 'var(--muted)' }}>
            Bu darsning nazariy qismi hozir tayyorlanmoqda.
          </p>
        )}

        {/* Qolgan qism yopiq — lekin ichida nima borligi ko'rinib turadi */}
        <div style={{
          background: 'linear-gradient(120deg, var(--accent), var(--accent-2))', color: 'white',
          borderRadius: '18px', padding: '24px 22px', marginTop: '30px',
        }}>
          <h2 style={{ fontSize: '18px', margin: '0 0 8px', color: 'white' }}>
            Darsning davomi ro&apos;yxatdan o&apos;tgach ochiladi
          </h2>
          <p style={{ fontSize: '14px', lineHeight: 1.7, margin: '0 0 16px', color: 'rgba(255,255,255,.9)' }}>
            To&apos;liq nazariya, flashcardlar, amaliy test va videodarslar — bepul ro&apos;yxatdan o&apos;tib davom eting.
          </p>

          {onamoyish && onamoyish.qolganSarlavhalar.length > 0 && (
            <div style={{ marginBottom: '18px' }}>
              <div style={{
                fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.04em',
                color: 'rgba(255,255,255,.75)', marginBottom: '8px',
              }}>
                Darsning qolgan bo&apos;limlari
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {onamoyish.qolganSarlavhalar.slice(0, 8).map((s) => (
                  <li key={s} style={{ fontSize: '13.5px', color: 'rgba(255,255,255,.92)' }}>{s}</li>
                ))}
              </ul>
            </div>
          )}

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
