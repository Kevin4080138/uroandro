'use client'

// Talabalar nazorati — har bir talabaning dars progressi, test urinishlari,
// obunalari va oxirgi faolligi. Qator bosilganda talabaning batafsil sahifasi ochiladi.

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import * as XLSX from 'xlsx'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { DARSLAR, BOSQICHLAR, type Bosqich } from '@/lib/talim/darslar'
import { darsTugadimi } from '@/lib/talim/useDarsProgress'
import { UrosferaLoaderMini } from '@/components/UrosferaLoader'

type ProgressQator = { student_id: string; dars_slug: string; qadam: string; created_at: string }
type NatijaQator = {
  student_id: string; dars_slug: string; dars_nomi: string
  togri_son: number; jami_savol: number; foiz: number; turi: string; created_at: string
}
type TalabaProfil = { id: string; full_name: string | null; email: string | null; telefon: string | null; created_at: string }
type ObunaQator = { student_id: string; bosqich: Bosqich; faol: boolean; tugash_sanasi: string | null }

type TalabaXulosa = {
  profil: TalabaProfil
  qadamlar: Map<string, Set<string>>
  natijalar: NatijaQator[]
  obunalar: Bosqich[]
  tugallanganDarslar: number
  jamiQadam: number
  urinishlar: number
  ortachaFoiz: number | null
  nazoratOtgan: number
  oxirgiFaollik: string | null
}

const BOSQICH_EMOJI: Record<string, string> = { oson: '🟢', "o'rta": '🟡', qiyin: '🔴' }

function sanaFmt(s: string | null): string {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function faollikRang(s: string | null): string {
  if (!s) return '#6b7280'
  const kun = (Date.now() - new Date(s).getTime()) / 86400000
  if (kun <= 3) return '#16a34a'
  if (kun <= 14) return '#d97706'
  return '#dc2626'
}

export default function TalabalarNazoratiPage() {
  const supabase = createClient()
  const router = useRouter()
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [talabalar, setTalabalar] = useState<TalabaProfil[]>([])
  const [progresslar, setProgresslar] = useState<ProgressQator[]>([])
  const [natijalar, setNatijalar] = useState<NatijaQator[]>([])
  const [obunaQatorlar, setObunaQatorlar] = useState<ObunaQator[]>([])
  const [qidiruv, setQidiruv] = useState('')
  const [bosqichFiltr, setBosqichFiltr] = useState<'hammasi' | Bosqich>('hammasi')
  const [faollikFiltr, setFaollikFiltr] = useState<'hammasi' | 'faol' | 'sust'>('hammasi')
  const [obunaFiltr, setObunaFiltr] = useState<'hammasi' | 'obunali' | 'obunasiz'>('hammasi')
  const [hozir] = useState(() => Date.now())

  useEffect(() => {
    const yukla = async () => {
      const [p, pr, n, o] = await Promise.all([
        supabase.from('profiles').select('id, full_name, email, telefon, created_at').eq('role', 'student').eq('arxivlangan', false),
        supabase.from('dars_qadam_progress').select('student_id, dars_slug, qadam, created_at'),
        supabase.from('talim_natijalari').select('student_id, dars_slug, dars_nomi, togri_son, jami_savol, foiz, turi, created_at').order('created_at', { ascending: false }),
        supabase.from('obunalar').select('student_id, bosqich, faol, tugash_sanasi'),
      ])
      setTalabalar((p.data as TalabaProfil[]) ?? [])
      setProgresslar((pr.data as ProgressQator[]) ?? [])
      setNatijalar((n.data as NatijaQator[]) ?? [])
      setObunaQatorlar((o.data as ObunaQator[]) ?? [])
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

  const xulosalar = useMemo<TalabaXulosa[]>(() => {
    const progressByStudent = new Map<string, ProgressQator[]>()
    for (const r of progresslar) {
      const arr = progressByStudent.get(r.student_id) ?? []
      arr.push(r)
      progressByStudent.set(r.student_id, arr)
    }
    const natijaByStudent = new Map<string, NatijaQator[]>()
    for (const r of natijalar) {
      const arr = natijaByStudent.get(r.student_id) ?? []
      arr.push(r)
      natijaByStudent.set(r.student_id, arr)
    }
    const obunaByStudent = new Map<string, Bosqich[]>()
    for (const r of obunaQatorlar) {
      const amal = r.faol && (!r.tugash_sanasi || new Date(r.tugash_sanasi).getTime() > hozir)
      if (!amal) continue
      const arr = obunaByStudent.get(r.student_id) ?? []
      arr.push(r.bosqich)
      obunaByStudent.set(r.student_id, arr)
    }

    return talabalar.map((t) => {
      const pr = progressByStudent.get(t.id) ?? []
      const nt = natijaByStudent.get(t.id) ?? []

      const qadamlar = new Map<string, Set<string>>()
      for (const r of pr) {
        const s = qadamlar.get(r.dars_slug) ?? new Set<string>()
        s.add(r.qadam)
        qadamlar.set(r.dars_slug, s)
      }

      let tugallangan = 0
      qadamlar.forEach((s) => { if (darsTugadimi(s)) tugallangan++ })

      const foizlar = nt.map((r) => Number(r.foiz))
      const nazoratOtgan = new Set(nt.filter((r) => r.turi === 'nazorat' && Number(r.foiz) >= 70).map((r) => r.dars_slug)).size

      const sanalar = [...pr.map((r) => r.created_at), ...nt.map((r) => r.created_at)].sort()
      const oxirgi = sanalar.length ? sanalar[sanalar.length - 1] : null

      return {
        profil: t,
        qadamlar,
        natijalar: nt,
        obunalar: obunaByStudent.get(t.id) ?? [],
        tugallanganDarslar: tugallangan,
        jamiQadam: pr.length,
        urinishlar: nt.length,
        ortachaFoiz: foizlar.length ? Math.round(foizlar.reduce((a, b) => a + b, 0) / foizlar.length) : null,
        nazoratOtgan,
        oxirgiFaollik: oxirgi,
      }
    })
  }, [talabalar, progresslar, natijalar, obunaQatorlar, hozir])

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
      r = r.filter((x) => {
        for (const slug of x.qadamlar.keys()) if (darsBosqichi.get(slug) === bosqichFiltr) return true
        return x.natijalar.some((n) => darsBosqichi.get(n.dars_slug) === bosqichFiltr)
      })
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
    return [...r].sort((a, b) => (b.oxirgiFaollik ?? '').localeCompare(a.oxirgiFaollik ?? ''))
  }, [xulosalar, qidiruv, bosqichFiltr, faollikFiltr, obunaFiltr, darsBosqichi, hozir])

  // KPI
  const faolSoni = xulosalar.filter((x) => x.oxirgiFaollik && hozir - new Date(x.oxirgiFaollik).getTime() <= 7 * 86400000).length
  const obunaliSoni = xulosalar.filter((x) => x.obunalar.length > 0).length
  const jamiTugallangan = xulosalar.reduce((s, x) => s + x.tugallanganDarslar, 0)
  const hammaFoizlar = natijalar.map((r) => Number(r.foiz))
  const umumiyOrtacha = hammaFoizlar.length ? Math.round(hammaFoizlar.reduce((a, b) => a + b, 0) / hammaFoizlar.length) : 0

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
            <h1 style={{ margin: 0, fontSize: '23px', fontWeight: 900 }}>📈 Talabalar nazorati</h1>
            <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontSize: '13px' }}>
              Talaba ustiga bosing — batafsil sahifasi ochiladi
            </p>
          </div>
          <button onClick={eksport} className="soft-press" style={{
            background: 'var(--surface)', color: 'var(--accent)', border: '1px solid var(--line)',
            borderRadius: '12px', padding: '9px 18px', fontSize: '12.5px', fontWeight: 800, cursor: 'pointer',
          }}>
            ⬇ .xlsx eksport
          </button>
        </div>

        {/* KPI kartalar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          {[
            { nom: 'Jami talabalar', qiymat: talabalar.length, emoji: '🎓' },
            { nom: 'Obunali talabalar', qiymat: obunaliSoni, emoji: '💳' },
            { nom: '7 kunda faol', qiymat: faolSoni, emoji: '🔥' },
            { nom: 'Tugallangan darslar', qiymat: jamiTugallangan, emoji: '✅' },
            { nom: "O'rtacha test foizi", qiymat: `${umumiyOrtacha}%`, emoji: '🎯' },
          ].map((k) => (
            <div key={k.nom} style={{
              background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
              padding: '16px 18px',
            }}>
              <div style={{ fontSize: '22px', fontWeight: 900 }}>{k.emoji} {k.qiymat}</div>
              <div style={{ fontSize: '11.5px', color: 'var(--muted)', fontWeight: 700, marginTop: '2px' }}>{k.nom}</div>
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
        {yuklanmoqda ? (
          <UrosferaLoaderMini />
        ) : korinadigan.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: '13.5px' }}>Talaba topilmadi.</p>
        ) : (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--line)', background: 'var(--surface-2)' }}>
                    {['Talaba', 'Obuna', 'Tugallangan darslar', 'Qadamlar', 'Urinishlar', "O'rtacha", 'Nazorat', 'Oxirgi faollik', ''].map((h) => (
                      <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.03em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {korinadigan.map((x) => (
                    <tr
                      key={x.profil.id}
                      onClick={() => router.push(`/admin/talabalar-nazorati/${x.profil.id}`)}
                      className="list-row"
                      style={{ borderBottom: '1px solid var(--line)', cursor: 'pointer' }}
                    >
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700 }}>{x.profil.full_name ?? '—'}</div>
                        <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{x.profil.email ?? x.profil.telefon ?? ''}</div>
                      </td>
                      <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                        {x.obunalar.length === 0
                          ? <span style={{ color: 'var(--muted)', fontSize: '12px' }}>—</span>
                          : x.obunalar.map((b) => <span key={b} title={b} style={{ fontSize: '14px', marginRight: '2px' }}>{BOSQICH_EMOJI[b]}</span>)}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 800 }}>{x.tugallanganDarslar}</td>
                      <td style={{ padding: '12px 14px' }}>{x.jamiQadam}</td>
                      <td style={{ padding: '12px 14px' }}>{x.urinishlar}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: x.ortachaFoiz === null ? 'var(--muted)' : x.ortachaFoiz >= 70 ? '#16a34a' : x.ortachaFoiz >= 50 ? '#d97706' : '#dc2626' }}>
                        {x.ortachaFoiz === null ? '—' : `${x.ortachaFoiz}%`}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        {x.nazoratOtgan > 0
                          ? <span style={{ fontSize: '11px', fontWeight: 800, color: '#16a34a', background: '#16a34a14', borderRadius: '999px', padding: '3px 10px' }}>🎓 {x.nazoratOtgan} ta</span>
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
