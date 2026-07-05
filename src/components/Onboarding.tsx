'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { pushYoqish, pushDastagiHolati } from '@/lib/pushClient'

const KALIT = 'patient_onboarding_v1'

type Props = { ism: string }

export function Onboarding({ ism }: Props) {
  const [korinadi, setKorinadi] = useState(false)
  const [qadam, setQadam] = useState(0)
  const [chiqish, setChiqish] = useState(false)
  const [pushHolat, setPushHolat] = useState<string>('tekshirilmoqda')
  const [pushYuklanyapti, setPushYuklanyapti] = useState(false)
  const [pushXabar, setPushXabar] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (!localStorage.getItem(KALIT)) setKorinadi(true)
    pushDastagiHolati().then(setPushHolat)
  }, [])

  const yopish = () => {
    setChiqish(true)
    setTimeout(() => {
      localStorage.setItem(KALIT, '1')
      setKorinadi(false)
    }, 350)
  }

  const keyingi = () => {
    if (qadam < 2) setQadam(q => q + 1)
    else yopish()
  }

  const pushBosish = async () => {
    setPushYuklanyapti(true)
    const { ok, error } = await pushYoqish()
    setPushYuklanyapti(false)
    if (ok) {
      setPushHolat('yoqilgan')
      setPushXabar("Bildirishnomalar yoqildi! Shifokor javob berganda xabar olasiz.")
    } else {
      setPushXabar(error ?? "Ruxsat berilmadi — keyinroq sozlamalardan yoqishingiz mumkin.")
    }
  }

  const murojaatBosish = () => {
    localStorage.setItem(KALIT, '1')
    router.push('/patient/murojaat')
  }

  if (!korinadi) return null

  const initsial = ism.split(' ').map(s => s[0]).join('').toUpperCase().slice(0, 2)

  const qadamlar = [
    {
      render: () => (
        <div style={{ textAlign: 'center' }}>
          {/* Avatar */}
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, #2563eb, #0891b2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 800, color: 'white',
            margin: '0 auto 20px',
            boxShadow: '0 8px 24px rgba(37,99,235,.3)',
          }}>
            {initsial}
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 10px', lineHeight: 1.25 }}>
            Xush kelibsiz,<br />{ism.split(' ')[0]}! 👋
          </h2>
          <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.65, margin: '0 0 28px' }}>
            Urosfera — shifokoringiz bilan to&apos;g&apos;ridan-to&apos;g&apos;ri bog&apos;lanish, dorilaringizni kuzatish va o&apos;z sog&apos;lig&apos;ingizni nazorat qilish uchun shaxsiy platformangiz.
          </p>
          <div style={{
            display: 'flex', gap: 10, flexDirection: 'column',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'var(--surface-2)', borderRadius: 12, padding: '12px 16px',
            }}>
              <span style={{ fontSize: 22 }}>✅</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>Profilingiz tayyor</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{ism}</div>
              </div>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'var(--surface-2)', borderRadius: 12, padding: '12px 16px', opacity: .5,
            }}>
              <span style={{ fontSize: 22 }}>🩺</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>Birinchi murojaat</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>Hali yuborilmagan</div>
              </div>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'var(--surface-2)', borderRadius: 12, padding: '12px 16px', opacity: .5,
            }}>
              <span style={{ fontSize: 22 }}>🔔</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>Bildirishnomalar</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>Hali yoqilmagan</div>
              </div>
            </div>
          </div>
        </div>
      ),
      tugma: "Boshlaylik →",
      skip: null,
    },
    {
      render: () => (
        <div>
          <div style={{
            width: 64, height: 64, borderRadius: '18px',
            background: 'linear-gradient(135deg, #2563eb20, #0891b220)',
            border: '1.5px solid #2563eb30',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, margin: '0 auto 20px',
          }}>
            🩺
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 10px', textAlign: 'center', lineHeight: 1.3 }}>
            Shifokorga murojaat qiling
          </h2>
          <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.65, margin: '0 0 22px', textAlign: 'center' }}>
            Shikoyatingizni yozing — shifokor imkon qadar tezroq ko&apos;rib, tavsiya va javob yozib qo&apos;yadi.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {[
              ['⚡', 'Tezkor', 'Javob odatda bir kunda keladi'],
              ['🔒', 'Maxfiy', 'Faqat siz va shifokoringiz ko\'radi'],
              ['📱', 'Qulay', 'Uydan turib, istalgan vaqt'],
            ].map(([ikon, sarlavha, tavsif]) => (
              <div key={sarlavha} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: 'var(--surface-2)', borderRadius: 12, padding: '12px 16px',
              }}>
                <span style={{ fontSize: 20 }}>{ikon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{sarlavha}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{tavsif}</div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={murojaatBosish}
            style={{
              width: '100%', background: 'var(--accent)', color: 'white', border: 'none',
              borderRadius: 14, padding: '16px', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', marginBottom: 10,
            }}
          >
            Murojaat yuborish →
          </button>
        </div>
      ),
      tugma: null,
      skip: "Keyinroq",
    },
    {
      render: () => (
        <div>
          <div style={{
            width: 64, height: 64, borderRadius: '18px',
            background: pushHolat === 'yoqilgan' ? '#dcfce7' : 'linear-gradient(135deg, #fef3c720, #fbbf2420)',
            border: pushHolat === 'yoqilgan' ? '1.5px solid #86efac' : '1.5px solid #fde68a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, margin: '0 auto 20px', transition: 'all .3s',
          }}>
            {pushHolat === 'yoqilgan' ? '✅' : '🔔'}
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 10px', textAlign: 'center', lineHeight: 1.3 }}>
            {pushHolat === 'yoqilgan' ? 'Bildirishnomalar yoqildi!' : 'Bildirishnomalarni yoqing'}
          </h2>
          <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.65, margin: '0 0 22px', textAlign: 'center' }}>
            {pushHolat === 'yoqilgan'
              ? "Shifokor javob berganda yoki yangi dori tayinlanganda telefongizga xabar keladi."
              : "Shifokor javob berganda siz darrov xabar olasiz. O'tkazib yubormang."}
          </p>

          {pushXabar && (
            <div style={{
              background: pushHolat === 'yoqilgan' ? '#dcfce7' : '#fef3c7',
              border: `1px solid ${pushHolat === 'yoqilgan' ? '#86efac' : '#fde68a'}`,
              borderRadius: 12, padding: '12px 16px', marginBottom: 16,
              fontSize: 13, color: pushHolat === 'yoqilgan' ? '#15803d' : '#92400e', lineHeight: 1.5,
            }}>
              {pushXabar}
            </div>
          )}

          {pushHolat !== 'yoqilgan' && pushHolat !== 'rad-etilgan' && pushHolat !== 'qollab-bolmaydi' && (
            <button
              onClick={pushBosish}
              disabled={pushYuklanyapti}
              style={{
                width: '100%', background: pushYuklanyapti ? 'var(--surface-2)' : 'var(--accent)',
                color: pushYuklanyapti ? 'var(--muted)' : 'white', border: 'none',
                borderRadius: 14, padding: '16px', fontSize: 15, fontWeight: 700,
                cursor: pushYuklanyapti ? 'wait' : 'pointer', marginBottom: 10, transition: 'all .2s',
              }}
            >
              {pushYuklanyapti ? 'Yuklanmoqda...' : '🔔 Bildirishnomalarni yoqish'}
            </button>
          )}

          {(pushHolat === 'rad-etilgan' || pushHolat === 'qollab-bolmaydi') && (
            <div style={{
              background: 'var(--surface-2)', borderRadius: 12, padding: '14px 16px',
              fontSize: 13, color: 'var(--muted)', lineHeight: 1.55, marginBottom: 10,
            }}>
              {pushHolat === 'qollab-bolmaydi'
                ? "Brauzeringiz push-bildirishnomalarni qo'llamaydi."
                : "Bildirishnomalar bloklangan. Brauzer sozlamalaridan ruxsat bering."}
            </div>
          )}
        </div>
      ),
      tugma: pushHolat === 'yoqilgan' ? 'Boshlash 🎉' : null,
      skip: pushHolat === 'yoqilgan' ? null : 'Keyinroq',
    },
  ]

  const joriy = qadamlar[qadam]

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        opacity: chiqish ? 0 : 1, transition: 'opacity .35s ease',
      }}
      onClick={e => { if (e.target === e.currentTarget) yopish() }}
    >
      <div
        style={{
          width: '100%', maxWidth: 480,
          background: 'var(--bg)', borderRadius: '28px 28px 0 0',
          padding: '8px 0 0',
          maxHeight: '92vh', overflowY: 'auto',
          transform: chiqish ? 'translateY(100%)' : 'translateY(0)',
          transition: 'transform .35s cubic-bezier(.2,.8,.3,1)',
          boxShadow: '0 -8px 40px rgba(0,0,0,.18)',
        }}
      >
        {/* Tortib olish tutqichi */}
        <div style={{
          width: 40, height: 4, background: 'var(--line)', borderRadius: 2,
          margin: '0 auto 20px',
        }} />

        {/* Qadam ko'rsatkichlari */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 24 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              height: 4, borderRadius: 2, transition: 'all .3s ease',
              width: i === qadam ? 24 : 8,
              background: i <= qadam ? 'var(--accent)' : 'var(--line)',
            }} />
          ))}
        </div>

        {/* Kontent */}
        <div style={{ padding: '0 24px 32px' }}>
          {joriy.render()}

          {/* Tugma — agar "render" ichida maxsus tugma bo'lmasa */}
          {joriy.tugma && (
            <button
              onClick={keyingi}
              style={{
                width: '100%', background: 'var(--accent)', color: 'white',
                border: 'none', borderRadius: 14, padding: '16px',
                fontSize: 15, fontWeight: 700, cursor: 'pointer',
                marginTop: 4, marginBottom: joriy.skip ? 10 : 0,
              }}
            >
              {joriy.tugma}
            </button>
          )}

          {joriy.skip && (
            <button
              onClick={keyingi}
              style={{
                width: '100%', background: 'none', border: 'none',
                color: 'var(--muted)', fontSize: 14, cursor: 'pointer',
                padding: '10px', marginTop: 2,
              }}
            >
              {joriy.skip}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
