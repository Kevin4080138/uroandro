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

    // Bo'sh maydon validatsiyasi (Supabase'ga behuda so'rov ketmasin)
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
      .select('role, faol, doctor_holati')
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

    if (profile?.role === 'student') router.push('/student/dashboard')
    else if (profile?.role === 'doctor') router.push('/doctor/dashboard')
    else if (profile?.role === 'patient') router.push('/patient/dashboard')
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
          <button type="button" onClick={toggle} aria-label="Temani almashtirish" className="btn-animated" style={{
            background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '8px',
            padding: '6px 10px', fontSize: '13px', cursor: 'pointer',
          }}>
            {theme === 'dark' ? '☀️' : '🌙'}
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

        {/* <form onSubmit> — Enter bilan kirish ishlaydi */}
        <form
          onSubmit={(e) => { e.preventDefault(); if (!loading) handleLogin() }}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          {mode === 'patient' ? (
            <div>
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
            {/* "Parolni unutdingizmi?" — yorliq yonida */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
              <label htmlFor="parol" style={{ color: 'var(--ink-soft)', fontSize: '14px' }}>
                Parol
              </label>
              <a href="/auth/parol-tiklash" style={{ color: 'var(--accent)', fontSize: '13px', textDecoration: 'none' }}>
                Parolni unutdingizmi?
              </a>
            </div>
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

          {/* xato xabari skrinrider uchun e'lon qilinadi */}
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
            {/* yuklanish spinneri (globals.css'dagi `spin` keyframe) */}
            {loading && (
              <span style={{
                width: '15px', height: '15px', borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white',
                animation: 'spin 0.7s linear infinite', display: 'inline-block',
              }} />
            )}
            {loading ? 'Kirish...' : 'Kirish'}
          </button>

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
