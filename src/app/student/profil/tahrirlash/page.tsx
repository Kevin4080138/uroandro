'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { UrosferaLoaderMini } from '@/components/UrosferaLoader'

type Profile = {
  full_name: string
  telefon: string | null
  role: string
  mutaxassislik: string | null
  ish_joyi: string | null
  talim_joyi: string | null
  avatar_url: string | null
}

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'var(--surface-2)', color: 'var(--ink)',
  border: '1px solid var(--line)', borderRadius: '10px',
  padding: '12px 16px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  color: 'var(--ink-soft)', fontSize: '13px', display: 'block',
  marginBottom: '6px', fontWeight: 600,
}

export default function ProfilTahrirlashPage() {
  const router = useRouter()
  const supabase = createClient()
  const fileRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState<Profile | null>(null)
  const [userId, setUserId] = useState('')

  // Ma'lumot maydonlari
  const [fullName, setFullName] = useState('')
  const [mutaxassislik, setMutaxassislik] = useState('')
  const [ishJoyi, setIshJoyi] = useState('')
  const [talimJoyi, setTalimJoyi] = useState('')

  // Avatar
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)

  // Parol
  const [parolBolim, setParolBolim] = useState(false)
  const [yangiParol, setYangiParol] = useState('')
  const [tasdiqlash, setTasdiqlash] = useState('')
  const [parolLoading, setParolLoading] = useState(false)
  const [parolXabar, setParolXabar] = useState('')
  const [parolXato, setParolXato] = useState('')

  // Umumiy
  const [loading, setLoading] = useState(false)
  const [yuklanmadi, setYuklanmadi] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/auth/login'); return }
      setUserId(user.id)
      const { data, error: dbErr } = await supabase
        .from('profiles')
        .select('full_name, telefon, role, mutaxassislik, ish_joyi')
        .eq('id', user.id)
        .maybeSingle()

      if (dbErr || !data) { setYuklanmadi(true); return }

      // avatar_url — yangi ustun, yo'q bo'lsa xato bermaydi
      const { data: avatarData } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .maybeSingle()

      setProfile({ ...data, avatar_url: avatarData?.avatar_url ?? null, talim_joyi: null } as Profile)
      setFullName(data.full_name ?? '')
      setMutaxassislik(data.mutaxassislik ?? '')
      setIshJoyi(data.ish_joyi ?? '')
      setAvatarPreview(avatarData?.avatar_url ?? null)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Avatar tanlash ──────────────────────────────────────────────────────────
  const avatarTanla = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { setError("Rasm 2 MB dan kichik bo'lishi kerak"); return }
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
    setError('')
  }

  // ── Saqlash ─────────────────────────────────────────────────────────────────
  const saqlash = async () => {
    setError('')
    if (!fullName.trim()) { setError("To'liq ismni kiriting"); return }
    setLoading(true)

    let avatarUrl: string | null = profile?.avatar_url ?? null

    // Avatar yuklash
    if (avatarFile) {
      setAvatarUploading(true)
      const ext = avatarFile.name.split('.').pop()
      const path = `${userId}/avatar.${ext}`
      const { error: upErr } = await supabase.storage
        .from('avatarlar')
        .upload(path, avatarFile, { upsert: true })
      if (upErr) {
        setError("Rasm yuklanmadi: " + upErr.message)
        setLoading(false)
        setAvatarUploading(false)
        return
      }
      const { data: urlData } = supabase.storage.from('avatarlar').getPublicUrl(path)
      avatarUrl = urlData.publicUrl + '?t=' + Date.now()
      setAvatarUploading(false)
    }

    const yangilash: Record<string, string | null> = {
      full_name: fullName.trim(),
      avatar_url: avatarUrl,
    }
    if (profile?.role === 'doctor') {
      yangilash.mutaxassislik = mutaxassislik.trim() || null
      yangilash.ish_joyi = ishJoyi.trim() || null
    }

    const { error: dbErr } = await supabase.from('profiles').update(yangilash).eq('id', userId)
    if (dbErr) {
      setError("Saqlashda xatolik: " + dbErr.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setAvatarFile(null)
    setLoading(false)
    setTimeout(() => router.push('/student/profil'), 1200)
  }

  // ── Parol o'zgartirish ───────────────────────────────────────────────────────
  const parolSaqla = async () => {
    setParolXato('')
    setParolXabar('')
    if (yangiParol.length < 8) { setParolXato("Parol kamida 8 ta belgi bo'lishi kerak"); return }
    if (yangiParol !== tasdiqlash) { setParolXato("Parollar mos kelmayapti"); return }
    setParolLoading(true)
    const { error } = await supabase.auth.updateUser({ password: yangiParol })
    if (error) {
      setParolXato("Xatolik: " + error.message)
    } else {
      setParolXabar('✅ Parol muvaffaqiyatli o\'zgartirildi')
      setYangiParol('')
      setTasdiqlash('')
      setTimeout(() => { setParolBolim(false); setParolXabar('') }, 2000)
    }
    setParolLoading(false)
  }

  if (!profile) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
        {yuklanmadi ? (
          <>
            <p style={{ color: 'var(--danger)' }}>Ma'lumotlar yuklanmadi</p>
            <button onClick={() => router.push('/student/profil')} style={{
              background: 'var(--accent)', color: 'white', border: 'none',
              borderRadius: '10px', padding: '10px 24px', cursor: 'pointer', fontSize: '14px',
            }}>Orqaga</button>
          </>
        ) : (
          <UrosferaLoaderMini />
        )}
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

      <div className="mx-auto max-w-[600px] px-5 py-6" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* ── Avatar ── */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--line)',
          borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
        }}>
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              width: '88px', height: '88px', borderRadius: '50%', cursor: 'pointer',
              border: '3px solid var(--accent)', overflow: 'hidden', flexShrink: 0,
              background: 'linear-gradient(135deg, #2563eb, #0891b2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}
          >
            {avatarPreview
              ? <img src={avatarPreview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: '32px', fontWeight: 800, color: 'white' }}>{harf}</span>
            }
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'rgba(0,0,0,0.45)', height: '28px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: '14px' }}>📷</span>
            </div>
          </div>

          <p style={{ color: 'var(--muted)', fontSize: '12px', margin: 0, textAlign: 'center' }}>
            Bosing va rasm tanlang · JPEG/PNG · max 2 MB
          </p>

          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={avatarTanla}
            style={{ display: 'none' }}
          />

          {avatarFile && (
            <p style={{ color: 'var(--accent)', fontSize: '13px', margin: 0 }}>
              ✓ {avatarFile.name} tanlandi — "Saqlash" bosing
            </p>
          )}
        </div>

        {/* ── Ma'lumotlar ── */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--line)',
          borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px',
        }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Shaxsiy ma'lumotlar</h3>

          <div>
            <label style={labelStyle}>To'liq ism</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
              placeholder="Ism Familiya" style={inputStyle} />
          </div>

          {profile.role === 'doctor' && (
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

          {profile.role === 'student' && (
            <div>
              <label style={labelStyle}>Ta'lim muassasasi</label>
              <input type="text" value={talimJoyi} onChange={e => setTalimJoyi(e.target.value)}
                placeholder="Masalan: ToshDTU, Andijon DIM" style={inputStyle} />
            </div>
          )}

          {profile.telefon && (
            <div>
              <label style={labelStyle}>Telefon raqami</label>
              <div style={{ ...inputStyle, color: 'var(--muted)', background: 'var(--surface)', cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🔒</span><span>+{profile.telefon}</span>
              </div>
            </div>
          )}

          <div>
            <label style={labelStyle}>Rol</label>
            <div style={{ ...inputStyle, color: 'var(--muted)', background: 'var(--surface)', cursor: 'not-allowed' }}>
              {rolNomi[profile.role] ?? profile.role}
            </div>
          </div>

          {error && <p style={{ color: 'var(--danger)', fontSize: '14px', margin: 0 }}>{error}</p>}
          {success && <p style={{ color: '#34d399', fontSize: '14px', margin: 0 }}>✅ Muvaffaqiyatli saqlandi!</p>}

          <button onClick={saqlash} disabled={loading || success} style={{
            width: '100%', background: 'var(--accent)', color: 'white', border: 'none',
            borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: 600,
            cursor: loading || success ? 'not-allowed' : 'pointer', opacity: loading || success ? 0.7 : 1,
          }}>
            {avatarUploading ? 'Rasm yuklanmoqda...' : loading ? 'Saqlanmoqda...' : success ? '✅ Saqlandi' : 'Saqlash'}
          </button>
        </div>

        {/* ── Parol o'zgartirish ── */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--line)',
          borderRadius: '14px', overflow: 'hidden',
        }}>
          <button
            onClick={() => { setParolBolim(v => !v); setParolXato(''); setParolXabar('') }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', padding: '16px 20px', background: 'none', border: 'none',
              cursor: 'pointer', color: 'var(--ink)',
            }}
          >
            <span style={{ fontWeight: 700, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🔑 Parolni o'zgartirish
            </span>
            <span style={{ color: 'var(--muted)', fontSize: '18px', transform: parolBolim ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }}>›</span>
          </button>

          {parolBolim && (
            <div style={{ padding: '4px 20px 20px', display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--line)' }}>
              <div>
                <label style={labelStyle}>Yangi parol</label>
                <input type="password" value={yangiParol} onChange={e => setYangiParol(e.target.value)}
                  placeholder="Kamida 8 ta belgi" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Parolni tasdiqlang</label>
                <input type="password" value={tasdiqlash} onChange={e => setTasdiqlash(e.target.value)}
                  placeholder="••••••••" style={inputStyle} />
              </div>

              {parolXato && <p style={{ color: 'var(--danger)', fontSize: '13px', margin: 0 }}>{parolXato}</p>}
              {parolXabar && <p style={{ color: '#34d399', fontSize: '13px', margin: 0 }}>{parolXabar}</p>}

              <button onClick={parolSaqla} disabled={parolLoading} style={{
                width: '100%', background: 'var(--accent)', color: 'white', border: 'none',
                borderRadius: '10px', padding: '13px', fontSize: '14px', fontWeight: 600,
                cursor: parolLoading ? 'not-allowed' : 'pointer', opacity: parolLoading ? 0.7 : 1,
              }}>
                {parolLoading ? 'Saqlanmoqda...' : 'Parolni saqlash'}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
