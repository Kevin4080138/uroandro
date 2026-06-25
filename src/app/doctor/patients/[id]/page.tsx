'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AppShell } from '@/components/AppShell'
import { IconButton } from '@/components/IconButton'
import { createClient } from '@/lib/supabase'
import { tavsiyaBerish } from '@/lib/tavsiya'
import { shikoyatToifalari } from '@/lib/shikoyatlar'
import { tekshiruvTavsiyalari } from '@/lib/tekshiruvlar'
import { tekshiruvBoyichaMaydonlar, asosiyMaydonKalitlari, type Maydon } from '@/lib/natijaMaydonlari'
import { HoverVariantInput } from '@/components/HoverVariantInput'
import { DORI_NOMLARI, DOZA_VARIANTLARI, KUNIGA_MARTA_VARIANTLARI, MUDDAT_KUN_VARIANTLARI, IZOH_VARIANTLARI } from '@/lib/doriVariantlari'
import { bemorHisobiniTop } from '@/lib/telefonMos'

const inputStyle = {
  width: '100%',
  background: 'var(--surface-2)',
  color: 'var(--ink)',
  border: '1px solid var(--line)',
  borderRadius: '10px',
  padding: '10px 14px',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box' as const,
}

const labelStyle = { color: 'var(--ink-soft)', fontSize: '13px', display: 'block', marginBottom: '6px' }

const holatLabel: Record<string, { text: string; color: string }> = {
  yangi: { text: "Shikoyat qabul qilindi", color: 'var(--warn)' },
  tekshiruv_buyurildi: { text: 'Tekshiruv buyurildi', color: 'var(--warn)' },
  natija_kiritildi: { text: 'Tekshiruv natijasi kiritildi', color: 'var(--accent)' },
  yakunlandi: { text: 'Tavsiya varaqasi yakunlandi', color: 'var(--good)' },
}

const emptyYangiForm = { shikoyat: '', anamnez: '', ogriq: "yo'q", oldin_operatsiya: "yo'q", tekshiruvlar: '' }

function kalkulyatorHavolasi(bemor: any, t: any) {
  const gradeMap: Record<string, string> = { I: '1', II: '2', III: '3' }
  const latMap: Record<string, string> = { chap: 'left', "o'ng": 'right', 'ikki tomonlama': 'bilateral' }
  const params = new URLSearchParams({
    fio: bemor?.fio ?? '',
    telefon: bemor?.telefon ?? '',
    grade: gradeMap[t.daraja] ?? '3',
    lat: latMap[t.tomon] ?? 'left',
    recur: t.oldin_operatsiya === 'ha' ? '1' : '0',
    reflux: t.reflux === 'bor' ? '1' : '0',
    venaDiametri: String(t.vena_diametri ?? ''),
    spermKonts: String(t.sperm_konts ?? ''),
    spermHarakat: String(t.sperm_harakat ?? ''),
    indic: t.ogriq === 'bor' ? 'pain' : 'infertility',
  })
  return `/doctor/calculators/varikotsele/klinik-qaror?${params.toString()}`
}

export default function PatientCardPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = createClient()

  const [bemor, setBemor] = useState<any>(null)
  const [tashriflar, setTashriflar] = useState<any[]>([])
  const [kalkulyatorNatijalari, setKalkulyatorNatijalari] = useState<any[]>([])
  const [kalkulyatorMenyu, setKalkulyatorMenyu] = useState(false)
  const [loading, setLoading] = useState(true)

  const [showYangiForm, setShowYangiForm] = useState(false)
  const [editingYangiId, setEditingYangiId] = useState<string | null>(null)
  const [yangiForm, setYangiForm] = useState(emptyYangiForm)
  const [tanlanganOrganlar, setTanlanganOrganlar] = useState<string[]>([])

  const [natijaTashrif, setNatijaTashrif] = useState<any>(null)
  const [natijaForm, setNatijaForm] = useState<Record<string, string>>({})
  const [natija, setNatija] = useState<{ tavsiya: string; sabab: string } | null>(null)

  const [yakunlashTashrifId, setYakunlashTashrifId] = useState<string | null>(null)
  const [doriMuolaja, setDoriMuolaja] = useState('')
  const [dorilarRoyxati, setDorilarRoyxati] = useState<{ nomi: string; dozasi: string; kuniga_marta: number; muddat_kun: number; boshlanish_sanasi: string; izoh: string }[]>([])

  const [showRetsept, setShowRetsept] = useState(false)
  const [bemorRetseptlari, setBemorRetseptlari] = useState<any[]>([])
  const [yangiRetseptlar, setYangiRetseptlar] = useState<{ nomi: string; dozasi: string; kuniga_marta: number; muddat_kun: number; boshlanish_sanasi: string; izoh: string }[]>([])
  const [retseptSaving, setRetseptSaving] = useState(false)

  const [saving, setSaving] = useState(false)

  const load = async () => {
    const { data: bemorData } = await supabase.from('bemorlar').select('*').eq('id', id).single()
    setBemor(bemorData)

    const { data: { user } } = await supabase.auth.getUser()
    const { data: tashriflarData } = await supabase
      .from('tashriflar')
      .select('*')
      .eq('bemor_id', id)
      .eq('doctor_id', user?.id)
      .order('sana', { ascending: false })
    setTashriflar(tashriflarData ?? [])

    const { data: kalkData } = await supabase
      .from('kalkulyator_natijalari')
      .select('*')
      .eq('bemor_id', id)
      .order('created_at', { ascending: false })
    setKalkulyatorNatijalari(kalkData ?? [])

    const { data: retseptData } = await supabase
      .from('dori_retseptlari')
      .select('*')
      .eq('bemor_id', id)
      .order('created_at', { ascending: false })
    setBemorRetseptlari(retseptData ?? [])

    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  const setY = (key: string) => (e: any) => setYangiForm((f) => ({ ...f, [key]: e.target.value }))

  const formatShikoyat = (royxat: string[]) =>
    royxat
      .map((s, i) => (i === 0 ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s.toLowerCase()))
      .join(', ')

  const qoshShikoyat = (matn: string) => {
    setYangiForm((f) => {
      const mavjud = f.shikoyat.split(',').map((s) => s.trim()).filter(Boolean)
      const past = mavjud.map((s) => s.toLowerCase())
      if (past.includes(matn.toLowerCase())) return f
      return { ...f, shikoyat: formatShikoyat([...mavjud, matn]) }
    })
  }

  const toggleOrgan = (nom: string) => {
    setTanlanganOrganlar((prev) =>
      prev.includes(nom) ? prev.filter((o) => o !== nom) : [...prev, nom]
    )
  }

  const qoshTekshiruv = (matn: string) => {
    setYangiForm((f) => {
      const mavjud = f.tekshiruvlar.split(',').map((s) => s.trim()).filter(Boolean)
      if (mavjud.includes(matn)) return f
      return { ...f, tekshiruvlar: [...mavjud, matn].join(', ') }
    })
  }

  const kalkulyatorNatijasiniOchir = async (natijaId: string) => {
    await supabase.from('kalkulyator_natijalari').delete().eq('id', natijaId)
    setKalkulyatorNatijalari((arr) => arr.filter((n) => n.id !== natijaId))
  }

  const openYangiForm = (t?: any) => {
    if (t) {
      setEditingYangiId(t.id)
      setYangiForm({
        shikoyat: t.shikoyat || '', anamnez: t.anamnez || '',
        ogriq: t.ogriq || "yo'q", oldin_operatsiya: t.oldin_operatsiya || "yo'q",
        tekshiruvlar: t.buyurilgan_tekshiruvlar || '',
      })
      setTanlanganOrganlar((t.organlar || '').split(',').map((s: string) => s.trim()).filter(Boolean))
    } else {
      setEditingYangiId(null)
      setYangiForm(emptyYangiForm)
      setTanlanganOrganlar([])
    }
    setShowYangiForm(true)
  }

  const handleYangiSave = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    setSaving(true)
    const payload = {
      shikoyat: yangiForm.shikoyat,
      anamnez: yangiForm.anamnez,
      ogriq: yangiForm.ogriq,
      oldin_operatsiya: yangiForm.oldin_operatsiya,
      organlar: tanlanganOrganlar.join(', '),
      buyurilgan_tekshiruvlar: yangiForm.tekshiruvlar,
    }

    const { error } = editingYangiId
      ? await supabase.from('tashriflar').update(payload).eq('id', editingYangiId)
      : await supabase.from('tashriflar').insert({
          bemor_id: id, doctor_id: user.id, fio: bemor.fio, holat: 'tekshiruv_buyurildi', ...payload,
        })
    setSaving(false)

    if (!error) {
      setYangiForm(emptyYangiForm)
      setTanlanganOrganlar([])
      setEditingYangiId(null)
      setShowYangiForm(false)
      load()
    }
  }

  const openNatijaForm = (t: any) => {
    setNatijaTashrif(t)
    setNatija(null)
    const boshlangich: Record<string, string> = {}
    const json = t.natija_json || {}
    for (const key of asosiyMaydonKalitlari) {
      if (t[key] !== null && t[key] !== undefined) boshlangich[key] = String(t[key])
    }
    for (const key of Object.keys(json)) {
      boshlangich[key] = String(json[key])
    }
    setNatijaForm(boshlangich)
  }

  const setNatijaQiymat = (key: string) => (e: any) => setNatijaForm((f) => ({ ...f, [key]: e.target.value }))

  const guruhlanganMaydonlar = natijaTashrif
    ? tekshiruvBoyichaMaydonlar(natijaTashrif.buyurilgan_tekshiruvlar || '')
    : []

  const handleNatijaSave = async () => {
    if (!natijaTashrif) return

    const asosiy: Record<string, any> = {}
    const qoshimcha: Record<string, any> = {}
    for (const [key, value] of Object.entries(natijaForm)) {
      if (value === '' || value === undefined) continue
      if (asosiyMaydonKalitlari.includes(key)) {
        asosiy[key] = ['vena_diametri', 'sperm_konts', 'sperm_harakat', 'sperm_morf', 'testosteron', 'fsh', 'lh'].includes(key)
          ? Number(value) : value
      } else {
        qoshimcha[key] = value
      }
    }

    let tavsiya: string | null = null
    let sabab = ''
    if (asosiy.daraja && asosiy.tomon) {
      const natijaHisob = tavsiyaBerish(
        asosiy.daraja, asosiy.tomon, natijaTashrif.ogriq || "yo'q", natijaTashrif.oldin_operatsiya || "yo'q",
        Number(asosiy.sperm_konts) || 0, Number(asosiy.sperm_harakat) || 0
      )
      tavsiya = natijaHisob.tavsiya
      sabab = natijaHisob.sabab
    }

    setSaving(true)
    const yakunlanganmi = natijaTashrif.holat === 'yakunlandi'
    const { error } = await supabase.from('tashriflar').update({
      ...asosiy,
      natija_json: qoshimcha,
      tavsiya,
      holat: yakunlanganmi ? 'yakunlandi' : 'natija_kiritildi',
    }).eq('id', natijaTashrif.id)
    setSaving(false)

    if (!error) {
      if (tavsiya) setNatija({ tavsiya, sabab })
      load()
    }
  }

  const openYakunlash = (tashrifId: string, mavjudDori: string) => {
    setYakunlashTashrifId(tashrifId)
    setDoriMuolaja(mavjudDori || '')
    setDorilarRoyxati([])
  }

  const bugunSana = () => new Date().toISOString().slice(0, 10)
  const sanaQoshish = (sana: string, kun: number) => {
    const d = new Date(sana)
    d.setDate(d.getDate() + kun - 1)
    return d.toISOString().slice(0, 10)
  }

  const doriQoshish = () => setDorilarRoyxati((arr) => [...arr, { nomi: '', dozasi: '', kuniga_marta: 1, muddat_kun: 7, boshlanish_sanasi: bugunSana(), izoh: '' }])
  const doriOchirish = (i: number) => setDorilarRoyxati((arr) => arr.filter((_, j) => j !== i))
  const doriYangila = (i: number, key: string, val: any) => setDorilarRoyxati((arr) => arr.map((d, j) => (j === i ? { ...d, [key]: val } : d)))

  const yangiRetseptQoshish = () => setYangiRetseptlar((arr) => [...arr, { nomi: '', dozasi: '', kuniga_marta: 1, muddat_kun: 7, boshlanish_sanasi: bugunSana(), izoh: '' }])
  const yangiRetseptOchirish = (i: number) => setYangiRetseptlar((arr) => arr.filter((_, j) => j !== i))
  const yangiRetseptYangila = (i: number, key: string, val: any) => setYangiRetseptlar((arr) => arr.map((d, j) => (j === i ? { ...d, [key]: val } : d)))

  const retseptlarniSaqla = async () => {
    const haqiqiyDorilar = yangiRetseptlar.filter((d) => d.nomi.trim())
    if (haqiqiyDorilar.length === 0) return
    setRetseptSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setRetseptSaving(false); return }

    const bemorUserId = await bemorHisobiniTop(supabase, bemor?.telefon)

    const { data: qoshilganRetseptlar } = await supabase.from('dori_retseptlari').insert(
      haqiqiyDorilar.map((d) => ({
        tashrif_id: null,
        bemor_id: id,
        bemor_user_id: bemorUserId,
        doctor_id: user.id,
        nomi: d.nomi.trim(),
        dozasi: d.dozasi.trim() || null,
        kuniga_marta: d.kuniga_marta,
        muddat_kun: d.muddat_kun,
        boshlanish_sanasi: d.boshlanish_sanasi || bugunSana(),
        izoh: d.izoh.trim() || null,
      }))
    ).select('id')

    if (qoshilganRetseptlar?.length) {
      fetch('/api/push/yangi-retsept', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ retseptIds: qoshilganRetseptlar.map((r) => r.id) }),
      }).catch(() => {})
    }

    setYangiRetseptlar([])
    setRetseptSaving(false)
    load()
  }

  const retseptniOchirish = async (retseptId: string) => {
    await supabase.from('dori_retseptlari').update({ faol: false }).eq('id', retseptId)
    load()
  }

  const [qaytaBoglashSaving, setQaytaBoglashSaving] = useState(false)
  const hisobniQaytaBoglash = async () => {
    setQaytaBoglashSaving(true)
    const bemorUserId = await bemorHisobiniTop(supabase, bemor?.telefon)
    if (bemorUserId) {
      await supabase.from('dori_retseptlari').update({ bemor_user_id: bemorUserId }).eq('bemor_id', id).is('bemor_user_id', null)
    }
    await load()
    setQaytaBoglashSaving(false)
    alert(bemorUserId ? "Bemor hisobi topildi va retseptlar bog'landi ✓" : "Bu telefon raqami bilan ro'yxatdan o'tgan bemor hisobi topilmadi. Bemor ilovaga telefon raqami orqali ro'yxatdan o'tganini tekshiring.")
  }

  const handleYakunlashSave = async () => {
    if (!yakunlashTashrifId) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('tashriflar').update({
      dori_muolaja: doriMuolaja,
      holat: 'yakunlandi',
    }).eq('id', yakunlashTashrifId)

    // Tuzilgan dori retseptlarini bemorga bog'lab saqlash — telefon raqami bo'yicha bemor hisobini topishga harakat qilamiz.
    const haqiqiyDorilar = dorilarRoyxati.filter((d) => d.nomi.trim())
    if (!error && haqiqiyDorilar.length > 0 && user) {
      const bemorUserId = await bemorHisobiniTop(supabase, bemor?.telefon)

      const { data: qoshilganRetseptlar } = await supabase.from('dori_retseptlari').insert(
        haqiqiyDorilar.map((d) => ({
          tashrif_id: yakunlashTashrifId,
          bemor_id: id,
          bemor_user_id: bemorUserId,
          doctor_id: user.id,
          nomi: d.nomi.trim(),
          dozasi: d.dozasi.trim() || null,
          kuniga_marta: d.kuniga_marta,
          muddat_kun: d.muddat_kun,
          boshlanish_sanasi: d.boshlanish_sanasi || bugunSana(),
          izoh: d.izoh.trim() || null,
        }))
      ).select('id')

      if (qoshilganRetseptlar?.length) {
        fetch('/api/push/yangi-retsept', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ retseptIds: qoshilganRetseptlar.map((r) => r.id) }),
        }).catch(() => {})
      }
    }

    setSaving(false)

    if (!error) {
      setYakunlashTashrifId(null)
      setDoriMuolaja('')
      setDorilarRoyxati([])
      load()
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--ink)' }}>Yuklanmoqda...</p>
    </div>
  )

  if (!bemor) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--ink)' }}>Bemor topilmadi.</p>
    </div>
  )

  const orqagaTugmasi = (
    <button
      onClick={() => router.push('/doctor/patients')}
      className="btn-animated soft-press"
      style={{
        background: 'var(--surface-2)', color: 'var(--ink-soft)', border: '1px solid var(--line)', borderRadius: '999px',
        padding: '8px 16px', cursor: 'pointer', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px',
      }}
    >
      ← Bemorlar
    </button>
  )

  return (
    <AppShell title={bemor.fio} actions={orqagaTugmasi}>
      <div className="mx-auto max-w-[900px] px-4 py-6 sm:px-8 sm:py-7">
        <div className="rise" style={{
          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
          padding: '22px 24px', marginBottom: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: '16px', flexWrap: 'wrap', boxShadow: 'var(--shadow)', position: 'relative', zIndex: 30,
          backgroundImage: 'linear-gradient(135deg, color-mix(in srgb, var(--accent) 6%, var(--surface)), var(--surface))',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
            <span className="avatar" style={{ width: '54px', height: '54px', fontSize: '19px' }}>{bemorBoshHarflar(bemor.fio)}</span>
            <div style={{ minWidth: 0 }}>
              <h2 style={{ margin: '0 0 6px 0', fontSize: '21px', fontWeight: 700 }}>{bemor.fio}</h2>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: '12.5px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {(bemor.passport_seria || bemor.passport_raqam) && <span>🪪 {[bemor.passport_seria, bemor.passport_raqam].filter(Boolean).join(' ')}</span>}
                {bemor.tugilgan_sana && <span>🎂 {bemor.tugilgan_sana}</span>}
                {bemor.telefon && <span>📞 {bemor.telefon}</span>}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => router.push(`/doctor/patients/${id}/hujjatlar`)} className="btn-animated soft-press" style={{
              background: 'var(--surface-2)', color: 'var(--ink-soft)', border: '1px solid var(--line)', borderRadius: '999px',
              padding: '10px 18px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap',
            }}>
              📄 Hujjatlar
            </button>
            <button onClick={() => setShowRetsept((v) => !v)} className="btn-animated soft-press" style={{
              background: showRetsept ? 'var(--accent)' : 'var(--surface-2)', color: showRetsept ? 'white' : 'var(--ink-soft)',
              border: showRetsept ? 'none' : '1px solid var(--line)', borderRadius: '999px',
              padding: '10px 18px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap',
              position: 'relative',
            }}>
              💊 Retsept
              {bemorRetseptlari.filter((r) => r.faol).length > 0 && (
                <span style={{
                  position: 'absolute', top: '-6px', right: '-6px', background: 'var(--danger)', color: 'white',
                  borderRadius: '999px', fontSize: '10px', fontWeight: 800, minWidth: '18px', height: '18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
                }}>
                  {bemorRetseptlari.filter((r) => r.faol).length}
                </span>
              )}
            </button>
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setKalkulyatorMenyu(true)}
              onMouseLeave={() => setKalkulyatorMenyu(false)}
            >
              <button onClick={() => setKalkulyatorMenyu((v) => !v)} className="btn-animated soft-press" style={{
                background: 'var(--surface-2)', color: 'var(--ink-soft)', border: '1px solid var(--line)', borderRadius: '999px',
                padding: '10px 18px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap',
              }}>
                🧮 Kalkulyatorlar
              </button>
              {kalkulyatorMenyu && (
                <>
                  {/* Tugma va dropdown orasidagi bo'shliqni "ko'prik" bilan to'ldirish — hover uzilib qolmasligi uchun */}
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, height: '6px', zIndex: 49 }} />
                  <div className="menyu-ochilish" style={{
                    position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 50, width: '250px', maxWidth: 'calc(100vw - 32px)',
                    background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px',
                    boxShadow: '0 10px 28px rgba(0,0,0,0.15)', overflow: 'hidden',
                    transformOrigin: 'top left', maxHeight: '420px', overflowY: 'auto',
                  }}>
                    {[
                      { guruh: 'Prostata', kalk: [
                        { href: 'ipss', label: 'IPSS / AUA-SS', icon: '📊' },
                        { href: 'psa', label: 'PSA kalkulyatori', icon: '🩸' },
                        { href: 'prostata-hajmi', label: 'Prostata hajmi', icon: '🍈' },
                        { href: 'nih-cpsi', label: 'NIH-CPSI', icon: '🔥' },
                      ] },
                      { guruh: 'Erkak bepushtligi', kalk: [
                        { href: 'spermogramma', label: 'WHO 2021 spermogramma', icon: '🧬' },
                        { href: 'dubin-amelar', label: 'Dubin-Amelar darajasi', icon: '🔬' },
                      ] },
                      { guruh: 'Erektil funksiya', kalk: [
                        { href: 'iief5', label: 'IIEF-5 (SHIM)', icon: '💙' },
                        { href: 'adam', label: 'Testosteron tanqisligi (ADAM)', icon: '🧪' },
                      ] },
                      { guruh: 'Buyrak', kalk: [
                        { href: 'egfr', label: 'eGFR (CKD-EPI)', icon: '🫘' },
                        { href: 'cockcroft-gault', label: 'Kreatinin klirensi', icon: '⚗️' },
                        { href: 'stone', label: 'STONE skori', icon: '🪨' },
                        { href: 'renal', label: 'R.E.N.A.L. nefrometriya', icon: '🗺️' },
                      ] },
                      { guruh: 'Siydik pufagi', kalk: [
                        { href: 'uroflowmetriya', label: 'Uroflowmetriya baholash', icon: '💧' },
                        { href: 'oab-v8', label: 'OAB-V8', icon: '🚻' },
                      ] },
                    ].map((g) => (
                      <div key={g.guruh}>
                        <div style={{
                          fontSize: '10.5px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase',
                          letterSpacing: '.04em', padding: '9px 16px 5px', background: 'var(--surface-2)',
                        }}>
                          {g.guruh}
                        </div>
                        {g.kalk.map((k) => (
                          <button
                            key={k.href}
                            onClick={() => router.push(`/doctor/calculators/${k.href}?bemorId=${id}`)}
                            style={{
                              width: '100%', display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left',
                              background: 'none', border: 'none', padding: '10px 16px', cursor: 'pointer',
                              fontSize: '13.5px', fontWeight: 600, color: 'var(--ink)',
                            }}
                            className="hover-row"
                          >
                            <span>{k.icon}</span>{k.label}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button onClick={() => (showYangiForm ? setShowYangiForm(false) : openYangiForm())} className="soft-press" style={{
              background: showYangiForm ? 'var(--surface-2)' : 'var(--accent)', color: showYangiForm ? 'var(--ink-soft)' : 'white',
              border: showYangiForm ? '1px solid var(--line)' : 'none', borderRadius: '999px',
              padding: '10px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap',
            }}>
              {showYangiForm ? 'Bekor qilish' : '+ Yangi qabul'}
            </button>
          </div>
        </div>

        {/* Dori retsepti paneli */}
        {showRetsept && (
          <div className="rise" style={{
            background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
            padding: '22px 24px', marginBottom: '22px', boxShadow: 'var(--shadow)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{
                width: '36px', height: '36px', borderRadius: '10px', background: 'var(--accent-soft)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0,
              }}>💊</span>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Dori retsepti</h3>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--muted)' }}>Bemor ilovasida &quot;Dorilarim&quot; bo&apos;limida eslatma sifatida ko&apos;rinadi</p>
              </div>
              {bemorRetseptlari.some((r) => r.faol && !r.bemor_user_id) && (
                <button onClick={hisobniQaytaBoglash} disabled={qaytaBoglashSaving} className="soft-press" style={{
                  background: 'var(--warn)', color: 'white', border: 'none', borderRadius: '8px',
                  padding: '7px 13px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
                }}>
                  {qaytaBoglashSaving ? '...' : '🔗 Hisobni qayta tekshirish'}
                </button>
              )}
            </div>

            {/* Faol retseptlar */}
            {bemorRetseptlari.filter((r) => r.faol).length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
                {bemorRetseptlari.filter((r) => r.faol).map((r) => (
                  <div key={r.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px',
                    background: 'var(--surface-2)', borderRadius: '10px', padding: '11px 16px', flexWrap: 'wrap',
                  }}>
                    <div style={{ minWidth: 0 }}>
                      <span style={{ fontSize: '13.5px', fontWeight: 700 }}>{r.nomi}</span>
                      {r.dozasi && <span style={{ fontSize: '12.5px', color: 'var(--ink-soft)' }}> — {r.dozasi}</span>}
                      <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '2px' }}>
                        Kuniga {r.kuniga_marta} marta · {r.muddat_kun} kun
                        {!r.bemor_user_id && <span style={{ color: 'var(--warn)' }}> · ⚠ bemor hisobi topilmadi</span>}
                      </div>
                    </div>
                    <button onClick={() => retseptniOchirish(r.id)} style={{
                      background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: '12px', fontWeight: 600,
                    }}>
                      To&apos;xtatish
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Yangi dori qo'shish */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.03em' }}>Yangi dori qo&apos;shish</span>
              <button onClick={yangiRetseptQoshish} className="soft-press" style={{
                background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--accent)', borderRadius: '8px',
                padding: '6px 14px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer',
              }}>
                + Dori qo&apos;shish
              </button>
            </div>

            {yangiRetseptlar.length === 0 ? (
              <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)' }}>Hali yangi dori qo&apos;shilmagan.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                {yangiRetseptlar.map((d, i) => (
                  <div key={i} style={{
                    background: 'var(--surface-2)', borderRadius: '10px', padding: '12px 14px',
                    display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'flex-end',
                  }}>
                    <div style={{ flex: '2 1 160px' }}>
                      <label style={{ ...labelStyle, fontSize: '11px' }}>Dori nomi</label>
                      <HoverVariantInput value={d.nomi} onChange={(v) => yangiRetseptYangila(i, 'nomi', v)} variantlar={DORI_NOMLARI} placeholder="masalan, Tamsulozin" />
                    </div>
                    <div style={{ flex: '1 1 110px' }}>
                      <label style={{ ...labelStyle, fontSize: '11px' }}>Dozasi</label>
                      <HoverVariantInput value={d.dozasi} onChange={(v) => yangiRetseptYangila(i, 'dozasi', v)} variantlar={DOZA_VARIANTLARI} placeholder="0.4 mg, 1 tab" />
                    </div>
                    <div style={{ flex: '0 1 100px' }}>
                      <label style={{ ...labelStyle, fontSize: '11px' }}>Kuniga marta</label>
                      <HoverVariantInput type="number" value={d.kuniga_marta} onChange={(v) => yangiRetseptYangila(i, 'kuniga_marta', parseInt(v) || 1)} variantlar={KUNIGA_MARTA_VARIANTLARI} />
                    </div>
                    <div style={{ flex: '0 1 100px' }}>
                      <label style={{ ...labelStyle, fontSize: '11px' }}>Necha kun</label>
                      <HoverVariantInput type="number" value={d.muddat_kun} onChange={(v) => yangiRetseptYangila(i, 'muddat_kun', parseInt(v) || 1)} variantlar={MUDDAT_KUN_VARIANTLARI} />
                    </div>
                    <div style={{ flex: '1 1 130px' }}>
                      <label style={{ ...labelStyle, fontSize: '11px' }}>Boshlanish sanasi</label>
                      <input type="date" style={{ ...inputStyle, padding: '8px 10px', fontSize: '13px' }} value={d.boshlanish_sanasi} onChange={(e) => yangiRetseptYangila(i, 'boshlanish_sanasi', e.target.value)} />
                    </div>
                    <div style={{ flex: '2 1 160px' }}>
                      <label style={{ ...labelStyle, fontSize: '11px' }}>Izoh (ixtiyoriy)</label>
                      <HoverVariantInput value={d.izoh} onChange={(v) => yangiRetseptYangila(i, 'izoh', v)} variantlar={IZOH_VARIANTLARI} placeholder="ovqatdan keyin" />
                    </div>
                    <div style={{ flex: '1 1 100%', fontSize: '11.5px', color: 'var(--muted)' }}>
                      📅 {d.boshlanish_sanasi || bugunSana()} — {sanaQoshish(d.boshlanish_sanasi || bugunSana(), d.muddat_kun)} oralig'ida ({d.muddat_kun} kun)
                    </div>
                    <button onClick={() => yangiRetseptOchirish(i)} style={{
                      background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: '15px', padding: '8px',
                    }}>🗑️</button>
                  </div>
                ))}
              </div>
            )}

            {yangiRetseptlar.length > 0 && (
              <button onClick={retseptlarniSaqla} disabled={retseptSaving} className="btn-animated soft-press" style={{
                background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px',
                padding: '11px 22px', cursor: retseptSaving ? 'not-allowed' : 'pointer', fontSize: '13.5px', fontWeight: 700,
                opacity: retseptSaving ? 0.7 : 1,
              }}>
                {retseptSaving ? 'Saqlanmoqda...' : '💾 Retseptni bemorga yuborish'}
              </button>
            )}
          </div>
        )}

        {/* Kalkulyator natijalari tarixi */}
        {kalkulyatorNatijalari.length > 0 && (
          <div className="rise" style={{
            background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
            padding: '18px 20px', marginBottom: '22px',
          }}>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)', fontWeight: 700, margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '7px' }}>
              <span style={{ width: '3px', height: '12px', background: 'var(--accent)', borderRadius: '2px', display: 'inline-block' }} />
              Kalkulyator natijalari
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {kalkulyatorNatijalari.map((n) => (
                <div key={n.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px',
                  background: 'var(--surface-2)', borderRadius: '10px', padding: '10px 14px', flexWrap: 'wrap',
                }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 700 }}>{n.sarlavha}</div>
                    <div style={{ fontSize: '12.5px', color: 'var(--ink-soft)', marginTop: '2px' }}>{n.xulosa}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '3px' }}>{new Date(n.created_at).toLocaleString('uz-UZ')}</div>
                  </div>
                  <button onClick={() => kalkulyatorNatijasiniOchir(n.id)} style={{
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: '14px', flexShrink: 0,
                  }}>🗑️</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 1-bosqich: shikoyat, anamnez, tekshiruv buyurtmasi */}
        {showYangiForm && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ marginTop: 0, fontSize: '15px', color: 'var(--muted)' }}>
              {editingYangiId ? 'Qabulni tahrirlash' : 'Shikoyat va kasallik tarixi'}
            </h3>
            <div>
              <label style={labelStyle}>Shikoyati</label>

              <p style={{ color: 'var(--muted)', fontSize: '12px', margin: '0 0 8px 0' }}>1) Qaysi organ bilan bog&apos;liq?</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                {shikoyatToifalari.map((toifa) => {
                  const tanlangan = tanlanganOrganlar.includes(toifa.nom)
                  return (
                    <button
                      key={toifa.nom}
                      type="button"
                      onClick={() => toggleOrgan(toifa.nom)}
                      style={{
                        background: tanlangan ? 'var(--accent)' : 'var(--surface-2)',
                        color: tanlangan ? 'white' : 'var(--ink-soft)',
                        border: tanlangan ? '1px solid var(--accent)' : '1px solid var(--line)',
                        borderRadius: '20px', padding: '7px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                      }}
                    >
                      {toifa.nom}
                    </button>
                  )
                })}
              </div>

              {tanlanganOrganlar.length > 0 && (
                <>
                  <p style={{ color: 'var(--muted)', fontSize: '12px', margin: '0 0 8px 0' }}>2) Tegishli shikoyatlarni tanlang</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                    {shikoyatToifalari
                      .filter((toifa) => tanlanganOrganlar.includes(toifa.nom))
                      .map((toifa) => (
                        <div key={toifa.nom} style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                          <span style={{ color: 'var(--muted)', fontSize: '12px', marginRight: '2px' }}>{toifa.nom}:</span>
                          {toifa.shikoyatlar.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => qoshShikoyat(s)}
                              style={{
                                background: 'var(--surface-2)', color: 'var(--ink-soft)', border: '1px solid var(--line)',
                                borderRadius: '20px', padding: '5px 12px', cursor: 'pointer', fontSize: '12px',
                              }}
                            >
                              + {s}
                            </button>
                          ))}
                        </div>
                      ))}
                  </div>
                </>
              )}

              <textarea style={{ ...inputStyle, minHeight: '60px' }} value={yangiForm.shikoyat} onChange={setY('shikoyat')} placeholder="Tugmalardan tanlang yoki qo'lda yozing..." />
            </div>
            <div style={{ marginTop: '12px' }}>
              <label style={labelStyle}>Kasallik tarixi (anamnez)</label>
              <textarea style={{ ...inputStyle, minHeight: '60px' }} value={yangiForm.anamnez} onChange={setY('anamnez')} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginTop: '12px' }}>
              <div>
                <label style={labelStyle}>Og&apos;riq / simptom</label>
                <select style={inputStyle} value={yangiForm.ogriq} onChange={setY('ogriq')}>
                  <option value="yo'q">yo&apos;q</option>
                  <option value="bor">bor</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Oldin operatsiya bo&apos;lganmi?</label>
                <select style={inputStyle} value={yangiForm.oldin_operatsiya} onChange={setY('oldin_operatsiya')}>
                  <option value="yo'q">yo&apos;q</option>
                  <option value="ha">ha</option>
                </select>
              </div>
            </div>

            {tanlanganOrganlar.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <label style={labelStyle}>Tavsiya etilgan tekshiruvlar</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                  {tanlanganOrganlar
                    .filter((organ) => tekshiruvTavsiyalari[organ])
                    .map((organ) => (
                      <div key={organ} style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                        <span style={{ color: 'var(--muted)', fontSize: '12px', marginRight: '2px' }}>{organ}:</span>
                        {tekshiruvTavsiyalari[organ].map((tek) => (
                          <button
                            key={tek}
                            type="button"
                            onClick={() => qoshTekshiruv(tek)}
                            style={{
                              background: 'var(--surface-2)', color: 'var(--warn)', border: '1px solid var(--line)',
                              borderRadius: '20px', padding: '5px 12px', cursor: 'pointer', fontSize: '12px',
                            }}
                          >
                            + {tek}
                          </button>
                        ))}
                      </div>
                    ))}
                </div>
                <textarea style={{ ...inputStyle, minHeight: '50px' }} value={yangiForm.tekshiruvlar} onChange={setY('tekshiruvlar')} placeholder="Buyurilgan tekshiruvlar ro'yxati..." />
              </div>
            )}

            <button onClick={handleYangiSave} disabled={saving} style={{
              marginTop: '16px', background: 'var(--accent)', color: 'var(--ink)', border: 'none',
              borderRadius: '10px', padding: '12px 24px', cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '14px', fontWeight: 600, opacity: saving ? 0.7 : 1,
            }}>
              {saving ? 'Saqlanmoqda...' : editingYangiId ? 'O\'zgarishlarni saqlash' : "Saqlash va tekshiruvga yo'llash"}
            </button>
          </div>
        )}

        {/* 2-bosqich: tekshiruv natijalari (buyurilgan testlarga mos dinamik maydonlar) */}
        {natijaTashrif && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ marginTop: 0, fontSize: '15px', color: 'var(--muted)' }}>Tekshiruv natijalari</h3>

            {guruhlanganMaydonlar.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: '13px' }}>
                Bu qabulda tekshiruv buyurilmagan. Avval &quot;Tahrirlash&quot; orqali tekshiruv qo&apos;shing.
              </p>
            ) : (
              guruhlanganMaydonlar.map(({ test, maydonlar }: { test: string; maydonlar: Maydon[] }) => (
                <div key={test} style={{ marginBottom: '16px' }}>
                  <p style={{ color: 'var(--warn)', fontSize: '13px', fontWeight: 600, margin: '0 0 8px 0' }}>{test}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {maydonlar.map((m: Maydon) => (
                      <div key={m.key}>
                        <label style={labelStyle}>{m.label}{m.unit ? ` (${m.unit})` : ''}</label>
                        {m.type === 'select' ? (
                          <select style={inputStyle} value={natijaForm[m.key] ?? ''} onChange={setNatijaQiymat(m.key)}>
                            <option value="">—</option>
                            {m.options!.map((o) => <option key={o} value={o}>{o}</option>)}
                          </select>
                        ) : (
                          <input
                            type={m.type === 'number' ? 'number' : 'text'}
                            style={inputStyle}
                            value={natijaForm[m.key] ?? ''}
                            onChange={setNatijaQiymat(m.key)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}

            {natija && (
              <div style={{ marginTop: '16px', background: 'var(--accent-soft)', border: '1px solid var(--good)', borderRadius: '10px', padding: '14px' }}>
                <p style={{ margin: 0, color: 'var(--good)', fontWeight: 600 }}>Tavsiya: {natija.tavsiya}</p>
                <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '13px' }}>{natija.sabab}</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button onClick={handleNatijaSave} disabled={saving} style={{
                background: 'var(--accent)', color: 'var(--ink)', border: 'none', borderRadius: '10px',
                padding: '12px 24px', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 600,
                opacity: saving ? 0.7 : 1,
              }}>
                {saving ? 'Saqlanmoqda...' : 'Natijalarni saqlash'}
              </button>
              <button onClick={() => setNatijaTashrif(null)} style={{
                background: 'var(--surface-2)', color: 'var(--muted)', border: '1px solid var(--line)', borderRadius: '10px',
                padding: '12px 24px', cursor: 'pointer', fontSize: '14px',
              }}>
                Yopish
              </button>
            </div>
          </div>
        )}

        {/* 3-bosqich: dori va muolaja */}
        {yakunlashTashrifId && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ marginTop: 0, fontSize: '15px', color: 'var(--muted)' }}>Tavsiya varaqasi — dori va muolaja</h3>
            <textarea style={{ ...inputStyle, minHeight: '120px' }} value={doriMuolaja} onChange={(e) => setDoriMuolaja(e.target.value)} placeholder="Dorilar, dozalar, muolajalar, tavsiyalar..." />

            {/* Tuzilgan retsept — bemor ilovasiga avtomatik eslatma sifatida tushadi */}
            <div style={{ marginTop: '20px', paddingTop: '18px', borderTop: '1px dashed var(--line)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>
                  💊 Dori retsepti <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(bemor ilovasida eslatma sifatida ko&apos;rinadi)</span>
                </h4>
                <button onClick={doriQoshish} className="soft-press" style={{
                  background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--accent)', borderRadius: '8px',
                  padding: '6px 14px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer',
                }}>
                  + Dori qo&apos;shish
                </button>
              </div>

              {dorilarRoyxati.length === 0 ? (
                <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)' }}>Hali dori qo&apos;shilmagan.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {dorilarRoyxati.map((d, i) => (
                    <div key={i} style={{
                      background: 'var(--surface-2)', borderRadius: '10px', padding: '12px 14px',
                      display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'flex-end',
                    }}>
                      <div style={{ flex: '2 1 160px' }}>
                        <label style={{ ...labelStyle, fontSize: '11px' }}>Dori nomi</label>
                        <HoverVariantInput value={d.nomi} onChange={(v) => doriYangila(i, 'nomi', v)} variantlar={DORI_NOMLARI} placeholder="masalan, Tamsulozin" />
                      </div>
                      <div style={{ flex: '1 1 110px' }}>
                        <label style={{ ...labelStyle, fontSize: '11px' }}>Dozasi</label>
                        <HoverVariantInput value={d.dozasi} onChange={(v) => doriYangila(i, 'dozasi', v)} variantlar={DOZA_VARIANTLARI} placeholder="0.4 mg, 1 tab" />
                      </div>
                      <div style={{ flex: '0 1 100px' }}>
                        <label style={{ ...labelStyle, fontSize: '11px' }}>Kuniga marta</label>
                        <HoverVariantInput type="number" value={d.kuniga_marta} onChange={(v) => doriYangila(i, 'kuniga_marta', parseInt(v) || 1)} variantlar={KUNIGA_MARTA_VARIANTLARI} />
                      </div>
                      <div style={{ flex: '0 1 100px' }}>
                        <label style={{ ...labelStyle, fontSize: '11px' }}>Necha kun</label>
                        <HoverVariantInput type="number" value={d.muddat_kun} onChange={(v) => doriYangila(i, 'muddat_kun', parseInt(v) || 1)} variantlar={MUDDAT_KUN_VARIANTLARI} />
                      </div>
                      <div style={{ flex: '1 1 130px' }}>
                        <label style={{ ...labelStyle, fontSize: '11px' }}>Boshlanish sanasi</label>
                        <input type="date" style={{ ...inputStyle, padding: '8px 10px', fontSize: '13px' }} value={d.boshlanish_sanasi} onChange={(e) => doriYangila(i, 'boshlanish_sanasi', e.target.value)} />
                      </div>
                      <div style={{ flex: '2 1 160px' }}>
                        <label style={{ ...labelStyle, fontSize: '11px' }}>Izoh (ixtiyoriy)</label>
                        <HoverVariantInput value={d.izoh} onChange={(v) => doriYangila(i, 'izoh', v)} variantlar={IZOH_VARIANTLARI} placeholder="ovqatdan keyin" />
                      </div>
                      <div style={{ flex: '1 1 100%', fontSize: '11.5px', color: 'var(--muted)' }}>
                        📅 {d.boshlanish_sanasi || bugunSana()} — {sanaQoshish(d.boshlanish_sanasi || bugunSana(), d.muddat_kun)} oralig'ida ({d.muddat_kun} kun)
                      </div>
                      <button onClick={() => doriOchirish(i)} style={{
                        background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: '15px', padding: '8px',
                      }}>🗑️</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button onClick={handleYakunlashSave} disabled={saving} style={{
                background: 'var(--accent)', color: 'var(--ink)', border: 'none', borderRadius: '10px',
                padding: '12px 24px', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 600,
                opacity: saving ? 0.7 : 1,
              }}>
                {saving ? 'Saqlanmoqda...' : 'Varaqani yakunlash'}
              </button>
              <button onClick={() => setYakunlashTashrifId(null)} style={{
                background: 'var(--surface-2)', color: 'var(--muted)', border: '1px solid var(--line)', borderRadius: '10px',
                padding: '12px 24px', cursor: 'pointer', fontSize: '14px',
              }}>
                Yopish
              </button>
            </div>
          </div>
        )}

        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '3px', height: '16px', background: 'var(--accent)', borderRadius: '2px', display: 'inline-block' }} />
          Qabullar tarixi
        </h3>
        {tashriflar.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)', background: 'var(--surface)', border: '1px dashed var(--line)', borderRadius: '14px' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px', opacity: 0.6 }}>🩺</div>
            <p style={{ margin: 0, fontSize: '13.5px' }}>Hozircha qabul yo&apos;q. &quot;+ Yangi qabul&quot; orqali boshlang.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tashriflar.map((t, i) => {
              const holat = holatLabel[t.holat] ?? holatLabel.yangi
              return (
                <div key={t.id} className="lift rise" style={{ animationDelay: `${Math.min(i * 0.05, 0.3)}s`, background: 'var(--surface)', border: '1px solid var(--line)', borderLeft: `3px solid ${holat.color}`, borderRadius: '12px', padding: '18px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '13px' }}>{new Date(t.sana).toLocaleString()}</span>
                    <span style={{ color: holat.color, fontSize: '13px', fontWeight: 600 }}>{holat.text}</span>
                  </div>
                  {t.shikoyat && <p style={{ margin: '0 0 4px 0', fontSize: '14px' }}><strong>Shikoyat:</strong> {t.shikoyat}</p>}
                  {t.anamnez && <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: 'var(--muted)' }}><strong>Anamnez:</strong> {t.anamnez}</p>}
                  {t.buyurilgan_tekshiruvlar && <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: 'var(--warn)' }}><strong>Buyurilgan tekshiruvlar:</strong> {t.buyurilgan_tekshiruvlar}</p>}
                  {t.tavsiya && <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: 'var(--accent)' }}><strong>Tavsiya:</strong> {t.tavsiya} ({t.daraja}-daraja, {t.tomon})</p>}
                  {t.dori_muolaja && <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: 'var(--good)' }}><strong>Dori/muolaja:</strong> {t.dori_muolaja}</p>}

                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                    <IconButton icon="✎" label="Tahrirlash" onClick={() => openYangiForm(t)} />
                    {(t.holat === 'yangi' || t.holat === 'tekshiruv_buyurildi') && (
                      <IconButton icon="🖨️" label="Yo'llanma chop etish" color="var(--warn)" onClick={() => window.open(`/doctor/print/referral/${t.id}`, '_blank')} />
                    )}
                    {t.holat !== 'yakunlandi' && (
                      <IconButton icon="🧪" label="Tekshiruv natijalarini kiritish" color="var(--accent)" onClick={() => openNatijaForm(t)} />
                    )}
                    {t.holat === 'natija_kiritildi' && (
                      <IconButton icon="📝" label="Tavsiya varaqasini yakunlash" color="var(--good)" onClick={() => openYakunlash(t.id, t.dori_muolaja)} />
                    )}
                    {(t.holat === 'natija_kiritildi' || t.holat === 'yakunlandi') && (
                      <IconButton icon="🧮" label="Varikotsele kalkulyatoriga o'tish" color="var(--accent-2)" onClick={() => router.push(kalkulyatorHavolasi(bemor, t))} />
                    )}
                    {t.holat === 'yakunlandi' && (
                      <>
                        <IconButton icon="🧪" label="Natijalarni tahrirlash" color="var(--accent)" onClick={() => openNatijaForm(t)} />
                        <IconButton icon="📝" label="Dori/muolajani tahrirlash" color="var(--good)" onClick={() => openYakunlash(t.id, t.dori_muolaja)} />
                        <IconButton icon="🖨️" label="Chop etish / PDF" onClick={() => window.open(`/doctor/print/${t.id}`, '_blank')} />
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AppShell>
  )
}

function bemorBoshHarflar(fio?: string) {
  if (!fio) return '—'
  const q = fio.trim().split(/\s+/)
  return ((q[0]?.[0] ?? '') + (q[1]?.[0] ?? '')).toUpperCase()
}
