'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useTheme } from '@/components/ThemeProvider'
import { SAYT_URL } from '@/lib/saytUrl'
import Hero, { MobileHero } from '@/components/Hero'

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'var(--surface-2)', color: 'var(--ink)',
  border: '1px solid var(--line)', borderRadius: '10px', padding: '12px 16px',
  fontSize: '14px', outline: 'none', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  color: 'var(--ink-soft)', fontSize: '14px', display: 'block', marginBottom: '6px',
}

function Spinner() {
  return (
    <span style={{
      width: '15px', height: '15px', borderRadius: '50%',
      border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white',
      animation: 'spin 0.7s linear infinite', display: 'inline-block',
    }} />
  )
}

function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, '')
  if (digits.startsWith('998')) return digits
  if (digits.startsWith('0')) return '998' + digits.slice(1)
  if (digits.length === 9) return '998' + digits
  return digits
}

function passwordStrength(pw: string): { level: number; label: string; color: string } {
  if (!pw) return { level: 0, label: '', color: 'var(--line)' }
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 2) return { level: 1, label: 'Zaif', color: 'var(--danger)' }
  if (score === 3) return { level: 2, label: "O'rtacha", color: 'var(--warn)' }
  return { level: 3, label: 'Kuchli', color: 'var(--good)' }
}

export default function ParolTiklashPage() {
  const [mode, setMode] = useState<'email' | 'telefon'>('email')

  // Email oqimi
  const [login, setLogin] = useState('')
  const [sent, setSent] = useState(false)

  // Telefon oqimi
  const [telefon, setTelefon] = useState('')
  const [phoneStep, setPhoneStep] = useState<'telefon' | 'kod'>('telefon')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [resetDone, setResetDone] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()
  const { theme, toggle } = useTheme()

  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'UrosferaBot'
  const BOT_LINK = `https://t.me/${botUsername}`
  const pw = passwordStrength(password)

  function switchMode(m: 'email' | 'telefon') {
    setMode(m); setError('')
  }

  // ── Email orqali ────────────────────────────────────────────────
  const handleEmailReset = async () => {
    setError('')
    const raw = login.trim()
    if (!raw) { setError('Login yoki emailingizni kiriting'); return }
    const email = raw.includes('@') ? raw : `${raw}@urosfera.uz`

    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${SAYT_URL}/auth/parol-yangilash`,
    })
    setLoading(false)

    // Xavfsizlik: email mavjudligini oshkor qilmaymiz — har doim bir xil xabar.
    if (error && !/rate limit/i.test(error.message)) {
      setError("Xatolik yuz berdi. Birozdan so'ng qayta urinib ko'ring.")
      return
    }
    setSent(true)
  }

  // ── Telefon orqali ──────────────────────────────────────────────
  function handlePhoneNext() {
    setError('')
    if (normalizePhone(telefon).length < 11) { setError("To'g'ri telefon raqami kiriting"); return }
    setPhoneStep('kod')
  }

  const handlePhoneReset = async () => {
    setError('')
    if (otp.length < 6) { setError('6 xonali kodni kiriting'); return }
    if (password.length < 8) { setError("Parol kamida 8 ta belgi bo'lishi kerak"); return }
    if (password !== confirm) { setError('Parollar mos kelmayapti'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: normalizePhone(telefon), code: otp, password }),
      })
      const data = await res.json()
      if (!data.ok) { setError(data.error || 'Xatolik yuz berdi'); setLoading(false); return }
      setResetDone(true)
    } catch {
      setError('Server xatosi')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex' }}>
      <Hero />
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '16px',
      }}>
        <MobileHero />
        <div style={{
          width: '100%', maxWidth: '420px', background: 'var(--surface)',
          borderRadius: '16px', padding: '32px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)', border: '1px solid var(--line)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
            <button type="button" onClick={toggle} aria-label={theme === 'dark' ? 'Kunduzgi temaga o\'tish' : 'Tungi temaga o\'tish'} className="btn-animated" style={{
              background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '8px',
              padding: '8px', cursor: 'pointer', color: 'var(--ink-soft)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 0,
            }}>
              {theme === 'dark' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <line x1="12" y1="2" x2="12" y2="4" /><line x1="12" y1="20" x2="12" y2="22" />
                  <line x1="2" y1="12" x2="4" y2="12" /><line x1="20" y1="12" x2="22" y2="12" />
                  <line x1="4.9" y1="4.9" x2="6.3" y2="6.3" /><line x1="17.7" y1="17.7" x2="19.1" y2="19.1" />
                  <line x1="4.9" y1="19.1" x2="6.3" y2="17.7" /><line x1="17.7" y1="6.3" x2="19.1" y2="4.9" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--ink)', margin: 0 }}>
              Uro<span style={{ color: 'var(--accent)' }}>sfera</span>
            </h1>
            <p style={{ color: 'var(--muted)', marginTop: '8px', fontSize: '14px' }}>Parolni tiklash</p>
          </div>

          {/* Muvaffaqiyat ekranlari */}
          {sent ? (
            <SuccessBox
              title="Havola yuborildi"
              text="Agar bunday hisob mavjud bo'lsa, parolni tiklash havolasi emailingizga yuborildi. Pochtangizni tekshiring (spam papkasini ham)."
            />
          ) : resetDone ? (
            <SuccessBox
              title="Parol yangilandi"
              text="Endi yangi parolingiz bilan kira olasiz."
            />
          ) : (
            <>
              {/* Rejim tanlash */}
              <div style={{ display: 'flex', border: '1.5px solid var(--line)', borderRadius: '10px', overflow: 'hidden', marginBottom: '20px' }}>
                {([['email', 'Email orqali'], ['telefon', 'Telefon orqali']] as const).map(([v, label]) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => switchMode(v)}
                    className="btn-animated"
                    style={{
                      flex: 1, border: 'none', padding: '10px 6px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer',
                      background: mode === v ? 'var(--accent)' : 'var(--surface-2)',
                      color: mode === v ? 'white' : 'var(--muted)',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* ── EMAIL OQIMI ── */}
              {mode === 'email' && (
                <form onSubmit={(e) => { e.preventDefault(); if (!loading) handleEmailReset() }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <p style={{ color: 'var(--ink-soft)', fontSize: '14px', margin: 0, lineHeight: '1.6' }}>
                    Login yoki emailingizni kiriting — parolni tiklash havolasini yuboramiz.
                  </p>
                  <div>
                    <label htmlFor="tiklash-login" style={labelStyle}>Login yoki email</label>
                    <input
                      id="tiklash-login" name="username" type="text" autoComplete="username"
                      value={login} onChange={(e) => setLogin(e.target.value.replace(/\s/g, ''))}
                      placeholder="arabboyev yoki email@gmail.com" style={inputStyle}
                    />
                    <p style={{ color: 'var(--muted)', fontSize: '12px', margin: '6px 0 0' }}>
                      Email kelmasa — "Telefon orqali" rejimidan foydalaning.
                    </p>
                  </div>

                  {error && <p role="alert" aria-live="polite" style={{ color: 'var(--danger)', fontSize: '14px', margin: 0 }}>{error}</p>}

                  <button type="submit" disabled={loading} className="btn-animated" style={btnStyle(loading)}>
                    {loading && <Spinner />}
                    {loading ? 'Yuborilmoqda...' : 'Tiklash havolasini yuborish'}
                  </button>
                </form>
              )}

              {/* ── TELEFON OQIMI ── */}
              {mode === 'telefon' && phoneStep === 'telefon' && (
                <form onSubmit={(e) => { e.preventDefault(); handlePhoneNext() }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <p style={{ color: 'var(--ink-soft)', fontSize: '14px', margin: 0, lineHeight: '1.6' }}>
                    Telefon raqamingizni kiriting — Telegram bot orqali kod olib parolni tiklaysiz.
                  </p>
                  <div>
                    <label htmlFor="tiklash-telefon" style={labelStyle}>Telefon raqami</label>
                    <input
                      id="tiklash-telefon" name="tel" type="tel" autoComplete="tel"
                      value={telefon} onChange={(e) => setTelefon(e.target.value)}
                      placeholder="+998 90 123 45 67" style={inputStyle}
                    />
                  </div>

                  {error && <p role="alert" aria-live="polite" style={{ color: 'var(--danger)', fontSize: '14px', margin: 0 }}>{error}</p>}

                  <button type="submit" className="btn-animated" style={btnStyle(false)}>Davom etish →</button>
                </form>
              )}

              {mode === 'telefon' && phoneStep === 'kod' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{
                    background: 'rgba(30,136,229,0.08)', border: '1px solid rgba(30,136,229,0.25)',
                    borderRadius: '12px', padding: '16px',
                  }}>
                    <p style={{ color: 'var(--ink)', fontWeight: '600', margin: '0 0 10px', fontSize: '14px', textAlign: 'center' }}>
                      Telegram bot orqali kod oling
                    </p>
                    <ol style={{ color: 'var(--muted)', fontSize: '13px', margin: 0, paddingLeft: '20px', lineHeight: '1.9' }}>
                      <li>Botni oching</li>
                      <li>Botga <strong style={{ color: 'var(--ink-soft)' }}>telefon raqamingizni</strong> yuboring</li>
                      <li>Bot <strong style={{ color: 'var(--ink-soft)' }}>6 xonali kod</strong> qaytaradi</li>
                    </ol>
                    <a
                      href={BOT_LINK} target="_blank" rel="noopener noreferrer"
                      style={{
                        display: 'block', width: '100%', background: '#229ED9', color: 'white',
                        borderRadius: '10px', padding: '12px', fontSize: '14px', fontWeight: '600',
                        cursor: 'pointer', textAlign: 'center', textDecoration: 'none',
                        boxSizing: 'border-box', marginTop: '12px',
                      }}
                    >
                      📱 Telegram botini ochish
                    </a>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); if (!loading) handlePhoneReset() }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label htmlFor="tiklash-otp" style={labelStyle}>6 xonali kod</label>
                      <input
                        id="tiklash-otp" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6}
                        value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="123456"
                        style={{ ...inputStyle, fontSize: '22px', textAlign: 'center', letterSpacing: '8px' }}
                      />
                    </div>

                    <div>
                      <label htmlFor="tiklash-yangi-parol" style={labelStyle}>Yangi parol</label>
                      <input
                        id="tiklash-yangi-parol" type="password" autoComplete="new-password"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••" style={inputStyle}
                      />
                      {password && (
                        <div style={{ marginTop: '8px' }}>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {[1, 2, 3].map(i => (
                              <div key={i} style={{
                                flex: 1, height: '4px', borderRadius: '2px',
                                background: i <= pw.level ? pw.color : 'var(--line)', transition: 'background 0.2s',
                              }} />
                            ))}
                          </div>
                          <p style={{ color: pw.color, fontSize: '12px', margin: '5px 0 0' }}>{pw.label}</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="tiklash-yangi-parol-2" style={labelStyle}>Parolni tasdiqlang</label>
                      <input
                        id="tiklash-yangi-parol-2" type="password" autoComplete="new-password"
                        value={confirm} onChange={(e) => setConfirm(e.target.value)}
                        placeholder="••••••••" style={inputStyle}
                      />
                    </div>

                    {error && <p role="alert" aria-live="polite" style={{ color: 'var(--danger)', fontSize: '14px', margin: 0 }}>{error}</p>}

                    <button type="submit" disabled={loading} className="btn-animated" style={btnStyle(loading)}>
                      {loading && <Spinner />}
                      {loading ? 'Yangilanmoqda...' : 'Parolni yangilash'}
                    </button>

                    <button type="button" onClick={() => { setPhoneStep('telefon'); setError('') }} style={{
                      background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer',
                      fontSize: '13px', padding: 0, textAlign: 'center',
                    }}>
                      ← Raqamni o'zgartirish
                    </button>
                  </form>
                </div>
              )}

              <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '14px', margin: '16px 0 0' }}>
                Paroli esladingizmi?{' '}
                <a href="/auth/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Kirish</a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function btnStyle(loading: boolean): React.CSSProperties {
  return {
    width: '100%', background: 'var(--accent)', color: 'white', border: 'none',
    borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: '600',
    cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
  }
}

function SuccessBox({ title, text }: { title: string; text: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '8px 0' }}>
      <div style={{
        width: '56px', height: '56px', borderRadius: '50%', margin: '0 auto 16px',
        background: 'rgba(52,211,153,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--good)',
      }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <h2 style={{ color: 'var(--ink)', fontSize: '18px', fontWeight: '700', margin: '0 0 10px' }}>{title}</h2>
      <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: '1.7', margin: '0 0 24px' }}>{text}</p>
      <a href="/auth/login" className="btn-animated" style={{
        display: 'inline-block', background: 'var(--accent)', color: 'white', textDecoration: 'none',
        borderRadius: '10px', padding: '13px 28px', fontSize: '15px', fontWeight: '600',
      }}>
        Kirishga qaytish
      </a>
    </div>
  )
}
