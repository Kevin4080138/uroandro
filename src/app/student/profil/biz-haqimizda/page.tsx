'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'

export default function BizHaqimizdaPage() {
  const supabase = createClient()
  // Admin /admin/biz-haqimizda da tahrirlagan matn; bo'lmasa quyidagi standart matn qoladi.
  const [paragraflar, setParagraflar] = useState<string[] | null>(null)

  useEffect(() => {
    supabase
      .from('sayt_kontenti')
      .select('qiymat')
      .eq('kalit', 'biz_haqimizda')
      .maybeSingle()
      .then(({ data }) => {
        const p = (data?.qiymat as { paragraflar?: string[] } | null)?.paragraflar
        if (p?.length) setParagraflar(p)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (paragraflar) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
        <Header backHref="/student/profil" backLabel="Profil" />
        <div className="mx-auto max-w-[600px] px-5 py-8 sm:px-8">
          <h2 style={{ margin: '0 0 16px', fontSize: '22px', fontWeight: 800 }}>ℹ️ Biz haqimizda</h2>
          <div className="rise" style={{
            background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '24px',
            color: 'var(--ink-soft)', fontSize: '14px', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '14px',
          }}>
            {paragraflar.map((p, i) => (
              <p key={i} style={{ margin: 0, whiteSpace: 'pre-line' }}>{p}</p>
            ))}
            <p style={{ margin: 0 }}>
              Savol va takliflar uchun: <a href="https://t.me/urolog_arabboyev" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>@urolog_arabboyev</a>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/student/profil" backLabel="Profil" />
      <div className="mx-auto max-w-[600px] px-5 py-8 sm:px-8">
        <h2 style={{ margin: '0 0 16px', fontSize: '22px', fontWeight: 800 }}>ℹ️ Biz haqimizda</h2>
        <div className="rise" style={{
          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '24px',
          color: 'var(--ink-soft)', fontSize: '14px', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '14px',
        }}>
          <p style={{ margin: 0 }}>
            <strong style={{ color: 'var(--ink)' }}>Urosfera</strong> — urologiya va andrologiya yo&apos;nalishidagi
            tibbiy ta&apos;lim platformasi. Loyiha shifokor-urolog <strong style={{ color: 'var(--ink)' }}>Dr. Arabboyev
            Muhammadqodir</strong> tomonidan tashkil etilgan.
          </p>
          <p style={{ margin: 0 }}>
            Platforma uch yo&apos;nalishga xizmat qiladi: <strong style={{ color: 'var(--ink)' }}>talabalar</strong> uchun
            bosqichma-bosqich (EASY/O&apos;RTA/QIYIN) tuzilgan darslar, klinik testlar va USMLE uslubidagi savollar;
            <strong style={{ color: 'var(--ink)' }}> shifokorlar</strong> uchun bemorlarni kuzatish va protokollar;
            <strong style={{ color: 'var(--ink)' }}> bemorlar</strong> uchun davolanish jarayonini kuzatish va shifokor
            bilan aloqa.
          </p>
          <p style={{ margin: 0 }}>
            Ta&apos;lim tarkibi xalqaro qo&apos;llanmalar — <strong style={{ color: 'var(--ink)' }}>Campbell-Walsh-Wein
            Urology</strong>, <strong style={{ color: 'var(--ink)' }}>EAU</strong> va <strong style={{ color: 'var(--ink)' }}>AUA</strong>{' '}
            tavsiyalariga asoslanib tayyorlanadi va muntazam yangilanib boriladi.
          </p>
          <p style={{ margin: 0 }}>
            Savol va takliflar uchun: <a href="https://t.me/urolog_arabboyev" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>@urolog_arabboyev</a>
          </p>
        </div>
      </div>
    </div>
  )
}
