'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/AppShell'

type Kalk = {
  href: string
  icon: string
  title: string
  desc: string
  kategoriya: string
  faol: boolean
  gradient: string
}

const KATEGORIYALAR = ['Hammasi', 'Prostata', 'Erkak bepushtligi', 'Erektil funksiya', 'Buyrak', 'Siydik pufagi'] as const

const KALKULYATORLAR: Kalk[] = [
  {
    href: '/doctor/calculators/varikotsele', icon: '🧮', title: 'Varikotsele solishtirish',
    desc: 'Laparoskopik, Marmar, Skleroterapiya, Palomo, Ivanissevich usullarini qiyosiy tahlil qilish',
    kategoriya: 'Erkak bepushtligi', faol: true, gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  },
  {
    href: '/doctor/calculators/ipss', icon: '📊', title: 'IPSS / AUA-SS',
    desc: 'Xalqaro prostata simptomlari indeksi — 7 savol bo\'yicha og\'irlik darajasini baholash',
    kategoriya: 'Prostata', faol: true, gradient: 'linear-gradient(135deg, #2563eb, #0891b2)',
  },
  {
    href: '#', icon: '🩸', title: 'PSA kalkulyatori',
    desc: 'Yoshga moslashgan me\'zonlar, PSA zichligi va erkin/umumiy PSA nisbati',
    kategoriya: 'Prostata', faol: false, gradient: 'linear-gradient(135deg, #dc2626, #f97316)',
  },
  {
    href: '#', icon: '🍈', title: 'Prostata hajmi',
    desc: 'USI o\'lchamlari (uzunlik × kenglik × balandlik) asosida ellipsoid formula bo\'yicha hajm',
    kategoriya: 'Prostata', faol: false, gradient: 'linear-gradient(135deg, #ea580c, #facc15)',
  },
  {
    href: '#', icon: '🧬', title: 'WHO 2021 spermogramma',
    desc: 'Sperma tahlili ko\'rsatkichlarini WHO 6-nashr me\'zonlari bilan solishtirish',
    kategoriya: 'Erkak bepushtligi', faol: false, gradient: 'linear-gradient(135deg, #0d9488, #22c55e)',
  },
  {
    href: '#', icon: '🔬', title: 'Dubin-Amelar darajasi',
    desc: 'Varikotsele klinik darajasini (I–III) tekshiruv natijalari bo\'yicha aniqlash',
    kategoriya: 'Erkak bepushtligi', faol: false, gradient: 'linear-gradient(135deg, #7c3aed, #c026d3)',
  },
  {
    href: '#', icon: '💙', title: 'IIEF-5 (SHIM)',
    desc: 'Erektil disfunksiyani 5 savollik anketa orqali baholash',
    kategoriya: 'Erektil funksiya', faol: false, gradient: 'linear-gradient(135deg, #db2777, #f43f5e)',
  },
  {
    href: '#', icon: '🧪', title: 'Testosteron tanqisligi (ADAM)',
    desc: 'Erkaklarda androgen yetishmovchiligi anketasi orqali dastlabki baholash',
    kategoriya: 'Erektil funksiya', faol: false, gradient: 'linear-gradient(135deg, #4338ca, #6366f1)',
  },
  {
    href: '#', icon: '🫘', title: 'eGFR (CKD-EPI)',
    desc: 'Kreatinin, yosh va jins asosida buyrak filtratsiya tezligini hisoblash',
    kategoriya: 'Buyrak', faol: false, gradient: 'linear-gradient(135deg, #0369a1, #38bdf8)',
  },
  {
    href: '#', icon: '⚗️', title: 'Kreatinin klirensi (Cockcroft-Gault)',
    desc: 'Tana vazni, yosh va kreatinin asosida klirensni baholash',
    kategoriya: 'Buyrak', faol: false, gradient: 'linear-gradient(135deg, #0e7490, #06b6d4)',
  },
  {
    href: '#', icon: '🪨', title: 'STONE skor',
    desc: 'Siydik yo\'li toshi ehtimolini klinik belgilar bo\'yicha bashorat qilish',
    kategoriya: 'Buyrak', faol: false, gradient: 'linear-gradient(135deg, #57534e, #a8a29e)',
  },
  {
    href: '#', icon: '🗺️', title: 'R.E.N.A.L. nefrometriya',
    desc: 'Buyrak o\'smasi murakkabligini USI/KT o\'lchamlari bo\'yicha ballash',
    kategoriya: 'Buyrak', faol: false, gradient: 'linear-gradient(135deg, #15803d, #84cc16)',
  },
  {
    href: '#', icon: '💧', title: 'Uroflowmetriya baholash',
    desc: 'Siydik oqimi tezligi (Qmax) natijalarini yosh me\'zonlari bilan izohlash',
    kategoriya: 'Siydik pufagi', faol: false, gradient: 'linear-gradient(135deg, #1d4ed8, #06b6d4)',
  },
  {
    href: '#', icon: '🚻', title: 'OAB-V8',
    desc: 'Giperaktiv siydik pufagi simptomlarini skrining anketasi orqali baholash',
    kategoriya: 'Siydik pufagi', faol: false, gradient: 'linear-gradient(135deg, #9333ea, #d946ef)',
  },
  {
    href: '#', icon: '🔥', title: 'NIH-CPSI',
    desc: 'Surunkali prostatit / chanoq og\'rig\'i sindromi indeksi',
    kategoriya: 'Prostata', faol: false, gradient: 'linear-gradient(135deg, #b91c1c, #ea580c)',
  },
]

export default function CalculatorsHubPage() {
  const router = useRouter()
  const [filtr, setFiltr] = useState<typeof KATEGORIYALAR[number]>('Hammasi')

  const royxat = filtr === 'Hammasi' ? KALKULYATORLAR : KALKULYATORLAR.filter((k) => k.kategoriya === filtr)
  const faolSoni = KALKULYATORLAR.filter((k) => k.faol).length

  return (
    <AppShell title="Kalkulatorlar">
      <div className="mx-auto max-w-[1080px] px-8 py-8">
        <div className="rise" style={{ marginBottom: '22px' }}>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800 }}>Klinik kalkulyatorlar</h2>
          <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontSize: '13.5px' }}>
            Urologiya va andrologiyada xalqaro standart hisoblangan{' '}
            <strong style={{ color: 'var(--ink)' }}>{KALKULYATORLAR.length}</strong> ta vosita —{' '}
            <strong style={{ color: 'var(--good)' }}>{faolSoni}</strong> tasi faol.
          </p>
        </div>

        {/* Kategoriya filtri */}
        <div className="rise" style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap', animationDelay: '.05s' }}>
          {KATEGORIYALAR.map((kat) => (
            <button
              key={kat}
              onClick={() => setFiltr(kat)}
              className="soft-press"
              style={{
                background: filtr === kat ? 'var(--accent)' : 'var(--surface-2)',
                color: filtr === kat ? 'white' : 'var(--ink-soft)',
                border: filtr === kat ? 'none' : '1px solid var(--line)',
                borderRadius: '999px', padding: '8px 16px', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer', transition: 'all .18s ease', whiteSpace: 'nowrap',
              }}
            >
              {kat}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {royxat.map((k, i) => (
            <div
              key={k.title}
              onClick={() => k.faol && router.push(k.href)}
              className={`rise ${k.faol ? 'lift' : ''}`}
              style={{
                animationDelay: `${Math.min(i * 0.05, 0.5)}s`,
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '16px',
                padding: '22px',
                cursor: k.faol ? 'pointer' : 'default',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform .2s ease, box-shadow .2s ease',
              }}
            >
              {!k.faol && (
                <span style={{
                  position: 'absolute', top: '14px', right: '14px', fontSize: '10.5px',
                  color: 'var(--muted)', border: '1px solid var(--line)', borderRadius: '999px',
                  padding: '3px 10px', fontWeight: 600, letterSpacing: '.02em',
                }}>
                  tez kunda
                </span>
              )}
              <div style={{
                width: '46px', height: '46px', borderRadius: '13px', background: k.gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
                marginBottom: '14px', boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                opacity: k.faol ? 1 : 0.65,
              }}>
                {k.icon}
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '6px' }}>
                {k.kategoriya}
              </div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '15.5px', fontWeight: 700, opacity: k.faol ? 1 : 0.85 }}>{k.title}</h3>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: '12.5px', lineHeight: 1.5 }}>{k.desc}</p>
              {k.faol && (
                <div style={{ marginTop: '14px', fontSize: '12.5px', fontWeight: 700, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Ochish →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
