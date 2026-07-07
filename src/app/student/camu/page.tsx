'use client'

import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import Image from 'next/image'

const BEPUL_DARSLAR = [
  {
    icon: '🫁',
    sarlavha: 'Urologiya asoslari',
    izoh: 'Buyrak, siydik pufagi va siydik yo\'llarining anatomiyasi va fiziologiyasi',
    href: '/student/darslar',
    rang: 'var(--accent)',
  },
  {
    icon: '🔬',
    sarlavha: 'Diagnostika usullari',
    izoh: 'USI, KT, MRT — urologik tekshiruvlar qo\'llanmasi',
    href: '/student/darslar',
    rang: 'var(--good)',
  },
  {
    icon: '💊',
    sarlavha: 'Klinik farmakologiya',
    izoh: 'Urologiyada ishlatiladigan asosiy dorilar va dozalash',
    href: '/student/darslar',
    rang: 'var(--accent-2)',
  },
]

const MAQOLALAR = [
  {
    sarlavha: 'Prostata adenomasi: yangi qarashlar',
    muallif: 'Urosfera tahririyati',
    sana: '2025 yil',
    icon: '📝',
  },
  {
    sarlavha: 'USMLE uchun urologiya savollar tahlili',
    muallif: 'Urosfera tahririyati',
    sana: '2025 yil',
    icon: '📋',
  },
  {
    sarlavha: 'Klinik holat: 45 yoshli erkakda gematüriya',
    muallif: 'Urosfera tahririyati',
    sana: '2025 yil',
    icon: '🩺',
  },
]

const IMKONIYATLAR = [
  { icon: '🎓', sarlavha: 'Bepul kurslar', izoh: 'CAMU talabalari uchun barcha asosiy kurslar bepul', rang: 'var(--accent)' },
  { icon: '📚', sarlavha: 'Kutubxona', izoh: 'Darsliklar, qo\'llanmalar va rasmiy protokollar', rang: 'var(--good)' },
  { icon: '🏆', sarlavha: 'Sertifikat', izoh: 'Kursni tugatgandan so\'ng elektron sertifikat', rang: 'var(--accent-2)' },
  { icon: '🤝', sarlavha: 'Mentorlik', izoh: 'Klinisi shifokorlar bilan bog\'lanish imkoniyati', rang: 'var(--warn)' },
  { icon: '📊', sarlavha: 'Test banklar', izoh: '500+ USMLE va klinik savol', rang: 'var(--danger)' },
  { icon: '🧬', sarlavha: 'Klinik holatlar', izoh: 'Real klinik vaziyatlar bo\'yicha mashq', rang: '#7c3aed' },
]

export default function CamuPage() {
  const router = useRouter()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
      <Header backHref="/student/dashboard" backLabel="Bosh sahifa" />

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '24px 20px' }}>

        {/* Hero — CAMU Logo va sarlavha */}
        <div className="rise" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center', marginBottom: '36px', padding: '32px 20px',
          background: 'linear-gradient(135deg, #0f2573 0%, #1a3a9e 60%, #2451c8 100%)',
          borderRadius: '24px', position: 'relative', overflow: 'hidden',
        }}>
          {/* Bezak doiralar */}
          <div style={{
            position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px',
            borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
          }} />
          <div style={{
            position: 'absolute', bottom: '-30px', left: '-30px', width: '140px', height: '140px',
            borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
          }} />

          {/* Logo */}
          <div style={{
            width: '110px', height: '110px', borderRadius: '50%', overflow: 'hidden',
            border: '3px solid rgba(255,255,255,0.4)', marginBottom: '18px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)', flexShrink: 0,
            background: '#1a3a9e',
          }}>
            <Image
              src="/camu-logo.png"
              alt="CAMU Logo"
              width={110}
              height={110}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 800, margin: '0 0 6px', lineHeight: 1.2 }}>
            Central Asian Medical University
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', margin: '0 0 6px' }}>
            Since 2022 · Toshkent, O&apos;zbekiston
          </p>
          <div style={{
            display: 'inline-block', background: 'rgba(255,255,255,0.15)', borderRadius: '999px',
            padding: '5px 16px', fontSize: '12px', color: '#fff', fontWeight: 600, marginTop: '8px',
          }}>
            🎓 CAMU talabalari uchun maxsus bo&apos;lim
          </div>
        </div>

        {/* Imkoniyatlar */}
        <h2 className="rise" style={{ fontSize: '16px', fontWeight: 800, marginBottom: '14px', animationDelay: '.04s' }}>
          ✨ Sizga nima beriladi
        </h2>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '10px', marginBottom: '32px',
        }}>
          {IMKONIYATLAR.map((item, i) => (
            <div key={item.sarlavha} className="rise" style={{
              background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
              padding: '14px 16px', animationDelay: `${0.06 + i * 0.04}s`,
            }}>
              <div style={{ fontSize: '22px', marginBottom: '6px' }}>{item.icon}</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: item.rang, marginBottom: '4px' }}>{item.sarlavha}</div>
              <div style={{ fontSize: '11.5px', color: 'var(--muted)', lineHeight: 1.4 }}>{item.izoh}</div>
            </div>
          ))}
        </div>

        {/* Bepul darslar */}
        <h2 className="rise" style={{ fontSize: '16px', fontWeight: 800, marginBottom: '14px', animationDelay: '.08s' }}>
          📖 Bepul darslar
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
          {BEPUL_DARSLAR.map((d, i) => (
            <div
              key={d.sarlavha}
              onClick={() => router.push(d.href)}
              className="rise lift"
              style={{
                animationDelay: `${0.1 + i * 0.04}s`,
                background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
                padding: '16px 18px', cursor: 'pointer', display: 'flex', gap: '14px', alignItems: 'center',
              }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                background: d.rang + '22', color: d.rang,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
              }}>
                {d.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '3px' }}>{d.sarlavha}</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.4 }}>{d.izoh}</div>
              </div>
              <span style={{ color: 'var(--muted)', fontSize: '18px' }}>›</span>
            </div>
          ))}

          <button
            onClick={() => router.push('/student/darslar')}
            style={{
              background: '#0f2573', color: '#fff', border: 'none', borderRadius: '14px',
              padding: '14px', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            🎓 Barcha darslarni ko&apos;rish
          </button>
        </div>

        {/* Maqolalar */}
        <h2 className="rise" style={{ fontSize: '16px', fontWeight: 800, marginBottom: '14px', animationDelay: '.14s' }}>
          📰 Maqolalar va resurslar
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
          {MAQOLALAR.map((m, i) => (
            <div key={m.sarlavha} className="rise" style={{
              animationDelay: `${0.16 + i * 0.04}s`,
              background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
              padding: '14px 18px', display: 'flex', gap: '12px', alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: '22px', flexShrink: 0 }}>{m.icon}</span>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 700, marginBottom: '4px' }}>{m.sarlavha}</div>
                <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>{m.muallif} · {m.sana}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Aloqa */}
        <div className="rise" style={{
          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
          padding: '20px', textAlign: 'center', animationDelay: '.22s',
        }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>💬</div>
          <h3 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 6px' }}>CAMU talabasisiz?</h3>
          <p style={{ fontSize: '12.5px', color: 'var(--muted)', margin: '0 0 14px', lineHeight: 1.5 }}>
            Urosfera jamoasi bilan bog&apos;laning — savollar, takliflar va hamkorlik uchun.
          </p>
          <button
            onClick={() => router.push('/student/profil/feedback')}
            style={{
              background: '#0f2573', color: '#fff', border: 'none', borderRadius: '10px',
              padding: '10px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
            }}
          >
            ✉️ Xabar yuborish
          </button>
        </div>

      </div>
      <BottomNav />
    </div>
  )
}
