import type { Metadata } from 'next'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { bosqichNomi } from '@/lib/talim/sertifikat'
import type { Bosqich } from '@/lib/talim/darslar'

// Ochiq tekshirish sahifasi: sertifikatdagi QR va kod shu yerga olib keladi.
// Login talab qilmaydi — ish beruvchi yoki ustoz haqiqiyligini tekshira olishi kerak.
//
// Indekslanmaydi: sahifada shaxs ismi bor, u qidiruv natijalarida chiqmasligi lozim.
// Havolani bilgan odam ko'ra oladi, Google esa ro'yxatga olmaydi.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Sertifikatni tekshirish — Urosfera',
  robots: { index: false, follow: false },
}

function sanaFormat(iso: string) {
  return new Date(iso).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function TekshirishSahifasi({ params }: { params: Promise<{ kod: string }> }) {
  const { kod } = await params

  const admin = createAdminClient()
  const { data: sert } = await admin
    .from('sertifikatlar')
    // Faqat tekshirish uchun zarur maydonlar — student_id kabi ichki ma'lumot chiqmaydi
    .select('kod, ism, turi, bosqich, kategoriya, foiz, dars_soni, created_at, bekor_qilingan, bekor_sababi')
    .eq('kod', kod.toUpperCase())
    .maybeSingle()

  const holat: 'haqiqiy' | 'bekor' | 'topilmadi' =
    !sert ? 'topilmadi' : sert.bekor_qilingan ? 'bekor' : 'haqiqiy'

  const rang = holat === 'haqiqiy' ? '#16a34a' : holat === 'bekor' ? '#dc2626' : '#64748b'
  const belgi = holat === 'haqiqiy' ? '✓' : holat === 'bekor' ? '✕' : '?'
  const sarlavha =
    holat === 'haqiqiy' ? 'Sertifikat haqiqiy'
    : holat === 'bekor' ? 'Sertifikat bekor qilingan'
    : 'Sertifikat topilmadi'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '40px 20px 60px' }}>

        <div style={{ textAlign: 'center', marginBottom: '26px' }}>
          <div style={{
            width: '68px', height: '68px', borderRadius: '50%', margin: '0 auto 14px',
            background: rang, color: 'white', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '34px', fontWeight: 800,
          }}>
            {belgi}
          </div>
          <h1 style={{ fontSize: '23px', margin: '0 0 6px' }}>{sarlavha}</h1>
          <p style={{ fontSize: '13.5px', color: 'var(--muted)', margin: 0 }}>
            Urosfera sertifikatlar reyestri
          </p>
        </div>

        {sert ? (
          <div style={{
            background: 'var(--surface)', border: `1px solid ${holat === 'haqiqiy' ? rang : 'var(--line)'}`,
            borderRadius: '16px', overflow: 'hidden',
          }}>
            <div style={{ height: '4px', background: rang }} />
            <div style={{ padding: '22px' }}>
              <Qator nom="Ism-familiya" qiymat={sert.ism} asosiy />
              <Qator
                nom="Hujjat turi"
                qiymat={sert.turi === 'bosqich' ? 'Bosqich sertifikati' : 'Bob nishoni'}
              />
              <Qator nom="Bosqich" qiymat={bosqichNomi(sert.bosqich as Bosqich)} />
              {sert.kategoriya && <Qator nom="Bo'lim" qiymat={sert.kategoriya} />}
              <Qator nom="Darslar soni" qiymat={`${sert.dars_soni} ta`} />
              {sert.foiz != null && Number(sert.foiz) > 0 && (
                <Qator nom="O'rtacha natija" qiymat={`${Math.round(Number(sert.foiz))}%`} />
              )}
              <Qator nom="Berilgan sana" qiymat={sanaFormat(sert.created_at)} />
              <Qator nom="Sertifikat kodi" qiymat={sert.kod} />
              {sert.bekor_qilingan && sert.bekor_sababi && (
                <Qator nom="Bekor qilish sababi" qiymat={sert.bekor_sababi} />
              )}
            </div>
          </div>
        ) : (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--line)',
            borderRadius: '16px', padding: '26px', textAlign: 'center',
          }}>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.7 }}>
              <strong>{kod.toUpperCase()}</strong> kodi bo&apos;yicha sertifikat topilmadi.
              Kodni tekshirib qayta kiriting — u <code>URS-XXXX-XXXX</code> ko&apos;rinishida bo&apos;ladi.
            </p>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '26px' }}>
          <Link href="/darslar" style={{ fontSize: '13.5px', color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>
            Urosfera darslari bilan tanishing →
          </Link>
        </div>
      </div>
    </div>
  )
}

function Qator({ nom, qiymat, asosiy }: { nom: string; qiymat: string; asosiy?: boolean }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', gap: '14px',
      padding: '10px 0', borderBottom: '1px solid var(--line)',
    }}>
      <span style={{ fontSize: '12.5px', color: 'var(--muted)', flexShrink: 0 }}>{nom}</span>
      <span style={{
        fontSize: asosiy ? '15px' : '13px', fontWeight: asosiy ? 800 : 600,
        textAlign: 'right', color: 'var(--ink)',
      }}>
        {qiymat}
      </span>
    </div>
  )
}
