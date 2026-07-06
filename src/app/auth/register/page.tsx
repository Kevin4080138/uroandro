'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/components/ThemeProvider'
import { telefonToEmail } from '@/lib/patientAuth'
import Hero, { MobileHero } from '@/components/Hero'

type Role = 'doctor' | 'student' | 'patient'
type Step = 'role' | 'info' | 'otp' | 'password' | 'done'

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--surface-2)',
  color: 'var(--ink)',
  border: '1px solid var(--line)',
  borderRadius: '10px',
  padding: '12px 16px',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  color: 'var(--ink-soft)',
  fontSize: '14px',
  display: 'block',
  marginBottom: '6px',
}

export default function RegisterPage() {
  const [step, setStep] = useState<Step>('role')
  const [role, setRole] = useState<Role | null>(null)

  // Info step
  const [fullName, setFullName] = useState('')
  const [telefon, setTelefon] = useState('')
  const [mutaxassislik, setMutaxassislik] = useState('')
  const [ishJoyi, setIshJoyi] = useState('')

  // OTP step
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpVerified, setOtpVerified] = useState(false)

  // Password step
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()
  const supabase = createClient()
  const { theme, toggle } = useTheme()

  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'UrosferaBot'
  const BOT_LINK = `https://t.me/${botUsername}`

  function normalizePhone(raw: string) {
    const digits = raw.replace(/\D/g, '')
    if (digits.startsWith('998')) return digits
    if (digits.startsWith('0')) return '998' + digits.slice(1)
    if (digits.length === 9) return '998' + digits
    return digits
  }

  // ── Step: rol tanlash ──────────────────────────────────────────────────────
  function handleRoleSelect(r: Role) {
    setRole(r)
    setStep('info')
    setError('')
  }

  // ── Step: ma'lumotlar ──────────────────────────────────────────────────────
  function handleInfoNext() {
    setError('')
    if (!fullName.trim()) { setError("To'liq ismni kiriting"); return }
    if (!telefon.trim()) { setError('Telefon raqamini kiriting'); return }
    if (normalizePhone(telefon).length < 11) { setError("To'g'ri telefon raqami kiriting"); return }
    if (role !== 'patient' && !mutaxassislik.trim()) {
      setError(role === 'doctor' ? 'Mutaxassislikni kiriting' : "Ta\'lim muassasasini kiriting")
      return
    }

    if (role === 'patient') {
      setStep('password')
    } else {
      setStep('otp')
    }
  }

  // ── OTP: Telegram orqali yuborish ──────────────────────────────────────────
  async function handleSendOtp() {
    setError('')
    setOtpSent(true)
    // Bot webhook orqali OTP yuboriladi — foydalanuvchi botga telefon yuborganda.
    // Bu yerda faqat UI ko'rsatiladi.
  }

  async function handleVerifyOtp() {
    setError('')
    if (otp.length < 6) { setError("6 xonali kodni kiriting"); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: normalizePhone(telefon), code: otp }),
      })
      const data = await res.json()
      if (!data.ok) { setError(data.error || "Kod noto'g'ri"); setLoading(false); return }
      setOtpVerified(true)
      setStep('password')
    } catch {
      setError('Server xatosi')
    }
    setLoading(false)
  }

  // ── Ro'yxatdan o'tish ──────────────────────────────────────────────────────
  async function handleRegister() {
    setError('')
    if (!password) { setError('Parolni kiriting'); return }
    if (password.length < 8) { setError("Parol kamida 8 ta belgi bo'lishi kerak"); return }
    if (password !== confirmPassword) { setError("Parollar mos kelmayapti"); return }

    setLoading(true)

    const email = role === 'patient'
      ? telefonToEmail(normalizePhone(telefon))
      : `t${normalizePhone(telefon)}@staff.urosfera.uz`

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
          telefon: normalizePhone(telefon),
          mutaxassislik: role === 'doctor' ? mutaxassislik : null,
          ish_joyi: role === 'doctor' ? ishJoyi : null,
          talim_joyi: role === 'student' ? mutaxassislik : null,
          telefon_tasdiqlangan: role !== 'patient' ? true : false,
        },
      },
    })

    if (signUpError) {
      setError('Xatolik: ' + signUpError.message)
      setLoading(false)
      return
    }

    setStep('done')
    setLoading(false)
  }

  // ── UI helpers ─────────────────────────────────────────────────────────────
  const roleLabels: Record<Role, { icon: string; title: string; desc: string }> = {
    doctor:  { icon: '👨‍⚕️', title: 'Shifokor', desc: 'Konsultatsiya va monitoring' },
    student: { icon: '🎓', title: 'Talaba',   desc: 'Ta\'lim materiallari va testlar' },
    patient: { icon: '🧑', title: 'Bemor',    desc: 'Murojaatlar va natijalar' },
  }

  const stepTitles: Record<Step, string> = {
    role:     'Siz kim bo\'lib tashrif buyurmoqchisiz?',
    info:     'Ma\'lumotlaringizni kiriting',
    otp:      'Telefon raqamni tasdiqlang',
    password: 'Parol o\'rnating',
    done:     '',
  }

  function ProgressDots() {
    const steps: Step[] = role === 'patient'
      ? ['role', 'info', 'password']
      : ['role', 'info', 'otp', 'password']
    return (
      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '24px' }}>
        {steps.map((s) => {
          const active = s === step
          const done = steps.indexOf(s) < steps.indexOf(step)
          return (
            <div key={s} style={{
              width: active ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: done ? 'var(--accent)' : active ? 'var(--accent)' : 'var(--line)',
              transition: 'all 0.3s',
              opacity: done ? 0.5 : 1,
            }} />
          )
        })}
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex' }}>
      <Hero />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        <MobileHero />
        <div style={{
          width: '100%',
          maxWidth: '440px',
          background: 'var(--surface)',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          border: '1px solid var(--line)',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
            <button onClick={toggle} aria-label="Temani almashtirish" className="btn-animated" style={{
              background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '8px',
              padding: '6px 10px', fontSize: '13px', cursor: 'pointer',
            }}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--ink)', margin: 0 }}>
              Uro<span style={{ color: 'var(--accent)' }}>sfera</span>
            </h1>
            {step !== 'done' && (
              <p style={{ color: 'var(--muted)', marginTop: '8px', fontSize: '14px' }}>
                {stepTitles[step]}
              </p>
            )}
          </div>

          {step !== 'role' && step !== 'done' && <ProgressDots />}

          {/* ── STEP: ROL ── */}
          {step === 'role' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(Object.keys(roleLabels) as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleSelect(r)}
                  className="btn-animated"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    background: 'var(--surface-2)',
                    border: '1px solid var(--line)',
                    borderRadius: '12px',
                    padding: '18px 20px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}
                >
                  <span style={{ fontSize: '32px' }}>{roleLabels[r].icon}</span>
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--ink)', fontSize: '16px' }}>{roleLabels[r].title}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '2px' }}>{roleLabels[r].desc}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', color: 'var(--muted)', fontSize: '18px' }}>›</span>
                </button>
              ))}
              <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '14px', margin: '8px 0 0' }}>
                Hisobingiz bormi?{' '}
                <a href="/auth/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Kirish</a>
              </p>
            </div>
          )}

          {/* ── STEP: INFO ── */}
          {step === 'info' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Tanlangan rol */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'var(--surface-2)', borderRadius: '10px', padding: '10px 14px',
                border: '1px solid var(--line)',
              }}>
                <span style={{ fontSize: '22px' }}>{roleLabels[role!].icon}</span>
                <span style={{ color: 'var(--ink)', fontWeight: '600' }}>{roleLabels[role!].title}</span>
                <button onClick={() => { setStep('role'); setError('') }} style={{
                  marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--accent)',
                  cursor: 'pointer', fontSize: '13px', padding: 0,
                }}>O'zgartirish</button>
              </div>

              <div>
                <label style={labelStyle}>To'liq ism</label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                  placeholder="Ism Familiya" style={inputStyle} />
              </div>

              {role === 'doctor' && (
                <>
                  <div>
                    <label style={labelStyle}>Mutaxassislik</label>
                    <input type="text" value={mutaxassislik} onChange={e => setMutaxassislik(e.target.value)}
                      placeholder="Masalan: Urolog, Androlog" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Ish joyi</label>
                    <input type="text" value={ishJoyi} onChange={e => setIshJoyi(e.target.value)}
                      placeholder="Masalan: 1-son shahar shifoxonasi" style={inputStyle} />
                  </div>
                </>
              )}

              {role === 'student' && (
                <div>
                  <label style={labelStyle}>Ta'lim muassasasi</label>
                  <input type="text" value={mutaxassislik} onChange={e => setMutaxassislik(e.target.value)}
                    placeholder="Masalan: ToshDTU, Andijon DIM" style={inputStyle} />
                </div>
              )}

              <div>
                <label style={labelStyle}>Telefon raqami</label>
                <input type="tel" value={telefon} onChange={e => setTelefon(e.target.value)}
                  placeholder="+998 90 123 45 67" style={inputStyle} />
              </div>

              {error && <p style={{ color: 'var(--danger)', fontSize: '14px', margin: 0 }}>{error}</p>}

              <button onClick={handleInfoNext} className="btn-animated" style={{
                width: '100%', background: 'var(--accent)', color: 'white', border: 'none',
                borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: '600', cursor: 'pointer',
              }}>
                Davom etish →
              </button>
            </div>
          )}

          {/* ── STEP: OTP (faqat shifokor/talaba) ── */}
          {step === 'otp' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {!otpSent ? (
                <>
                  <div style={{
                    background: 'rgba(30,136,229,0.08)', border: '1px solid rgba(30,136,229,0.25)',
                    borderRadius: '12px', padding: '18px', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '40px', marginBottom: '8px' }}>✈️</div>
                    <p style={{ color: 'var(--ink)', fontWeight: '600', margin: '0 0 8px', fontSize: '15px' }}>
                      Telegram orqali tasdiqlash
                    </p>
                    <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0, lineHeight: '1.6' }}>
                      Telefon raqamingizni tasdiqlaymiz.<br />
                      Telegram botimizga raqamingizni yuboring va kod oling.
                    </p>
                  </div>

                  <div style={{
                    background: 'var(--surface-2)', borderRadius: '10px', padding: '14px 16px',
                    border: '1px solid var(--line)',
                  }}>
                    <p style={{ color: 'var(--ink-soft)', fontSize: '13px', margin: '0 0 4px' }}>Telefon raqamingiz:</p>
                    <p style={{ color: 'var(--ink)', fontWeight: '600', margin: 0, fontSize: '15px' }}>{telefon}</p>
                  </div>

                  <a
                    href={BOT_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleSendOtp}
                    style={{
                      display: 'block', width: '100%', background: '#229ED9', color: 'white',
                      border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px',
                      fontWeight: '600', cursor: 'pointer', textAlign: 'center', textDecoration: 'none',
                      boxSizing: 'border-box',
                    }}
                  >
                    📱 Telegram botini ochish
                  </a>

                  <p style={{ color: 'var(--muted)', fontSize: '12px', textAlign: 'center', margin: 0, lineHeight: '1.6' }}>
                    Bot ochilganda telefon raqamingizni yuboring.<br />
                    Bot sizga 6 xonali kod yuboradi.
                  </p>
                </>
              ) : (
                <>
                  <div style={{
                    background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)',
                    borderRadius: '12px', padding: '16px', textAlign: 'center',
                  }}>
                    <p style={{ color: '#34d399', fontWeight: '600', margin: 0, fontSize: '14px' }}>
                      ✅ Telegram bot ochildi — endi raqamingizni yuboring va kodni kiriting
                    </p>
                  </div>

                  <div>
                    <label style={labelStyle}>6 xonali kod</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="123456"
                      style={{ ...inputStyle, fontSize: '22px', textAlign: 'center', letterSpacing: '8px' }}
                    />
                  </div>

                  {error && <p style={{ color: 'var(--danger)', fontSize: '14px', margin: 0 }}>{error}</p>}

                  <button onClick={handleVerifyOtp} disabled={loading} className="btn-animated" style={{
                    width: '100%', background: 'var(--accent)', color: 'white', border: 'none',
                    borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
                  }}>
                    {loading ? 'Tekshirilmoqda...' : 'Kodni tasdiqlash'}
                  </button>

                  <button onClick={() => setOtpSent(false)} style={{
                    background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer',
                    fontSize: '13px', padding: 0, textAlign: 'center',
                  }}>
                    ← Qaytish
                  </button>
                </>
              )}
            </div>
          )}

          {/* ── STEP: PAROL ── */}
          {step === 'password' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {role !== 'patient' && (
                <div style={{
                  background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)',
                  borderRadius: '10px', padding: '12px 16px',
                }}>
                  <p style={{ color: '#34d399', fontSize: '13px', margin: 0 }}>
                    ✅ Telefon raqam tasdiqlandi: <strong>{telefon}</strong>
                  </p>
                </div>
              )}

              <div>
                <label style={labelStyle}>Parol</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Parolni tasdiqlang</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••" style={inputStyle} />
              </div>

              {error && <p style={{ color: 'var(--danger)', fontSize: '14px', margin: 0 }}>{error}</p>}

              <button onClick={handleRegister} disabled={loading} className="btn-animated" style={{
                width: '100%', background: 'var(--accent)', color: 'white', border: 'none',
                borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
              }}>
                {loading ? "Ro'yxatdan o'tilmoqda..." : "Ro'yxatdan o'tish"}
              </button>
            </div>
          )}

          {/* ── STEP: DONE ── */}
          {step === 'done' && (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
              <h2 style={{ color: 'var(--ink)', fontSize: '20px', fontWeight: '700', margin: '0 0 12px' }}>
                Tabriklaymiz!
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: '1.7', margin: '0 0 24px' }}>
                {role === 'patient'
                  ? 'Hisobingiz muvaffaqiyatli yaratildi. Telefon raqam va parolingiz orqali kira olasiz.'
                  : 'So\'rovingiz qabul qilindi. Admin tasdiqlagandan so\'ng hisobingiz faollashadi.'}
              </p>
              <button onClick={() => router.push('/auth/login')} className="btn-animated" style={{
                background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px',
                padding: '14px 32px', fontSize: '15px', fontWeight: '600', cursor: 'pointer',
              }}>
                Kirishga o'tish
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
