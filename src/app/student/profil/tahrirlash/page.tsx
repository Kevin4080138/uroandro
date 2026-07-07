'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'

type Profile = {
  full_name: string
  telefon: string | null
  role: string
  mutaxassislik: string | null
  ish_joyi: string | null
  talim_joyi: string | null
}

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
  fontSize: '13px',
  display: 'block',
  marginBottom: '6px',
  fontWeight: 600,
}

export default function ProfilTahrirlashPage() {
  const router = useRouter()
  const supabase = createClient()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [fullName, setFullName] = useState('')
  const [mutaxassislik, setMutaxassislik] = useState('')
  const [ishJoyi, setIshJoyi] = useState('')
  const [talimJoyi, setTalimJoyi] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/auth/login'); return }
      const { data } = await supabase
        .from('profiles')
        .select('full_name, telefon, role, mutaxassislik, ish_joyi, talim_joyi')
        .eq('id', user.id)
        .maybeSingle()
      if (data) {
        setProfile(data as Profile)
        setFullName(data.full_name ?? '')
        setMutaxassislik(data.mutaxassislik ?? '')
        setIshJoyi(data.ish_joyi ?? '')
        setTalimJoyi(data.talim_joyi ?? '')
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const saqlash = async () => {
    setError('')
    if (!fullName.trim()) { setError("To'liq ismni kiriting"); return }

    setLoading(true)

    const yangilash: Record<string, string | null> = { full_name: fullName.trim() }

    if (profile?.role === 'doctor') {
      yangilash.mutaxassislik = mutaxassislik.trim() || null
      yangilash.ish_joyi = ishJoyi.trim() || null
    }
    if (profile?.role === 'student') {
      yangilash.talim_joyi = talimJoyi.trim() || null
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const { error: dbError } = await supabase
      .from('profiles')
      .update(yangilash)
      .eq('id', user.id)

    if (dbError) {
      setError("Saqlashda xatolik: " + dbError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
    setTimeout(() => router.push('/student/profil'), 1200)
  }

  if (!profile) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--ink)' }}>Yuklanmoqda...</p>
      </div>
    )
  }

  const harf = (profile.full_name?.trim()?.[0] ?? '?').toUpperCase()
  const rolNomi: Record<string, string> = {
    student: '🎓 Talaba', doctor: '👨‍⚕️ Shifokor', patient: '🧑 Bemor',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '40px' }}>
      <Header backHref="/student/profil" backLabel="Profil" />

      <div className="mx-auto max-w-[600px] px-5 py-6">

        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #2563eb, #0891b2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', fontWeight: 800, color: 'white',
          }}>
            {harf}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '16px' }}>{profile.full_name}</p>
            <p style={{ margin: '3px 0 0', fontSize: '13px', color: 'var(--muted)' }}>
              {rolNomi[profile.role] ?? profile.role}
              {profile.telefon && ` · +${profile.telefon}`}
            </p>
          </div>
        </div>

        {/* Forma */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--line)',
          borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px',
        }}>
          <div>
            <label style={labelStyle}>To'liq ism</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Ism Familiya"
              style={inputStyle}
            />
          </div>

          {profile.role === 'doctor' && (
            <>
              <div>
                <label style={labelStyle}>Mutaxassislik</label>
                <input
                  type="text"
                  value={mutaxassislik}
                  onChange={e => setMutaxassislik(e.target.value)}
                  placeholder="Masalan: Urolog, Androlog"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Ish joyi</label>
                <input
                  type="text"
                  value={ishJoyi}
                  onChange={e => setIshJoyi(e.target.value)}
                  placeholder="Masalan: 1-son shahar shifoxonasi"
                  style={inputStyle}
                />
              </div>
            </>
          )}

          {profile.role === 'student' && (
            <div>
              <label style={labelStyle}>Ta'lim muassasasi</label>
              <input
                type="text"
                value={talimJoyi}
                onChange={e => setTalimJoyi(e.target.value)}
                placeholder="Masalan: ToshDTU, Andijon DIM"
                style={inputStyle}
              />
            </div>
          )}

          {/* Telefon — o'qiladi xolos */}
          {profile.telefon && (
            <div>
              <label style={labelStyle}>Telefon raqami</label>
              <div style={{
                ...inputStyle,
                color: 'var(--muted)',
                background: 'var(--surface)',
                cursor: 'not-allowed',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <span>🔒</span>
                <span>+{profile.telefon}</span>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '12px', margin: '5px 0 0' }}>
                Telefon raqamini o'zgartirish mumkin emas
              </p>
            </div>
          )}

          {error && (
            <p style={{ color: 'var(--danger)', fontSize: '14px', margin: 0 }}>{error}</p>
          )}

          {success && (
            <p style={{ color: '#34d399', fontSize: '14px', margin: 0 }}>
              ✅ Muvaffaqiyatli saqlandi!
            </p>
          )}

          <button
            onClick={saqlash}
            disabled={loading || success}
            style={{
              width: '100%', background: 'var(--accent)', color: 'white', border: 'none',
              borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: '600',
              cursor: loading || success ? 'not-allowed' : 'pointer',
              opacity: loading || success ? 0.7 : 1, marginTop: '4px',
            }}
          >
            {loading ? 'Saqlanmoqda...' : success ? '✅ Saqlandi' : 'Saqlash'}
          </button>
        </div>
      </div>
    </div>
  )
}
