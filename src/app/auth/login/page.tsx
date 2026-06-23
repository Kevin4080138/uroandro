'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/components/ThemeProvider'
import { telefonToEmail } from '@/lib/patientAuth'

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
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email: mode === 'patient' ? telefonToEmail(telefon) : email,
      password,
    })

    if (error) {
      setError(mode === 'patient' ? "Telefon yoki parol noto'g'ri" : "Email yoki parol noto'g'ri")
      setLoading(false)
      return
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, faol')
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

    if (profile?.role === 'student') router.push('/student/dashboard')
    else if (profile?.role === 'doctor') router.push('/doctor/dashboard')
    else if (profile?.role === 'patient') router.push('/patient/dashboard')
    else if (profile?.role === 'admin') router.push('/admin/dashboard')
    else router.push('/dashboard')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
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
          <button onClick={toggle} aria-label="Temani almashtirish" className="btn-animated" style={{
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {mode === 'patient' ? (
            <div>
              <label style={{ color: 'var(--ink-soft)', fontSize: '14px', display: 'block', marginBottom: '6px' }}>
                Telefon raqami
              </label>
              <input
                type="tel"
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
              <label style={{ color: 'var(--ink-soft)', fontSize: '14px', display: 'block', marginBottom: '6px' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
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
            <label style={{ color: 'var(--ink-soft)', fontSize: '14px', display: 'block', marginBottom: '6px' }}>
              Parol
            </label>
            <input
              type="password"
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

          {error && (
            <p style={{ color: 'var(--danger)', fontSize: '14px', margin: 0 }}>{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
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
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Kirish...' : 'Kirish'}
          </button>

          <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '14px', margin: 0 }}>
            Hisobingiz yo&apos;qmi?{' '}
            <a href="/auth/register" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
              Ro&apos;yxatdan o&apos;ting
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}