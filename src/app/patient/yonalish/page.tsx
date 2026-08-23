'use client'

// Bemor yo'naltirish — jinsga qarab BIRINCHI tavsiya, lekin ikkala bo'lim ham ochiq.
// "Ayol ham urologga muhtoj" muammosining yechimi: muqobil doim ochiq.

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Info } from 'lucide-react'

export default function BemorYonaltirish() {
  const router = useRouter()
  const supabase = createClient()
  const [jins, setJins] = useState<'ayol' | 'erkak'>('ayol')

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('jins').eq('id', user.id).single()
      if (data?.jins === 'erkak') setJins('erkak')
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Tanlovni saqlab (yo'nalish) dashboardga o'tamiz — gate bir martalik bo'ladi.
  async function tanla(yonalish: 'urologiya' | 'ginekologiya') {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) await supabase.from('profiles').update({ yonalish }).eq('id', user.id)
    router.push('/patient/dashboard')
  }

  // Jinsga qarab tavsiya: asosiy karta almashadi, muqobil doim ochiq.
  const asosiy = jins === 'ayol'
    ? { harf: 'G', nom: 'Ayollar salomatligi', tavsif: 'Ginekologik shikoyatlar, homiladorlik, ayollar salomatligi.', c: 'var(--gyn)', soft: 'var(--gyn-soft)', yon: 'ginekologiya' as const, tugma: 'Davom etish' }
    : { harf: 'U', nom: 'Erkaklar salomatligi', tavsif: 'Siydik-tanosil tizimi, andrologiya, prostata, erkaklar salomatligi.', c: 'var(--accent)', soft: 'var(--accent-soft)', yon: 'urologiya' as const, tugma: 'Davom etish' }

  const muqobil = jins === 'ayol'
    ? { harf: 'U', nom: 'Siydik / buyrak muammosi', ost: 'Urologiya', tavsif: 'Tez-tez siyish, og’riq, tosh, siydik tutolmaslik — ayollarda ham keng tarqalgan.', c: 'var(--accent)', soft: 'var(--accent-soft)', yon: 'urologiya' as const, link: 'Bu bo’limga o’tish' }
    : { harf: 'G', nom: 'Ayollar salomatligi', ost: 'Ginekologiya', tavsif: 'Oiladagi ayol a’zolar uchun ham murojaat ochishingiz mumkin.', c: 'var(--gyn)', soft: 'var(--gyn-soft)', yon: 'ginekologiya' as const, link: 'Bu bo’limga o’tish' }

  const jinsLabel = jins === 'ayol' ? 'Ayol' : 'Erkak'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{
        width: '100%', maxWidth: '440px', background: 'var(--surface)', borderRadius: '18px',
        padding: '26px 22px', border: '1px solid var(--line)', boxShadow: 'var(--shadow)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px', background: asosiy.soft,
            color: asosiy.c, border: `1px solid ${asosiy.c}`, borderRadius: '999px',
            padding: '4px 12px', font: '700 11px var(--font-inter)', marginBottom: '10px',
          }}>{jinsLabel}</span>
          <h1 style={{ fontSize: '20px', margin: '0 0 5px' }}>Sizga mos bo&apos;lim</h1>
          <p style={{ color: 'var(--muted)', margin: 0, font: '400 12.5px var(--font-inter)', lineHeight: 1.5 }}>
            Jinsingizga qarab tavsiya — istagan vaqt o&apos;zgartirasiz
          </p>
        </div>

        {/* Asosiy tavsiya */}
        <button onClick={() => tanla(asosiy.yon)} className="soft-press" style={{
          width: '100%', textAlign: 'left', border: `1.5px solid ${asosiy.c}`, background: asosiy.soft,
          borderRadius: '16px', padding: '16px', marginBottom: '14px', cursor: 'pointer',
          display: 'flex', gap: '13px', alignItems: 'center',
        }}>
          <span style={{ width: '50px', height: '50px', borderRadius: '14px', flexShrink: 0, background: 'var(--surface)', color: asosiy.c, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '800 22px var(--font-inter)' }}>{asosiy.harf}</span>
          <span style={{ minWidth: 0 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <span style={{ fontWeight: 800, fontSize: '16px' }}>{asosiy.nom}</span>
              <span style={{ background: asosiy.c, color: '#fff', font: '700 9px var(--font-inter)', padding: '3px 7px', borderRadius: '999px', letterSpacing: '.03em' }}>TAVSIYA</span>
            </span>
            <span style={{ display: 'block', font: '400 12px var(--font-inter)', color: 'var(--muted)', lineHeight: 1.45 }}>{asosiy.tavsif}</span>
          </span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 4px 14px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--line)' }} />
          <span style={{ font: '600 11px var(--font-inter)', color: 'var(--muted)' }}>yoki boshqa muammo bo&apos;lsa</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--line)' }} />
        </div>

        {/* Muqobil — doim ochiq (yechim) */}
        <button onClick={() => tanla(muqobil.yon)} className="soft-press" style={{
          width: '100%', textAlign: 'left', border: `1.5px solid ${muqobil.c}`, background: 'var(--surface)',
          borderRadius: '16px', padding: '16px', marginBottom: '16px', cursor: 'pointer',
          display: 'flex', gap: '13px', alignItems: 'center',
        }}>
          <span style={{ width: '50px', height: '50px', borderRadius: '14px', flexShrink: 0, background: muqobil.soft, color: muqobil.c, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '800 22px var(--font-inter)' }}>{muqobil.harf}</span>
          <span style={{ minWidth: 0 }}>
            <span style={{ display: 'block', marginBottom: '2px' }}>
              <span style={{ fontWeight: 800, fontSize: '15px' }}>{muqobil.nom}</span>
              <span style={{ font: '600 11px var(--font-inter)', color: 'var(--muted)' }}> · {muqobil.ost}</span>
            </span>
            <span style={{ display: 'block', font: '400 12px var(--font-inter)', color: 'var(--muted)', lineHeight: 1.45 }}>{muqobil.tavsif}</span>
          </span>
        </button>

        <div style={{ display: 'flex', gap: '9px', alignItems: 'flex-start', background: 'var(--surface-2)', borderRadius: '12px', padding: '11px 13px', marginBottom: '16px' }}>
          <Info size={16} strokeWidth={2} style={{ color: 'var(--ink-soft)', flexShrink: 0, marginTop: '1px' }} />
          <p style={{ margin: 0, font: '500 11.5px var(--font-inter)', lineHeight: 1.5, color: 'var(--ink-soft)' }}>
            Har bir bemor <b>ikkala bo&apos;limga ham</b> kira oladi. Jins faqat birinchi tavsiyani beradi —
            hech kim cheklanmaydi.
          </p>
        </div>

        <button onClick={() => tanla(asosiy.yon)} className="btn-animated" style={{
          width: '100%', background: asosiy.c, color: '#fff', border: 'none', borderRadius: '10px',
          padding: '14px', font: '600 15px var(--font-inter)', cursor: 'pointer',
        }}>{asosiy.tugma}</button>
        <button onClick={() => tanla(muqobil.yon)} style={{
          display: 'block', width: '100%', background: 'none', border: 'none', color: 'var(--accent)',
          font: '600 13px var(--font-inter)', cursor: 'pointer', marginTop: '12px', textAlign: 'center',
        }}>{muqobil.link} →</button>
      </div>
    </div>
  )
}
