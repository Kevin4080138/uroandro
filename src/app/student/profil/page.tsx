'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { useTheme } from '@/components/ThemeProvider'
import { createClient } from '@/lib/supabase'
import { RankMini, UnvonlarModal } from '@/components/RankBadge'
import { getRank, getProgressData } from '@/lib/rank'
import { useSeriya } from '@/lib/talim/seriya'
import { HAYVONLAR, hayvonTop } from '@/lib/hayvonAvatar'
import { ProfilStatistika } from '@/components/ProfilStatistika'
import {
  User, BarChart3, Award, Bell, Settings, Gift, Info, MessageSquare, Send,
  Phone, BookOpen, HelpCircle, FileText, Sun, Moon, ChevronRight, LogOut, Trash2,
  Check, Pencil, type LucideIcon,
} from 'lucide-react'
import { UrosferaLoaderMini } from '@/components/UrosferaLoader'

type Profile = { full_name: string; telefon: string | null; role: string; avatar_url: string | null }
type NatijaQ = { dars_slug: string; foiz?: number }

const ROL_NOMI: Record<string, string> = {
  student: 'Talaba', doctor: 'Shifokor', patient: 'Bemor', admin: 'Admin',
}

const BANDLAR: { Icon: LucideIcon; label: string; href: string; tashqi?: boolean }[] = [
  { Icon: User, label: 'Profil ma\'lumotlari', href: '/student/profil/tahrirlash' },
  { Icon: BarChart3, label: 'Faolligingiz', href: '/student/profil/faollik' },
  { Icon: Award, label: 'Sertifikatlar', href: '/student/profil/sertifikatlar' },
  { Icon: Bell, label: 'Bildirishnomalar', href: '/student/profil/bildirishnomalar' },
  { Icon: Settings, label: 'Bildirishnoma sozlamalari', href: '/bildirishnoma-sozlamalari' },
  { Icon: Gift, label: "Do'stlarni taklif qilish", href: '/student/profil/taklif' },
  { Icon: Info, label: 'Biz haqimizda', href: '/student/profil/biz-haqimizda' },
  { Icon: MessageSquare, label: 'Izoh (feedback)', href: '/student/profil/feedback' },
  { Icon: Send, label: 'Adminga yozish', href: 'https://t.me/urolog_arabboyev', tashqi: true },
  { Icon: Phone, label: "Qo'ng'iroq qilish", href: 'tel:+998904080138', tashqi: true },
  { Icon: BookOpen, label: "Yo'riqnoma", href: '/student/profil/yoriqnoma' },
  { Icon: HelpCircle, label: 'Savol-Javoblar', href: '/student/profil/faq' },
  { Icon: FileText, label: 'Ommaviy oferta', href: '/student/profil/oferta' },
]

export default function ProfilPage() {
  const router = useRouter()
  const supabase = createClient()
  const { theme, toggle } = useTheme()
  const { seriya } = useSeriya()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [myId, setMyId] = useState<string | null>(null)
  const [natijalarList, setNatijalarList] = useState<NatijaQ[]>([])
  const [avatarIkon, setAvatarIkon] = useState<string | null>(null)
  const [ikonTanlash, setIkonTanlash] = useState(false)
  const [ochirilmoqda, setOchirilmoqda] = useState(false)
  const [parolModal, setParolModal] = useState(false)
  const [parol, setParol] = useState('')
  const [parolXato, setParolXato] = useState('')
  const [unvonlarOchiq, setUnvonlarOchiq] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/auth/login'); return }
      setMyId(user.id)
      const { data } = await supabase.from('profiles').select('full_name, telefon, role, avatar_url').eq('id', user.id).maybeSingle()
      setProfile(data as Profile)
      // avatar_ikon — yangi ustun; migratsiyadan oldin bo'lmasligi mumkin (xato bermaydi)
      const { data: ikonData } = await supabase.from('profiles').select('avatar_ikon').eq('id', user.id).maybeSingle()
      setAvatarIkon((ikonData as { avatar_ikon?: string | null } | null)?.avatar_ikon ?? null)
      const { data: nat } = await supabase.from('talim_natijalari').select('dars_slug, foiz').eq('student_id', user.id)
      setNatijalarList((nat as NatijaQ[]) ?? [])
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const chiqish = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  // Hayvon avatarini tanlash/o'chirish (qayta bosilsa — bekor qiladi)
  const hayvonTanla = async (key: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const yangi = avatarIkon === key ? null : key
    setAvatarIkon(yangi)
    setIkonTanlash(false)
    await supabase.from('profiles').update({ avatar_ikon: yangi }).eq('id', user.id)
  }

  const hisobniOchir = () => {
    if (!confirm("Hisobingizni BUTUNLAY o'chirishni tasdiqlaysizmi? Bu amalni qaytarib bo'lmaydi va barcha ma'lumotlaringiz (natijalar, obunalar) yo'qoladi.")) return
    setParol('')
    setParolXato('')
    setParolModal(true)
  }

  const tasdiqlabOchir = async () => {
    if (!parol) { setParolXato('Parolni kiriting'); return }
    setOchirilmoqda(true)
    setParolXato('')
    const res = await fetch('/api/hisobni-ochirish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: parol }),
    })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      setParolXato(j.error ?? "Hisobni o'chirib bo'lmadi")
      setOchirilmoqda(false)
      return
    }
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (!profile) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <UrosferaLoaderMini />
      </div>
    )
  }

  const harf = (profile.full_name?.trim()?.[0] ?? '?').toUpperCase()
  const tanlanganHayvon = hayvonTop(avatarIkon)
  const ortacha = natijalarList.length ? Math.round(natijalarList.reduce((s, n) => s + (n.foiz ?? 0), 0) / natijalarList.length) : 0
  const seriyaKun = seriya?.joriy ?? 0

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
      <Header backHref="/student/dashboard" backLabel="Bosh sahifa" />
      <div className="mx-auto max-w-[1000px] px-5 py-6 sm:px-8 sm:py-8">

        {/* Bento: chapda katta rasm kartasi + o'ngda statistika widgetlari (Lordbank) */}
        <div className="rise grid grid-cols-1 min-[760px]:grid-cols-[260px_1fr_1fr] gap-3" style={{ marginBottom: '16px' }}>
          {/* Rasm kartasi — chap, baland */}
          <div className="min-[760px]:row-span-2" style={{
            background: 'linear-gradient(160deg, var(--accent), var(--accent-2))', borderRadius: '18px',
            padding: '18px', color: 'white', display: 'flex', flexDirection: 'column',
          }}>
            <button onClick={() => setIkonTanlash((v) => !v)} aria-label="Avatar belgisini tanlash" style={{
              position: 'relative', flex: 1, minHeight: '150px', borderRadius: '14px',
              background: 'rgba(255,255,255,.15)', color: 'white', border: 'none', cursor: 'pointer', padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
            }}>
              {tanlanganHayvon
                ? <tanlanganHayvon.Icon size={64} strokeWidth={1.5} />
                : profile.avatar_url
                  ? <img src={profile.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: '48px', fontWeight: 800 }}>{harf}</span>}
              <span style={{
                position: 'absolute', right: '8px', bottom: '8px', width: '26px', height: '26px', borderRadius: '50%',
                background: 'white', color: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><Pencil size={13} strokeWidth={2.4} /></span>
            </button>
            <div style={{ marginTop: '14px' }}>
              <div style={{ fontSize: '17px', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile.full_name}</div>
              <div style={{ fontSize: '12.5px', opacity: .85, marginTop: '2px' }}>{ROL_NOMI[profile.role] ?? profile.role}</div>
              {profile.role === 'student' && (
                <div style={{ marginTop: '9px' }}>
                  <RankMini rank={getRank(getProgressData(natijalarList))} onClick={() => setUnvonlarOchiq(true)} />
                </div>
              )}
              <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
                {[{ n: 'Testlar', v: `${natijalarList.length}` }, { n: "O'rtacha", v: `${ortacha}%` }, { n: 'Seriya', v: `${seriyaKun}` }].map((s) => (
                  <div key={s.n} style={{ flex: 1, background: 'rgba(255,255,255,.18)', borderRadius: '10px', padding: '8px 4px', textAlign: 'center' }}>
                    <div style={{ fontSize: '15px', fontWeight: 800, lineHeight: 1 }}>{s.v}</div>
                    <div style={{ fontSize: '9.5px', opacity: .8, marginTop: '3px' }}>{s.n}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {myId && <ProfilStatistika studentId={myId} />}
        </div>

        {/* Hayvon belgi tanlagich — bento ostida, to'liq kenglik */}
        {ikonTanlash && (
          <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '16px', marginBottom: '16px' }}>
            <p style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 800 }}>
              Belgi tanlang <span style={{ color: 'var(--muted)', fontWeight: 500 }}>— qayta bossangiz bekor bo&apos;ladi</span>
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(56px, 1fr))', gap: '10px' }}>
              {HAYVONLAR.map((h) => {
                const faol = avatarIkon === h.key
                return (
                  <button key={h.key} onClick={() => hayvonTanla(h.key)} aria-label={h.nom} title={h.nom} style={{
                    aspectRatio: '1', borderRadius: '12px', cursor: 'pointer',
                    background: faol ? 'var(--accent)' : 'var(--surface-2)',
                    color: faol ? 'white' : 'var(--ink-soft)',
                    border: faol ? 'none' : '1px solid var(--line)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                  }}>
                    <h.Icon size={24} strokeWidth={2} />
                    {faol && <span style={{ position: 'absolute', right: 4, top: 4 }}><Check size={12} strokeWidth={3} /></span>}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="rise" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
          padding: '14px 18px', marginBottom: '16px',
        }}>
          <span style={{ fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            {theme === 'dark' ? <Moon size={16} strokeWidth={2} /> : <Sun size={16} strokeWidth={2} />} Tungi rejim
          </span>
          <button
            onClick={toggle}
            aria-label="Tungi rejimni almashtirish"
            style={{
              width: '44px', height: '26px', borderRadius: '999px', border: 'none', cursor: 'pointer', position: 'relative',
              background: theme === 'dark' ? 'var(--accent)' : 'var(--line)', transition: 'background .2s',
            }}
          >
            <span style={{
              position: 'absolute', top: '3px', left: theme === 'dark' ? '22px' : '3px',
              width: '20px', height: '20px', borderRadius: '50%', background: 'white', transition: 'left .2s',
            }} />
          </button>
        </div>

        <div className="rise grid grid-cols-1 min-[720px]:grid-cols-2 gap-2.5" style={{ marginBottom: '16px' }}>
          {BANDLAR.map((b) => (
            <a
              key={b.label}
              href={b.href}
              target={b.tashqi ? '_blank' : undefined}
              rel={b.tashqi ? 'noopener noreferrer' : undefined}
              className="row-hover lift"
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px',
                background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
                textDecoration: 'none', color: 'var(--ink)',
              }}
            >
              <span style={{ display: 'flex', color: 'var(--ink-soft)' }}><b.Icon size={18} strokeWidth={2} /></span>
              <span style={{ fontSize: '14px', fontWeight: 600, flex: 1 }}>{b.label}</span>
              <ChevronRight size={17} strokeWidth={2} style={{ color: 'var(--muted)' }} />
            </a>
          ))}
        </div>

        <div className="rise" style={{
          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', overflow: 'hidden',
        }}>
          <button onClick={chiqish} className="row-hover" style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', width: '100%',
            background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--danger)',
          }}>
            <LogOut size={18} strokeWidth={2} />
            <span style={{ fontSize: '14px', fontWeight: 700 }}>Hisobdan chiqish</span>
          </button>
          <button onClick={hisobniOchir} disabled={ochirilmoqda} className="row-hover" style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', width: '100%',
            background: 'none', border: 'none', borderTop: '1px solid var(--line)', cursor: ochirilmoqda ? 'wait' : 'pointer',
            textAlign: 'left', color: 'var(--danger)', opacity: ochirilmoqda ? .6 : 1,
          }}>
            <Trash2 size={18} strokeWidth={2} />
            <span style={{ fontSize: '14px', fontWeight: 700 }}>{ochirilmoqda ? "O'chirilmoqda..." : "Hisobni o'chirish"}</span>
          </button>
        </div>
      </div>

      {parolModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 100,
        }}>
          <div style={{
            width: '100%', maxWidth: '380px', background: 'var(--surface)', borderRadius: '16px',
            padding: '24px', border: '1px solid var(--line)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '17px', color: 'var(--ink)' }}>Parolni tasdiqlang</h3>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--muted)' }}>
              Hisobni o&apos;chirish irreversible amal — davom etish uchun joriy parolingizni kiriting.
            </p>
            <input
              type="password"
              value={parol}
              onChange={(e) => setParol(e.target.value)}
              placeholder="Joriy parol"
              autoFocus
              style={{
                width: '100%', background: 'var(--surface-2)', color: 'var(--ink)', border: '1px solid var(--line)',
                borderRadius: '10px', padding: '12px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
              }}
            />
            {parolXato && <p style={{ color: 'var(--danger)', fontSize: '13px', margin: '8px 0 0' }}>{parolXato}</p>}
            <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
              <button
                onClick={() => setParolModal(false)}
                disabled={ochirilmoqda}
                style={{
                  flex: 1, background: 'var(--surface-2)', color: 'var(--ink)', border: '1px solid var(--line)',
                  borderRadius: '10px', padding: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                }}
              >
                Bekor qilish
              </button>
              <button
                onClick={tasdiqlabOchir}
                disabled={ochirilmoqda}
                style={{
                  flex: 1, background: 'var(--danger)', color: 'white', border: 'none',
                  borderRadius: '10px', padding: '12px', fontSize: '14px', fontWeight: 600,
                  cursor: ochirilmoqda ? 'wait' : 'pointer', opacity: ochirilmoqda ? .7 : 1,
                }}
              >
                {ochirilmoqda ? "O'chirilmoqda..." : "Hisobni o'chirish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {unvonlarOchiq && (
        <UnvonlarModal
          joriyDaraja={getRank(getProgressData(natijalarList)).darajaSon}
          onClose={() => setUnvonlarOchiq(false)}
        />
      )}

      <BottomNav />
    </div>
  )
}
