'use client'

import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { GINEKOLOGIYA_KALKULYATORLARI_KONTENTI, type KalkulyatorKontenti } from '@/lib/ginekologiyaKalkulyatorKontenti'
import { ManbaMeta } from '@/components/KlinikIzoh'

export function kontentTop(slug: string) {
  return GINEKOLOGIYA_KALKULYATORLARI_KONTENTI.find((k) => k.slug === slug) ?? null
}

export const ginInput = {
  width: '100%', background: 'var(--surface-2)', color: 'var(--ink)', border: '1px solid var(--line)',
  borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const,
}
export const ginLabel = { color: 'var(--ink-soft)', fontSize: '13px', display: 'block', marginBottom: '6px', fontWeight: 600 }
export const ginKarta = { background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '22px 24px' }

export function GinekologiyaKalkulyatorQobiq({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  const router = useRouter()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
      <Header backHref="/student/ginekologiya/kalkulyatorlar" backLabel="Kalkulyatorlar" />
      <main style={{ maxWidth: '820px', margin: '0 auto', padding: '24px 20px' }}>
        <button onClick={() => router.push('/student/ginekologiya/kalkulyatorlar')} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 0, marginBottom: '16px', fontSize: '13px' }}>
          ← Kalkulyatorlarga qaytish
        </button>
        <section className="rise" style={{ background: 'linear-gradient(135deg, var(--gyn), #f472b6)', color: 'white', borderRadius: '18px', padding: '26px 28px', marginBottom: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '21px', fontWeight: 800 }}>{title}</h1>
          <p style={{ margin: '8px 0 0', fontSize: '14px', opacity: .94, lineHeight: 1.6 }}>{subtitle}</p>
        </section>
        {children}
      </main>
      <BottomNav />
    </div>
  )
}

export function KlinikOgohlantirish({ children }: { children: ReactNode }) {
  return <p style={{ margin: '16px 0 0', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.55 }}>{children} Bu kalkulyator o‘quv va klinik yordamchi vosita; yakuniy qarorni mutaxassis qabul qiladi.</p>
}

// Bo'lim sarlavhasi: ikonka + rangli yozuv (barcha kontent bo'limlari uchun yagona).
function BolimSarlavha({ nishon, sarlavha, rang }: { nishon: string; sarlavha: string; rang: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
      <span style={{ fontSize: '15px', lineHeight: 1 }}>{nishon}</span>
      <span style={{ fontSize: '12.5px', fontWeight: 800, color: rang, textTransform: 'uppercase', letterSpacing: '.05em' }}>{sarlavha}</span>
    </div>
  )
}

// Rangli nuqta/raqamli markerли ro'yxatli bo'lim.
function KontentBolim({ nishon, sarlavha, rang, satrlar, raqamli }: { nishon: string; sarlavha: string; rang: string; satrlar?: string[]; raqamli?: boolean }) {
  if (!satrlar?.length) return null
  return (
    <div style={{ marginTop: '20px' }}>
      <BolimSarlavha nishon={nishon} sarlavha={sarlavha} rang={rang} />
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {satrlar.map((s, i) => (
          <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
            {raqamli
              ? <span style={{ flexShrink: 0, width: '19px', height: '19px', borderRadius: '50%', background: `color-mix(in srgb, ${rang} 16%, transparent)`, color: rang, fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px' }}>{i + 1}</span>
              : <span style={{ flexShrink: 0, width: '6px', height: '6px', borderRadius: '50%', background: rang, marginTop: '8px' }} />}
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Klinik izoh (batafsil matn) — ikonka + chap aksent chizig'i bilan.
function KlinikIzohBloki({ matn }: { matn: string }) {
  return (
    <div>
      <BolimSarlavha nishon="🧭" sarlavha="Bu nimani anglatadi" rang="var(--gyn)" />
      <p style={{ margin: 0, fontSize: '14.5px', color: 'var(--ink)', lineHeight: 1.7, borderLeft: '3px solid var(--gyn)', paddingLeft: '14px' }}>{matn}</p>
    </div>
  )
}

// 5-qismli standartning qo'shimcha qismlari (mavjud bo'lganda ko'rsatiladi).
function BeshQismQoshimcha({ k }: { k: KalkulyatorKontenti }) {
  return (
    <>
      <KontentBolim nishon="🚫" sarlavha="Bu nimani anglatmaydi" rang="var(--danger)" satrlar={k.buNimaEmas} />
      <KontentBolim nishon="➡️" sarlavha="Keyingi qadam" rang="var(--gyn)" satrlar={k.keyingiQadam} raqamli />
      {k.klinikMisol && (
        <div style={{ marginTop: '20px' }}>
          <BolimSarlavha nishon="🩺" sarlavha="Klinik misol" rang="var(--good)" />
          <div style={{ background: 'color-mix(in srgb, var(--good) 8%, var(--surface-2))', border: '1px solid color-mix(in srgb, var(--good) 30%, var(--line))', borderRadius: '12px', padding: '14px 16px', fontSize: '14px', lineHeight: 1.65 }}>
            <p style={{ margin: '0 0 7px' }}><strong style={{ color: 'var(--ink)' }}>Vaziyat:</strong> <span style={{ color: 'var(--ink-soft)' }}>{k.klinikMisol.vaziyat}</span></p>
            <p style={{ margin: 0 }}><strong style={{ color: 'var(--good)' }}>Javob:</strong> <span style={{ color: 'var(--ink-soft)' }}>{k.klinikMisol.javob}</span></p>
          </div>
        </div>
      )}
      <KontentBolim nishon="⚠️" sarlavha="Ko‘p uchraydigan xato" rang="var(--warn)" satrlar={k.kopUchraydiganXato} />
    </>
  )
}

/**
 * Jonli kalkulyator sahifasi ostiga qo'yiladigan kontent bloki (5-qismli standart):
 * klinik izoh → natija talqini → nimani anglatmaydi → keyingi qadam → misol →
 * ko'p uchraydigan xato → cheklovlar → manbalar.
 */
export function KalkulyatorKontent({ slug }: { slug: string }) {
  const k = kontentTop(slug)
  if (!k) return null
  return (
    <section className="rise" style={{ ...ginKarta, marginTop: '16px' }}>
      {k.batafsilIzoh && <KlinikIzohBloki matn={k.batafsilIzoh} />}
      <KontentBolim nishon="📊" sarlavha="Natija talqini" rang="var(--gyn)" satrlar={k.natijaTalqini} />
      <BeshQismQoshimcha k={k} />
      <KontentBolim nishon="🔒" sarlavha="Cheklovlar" rang="var(--muted)" satrlar={k.cheklovlar} />
      <KontentBolim nishon="📚" sarlavha="Manbalar" rang="var(--muted)" satrlar={k.manbalar} />
      <ManbaMeta litsenziya={k.litsenziya} />
    </section>
  )
}

/**
 * Hozircha jonli hisoblash qismi bo'lmagan (savol banki yoki tashqi modelga
 * bog'liq) kalkulyatorlar uchun to'liq ma'lumot sahifasi.
 */
export function KalkulyatorInfoSahifa({ slug }: { slug: string }) {
  const k = kontentTop(slug)
  if (!k) return <GinekologiyaKalkulyatorQobiq title="Topilmadi" subtitle="Bu kalkulyator uchun kontent topilmadi."><span /></GinekologiyaKalkulyatorQobiq>
  return (
    <GinekologiyaKalkulyatorQobiq title={k.nomi} subtitle={k.qisqaIzoh}>
      <section className="rise" style={{ ...ginKarta, marginBottom: '16px', borderStyle: 'dashed' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: 'var(--gyn)' }}>
          <span style={{ fontSize: '16px' }}>🛠️</span> Interaktiv hisoblash qismi tayyorlanmoqda
        </div>
        <p style={{ margin: '8px 0 0', fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6 }}>
          Quyida shkalaning to'liq klinik ta'rifi, kiritiladigan ma'lumotlar, hisoblash mantig'i va talqini keltirilgan.
        </p>
      </section>
      <section className="rise" style={ginKarta}>
        <KlinikIzohBloki matn={k.batafsilIzoh} />
        <KontentBolim nishon="📝" sarlavha="Kiritiladigan ma'lumotlar" rang="var(--gyn)" satrlar={k.maydonlar} />
        <KontentBolim nishon="🧮" sarlavha="Qanday hisoblanadi" rang="var(--gyn)" satrlar={k.hisoblash} raqamli />
        <KontentBolim nishon="📊" sarlavha="Natija talqini" rang="var(--gyn)" satrlar={k.natijaTalqini} />
        <BeshQismQoshimcha k={k} />
        <KontentBolim nishon="🔒" sarlavha="Cheklovlar" rang="var(--muted)" satrlar={k.cheklovlar} />
        <KontentBolim nishon="📚" sarlavha="Manbalar" rang="var(--muted)" satrlar={k.manbalar} />
        <ManbaMeta litsenziya={k.litsenziya} />
        <KlinikOgohlantirish>Ushbu ma'lumot standartlarga asoslangan.</KlinikOgohlantirish>
      </section>
    </GinekologiyaKalkulyatorQobiq>
  )
}
