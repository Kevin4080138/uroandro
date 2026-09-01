'use client'

// Talabalar nazorati — har bir talabaning dars progressi, test urinishlari,
// obunalari va oxirgi faolligi. Qator bosilganda talabaning batafsil sahifasi ochiladi.

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import * as XLSX from 'xlsx'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { DARSLAR, BOSQICHLAR, type Bosqich } from '@/lib/talim/darslar'
import { UrosferaLoaderMini } from '@/components/UrosferaLoader'
import { GraduationCap, CreditCard, Flame, CheckCircle2, Target, Download, TrendingUp } from 'lucide-react'

type TalabaProfil = { id: string; full_name: string | null; email: string | null; telefon: string | null; created_at: string }

// admin_talabalar_xulosa() RPC qaytaradigan xom qator (agregatsiya bazada)
type XulosaQator = {
  student_id: string; full_name: string | null; email: string | null; telefon: string | null; created_at: string
  tugallangan_darslar: number; jami_qadam: number; urinishlar: number
  ortacha_foiz: number | null; nazorat_otgan: number
  obunalar: string[]; darslar: string[]; oxirgi_faollik: string | null
}

type TalabaXulosa = {
  profil: TalabaProfil
  darslar: string[]        // bosqich filtri uchun tegib o'tilgan dars slug'lari
  obunalar: Bosqich[]
  tugallanganDarslar: number
  jamiQadam: number
  urinishlar: number
  ortachaFoiz: number | null
  nazoratOtgan: number
  oxirgiFaollik: string | null
}

type SaralashKalit = 'ism' | 'tugallanganDarslar' | 'jamiQadam' | 'urinishlar' | 'ortachaFoiz' | 'nazoratOtgan' | 'oxirgiFaollik'

// Jadval ustunlari — kalit bo'lgani saralanadi
const USTUNLAR: { label: string; kalit?: SaralashKalit }[] = [
  { label: 'Talaba', kalit: 'ism' },
  { label: 'Obuna' },
  { label: 'Tugallangan darslar', kalit: 'tugallanganDarslar' },
  { label: 'Qadamlar', kalit: 'jamiQadam' },
  { label: 'Urinishlar', kalit: 'urinishlar' },
  { label: "O'rtacha", kalit: 'ortachaFoiz' },
  { label: 'Nazorat', kalit: 'nazoratOtgan' },
  { label: 'Oxirgi faollik', kalit: 'oxirgiFaollik' },
  { label: '' },
]

// Obuna bosqichi — rang + matnli belgi (faqat rang bilan ajratish rang ko'rmaydiganlar
// uchun tushunarsiz edi).
const BOSQICH_META: Record<string, { label: string; rang: string }> = {
  oson: { label: 'Oson', rang: 'var(--good)' },
  "o'rta": { label: "O'rta", rang: 'var(--warn)' },
  qiyin: { label: 'Qiyin', rang: 'var(--danger)' },
}

function sanaFmt(s: string | null): string {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function faollikRang(s: string | null): string {
  if (!s) return 'var(--muted)'
  const kun = (Date.now() - new Date(s).getTime()) / 86400000
  if (kun <= 3) return 'var(--good)'
  if (kun <= 14) return 'var(--warn)'
  return 'var(--danger)'
}

function foizRang(f: number | null): string {
  if (f === null) return 'var(--muted)'
  if (f >= 70) return 'var(--good)'
  if (f >= 50) return 'var(--warn)'
  return 'var(--danger)'
}

export default function TalabalarNazoratiPage() {
  const supabase = createClient()
  const router = useRouter()
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [xatolik, setXatolik] = useState<string | null>(null)
  const [xulosalar, setXulosalar] = useState<TalabaXulosa[]>([])
  const [qidiruv, setQidiruv] = useState('')
  const [bosqichFiltr, setBosqichFiltr] = useState<'hammasi' | Bosqich>('hammasi')
  const [faollikFiltr, setFaollikFiltr] = useState<'hammasi' | 'faol' | 'sust'>('hammasi')
  const [obunaFiltr, setObunaFiltr] = useState<'hammasi' | 'obunali' | 'obunasiz'>('hammasi')
  const [saralash, setSaralash] = useState<{ kalit: SaralashKalit; yon: 'asc' | 'desc' }>({ kalit: 'oxirgiFaollik', yon: 'desc' })
  const [hozir] = useState(() => Date.now())

  useEffect(() => {
    const yukla = async () => {
      // Agregatsiya bazada bajariladi — har talaba uchun bitta xulosa qatori.
      const { data, error } = await supabase.rpc('admin_talabalar_xulosa')
      if (error) { setXatolik(error.message); setYuklanmoqda(false); return }
      const rows = (data as XulosaQator[]) ?? []
      setXulosalar(rows.map((r) => ({
        profil: { id: r.student_id, full_name: r.full_name, email: r.email, telefon: r.telefon, created_at: r.created_at },
        darslar: r.darslar ?? [],
        obunalar: (r.obunalar ?? []) as Bosqich[],
        tugallanganDarslar: Number(r.tugallangan_darslar) || 0,
        jamiQadam: Number(r.jami_qadam) || 0,
        urinishlar: Number(r.urinishlar) || 0,
        ortachaFoiz: r.ortacha_foiz === null || r.ortacha_foiz === undefined ? null : Number(r.ortacha_foiz),
        nazoratOtgan: Number(r.nazorat_otgan) || 0,
        oxirgiFaollik: r.oxirgi_faollik,
      })))
      setYuklanmoqda(false)
    }
    yukla()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const darsBosqichi = useMemo(() => {
    const m = new Map<string, Bosqich>()
    for (const d of DARSLAR) m.set(d.slug, d.bosqich)
    return m
  }, [])

  const korinadigan = useMemo(() => {
    let r = xulosalar
    if (qidiruv.trim()) {
      const q = qidiruv.trim().toLowerCase()
      r = r.filter((x) =>
        (x.profil.full_name ?? '').toLowerCase().includes(q) ||
        (x.profil.email ?? '').toLowerCase().includes(q) ||
        (x.profil.telefon ?? '').includes(q)
      )
    }
    if (bosqichFiltr !== 'hammasi') {
      r = r.filter((x) => x.darslar.some((slug) => darsBosqichi.get(slug) === bosqichFiltr))
    }
    if (faollikFiltr !== 'hammasi') {
      const chegara = hozir - 7 * 86400000
      r = r.filter((x) => {
        const faol = x.oxirgiFaollik ? new Date(x.oxirgiFaollik).getTime() >= chegara : false
        return faollikFiltr === 'faol' ? faol : !faol
      })
    }
    if (obunaFiltr !== 'hammasi') {
      r = r.filter((x) => obunaFiltr === 'obunali' ? x.obunalar.length > 0 : x.obunalar.length === 0)
    }
    const yon = saralash.yon === 'asc' ? 1 : -1
    return [...r].sort((a, b) => {
      let c: number
      if (saralash.kalit === 'ism') {
        c = (a.profil.full_name ?? '').localeCompare(b.profil.full_name ?? '')
      } else if (saralash.kalit === 'oxirgiFaollik') {
        c = (a.oxirgiFaollik ?? '').localeCompare(b.oxirgiFaollik ?? '')
      } else {
        c = ((a[saralash.kalit] as number | null) ?? -1) - ((b[saralash.kalit] as number | null) ?? -1)
      }
      return c * yon
    })
  }, [xulosalar, qidiruv, bosqichFiltr, faollikFiltr, obunaFiltr, saralash, darsBosqichi, hozir])

  // KPI
  const faolSoni = xulosalar.filter((x) => x.oxirgiFaollik && hozir - new Date(x.oxirgiFaollik).getTime() <= 7 * 86400000).length
  const obunaliSoni = xulosalar.filter((x) => x.obunalar.length > 0).length
  const jamiTugallangan = xulosalar.reduce((s, x) => s + x.tugallanganDarslar, 0)
  // Umumiy o'rtacha — urinishlar soniga tortilgan (og'irlashtirilgan) o'rtacha,
  // chunki per-talaba ortachaFoiz'lardan oddiy o'rtacha olish noto'g'ri bo'lardi.
  const jamiUrinish = xulosalar.reduce((s, x) => s + x.urinishlar, 0)
  const umumiyOrtacha = jamiUrinish
    ? Math.round(xulosalar.reduce((s, x) => s + (x.ortachaFoiz ?? 0) * x.urinishlar, 0) / jamiUrinish)
    : 0

  const eksport = () => {
    const qatorlar = korinadigan.map((x) => ({
      'Talaba': x.profil.full_name ?? '—',
      'Email': x.profil.email ?? '',
      'Telefon': x.profil.telefon ?? '',
      'Obunalar': x.obunalar.join(', '),
      'Tugallangan darslar': x.tugallanganDarslar,
      'Yakunlangan qadamlar': x.jamiQadam,
      'Test urinishlari': x.urinishlar,
      "O'rtacha foiz": x.ortachaFoiz ?? '',
      "Nazoratdan o'tgan": x.nazoratOtgan,
      'Oxirgi faollik': x.oxirgiFaollik ? sanaFmt(x.oxirgiFaollik) : '',
    }))
    const ws = XLSX.utils.json_to_sheet(qatorlar)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Talabalar')
    XLSX.writeFile(wb, `talabalar-nazorati-${new Date().toISOString().slice(0, 10)}.xlsx`)
  }

  const saralaBosildi = (kalit: SaralashKalit) => {
    setSaralash((s) => s.kalit === kalit
      ? { kalit, yon: s.yon === 'asc' ? 'desc' : 'asc' }
      : { kalit, yon: kalit === 'ism' ? 'asc' : 'desc' })  // matn — asc, son/sana — desc
  }

  const filtrTugma = (faolMi: boolean) => ({
    background: faolMi ? 'var(--accent)' : 'var(--surface-2)',
    color: faolMi ? 'white' : 'var(--ink-soft)',
    border: faolMi ? 'none' : '1px solid var(--line)',
    borderRadius: '999px', padding: '7px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
  } as const)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/admin/dashboard" backLabel="Dashboard" />

      <div className="mx-auto max-w-[1200px] px-6 py-8">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '23px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '9px' }}>
              <TrendingUp size={22} strokeWidth={2.4} style={{ color: 'var(--accent)' }} /> Talabalar nazorati
            </h1>
            <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontSize: '13px' }}>
              Talaba ustiga bosing — batafsil sahifasi ochiladi
            </p>
          </div>
          <button onClick={eksport} className="soft-press" style={{
            background: 'var(--surface)', color: 'var(--accent)', border: '1px solid var(--line)',
            borderRadius: '12px', padding: '9px 18px', fontSize: '12.5px', fontWeight: 800, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '7px',
          }}>
            <Download size={15} strokeWidth={2.4} /> .xlsx eksport
          </button>
        </div>

        {/* KPI kartalar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          {[
            { nom: 'Jami talabalar', qiymat: xulosalar.length, Icon: GraduationCap, rang: 'var(--accent)' },
            { nom: 'Obunali talabalar', qiymat: obunaliSoni, Icon: CreditCard, rang: 'var(--good)' },
            { nom: '7 kunda faol', qiymat: faolSoni, Icon: Flame, rang: 'var(--warn)' },
            { nom: 'Tugallangan darslar', qiymat: jamiTugallangan, Icon: CheckCircle2, rang: 'var(--good)' },
            { nom: "O'rtacha test foizi", qiymat: `${umumiyOrtacha}%`, Icon: Target, rang: 'var(--accent)' },
          ].map((k) => (
            <div key={k.nom} style={{
              background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
              padding: '16px 18px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: k.rang, display: 'flex' }}><k.Icon size={18} strokeWidth={2.2} /></span>
                <span style={{ fontSize: '22px', fontWeight: 900 }}>{k.qiymat}</span>
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--muted)', fontWeight: 700, marginTop: '4px' }}>{k.nom}</div>
            </div>
          ))}
        </div>

        {/* Filtrlar */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            value={qidiruv}
            onChange={(e) => setQidiruv(e.target.value)}
            placeholder="Ism, email yoki telefon..."
            style={{
              flex: '1 1 200px', maxWidth: '300px',
              background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px',
              padding: '10px 14px', fontSize: '13px', color: 'var(--ink)', outline: 'none',
            }}
          />
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {(['hammasi', 'oson', "o'rta", 'qiyin'] as const).map((b) => (
              <button key={b} onClick={() => setBosqichFiltr(b)} className="soft-press" style={filtrTugma(bosqichFiltr === b)}>
                {b === 'hammasi' ? 'Barcha bosqich' : BOSQICHLAR.find((x) => x.id === b)?.emoji + ' ' + b.toUpperCase()}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {([['hammasi', 'Hammasi'], ['faol', '🔥 Faol (7 kun)'], ['sust', '😴 Sust']] as const).map(([id, nom]) => (
              <button key={id} onClick={() => setFaollikFiltr(id)} className="soft-press" style={filtrTugma(faollikFiltr === id)}>{nom}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {([['hammasi', 'Barchasi'], ['obunali', '💳 Obunali'], ['obunasiz', 'Obunasiz']] as const).map(([id, nom]) => (
              <button key={id} onClick={() => setObunaFiltr(id)} className="soft-press" style={filtrTugma(obunaFiltr === id)}>{nom}</button>
            ))}
          </div>
        </div>

        {/* Jadval */}
        {xatolik ? (
          <p style={{ color: 'var(--danger)', fontSize: '13.5px', background: 'var(--surface)', border: '1px solid var(--danger)', borderRadius: '12px', padding: '14px 16px' }}>
            Ma&apos;lumotni yuklab bo&apos;lmadi: {xatolik}
          </p>
        ) : yuklanmoqda ? (
          <UrosferaLoaderMini />
        ) : korinadigan.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: '13.5px' }}>Talaba topilmadi.</p>
        ) : (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--line)', background: 'var(--surface-2)' }}>
                    {USTUNLAR.map((u, i) => {
                      const faol = u.kalit && saralash.kalit === u.kalit
                      return (
                        <th key={u.label || `bosh-${i}`} style={{ padding: '11px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 800, color: faol ? 'var(--accent)' : 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.03em', whiteSpace: 'nowrap' }}>
                          {u.kalit ? (
                            <button
                              onClick={() => saralaBosildi(u.kalit!)}
                              aria-label={`${u.label} bo'yicha saralash`}
                              style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'inherit', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', textTransform: 'inherit', letterSpacing: 'inherit' }}
                            >
                              {u.label}
                              <span style={{ opacity: faol ? 1 : 0.35 }}>{faol ? (saralash.yon === 'asc' ? '▲' : '▼') : '↕'}</span>
                            </button>
                          ) : u.label}
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  {korinadigan.map((x) => (
                    <tr
                      key={x.profil.id}
                      onClick={() => router.push(`/admin/talabalar-nazorati/${x.profil.id}`)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(`/admin/talabalar-nazorati/${x.profil.id}`) } }}
                      role="button"
                      tabIndex={0}
                      aria-label={`${x.profil.full_name ?? 'Talaba'} — batafsil ko'rish`}
                      className="list-row"
                      style={{ borderBottom: '1px solid var(--line)', cursor: 'pointer' }}
                    >
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700 }}>{x.profil.full_name ?? '—'}</div>
                        <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{x.profil.email ?? x.profil.telefon ?? ''}</div>
                      </td>
                      <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                        {x.obunalar.length === 0 ? (
                          <span style={{ color: 'var(--muted)', fontSize: '12px' }}>—</span>
                        ) : (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {x.obunalar.map((b) => {
                              const m = BOSQICH_META[b]
                              return (
                                <span key={b} style={{
                                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                                  fontSize: '11px', fontWeight: 700, color: m.rang,
                                  background: `color-mix(in srgb, ${m.rang} 12%, transparent)`,
                                  border: `1px solid color-mix(in srgb, ${m.rang} 30%, transparent)`,
                                  borderRadius: '999px', padding: '2px 8px',
                                }}>
                                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: m.rang, flexShrink: 0 }} />
                                  {m.label}
                                </span>
                              )
                            })}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 800 }}>{x.tugallanganDarslar}</td>
                      <td style={{ padding: '12px 14px' }}>{x.jamiQadam}</td>
                      <td style={{ padding: '12px 14px' }}>{x.urinishlar}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: foizRang(x.ortachaFoiz) }}>
                        {x.ortachaFoiz === null ? '—' : `${x.ortachaFoiz}%`}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        {x.nazoratOtgan > 0
                          ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 800, color: 'var(--good)', background: 'color-mix(in srgb, var(--good) 12%, transparent)', borderRadius: '999px', padding: '3px 10px' }}><GraduationCap size={13} strokeWidth={2.4} /> {x.nazoratOtgan} ta</span>
                          : <span style={{ color: 'var(--muted)', fontSize: '12px' }}>—</span>}
                      </td>
                      <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: faollikRang(x.oxirgiFaollik), display: 'inline-block' }} />
                          {sanaFmt(x.oxirgiFaollik)}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--accent)', fontSize: '12px', fontWeight: 800, whiteSpace: 'nowrap' }}>Ochish →</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
