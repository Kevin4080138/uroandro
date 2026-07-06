'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/components/ThemeProvider'
import { telefonToEmail, telefonFormatTogri } from '@/lib/patientAuth'
import Hero, { MobileHero } from '@/components/Hero'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [telefon, setTelefon] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('')
  const [mutaxassislik, setMutaxassislik] = useState('')
  const [ishJoyi, setIshJoyi] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()
  const supabase = createClient()
  const { theme, toggle } = useTheme()

  const isPatient = role === 'patient'
  const isDoctor = role === 'doctor'

  const handleRegister = async () => {
    setError('')
    setSuccess('')

    if (!fullName || !role || (isPatient ? !telefon : !email) || !password) {
      setError('Barcha maydonlarni to\'ldiring')
      return
    }

    if (isDoctor && (!mutaxassislik || !ishJoyi)) {
      setError('Mutaxassislik va ish joyini kiriting')
      return
    }

    if (isPatient && !telefonFormatTogri(telefon)) {
      setError("To'g'ri telefon raqami kiriting")
      return
    }

    if (password !== confirmPassword) {
      setError('Parollar mos kelmayapti')
      return
    }

    if (password.length < 8) {
      setError('Parol kamida 8 ta belgi bo\'lishi kerak')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email: isPatient ? telefonToEmail(telefon) : email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
          telefon: isPatient ? telefon : null,
          mutaxassislik: isDoctor ? mutaxassislik : null,
          ish_joyi: isDoctor ? ishJoyi : null,
        }
      }
    })

    if (error) {
      setError('Xatolik: ' + error.message)
      setLoading(false)
      return
    }

    setSuccess(
      isPatient
        ? 'Tabriklaymiz! Endi telefon va parolingiz orqali kira olasiz.'
        : isDoctor
        ? 'So\'rovingiz qabul qilindi! Admin tasdiqlagandan so\'ng emailingizga xabar yuboriladi.'
        : 'Tabriklaymiz! Email manzilingizni tasdiqlang.'
    )
    setLoading(false)
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
            Yangi hisob yarating
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div>
            <label style={{ color: 'var(--ink-soft)', fontSize: '14px', display: 'block', marginBottom: '6px' }}>
              To'liq ism
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ism Familiya"
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

          <div>
            <label style={{ color: 'var(--ink-soft)', fontSize: '14px', display: 'block', marginBottom: '6px' }}>
              Rol
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--surface-2)',
                color: role ? 'var(--ink)' : 'var(--muted)',
                border: '1px solid var(--line)',
                borderRadius: '10px',
                padding: '12px 16px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            >
              <option value="">Rolni tanlang</option>
              <option value="student">🎓 Talaba</option>
              <option value="doctor">👨‍⚕️ Shifokor</option>
              <option value="patient">🧑 Bemor</option>
            </select>
          </div>

          {isDoctor && (
            <>
              <div>
                <label style={{ color: 'var(--ink-soft)', fontSize: '14px', display: 'block', marginBottom: '6px' }}>
                  Mutaxassislik
                </label>
                <input
                  type="text"
                  value={mutaxassislik}
                  onChange={(e) => setMutaxassislik(e.target.value)}
                  placeholder="Masalan: Urolog, Androlog"
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
              <div>
                <label style={{ color: 'var(--ink-soft)', fontSize: '14px', display: 'block', marginBottom: '6px' }}>
                  Ish joyi
                </label>
                <input
                  type="text"
                  value={ishJoyi}
                  onChange={(e) => setIshJoyi(e.target.value)}
                  placeholder="Masalan: 1-son shahar shifoxonasi"
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
            </>
          )}

          {isPatient ? (
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

          <div>
            <label style={{ color: 'var(--ink-soft)', fontSize: '14px', display: 'block', marginBottom: '6px' }}>
              Parolni tasdiqlang
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

          {success && (
            <p style={{ color: '#34d399', fontSize: '14px', margin: 0 }}>{success}</p>
          )}

          <button
            onClick={handleRegister}
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
            {loading ? 'Ro\'yxatdan o\'tilmoqda...' : 'Ro\'yxatdan o\'tish'}
          </button>

          <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '14px', margin: 0 }}>
            Hisobingiz bormi?{' '}
            <a href="/auth/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
              Kirish
            </a>
          </p>
        </div>
      </div>
      </div>
    </div>
  )
}