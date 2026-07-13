'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const ROL_DASHBOARD: Record<string, string> = {
  student: '/student/dashboard',
  doctor: '/doctor/dashboard',
  patient: '/patient/dashboard',
  admin: '/admin/dashboard',
}

const ESHIKLAR = [
  {
    kalit: 'bemor',
    belgi: '🧑',
    sarlavha: 'Men bemorman',
    izoh: 'Shifokor topaman, navbatga yozilaman',
    href: '/bemor',
    asosiy: true,
  },
  {
    kalit: 'shifokor',
    belgi: '👨‍⚕️',
    sarlavha: 'Men shifokorman',
    izoh: 'Bemorlar, protokollar, kasbiy vositalar',
    href: '/kasbiy?rol=shifokor',
    asosiy: false,
  },
  {
    kalit: 'talaba',
    belgi: '🎓',
    sarlavha: 'Men talabaman',
    izoh: 'Darslar, testlar, reyting',
    href: '/kasbiy?rol=talaba',
    asosiy: false,
  },
]

function Ostona() {
  const router = useRouter()
  const params = useSearchParams()
  const supabase = createClient()
  const [tayyor, setTayyor] = useState(false)

  useEffect(() => {
    const tekshir = async () => {
      // Login qilgan foydalanuvchi — to'g'ri dashboardga
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        const yol = ROL_DASHBOARD[data?.role ?? '']
        if (yol) { router.replace(yol); return }
      }
      // Oldingi tanlov eslab qolingan bo'lsa — to'g'ri eshikka (agar qayta tanlash so'ralmagan bo'lsa)
      const qaytaTanla = params.get('tanla') === '1'
      if (!qaytaTanla && typeof window !== 'undefined') {
        const saqlangan = localStorage.getItem('urosfera_rol')
        const eshik = ESHIKLAR.find((e) => e.kalit === saqlangan)
        if (eshik) { router.replace(eshik.href); return }
      }
      setTayyor(true)
    }
    tekshir()
  }, [])

  const tanla = (eshik: typeof ESHIKLAR[number]) => {
    try { localStorage.setItem('urosfera_rol', eshik.kalit) } catch {}
    router.push(eshik.href)
  }

  if (!tayyor) {
    return (
      <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="pulse" style={{ color: 'var(--muted)', fontSize: 14 }}>Yuklanmoqda...</div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100dvh', background: 'var(--bg)', color: 'var(--ink)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '32px 20px',
    }}>
      <div style={{ width: '100%', maxWidth: 460, textAlign: 'center' }}>

        {/* Brend */}
        <div className="rise" style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-.02em' }}>
            Uro<span style={{ color: 'var(--accent)' }}>sfera</span>
          </span>
        </div>
        <p className="rise" style={{ color: 'var(--muted)', fontSize: 13.5, margin: '0 0 32px', animationDelay: '.05s' }}>
          Farg&apos;ona urologiya ekotizimi
        </p>

        {/* Savol */}
        <h1 className="rise" style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.2, margin: '0 0 24px', animationDelay: '.1s' }}>
          Kim uchun keldingiz?
        </h1>

        {/* Eshiklar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {ESHIKLAR.map((e, i) => (
            <button
              key={e.kalit}
              onClick={() => tanla(e)}
              className="rise lift soft-press"
              style={{
                display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left', cursor: 'pointer',
                background: e.asosiy ? 'var(--accent)' : 'var(--surface)',
                color: e.asosiy ? '#fff' : 'var(--ink)',
                border: e.asosiy ? 'none' : '1.5px solid var(--line)',
                borderRadius: 18, padding: '20px 22px',
                animationDelay: `${0.15 + i * 0.07}s`,
                boxShadow: e.asosiy ? '0 10px 28px rgba(37,99,235,.28)' : 'none',
              }}
            >
              <span style={{
                fontSize: 30, width: 52, height: 52, flexShrink: 0, borderRadius: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: e.asosiy ? 'rgba(255,255,255,.18)' : 'var(--surface-2)',
              }}>{e.belgi}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 18, fontWeight: 800, lineHeight: 1.2 }}>{e.sarlavha}</span>
                <span style={{ display: 'block', fontSize: 13, marginTop: 3, opacity: e.asosiy ? 0.9 : 1, color: e.asosiy ? '#fff' : 'var(--muted)', lineHeight: 1.4 }}>{e.izoh}</span>
              </span>
              <span style={{ fontSize: 22, opacity: e.asosiy ? 0.9 : 0.5 }}>›</span>
            </button>
          ))}
        </div>

        <p className="rise" style={{ marginTop: 28, fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, animationDelay: '.4s' }}>
          Ro&apos;yxatdan o&apos;tmasdan ham shifokor topishingiz mumkin
        </p>
      </div>
    </div>
  )
}

export default function OstonaPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100dvh', background: 'var(--bg)' }} />
    }>
      <Ostona />
    </Suspense>
  )
}
