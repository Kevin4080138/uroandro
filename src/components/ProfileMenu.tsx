'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { User, Bell, LogOut, GraduationCap, Stethoscope, UserRound, Wrench, Sun, Moon, X, ChevronRight, type LucideIcon } from 'lucide-react'
import { hayvonTop } from '@/lib/hayvonAvatar'
import { SideDrawer } from './SideDrawer'
import { useTheme } from './ThemeProvider'

// Profil menyusi: o'ngdan chiquvchi drawer (true) yoki kichik dropdown (false).
const DRAWER_PROFIL = true

type Profile = { full_name: string; role: string; avatar_url: string | null }

const ROL_NOMI: Record<string, string> = {
  student: 'Talaba', doctor: 'Shifokor', patient: 'Bemor', admin: 'Admin',
}
const ROL_ICON: Record<string, LucideIcon> = {
  student: GraduationCap, doctor: Stethoscope, patient: UserRound, admin: Wrench,
}

export function ProfileMenu() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [avatarIkon, setAvatarIkon] = useState<string | null>(null)
  const [ochiq, setOchiq] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { theme, toggle } = useTheme()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data } = await supabase.from('profiles').select('full_name, role, avatar_url').eq('id', user.id).maybeSingle()
      if (data) setProfile(data as Profile)
      // avatar_ikon — yangi ustun; migratsiyadan oldin bo'lmasligi mumkin (alohida, tolerant)
      const { data: ikonData } = await supabase.from('profiles').select('avatar_ikon').eq('id', user.id).maybeSingle()
      setAvatarIkon((ikonData as { avatar_ikon?: string | null } | null)?.avatar_ikon ?? null)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Dropdown rejimida tashqariga bosilganda yopiladi. Drawer rejimida
  // yopishni SideDrawer'ning o'z overlay'i boshqaradi.
  useEffect(() => {
    if (DRAWER_PROFIL) return
    const tashqiBosish = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOchiq(false)
    }
    document.addEventListener('mousedown', tashqiBosish)
    return () => document.removeEventListener('mousedown', tashqiBosish)
  }, [])

  const chiqish = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (!profile) return null

  const harf = (profile.full_name?.trim()?.[0] ?? '?').toUpperCase()

  const avatarNode = (olcham: number) => {
    const h = hayvonTop(avatarIkon)
    if (h) return <h.Icon size={olcham} strokeWidth={2} />
    if (profile.avatar_url) return <img src={profile.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    return <span style={{ fontSize: olcham * 0.7, fontWeight: 700 }}>{harf}</span>
  }

  const RolIcon = ROL_ICON[profile.role]

  // Drawer bandi — yagona uslub
  const bandStyle = (danger = false): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: '12px', width: '100%', textAlign: 'left',
    background: 'none', border: 'none', cursor: 'pointer', font: 'inherit',
    color: danger ? 'var(--danger)' : 'var(--ink)', fontSize: '14px', fontWeight: 600,
    padding: '13px 12px', borderRadius: '11px',
  })

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOchiq((v) => !v)}
        aria-label="Profil menyusi"
        className="btn-animated"
        style={{
          width: '36px', height: '36px', borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: 'var(--accent)', color: 'white', fontSize: '14px', fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 0,
        }}
      >
        {avatarNode(19)}
      </button>

      {DRAWER_PROFIL ? (
        <SideDrawer ochiq={ochiq} onYopish={() => setOchiq(false)}>
          {/* Profil boshi */}
          <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: '13px' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
              background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {avatarNode(26)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {profile.full_name}
              </p>
              <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                {RolIcon ? <RolIcon size={14} strokeWidth={2} /> : null}
                {ROL_NOMI[profile.role] ?? profile.role}
              </p>
            </div>
            <button
              onClick={() => setOchiq(false)}
              aria-label="Yopish"
              className="soft-press"
              style={{
                width: '34px', height: '34px', borderRadius: '999px', flexShrink: 0, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--muted)',
              }}
            >
              <X size={18} strokeWidth={2.2} />
            </button>
          </div>

          {/* Bandlar */}
          <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
            {profile.role === 'student' && (
              <button onClick={() => { setOchiq(false); router.push('/student/profil') }} className="soft-press" style={bandStyle()}>
                <User size={18} strokeWidth={2} /> Mening profilim
                <ChevronRight size={16} strokeWidth={2} style={{ marginLeft: 'auto', color: 'var(--muted)' }} />
              </button>
            )}
            <button onClick={() => { setOchiq(false); router.push('/bildirishnoma-sozlamalari') }} className="soft-press" style={bandStyle()}>
              <Bell size={18} strokeWidth={2} /> Bildirishnoma sozlamalari
              <ChevronRight size={16} strokeWidth={2} style={{ marginLeft: 'auto', color: 'var(--muted)' }} />
            </button>
            <button onClick={toggle} className="soft-press" style={bandStyle()}>
              {theme === 'dark' ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
              Tema
              <span style={{ marginLeft: 'auto', fontSize: '12.5px', fontWeight: 700, color: 'var(--muted)' }}>
                {theme === 'dark' ? 'Tungi' : 'Yorug‘'}
              </span>
            </button>
          </div>

          {/* Chiqish — pastda, ajratilgan */}
          <div style={{ padding: '10px', borderTop: '1px solid var(--line)' }}>
            <button onClick={chiqish} className="soft-press" style={bandStyle(true)}>
              <LogOut size={18} strokeWidth={2} /> Chiqish
            </button>
          </div>
        </SideDrawer>
      ) : ochiq && (
        <div
          className="rise"
          style={{
            position: 'fixed', right: '12px', top: '60px', zIndex: 200, minWidth: '220px', maxWidth: 'calc(100vw - 24px)',
            background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
            boxShadow: 'var(--shadow)', padding: '14px', overflow: 'hidden',
          }}
        >
          <div style={{ padding: '0 4px 12px', borderBottom: '1px solid var(--line)', marginBottom: '8px' }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {profile.full_name}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              {(() => { const RI = ROL_ICON[profile.role]; return RI ? <RI size={13} strokeWidth={2} /> : null })()}
              {ROL_NOMI[profile.role] ?? profile.role}
            </p>
          </div>
          {profile.role === 'student' && (
            <button
              onClick={() => { setOchiq(false); router.push('/student/profil') }}
              className="soft-press"
              style={{
                width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--ink)', fontSize: '13px', fontWeight: 600, padding: '8px 4px', borderRadius: '8px',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}
            >
              <User size={15} strokeWidth={2} /> Mening profilim
            </button>
          )}
          {/* Barcha rollar uchun — bemor va shifokorda profil sahifasi yo'q,
              lekin bildirishnomani boshqarish imkoni hammaga kerak */}
          <button
            onClick={() => { setOchiq(false); router.push('/bildirishnoma-sozlamalari') }}
            className="soft-press"
            style={{
              width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--ink)', fontSize: '13px', fontWeight: 600, padding: '8px 4px', borderRadius: '8px',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}
          >
            <Bell size={15} strokeWidth={2} /> Bildirishnoma sozlamalari
          </button>
          <button
            onClick={chiqish}
            className="soft-press"
            style={{
              width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--danger)', fontSize: '13px', fontWeight: 600, padding: '8px 4px', borderRadius: '8px',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}
          >
            <LogOut size={15} strokeWidth={2} /> Chiqish
          </button>
        </div>
      )}
    </div>
  )
}
