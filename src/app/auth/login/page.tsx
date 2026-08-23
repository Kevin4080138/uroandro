'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/components/ThemeProvider'
import { telefonToEmail } from '@/lib/patientAuth'
import Hero, { MobileHero } from '@/components/Hero'

export default function LoginPage() {
  const [mode, setMode] = useState<'staff' | 'patient'>('staff')
  const [email, setEmail] = useState('')
  const [telefon, setTelefon] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()
  const { theme, toggle } = useTheme()

  const handleLogin = async () => {
    setError('')

    // ── FIX #2: bo'sh maydon validatsiyasi (Supabase'ga behuda so'rov ketmasin) ──
    const identifier = mode === 'patient' ? telefon.trim() : email.trim()
    if (!identifier) {
      setError(mode === 'patient' ? 'Telefon raqamini kiriting' : 'Login kiriting')
      return
    }
    if (!password) {
      setError('Parolni kiriting')
      return
    }

    setLoading(true)

    const staffEmail = email.includes('@') ? email : `${email}@urosfera.uz`
    const { data, error } = await supabase.auth.signInWithPassword({
      email: mode === 'patient' ? telefonToEmail(telefon) : staffEmail,
      password,
    })

    if (error) {
      setError(mode === 'patient' ? "Telefon yoki parol noto'g'ri" : "Login yoki parol noto'g'ri")
      setLoading(false)
      return
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, faol, doctor_holati, yonalish')
      .eq('id', data.user.id)
      .single()

    if (profileError) {
      setError('Profil xatosi: ' + profileError.message)
      setLoading(false)
      return
    }

    if (profile?.faol === false) {
      await supabase.auth.signOut()
      setError('Hisobingiz bloklangan. Administrator bilan bog\'laning.')
      setLoading(false)
      return
    }

    if (profile?.doctor_holati === 'kutish') {
      await supabase.auth.signOut()
      setError('Shifokor hisobingiz hali admin tomonidan tasdiqlanmagan. Tez orada tasdiqlangach, xabar beramiz.')
      setLoading(false)
      return
    }

    if (profile?.doctor_holati === 'rad_etildi') {
      await supabase.auth.signOut()
      setError('Shifokor so\'rovingiz rad etildi. Qo\'shimcha ma\'lumot uchun administrator bilan bog\'laning.')
      setLoading(false)
      return
    }

    // Yo'nalish hali tanlanmagan bo'lsa — bir marta yo'naltirish sahifasiga
    if (profile?.role === 'student') router.push(profile.yonalish ? '/student/dashboard' : '/student/yonalish')
    else if (profile?.role === 'doctor') router.push('/doctor/dashboard')
    else if (profile?.role === 'patient') router.push(profile.yonalish ? '/patient/dashboard' : '/patient/yonalish')
    else if (profile?.role === 'admin') router.push('/admin/dashboard')
    else router.push('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex' }}>
      <Hero />
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}>
      <MobileHero />
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'var(--surface)',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        border: '1px solid var(--line)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
          {/* ── FIX #4: emoji o'rniga SVG ikonka ── */}
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
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--ink)', margin: 0 }}>
            Uro<span style={{ color: 'var(--accent)' }}>sfera</span>
          </h1>
          <p style={{ color: 'var(--muted)', marginTop: '8px', fontSize: '14px' }}>
            Urologiya va Andrologiya platformasi
          </p>
        </div>

        <div style={{ display: 'flex', border: '1.5px solid var(--line)', borderRadius: '10px', overflow: 'hidden', marginBottom: '20px' }}>
          {([['staff', "Shifokor / Talaba"], ['patient', 'Bemor']] as const).map(([v, label]) => (
            <button
              key={v}
              type="button"
              onClick={() => { setMode(v); setError('') }}
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

        {/* ── FIX #1: <form onSubmit> — Enter bilan kirish ishlaydi ── */}
        <form
          onSubmit={(e) => { e.preventDefault(); if (!loading) handleLogin() }}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          {mode === 'patient' ? (
            <div>
              {/* ── FIX #13: label ↔ input htmlFor/id bilan bog'landi ── */}
              <label htmlFor="telefon" style={{ color: 'var(--ink-soft)', fontSize: '14px', display: 'block', marginBottom: '6px' }}>
                Telefon raqami
              </label>
              <input
                id="telefon"
                name="telefon"
                type="tel"
                autoComplete="tel"
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
                placeholder="+998 90 123 45 67"
                style={{
                  width: '100%',
                  background: 'var(--surface-2)',
                  color: 'var(--ink)',
                  border: '1px solid var(--line)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          ) : (
            <div>
              <label htmlFor="login" style={{ color: 'var(--ink-soft)', fontSize: '14px', display: 'block', marginBottom: '6px' }}>
                Login
              </label>
              <input
                id="login"
                name="username"
                type="text"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value.replace(/\s/g, ''))}
                placeholder="arabboyev yoki email@gmail.com"
                style={{
                  width: '100%',
                  background: 'var(--surface-2)',
                  color: 'var(--ink)',
                  border: '1px solid var(--line)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          <div>
            <label htmlFor="parol" style={{ color: 'var(--ink-soft)', fontSize: '14px', display: 'block', marginBottom: '6px' }}>
              Parol
            </label>
            <input
              id="parol"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                background: 'var(--surface-2)',
                color: 'var(--ink)',
                border: '1px solid var(--line)',
                borderRadius: '10px',
                padding: '12px 16px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* ── FIX #13: xato xabari skrinrider uchun e'lon qilinadi ── */}
          {error && (
            <p role="alert" aria-live="polite" style={{ color: 'var(--danger)', fontSize: '14px', margin: 0 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-animated"
            style={{
              width: '100%',
              background: 'var(--accent)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '14px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '8px',
              opacity: loading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {/* ── FIX #12: yuklanish spinneri (globals.css'dagi `spin` keyframe) ── */}
            {loading && (
              <span style={{
                width: '15px', height: '15px', borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white',
                animation: 'spin 0.7s linear infinite', display: 'inline-block',
              }} />
            )}
            {loading ? 'Kirish...' : 'Kirish'}
          </button>

          {/* ── FIX #5: "Parolni unutdingizmi?" havolasi ── */}
          <p style={{ textAlign: 'center', margin: '0' }}>
            <a href="/auth/parol-tiklash" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '13px' }}>
              Parolni unutdingizmi?
            </a>
          </p>

          <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '14px', margin: 0 }}>
            Hisobingiz yo&apos;qmi?{' '}
            <a href="/auth/register" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
              Ro&apos;yxatdan o&apos;ting
            </a>
          </p>
        </form>
      </div>
      </div>
    </div>
  )
}
