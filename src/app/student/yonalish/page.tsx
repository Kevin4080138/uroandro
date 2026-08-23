'use client'

// Ro'yxatdan keyin: "Qaysi yo'nalishni o'rganmoqchisiz?"
// Tanlov faqat dashboardni moslaydi — foydalanuvchini cheklamaydi.

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { ChevronRight, Lock, CircleDashed } from 'lucide-react'

const YONALISHLAR = [
  {
    id: 'urologiya', harf: 'U', nom: 'Urologiya',
    tavsif: 'Siydik-tanosil tizimi, andrologiya, diagnostika, operativ urologiya, klinik holatlar va testlar.',
    c: 'var(--accent)', soft: 'var(--accent-soft)',
  },
  {
    id: 'ginekologiya', harf: 'G', nom: 'Ginekologiya',
    tavsif: 'Ayollar reproduktiv tizimi, ginekologik kasalliklar, operativ ginekologiya, klinik holatlar va testlar.',
    c: 'var(--gyn)', soft: 'var(--gyn-soft)',
  },
] as const

export default function YonalishTanlash() {
  const router = useRouter()
  const supabase = createClient()

  async function tanla(id: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) await supabase.from('profiles').update({ yonalish: id }).eq('id', user.id)
    router.push('/student/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header />
      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '24px 20px 40px' }}>
        <p className="rise" style={{ margin: '0 0 4px', color: 'var(--muted)', font: '500 13px var(--font-inter)' }}>
          Ro&apos;yxatdan o&apos;tdingiz 🎉
        </p>
        <h1 className="rise" style={{ margin: '0 0 7px', fontSize: '24px', lineHeight: 1.22 }}>
          Qaysi yo&apos;nalishni o&apos;rganmoqchisiz?
        </h1>
        <p className="rise" style={{ margin: '0 0 22px', color: 'var(--muted)', fontSize: '13.5px', lineHeight: 1.55 }}>
          Tanlov faqat asosiy panelni moslaydi — keyin ikkalasiga ham erkin o&apos;ta olasiz.
        </p>

        {YONALISHLAR.map((y, i) => (
          <button
            key={y.id}
            onClick={() => tanla(y.id)}
            className="rise soft-press"
            style={{
              display: 'flex', alignItems: 'center', gap: '14px', width: '100%', textAlign: 'left',
              background: 'var(--surface)', border: '1px solid var(--line)', borderLeft: `4px solid ${y.c}`,
              borderRadius: '18px', padding: '17px', marginBottom: '13px', cursor: 'pointer',
              boxShadow: 'var(--shadow)', animationDelay: `${0.05 + i * 0.05}s`,
            }}
          >
            <span style={{
              width: '52px', height: '52px', borderRadius: '15px', flexShrink: 0,
              background: y.soft, color: y.c, display: 'flex', alignItems: 'center', justifyContent: 'center',
              font: '800 24px var(--font-inter)',
            }}>{y.harf}</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontWeight: 800, fontSize: '16px', marginBottom: '3px' }}>{y.nom}</span>
              <span style={{ display: 'block', font: '400 12px var(--font-inter)', color: 'var(--muted)', lineHeight: 1.45 }}>
                {y.tavsif}
              </span>
            </span>
            <ChevronRight size={18} strokeWidth={2.4} style={{ color: 'var(--muted)', flexShrink: 0 }} />
          </button>
        ))}

        <div className="rise" style={{
          display: 'flex', gap: '10px', alignItems: 'flex-start',
          background: 'var(--accent-soft)', border: '1px solid rgba(37,99,235,.22)',
          borderRadius: '12px', padding: '11px 13px', margin: '5px 0 12px',
        }}>
          <Lock size={16} strokeWidth={2} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '1px' }} />
          <p style={{ margin: 0, font: '500 11.5px var(--font-inter)', lineHeight: 1.5, color: 'var(--ink-soft)' }}>
            Bu tanlov sizni <b>cheklamaydi</b>. Menyudagi yo&apos;nalish almashtirgichdan istalgan vaqt
            ikkalasiga ham kirasiz.
          </p>
        </div>

        <div className="rise" style={{ display: 'flex', gap: '9px', alignItems: 'center', color: 'var(--muted)' }}>
          <CircleDashed size={16} strokeWidth={1.8} style={{ color: 'var(--gyn)', flexShrink: 0 }} />
          <span style={{ font: '500 11px var(--font-inter)', lineHeight: 1.4 }}>
            <b style={{ color: 'var(--gyn)' }}>Uroginekologiya</b> — ikkala yo&apos;nalish kesishgan mavzular
            alohida maxsus bo&apos;limda.
          </span>
        </div>
      </div>
    </div>
  )
}
