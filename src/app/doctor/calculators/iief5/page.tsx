'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/AppShell'

// IIEF-5 (SHIM) — 5 savol, har biri 1–5 ball (1-savolda "jinsiy aloqa bo'lmagan" uchun 0 variant ham bor)
const SAVOLLAR = [
  {
    matn: "So'nggi 6 oy ichida erektsiyangizni qanchalik ishonchli holda yetarli darajada ushlab tura olgansiz?",
    variantlar: ['Jinsiy faoliyat bo\'lmagan', 'Juda past', 'Past', "O'rtacha", 'Yuqori', 'Juda yuqori'],
  },
  {
    matn: "So'nggi 6 oy ichida jinsiy qo'zg'alish natijasida erektsiya bo'lganda, jinsiy aloqaga kirish uchun yetarlicha qotgan holatga necha marta erisha oldingiz?",
    variantlar: ['Jinsiy faoliyat bo\'lmagan', 'Deyarli hech qachon', 'Kamdan-kam (yarmidan kamida)', 'Ba\'zan (taxminan yarmida)', "Ko'pincha (yarmidan ko'pida)", 'Deyarli har doim/har doim'],
  },
  {
    matn: "So'nggi 6 oy ichida jinsiy aloqa vaqtida erektsiyangizni necha marta saqlab qola oldingiz?",
    variantlar: ['Jinsiy aloqa bo\'lmagan', 'Juda qiyin', 'Qiyin', "O'rtacha qiyin", 'Sal qiyin', 'Qiyin emas'],
  },
  {
    matn: "So'nggi 6 oy ichida jinsiy aloqani yakunlash uchun erektsiyangizni saqlab qolish qanchalik qiyin bo'lgan?",
    variantlar: ['Jinsiy aloqa bo\'lmagan', 'Juda qiyin', 'Qiyin', "O'rtacha qiyin", 'Sal qiyin', 'Qiyin emas'],
  },
  {
    matn: "So'nggi 6 oy ichida jinsiy aloqaga kirishga harakat qilganingizda, bu sizga qanchalik qoniqarli tuyulgan?",
    variantlar: ['Jinsiy aloqaga harakat bo\'lmagan', 'Deyarli hech qachon', 'Kamdan-kam', 'Ba\'zan', "Ko'pincha", 'Deyarli har doim/har doim'],
  },
] as const

function daraja(jami: number) {
  if (jami <= 7) return { nom: "Og'ir erektil disfunksiya", rang: '#dc2626' }
  if (jami <= 11) return { nom: "O'rtacha-og'ir erektil disfunksiya", rang: '#ea580c' }
  if (jami <= 16) return { nom: "O'rtacha erektil disfunksiya", rang: '#d97706' }
  if (jami <= 21) return { nom: 'Yengil erektil disfunksiya', rang: '#65a30d' }
  return { nom: 'Erektil disfunksiya yo\'q', rang: '#16a34a' }
}

export default function IIEF5Page() {
  const router = useRouter()
  const [javoblar, setJavoblar] = useState<(number | null)[]>(Array(5).fill(null))

  const tuldi = javoblar.every((v) => v !== null)
  const jami = useMemo(() => javoblar.reduce((s: number, v) => s + (v ?? 0), 0), [javoblar])
  const natija = daraja(jami)

  const javobBer = (i: number, val: number) => setJavoblar((arr) => arr.map((v, j) => (j === i ? val : v)))
  const qaytaBoshla = () => setJavoblar(Array(5).fill(null))

  return (
    <AppShell title="IIEF-5 (SHIM)">
      <div className="mx-auto max-w-[820px] px-8 py-8">
        <button onClick={() => router.push('/doctor/calculators')} style={{
          background: 'none', border: 'none', color: 'var(--muted)', fontSize: '13px', cursor: 'pointer',
          padding: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          ← Kalkulyatorlarga qaytish
        </button>

        <div className="rise" style={{
          background: 'linear-gradient(135deg, #db2777, #f43f5e)', color: 'white',
          borderRadius: '18px', padding: '26px 28px', marginBottom: '20px',
        }}>
          <h2 style={{ margin: 0, fontSize: '21px', fontWeight: 800 }}>IIEF-5 (SHIM)</h2>
          <p style={{ margin: '8px 0 0', fontSize: '14px', opacity: 0.92, maxWidth: '60ch' }}>
            <strong>IIEF-5</strong> — <em>International Index of Erectile Function</em> (5 savollik qisqartirilgan shakl),
            shuningdek <strong>SHIM</strong> (<em>Sexual Health Inventory for Men</em>) nomi bilan ham tanilgan.
            To&apos;liq 15 savollik IIEF anketasining qisqartirilgan, klinik amaliyotda tezkor skrining uchun qulay versiyasi —
            erektil disfunksiya (ED) mavjudligi va og&apos;irlik darajasini standartlashtirilgan tarzda baholaydi.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {SAVOLLAR.map((s, i) => (
            <div key={i} className="rise" style={{
              animationDelay: `${Math.min(i * 0.05, 0.4)}s`,
              background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '18px 20px',
            }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                <span style={{
                  width: '24px', height: '24px', borderRadius: '7px', background: 'var(--accent-soft)', color: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, flexShrink: 0,
                }}>{i + 1}</span>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, lineHeight: 1.4 }}>{s.matn}</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingLeft: '34px' }}>
                {s.variantlar.map((v, vi) => (
                  <button
                    key={v}
                    onClick={() => javobBer(i, vi)}
                    className="soft-press"
                    style={{
                      border: javoblar[i] === vi ? 'none' : '1px solid var(--line)',
                      background: javoblar[i] === vi ? 'var(--accent)' : 'var(--surface-2)',
                      color: javoblar[i] === vi ? 'white' : 'var(--ink-soft)',
                      borderRadius: '999px', padding: '6px 13px', fontSize: '12.5px', fontWeight: 600,
                      cursor: 'pointer', transition: 'all .15s ease',
                    }}
                  >
                    {v} <span style={{ opacity: 0.7 }}>({vi})</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rise" style={{
          marginTop: '22px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
          padding: '24px 26px',
        }}>
          {!tuldi ? (
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px' }}>
              Natijani ko&apos;rish uchun yuqoridagi 5 ta savolga javob bering.
            </p>
          ) : (
            <>
              <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '.04em' }}>Jami ball (1–25)</div>
              <div style={{ fontSize: '40px', fontWeight: 800, color: natija.rang, lineHeight: 1.1 }}>{jami}</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: natija.rang, marginTop: '2px' }}>{natija.nom}</div>

              <div style={{ marginTop: '16px', height: '10px', borderRadius: '999px', background: 'var(--surface-2)', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
                  <div style={{ flex: 7, background: '#dc262622' }} />
                  <div style={{ flex: 4, background: '#ea580c22' }} />
                  <div style={{ flex: 5, background: '#d9770622' }} />
                  <div style={{ flex: 5, background: '#65a30d22' }} />
                  <div style={{ flex: 4, background: '#16a34a22' }} />
                </div>
                <div style={{
                  position: 'absolute', top: 0, left: 0, height: '100%', borderRadius: '999px',
                  width: `${(jami / 25) * 100}%`, background: natija.rang, transition: 'width .3s ease',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--muted)', marginTop: '6px' }}>
                <span>1–7 og&apos;ir</span><span>8–11</span><span>12–16</span><span>17–21</span><span>22–25 ED yo&apos;q</span>
              </div>

              <button onClick={qaytaBoshla} className="soft-press" style={{
                marginTop: '16px', background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '10px',
                padding: '9px 18px', fontSize: '13px', fontWeight: 600, color: 'var(--ink-soft)', cursor: 'pointer',
              }}>
                ↺ Qaytadan boshlash
              </button>
            </>
          )}
        </div>

        <div className="rise" style={{ marginTop: '20px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '22px 24px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
            Standart haqida
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>IIEF</strong> (International Index of Erectile Function) — 1997-yilda ishlab chiqilgan, 15 savoldan iborat to&apos;liq anketa,
              erkaklarda jinsiy funksiyaning 5 sohasini (erektil funksiya, orgazm, libido, jinsiy aloqadan qoniqish, umumiy qoniqish) baholaydi.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>IIEF-5 / SHIM</strong> — shu anketadan faqat erektil funksiyaga oid 5 savolni o&apos;z ichiga olgan qisqa shakli,
              klinik amaliyot va birinchi bosqich skrining uchun validatsiya qilingan. <strong>SHIM</strong> (Sexual Health Inventory for Men) — bu xuddi shu testning savdo nomi.
            </p>
            <p style={{ margin: 0 }}>
              Har bir savol <strong style={{ color: 'var(--ink)' }}>0(yoki 1) dan 5 ballgacha</strong> baholanadi, jami <strong style={{ color: 'var(--ink)' }}>1–25 ball</strong> oralig&apos;ida natija beradi:
            </p>
            <ul style={{ margin: '0 0 0 18px', padding: 0 }}>
              <li><strong style={{ color: '#dc2626' }}>1–7</strong> — og&apos;ir erektil disfunksiya (ED)</li>
              <li><strong style={{ color: '#ea580c' }}>8–11</strong> — o&apos;rtacha-og&apos;ir ED</li>
              <li><strong style={{ color: '#d97706' }}>12–16</strong> — o&apos;rtacha ED</li>
              <li><strong style={{ color: '#65a30d' }}>17–21</strong> — yengil ED</li>
              <li><strong style={{ color: '#16a34a' }}>22–25</strong> — ED belgilari yo&apos;q</li>
            </ul>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>
              Manba: Rosen RC va boshq. (1997, 1999) IIEF va IIEF-5 validatsiya tadqiqotlari. AUA/EAU andrologiya qo&apos;llanmalari. Bu kalkulyator faqat klinik yordamchi vosita — yakuniy tashxis va davolash shifokor tomonidan belgilanadi.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
