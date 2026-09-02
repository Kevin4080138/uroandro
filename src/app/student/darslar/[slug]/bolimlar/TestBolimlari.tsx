'use client'

// Test bo'limlari — hammasi TestBlok dvigateli ustida quriladi.
// amaliy: bankdan tasodifiy, izohli, cheksiz urinish.
// usmle:  klinik vinyetka, izohli, cheksiz urinish.
// nazorat: yopiq, vaqtli, bir marta, qattiq rejim (sertifikatga bog'liq).

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { shuffleVaTanla, variantlarniAralashtir, type TestSavoli, type UsmleSavoli } from '@/lib/talim/darslar'
import { UrosferaLoaderMini } from '@/components/UrosferaLoader'
import { type TestNatija } from './types'
import { TestBlok } from './TestBlok'
import { BoshUlash } from './BoshUlash'

// Natija saqlanmaganda test tepasida ko'rinadigan ogohlantirish.
function SaqlashXatosi({ matn }: { matn: string }) {
  return (
    <p role="alert" style={{
      margin: '0 0 14px', fontSize: '12.5px', fontWeight: 600, color: 'var(--danger)',
      background: 'color-mix(in srgb, var(--danger) 10%, transparent)',
      border: '1px solid var(--danger)', borderRadius: '10px', padding: '10px 14px', lineHeight: 1.5,
    }}>
      {matn}
    </p>
  )
}

export function AmaliyTestBolimi({ darsSlug, darsNomi, bank, savolSoni = 20 }: { darsSlug: string; darsNomi: string; bank: TestSavoli[]; savolSoni?: number }) {
  const supabase = createClient()
  const [saqlashXato, setSaqlashXato] = useState<string | null>(null)
  const savollar = useMemo(
    () => shuffleVaTanla(bank, Math.min(savolSoni, bank.length)).map(variantlarniAralashtir),
    [bank, savolSoni]
  )

  const saqla = async ({ togriSon, jami }: TestNatija) => {
    setSaqlashXato(null)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('talim_natijalari').insert({
      student_id: user.id, dars_slug: darsSlug, dars_nomi: darsNomi,
      togri_son: togriSon, jami_savol: jami, foiz: Math.round((togriSon / jami) * 100), turi: 'amaliy',
    })
    if (error) setSaqlashXato("Natija saqlanmadi — internetni tekshiring. Bu urinish hisobga olinmagan bo'lishi mumkin.")
  }

  if (savollar.length === 0) return <BoshUlash matn="Savollar yuklanmoqda..." />

  return (
    <>
      {saqlashXato && <SaqlashXatosi matn={saqlashXato} />}
      <TestBlok
        key={savollar.map((s) => s.savol).join('|')}
        savollar={savollar}
        izohKorsat
        qaytaUrinishKorinsin
        boshlashSarlavha={<>Bankdan tasodifiy <strong>{savollar.length} ta</strong> savol tanlandi. Xohlagancha qayta urinishingiz mumkin.</>}
        boshlashTugma="Testni boshlash →"
        onTopshirish={saqla}
      />
    </>
  )
}

export function UsmleTestBolimi({ darsSlug, darsNomi, bank }: { darsSlug: string; darsNomi: string; bank: UsmleSavoli[] }) {
  const supabase = createClient()
  const [saqlashXato, setSaqlashXato] = useState<string | null>(null)
  const savollar = useMemo(
    () => shuffleVaTanla(bank, Math.min(5, bank.length)).map(variantlarniAralashtir),
    [bank]
  )

  const saqla = async ({ togriSon, jami }: TestNatija) => {
    setSaqlashXato(null)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('talim_natijalari').insert({
      student_id: user.id, dars_slug: darsSlug, dars_nomi: darsNomi,
      togri_son: togriSon, jami_savol: jami, foiz: Math.round((togriSon / jami) * 100), turi: 'usmle',
    })
    if (error) setSaqlashXato("Natija saqlanmadi — internetni tekshiring. Bu urinish hisobga olinmagan bo'lishi mumkin.")
  }

  if (savollar.length === 0) return <BoshUlash matn="Savollar yuklanmoqda..." />

  return (
    <>
      {saqlashXato && <SaqlashXatosi matn={saqlashXato} />}
      <TestBlok
        key={savollar.map((s) => s.savol).join('|')}
        savollar={savollar}
        izohKorsat
        qaytaUrinishKorinsin
        boshlashSarlavha={<>USMLE uslubidagi bankdan tasodifiy <strong>{savollar.length} ta</strong> klinik vinyetka savoli tanlandi. Xohlagancha qayta urinishingiz mumkin.</>}
        boshlashTugma="USMLE testni boshlash →"
        onTopshirish={saqla}
      />
    </>
  )
}

export function NazoratTestBolimi({
  darsSlug, darsNomi, bank, savolSoni, vaqtDaqiqa, otishFoizi,
}: {
  darsSlug: string; darsNomi: string; bank: TestSavoli[]; savolSoni: number; vaqtDaqiqa: number; otishFoizi: number
}) {
  const supabase = createClient()
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [avvalgiNatija, setAvvalgiNatija] = useState<{ togri_son: number; jami_savol: number; foiz: number; created_at: string } | null>(null)
  const [savollar, setSavollar] = useState<TestSavoli[]>([])
  const [yakunlandi, setYakunlandi] = useState<TestNatija | null>(null)
  const [saqlashXato, setSaqlashXato] = useState<string | null>(null)

  useEffect(() => {
    const tekshir = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setYuklanmoqda(false); return }
      const { data } = await supabase
        .from('talim_natijalari')
        .select('togri_son, jami_savol, foiz, created_at')
        .eq('student_id', user.id)
        .eq('dars_slug', darsSlug)
        .eq('turi', 'nazorat')
        .maybeSingle()
      setAvvalgiNatija(data ?? null)
      setSavollar(shuffleVaTanla(bank, Math.min(savolSoni, bank.length)).map(variantlarniAralashtir))
      setYuklanmoqda(false)
    }
    tekshir()
  }, [darsSlug, bank, savolSoni, supabase])

  const saqla = async ({ togriSon, jami }: TestNatija) => {
    setYakunlandi({ togriSon, jami })
    setSaqlashXato(null)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaqlashXato('Tizimga kirilmagan — natija saqlanmadi.'); return }
    const { error } = await supabase.from('talim_natijalari').insert({
      student_id: user.id, dars_slug: darsSlug, dars_nomi: darsNomi,
      togri_son: togriSon, jami_savol: jami, foiz: Math.round((togriSon / jami) * 100), turi: 'nazorat',
    })
    // Nazorat natijasi sertifikatga bog'liq — saqlanmasa albatta bildiramiz.
    if (error) setSaqlashXato("⚠️ Natija saqlanmadi! Internetni tekshirib, admin/shifokorga murojaat qiling — aks holda sertifikat hisobga olinmaydi.")
  }

  if (yuklanmoqda) return <UrosferaLoaderMini />
  if (bank.length === 0) return <BoshUlash matn="Nazorat testi savollari tez orada qo'shiladi." />

  if (avvalgiNatija) {
    const otdi = avvalgiNatija.foiz >= otishFoizi
    return (
      <div className="rise" style={{
        background: 'var(--surface)', border: `2px solid ${otdi ? '#16a34a' : '#dc2626'}33`, borderRadius: '16px',
        padding: '26px', textAlign: 'center',
      }}>
        <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>
          Siz bu nazorat testini allaqachon topshirgansiz
        </div>
        <div style={{ fontSize: '36px', fontWeight: 800, margin: '8px 0', color: otdi ? '#16a34a' : '#dc2626' }}>
          {avvalgiNatija.togri_son} / {avvalgiNatija.jami_savol} ({avvalgiNatija.foiz}%)
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-soft)' }}>
          {new Date(avvalgiNatija.created_at).toLocaleString('uz-UZ')}
        </p>
        <p style={{ margin: '14px 0 0', fontSize: '13.5px', fontWeight: 700, color: otdi ? '#16a34a' : '#dc2626' }}>
          {otdi ? `✓ Sertifikat olish chegarasi (${otishFoizi}%) bajarildi.` : `Sertifikat chegarasi (${otishFoizi}%) bajarilmadi.`}
        </p>
      </div>
    )
  }

  if (yakunlandi) {
    const foiz = Math.round((yakunlandi.togriSon / yakunlandi.jami) * 100)
    const otdi = foiz >= otishFoizi
    return (
      <div className="rise" style={{
        background: 'var(--surface)', border: `2px solid ${otdi ? '#16a34a' : '#dc2626'}33`, borderRadius: '16px',
        padding: '26px', textAlign: 'center',
      }}>
        <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>Yakuniy natija</div>
        <div style={{ fontSize: '40px', fontWeight: 800, margin: '8px 0', color: otdi ? '#16a34a' : '#dc2626' }}>
          {yakunlandi.togriSon} / {yakunlandi.jami} ({foiz}%)
        </div>
        <p style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: otdi ? '#16a34a' : '#dc2626' }}>
          {otdi ? `🏅 Tabriklaymiz! Sertifikat olish huquqiga ega bo'ldingiz.` : `Sertifikat chegarasi (${otishFoizi}%) bajarilmadi — qaytadan urinish admin/shifokor orqali rasmiylashtiriladi.`}
        </p>
        {saqlashXato && (
          <p role="alert" style={{ margin: '14px 0 0', fontSize: '12.5px', fontWeight: 700, color: 'var(--danger)', lineHeight: 1.5 }}>
            {saqlashXato}
          </p>
        )}
      </div>
    )
  }

  return (
    <TestBlok
      savollar={savollar}
      izohKorsat={false}
      vaqtDaqiqa={vaqtDaqiqa}
      qaytaUrinishKorinsin={false}
      qattiqRejim
      boshlashSarlavha={
        <>
          Bu — <strong>yakkama-yakka, yopiq</strong> nazorat testi: <strong>{savollar.length} savol</strong>,{' '}
          <strong>{vaqtDaqiqa} daqiqa</strong>, hech qanday materialdan foydalanish mumkin emas, javoblar darhol
          ko&apos;rsatilmaydi va faqat <strong>bitta marta</strong> urinish huquqi beriladi. {otishFoizi}% va undan
          yuqori natija sertifikat olish huquqini beradi.
          <br /><br />
          🖥️ Test boshlanganda <strong>to&apos;liq ekran (fullscreen)</strong> rejimi yoqiladi. Boshqa tab/oynaga
          o&apos;tsangiz yoki fullscreendan chiqsangiz — <strong>1-marta ogohlantirilasiz</strong>, qaytarilsa{' '}
          <strong>test avtomatik yakunlanadi</strong>.
        </>
      }
      boshlashTugma="Nazorat testini boshlash"
      onTopshirish={saqla}
    />
  )
}
