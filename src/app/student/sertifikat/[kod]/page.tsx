import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabaseServer'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { bosqichNomi } from '@/lib/talim/sertifikat'
import { qrDataUrl, tekshirishUrl } from '@/lib/talim/sertifikatQr'
import { type SertifikatMalumoti } from '@/components/sertifikat/SertifikatVaraq'
import { SertifikatAmallar } from '@/components/sertifikat/SertifikatAmallar'
import type { Bosqich } from '@/lib/talim/darslar'

// Talabaning o'z sertifikati: ko'rish, PDF chop etish va ulashish rasmini yuklab olish.
export const dynamic = 'force-dynamic'

export default async function SertifikatSahifasi({ params }: { params: Promise<{ kod: string }> }) {
  const { kod } = await params

  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) notFound()

  const admin = createAdminClient()
  const { data: sert } = await admin
    .from('sertifikatlar')
    .select('*')
    .eq('kod', kod.toUpperCase())
    .maybeSingle()

  // Boshqaning sertifikatini bu sahifadan ochib bo'lmaydi — ommaviy ko'rinish
  // uchun /sertifikat/[kod] tekshirish sahifasi bor.
  if (!sert || sert.student_id !== user.id) notFound()

  const malumot: SertifikatMalumoti = {
    kod: sert.kod,
    ism: sert.ism,
    turi: sert.turi,
    bosqichNomi: bosqichNomi(sert.bosqich as Bosqich),
    kategoriya: sert.kategoriya,
    foiz: sert.foiz != null ? Math.round(Number(sert.foiz)) : null,
    darsSoni: sert.dars_soni,
    sana: sert.created_at,
    qrDataUrl: await qrDataUrl(sert.kod),
    tekshirishUrl: tekshirishUrl(sert.kod),
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <div className="sert-yashir-chop" style={{ maxWidth: '1180px', margin: '0 auto', padding: '20px 20px 0' }}>
        <Link href="/student/profil/sertifikatlar" style={{ fontSize: '13px', color: 'var(--muted)', textDecoration: 'none', fontWeight: 600 }}>
          ← Sertifikatlarim
        </Link>
      </div>

      {sert.bekor_qilingan && (
        <div className="sert-yashir-chop" style={{
          maxWidth: '1180px', margin: '14px auto 0', padding: '14px 18px',
          background: 'rgba(220,38,38,.1)', border: '1px solid var(--danger)',
          borderRadius: '12px', color: 'var(--danger)', fontSize: '13.5px', fontWeight: 600,
        }}>
          Bu sertifikat bekor qilingan{sert.bekor_sababi ? `: ${sert.bekor_sababi}` : '.'}
        </div>
      )}

      <SertifikatAmallar s={malumot} />
    </div>
  )
}
