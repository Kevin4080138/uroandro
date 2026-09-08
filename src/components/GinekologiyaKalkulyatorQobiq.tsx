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

// Kontent spetsifikatsiyasidagi ro'yxatli bo'lim (cheklovlar, manbalar, hisoblash…)
function KontentBolim({ sarlavha, satrlar, raqamli }: { sarlavha: string; satrlar: string[]; raqamli?: boolean }) {
  if (!satrlar?.length) return null
  const Teg = raqamli ? 'ol' : 'ul'
  return (
    <div style={{ marginTop: '18px' }}>
      <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '8px' }}>{sarlavha}</div>
      <Teg style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {satrlar.map((s, i) => <li key={i} style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.55 }}>{s}</li>)}
      </Teg>
    </div>
  )
}

// 5-qismli standartning qo'shimcha qismlari (mavjud bo'lganda ko'rsatiladi).
function BeshQismQoshimcha({ k }: { k: KalkulyatorKontenti }) {
  return (
    <>
      <KontentBolim sarlavha="Bu nimani anglatmaydi" satrlar={k.buNimaEmas ?? []} />
      <KontentBolim sarlavha="Keyingi qadam" satrlar={k.keyingiQadam ?? []} raqamli />
      {k.klinikMisol && (
        <div style={{ marginTop: '18px' }}>
          <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '8px' }}>Klinik misol</div>
          <div style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '10px', padding: '12px 14px', fontSize: '13.5px', lineHeight: 1.6 }}>
            <p style={{ margin: '0 0 6px' }}><strong>Vaziyat:</strong> {k.klinikMisol.vaziyat}</p>
            <p style={{ margin: 0 }}><strong>Javob:</strong> {k.klinikMisol.javob}</p>
          </div>
        </div>
      )}
      <KontentBolim sarlavha="Ko‘p uchraydigan xato" satrlar={k.kopUchraydiganXato ?? []} />
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
      {k.batafsilIzoh && (
        <>
          <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '8px' }}>Klinik izoh (bu nimani anglatadi)</div>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>{k.batafsilIzoh}</p>
        </>
      )}
      <KontentBolim sarlavha="Natija talqini" satrlar={k.natijaTalqini} />
      <BeshQismQoshimcha k={k} />
      <KontentBolim sarlavha="Cheklovlar" satrlar={k.cheklovlar} />
      <KontentBolim sarlavha="Manbalar" satrlar={k.manbalar} />
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
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>{k.batafsilIzoh}</p>
        <KontentBolim sarlavha="Kiritiladigan ma'lumotlar" satrlar={k.maydonlar} />
        <KontentBolim sarlavha="Qanday hisoblanadi" satrlar={k.hisoblash} raqamli />
        <KontentBolim sarlavha="Natija talqini" satrlar={k.natijaTalqini} />
        <BeshQismQoshimcha k={k} />
        <KontentBolim sarlavha="Cheklovlar" satrlar={k.cheklovlar} />
        <KontentBolim sarlavha="Manbalar" satrlar={k.manbalar} />
        <ManbaMeta litsenziya={k.litsenziya} />
        <KlinikOgohlantirish>Ushbu ma'lumot standartlarga asoslangan.</KlinikOgohlantirish>
      </section>
    </GinekologiyaKalkulyatorQobiq>
  )
}
