'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async () => {
    setError('')
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Email yoki parol noto\'g\'ri')
      setLoading(false)
      return
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    console.log('DEBUG user.id:', data.user.id, 'profile:', profile, 'profileError:', profileError)

    if (profileError) {
      setError('Profil xatosi: ' + profileError.message)
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
      backgroundColor: '#0a0a0f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: '#111118',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        border: '1px solid #1e1e2e'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', margin: 0 }}>
            Uro<span style={{ color: '#60a5fa' }}>Andro</span>
          </h1>
          <p style={{ color: '#6b7280', marginTop: '8px', fontSize: '14px' }}>
            Urologiya va Andrologiya platformasi
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ color: '#d1d5db', fontSize: '14px', display: 'block', marginBottom: '6px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              style={{
                width: '100%',
                backgroundColor: '#1e1e2e',
                color: 'white',
                border: '1px solid #2e2e3e',
                borderRadius: '10px',
                padding: '12px 16px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ color: '#d1d5db', fontSize: '14px', display: 'block', marginBottom: '6px' }}>
              Parol
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                backgroundColor: '#1e1e2e',
                color: 'white',
                border: '1px solid #2e2e3e',
                borderRadius: '10px',
                padding: '12px 16px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {error && (
            <p style={{ color: '#f87171', fontSize: '14px', margin: 0 }}>{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: '#2563eb',
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

          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px', margin: 0 }}>
            Hisobingiz yo&apos;qmi?{' '}
            <a href="/auth/register" style={{ color: '#60a5fa', textDecoration: 'none' }}>
              Ro&apos;yxatdan o&apos;ting
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}