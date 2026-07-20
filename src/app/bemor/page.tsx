'use client'

import { useRouter } from 'next/navigation'

const HARAKATLAR = [
  {
    belgi: '🔍',
    sarlavha: 'Shifokor topish',
    izoh: "Farg'ona urologlari, narxlari va reytingi",
    href: '/shifokorlar',
    asosiy: true,
    ochiq: true,
  },
  {
    belgi: '🗓',
    sarlavha: 'Navbatga yozilish',
    izoh: 'Shifokorga qulay vaqtga onlayn yoziling',
    href: '/patient/navbat',
    asosiy: false,
    ochiq: false,
  },
  {
    belgi: '💬',
    sarlavha: 'Dardimni aytish',
    izoh: 'Shikoyatingizni yozing, shifokor javob beradi',
    href: '/patient/murojaat',
    asosiy: false,
    ochiq: false,
  },
  {
    belgi: '🏥',
    sarlavha: 'Operatsiyalar haqida',
    izoh: 'Oddiy tilda: nega, qancha, qanday tuzaladi',
    href: '/patient/operatsiyalar',
    asosiy: false,
    ochiq: true,
  },
]

export default function BemorEshigiPage() {
  const router = useRouter()

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', color: 'var(--ink)' }}>
      {/* Yuqori tasma */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px', maxWidth: 560, margin: '0 auto',
      }}>
        <button
          onClick={() => router.push('/?tanla=1')}
          style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
        >
          ‹ Boshqa bo&apos;lim
        </button>
        <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-.02em' }}>
          Uro<span style={{ color: 'var(--accent)' }}>sfera</span>
        </span>
        <button
          onClick={() => router.push('/auth/login')}
          style={{ background: 'none', border: '1px solid var(--line)', color: 'var(--ink)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', borderRadius: 999, padding: '6px 14px' }}
        >
          Kirish
        </button>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '12px 20px 48px' }}>
        {/* Salom */}
        <h1 className="rise" style={{ fontSize: 27, fontWeight: 800, lineHeight: 1.2, margin: '12px 0 8px' }}>
          Sizga qanday yordam kerak?
        </h1>
        <p className="rise" style={{ color: 'var(--muted)', fontSize: 14, margin: '0 0 26px', lineHeight: 1.5, animationDelay: '.05s' }}>
          Kerakli tugmani bosing. Shifokor topish uchun ro&apos;yxatdan o&apos;tish shart emas.
        </p>

        {/* Harakatlar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {HARAKATLAR.map((h, i) => (
            <button
              key={h.sarlavha}
              onClick={() => router.push(h.href)}
              className="rise lift soft-press"
              style={{
                display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left', cursor: 'pointer',
                background: h.asosiy ? 'var(--accent)' : 'var(--surface)',
                color: h.asosiy ? '#fff' : 'var(--ink)',
                border: h.asosiy ? 'none' : '1.5px solid var(--line)',
                borderRadius: 18, padding: '20px 22px',
                animationDelay: `${0.1 + i * 0.06}s`,
                boxShadow: h.asosiy ? '0 10px 28px rgba(37,99,235,.28)' : 'none',
              }}
            >
              <span style={{
                fontSize: 28, width: 54, height: 54, flexShrink: 0, borderRadius: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: h.asosiy ? 'rgba(255,255,255,.18)' : 'var(--surface-2)',
              }}>{h.belgi}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 17.5, fontWeight: 800, lineHeight: 1.2 }}>{h.sarlavha}</span>
                  {h.ochiq && !h.asosiy && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--good)', background: 'color-mix(in srgb, var(--good) 14%, transparent)', borderRadius: 6, padding: '1px 6px' }}>Ochiq</span>
                  )}
                </span>
                <span style={{ display: 'block', fontSize: 13, marginTop: 3, opacity: h.asosiy ? 0.9 : 1, color: h.asosiy ? '#fff' : 'var(--muted)', lineHeight: 1.4 }}>{h.izoh}</span>
              </span>
              <span style={{ fontSize: 22, opacity: h.asosiy ? 0.9 : 0.5 }}>›</span>
            </button>
          ))}
        </div>

        {/* Hisob eslatmasi */}
        <div className="rise" style={{
          marginTop: 24, background: 'var(--accent-soft)', border: '1px solid var(--accent)', borderRadius: 14,
          padding: '16px 18px', fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55, animationDelay: '.4s',
        }}>
          💡 Navbat olish va shifokor bilan yozishmalar uchun bir marta ro&apos;yxatdan o&apos;ting — telefon raqamingiz yetarli.{' '}
          <button
            onClick={() => router.push('/auth/register?rol=bemor')}
            style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 700, cursor: 'pointer', padding: 0, fontSize: 13 }}
          >
            Ro&apos;yxatdan o&apos;tish ›
          </button>
        </div>
      </div>
    </div>
  )
}
