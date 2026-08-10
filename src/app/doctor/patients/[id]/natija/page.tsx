'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AppShell } from '@/components/AppShell'
import { createClient } from '@/lib/supabase'
import { UrosferaLoaderMini } from '@/components/UrosferaLoader'

const inp: React.CSSProperties = {
  width: '100%', background: 'var(--surface-2)', color: 'var(--ink)',
  border: '1px solid var(--line)', borderRadius: '10px', padding: '10px 14px',
  fontSize: '14px', outline: 'none', boxSizing: 'border-box',
}
const lbl: React.CSSProperties = { color: 'var(--ink-soft)', fontSize: '13px', display: 'block', marginBottom: '6px', fontWeight: 600 }
const card: React.CSSProperties = {
  background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '20px 22px', marginBottom: '16px',
}
const sectionTitle = (emoji: string, nom: string) => (
  <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)', fontWeight: 700, margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '7px' }}>
    <span style={{ width: '3px', height: '12px', background: 'var(--accent)', borderRadius: '2px', display: 'inline-block' }} />
    {emoji} {nom}
  </p>
)

const OPERATSIYA_TURLARI = [
  'Mikrojarrohlik subingvinal (Marmar)',
  'Laparoskopik varikotselektomiya',
  'Ivanissevich operatsiyasi',
  'Palomo operatsiyasi',
  'Skleroterapiya',
  'Embolizatsiya',
  'Operatsiya qilinmadi — kuzatuv',
]

const MAVZULAR = [
  { id: 'varikotsele', nom: '🔵 Varikotsele' },
  { id: 'bph', nom: '🟡 BPH / LUTS' },
  { id: 'prostatit', nom: '🟠 Prostatit' },
  { id: 'urolitiaz', nom: '🟣 Urolitiaz' },
]

// Mavzu bo'yicha natija maydonlari
const NATIJA_MAYDONLAR: Record<string, { key: string; label: string; type: string; variantlar?: string[] }[][]> = {
  varikotsele: [
    // Muolaja
    [
      { key: 'operatsiya_turi', label: 'Operatsiya / muolaja turi', type: 'select', variantlar: OPERATSIYA_TURLARI },
      { key: 'operatsiya_sanasi', label: 'Operatsiya sanasi', type: 'date' },
      { key: 'anesteziya', label: 'Anesteziya turi', type: 'select', variantlar: ['Umumiy', 'Mahalliy', 'Spinal', 'Epidural'] },
    ],
    // Spermogramma keyin
    [
      { key: 'sperm_konts_keyin', label: 'Spermogramma: konts. keyin (mln/ml)', type: 'number' },
      { key: 'sperm_harakat_keyin', label: 'Progressiv harakat keyin (%)', type: 'number' },
      { key: 'sperm_morf_keyin', label: 'Normal morfologiya keyin (%)', type: 'number' },
      { key: 'kuzatuv_oyi', label: 'Kuzatuv muddati (oy)', type: 'number' },
    ],
    // Natija
    [
      { key: 'retsidiv', label: 'Retsidiv', type: 'select', variantlar: ["Yo'q", 'Bor', 'Noaniq'] },
      { key: 'gidrotsele', label: 'Gidrotsele asarati', type: 'select', variantlar: ["Yo'q", 'Bor'] },
      { key: 'homiladorlik', label: 'Homiladorlik natijasi', type: 'select', variantlar: ["Kuzatilmaydi", 'Ha — tabiiy', 'Ha — IVF/ICSI', "Yo'q"] },
      { key: 'testosteron_keyin', label: 'Testosteron keyin (nmol/L)', type: 'number' },
      { key: 'umumiy_natija', label: 'Umumiy natija', type: 'select', variantlar: ['Yaxshilandi', "O'zgarmadi", 'Yomonlashdi'] },
    ],
  ],
  bph: [
    [
      { key: 'davolash_turi', label: 'Davolash turi', type: 'select', variantlar: ['Alfa-blokator', '5-ARI', 'Kombinatsiya', 'TURP', 'Laser enukleatsiya', 'Laser vaporizatsiya', 'HoLEP', 'Dinamik kuzatuv'] },
      { key: 'operatsiya_sanasi', label: 'Operatsiya sanasi (agar bo\'lgan bo\'lsa)', type: 'date' },
    ],
    [
      { key: 'ipss_oldin', label: 'IPSS oldin', type: 'number' },
      { key: 'ipss_keyin', label: 'IPSS keyin', type: 'number' },
      { key: 'qmax_oldin', label: 'Qmax oldin (ml/s)', type: 'number' },
      { key: 'qmax_keyin', label: 'Qmax keyin (ml/s)', type: 'number' },
      { key: 'qoldiq_oldin', label: 'Qoldiq siydik oldin (ml)', type: 'number' },
      { key: 'qoldiq_keyin', label: 'Qoldiq siydik keyin (ml)', type: 'number' },
    ],
    [
      { key: 'kuzatuv_oyi', label: 'Kuzatuv muddati (oy)', type: 'number' },
      { key: 'asorat', label: 'Asorat', type: 'select', variantlar: ["Yo'q", 'Siydik tutilishi', 'Infeksiya', 'Gemorragiya', 'Boshqa'] },
      { key: 'umumiy_natija', label: 'Umumiy natija', type: 'select', variantlar: ['Yaxshilandi', "O'zgarmadi", 'Yomonlashdi'] },
    ],
  ],
  prostatit: [
    [
      { key: 'tur', label: 'Prostatit turi', type: 'select', variantlar: ["O'tkir bakterial", 'Surunkali bakterial', 'CPPS (bakterial emas)'] },
      { key: 'antibiotik', label: 'Antibiotik', type: 'text' },
      { key: 'davomiyligi', label: 'Davolash davomiyligi (kun)', type: 'number' },
    ],
    [
      { key: 'nihcpsi_oldin', label: 'NIH-CPSI skori oldin', type: 'number' },
      { key: 'nihcpsi_keyin', label: 'NIH-CPSI skori keyin', type: 'number' },
      { key: 'kuzatuv_oyi', label: 'Kuzatuv muddati (oy)', type: 'number' },
      { key: 'retsidiv', label: 'Retsidiv', type: 'select', variantlar: ["Yo'q", 'Bor'] },
      { key: 'umumiy_natija', label: 'Umumiy natija', type: 'select', variantlar: ['Tuzaldi', 'Yaxshilandi', "O'zgarmadi", 'Yomonlashdi'] },
    ],
  ],
  urolitiaz: [
    [
      { key: 'tosh_joyi', label: 'Tosh joylashuvi', type: 'select', variantlar: ['Buyrak', 'Ureter yuqori', 'Ureter o\'rta', 'Ureter pastki', 'Siydik pufagi', 'Uretra'] },
      { key: 'tosh_oʻlchami', label: "Tosh o'lchami (mm)", type: 'number' },
      { key: 'davolash_turi', label: 'Davolash turi', type: 'select', variantlar: ['Konservativ (MET)', 'ESWL', 'Ureteroskopiya (URS)', 'PCNL', 'Laparoskopik', 'Shoshilinch stent/nefrostomiya'] },
    ],
    [
      { key: 'operatsiya_sanasi', label: 'Muolaja sanasi', type: 'date' },
      { key: 'tosh_chiqdi', label: 'Tosh to\'liq chiqdi', type: 'select', variantlar: ['Ha', 'Qisman', "Yo'q"] },
      { key: 'asorat', label: 'Asorat', type: 'select', variantlar: ["Yo'q", 'Infeksiya', 'Gemorragiya', 'Urosepsiz', 'Boshqa'] },
      { key: 'kuzatuv_oyi', label: 'Kuzatuv muddati (oy)', type: 'number' },
      { key: 'retsidiv', label: 'Retsidiv', type: 'select', variantlar: ["Yo'q", 'Bor'] },
      { key: 'umumiy_natija', label: 'Umumiy natija', type: 'select', variantlar: ['Muvaffaqiyatli', 'Qisman', 'Muvaffaqiyatsiz'] },
    ],
  ],
}

const GURUH_NOMLARI: Record<string, string[]> = {
  varikotsele: ['💊 Muolaja', '🔬 Spermogramma (kuzatuv)', '📊 Natija'],
  bph: ['💊 Davolash', '📈 Ko\'rsatkichlar', '📊 Natija'],
  prostatit: ['💊 Davolash', '📊 Natija va kuzatuv'],
  urolitiaz: ['🪨 Tosh ma\'lumoti', '📊 Natija'],
}

export default function NatijaPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = createClient()

  const [bemor, setBemor] = useState<any>(null)
  const [asosiyTashrif, setAsosiyTashrif] = useState<any>(null)
  const [mavzu, setMavzu] = useState('varikotsele')
  const [malumot, setMalumot] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saqlandi, setSaqlandi] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      const [{ data: b }, { data: tashriflar }, { data: natija }] = await Promise.all([
        supabase.from('bemorlar').select('*').eq('id', id).single(),
        supabase.from('tashriflar').select('*').eq('bemor_id', id).eq('doctor_id', user!.id).order('sana', { ascending: false }),
        supabase.from('bemor_natijalar').select('malumot').eq('bemor_id', id).eq('doctor_id', user!.id).eq('mavzu', mavzu).maybeSingle(),
      ])
      setBemor(b)
      setAsosiyTashrif(tashriflar?.[0] ?? null)
      setMalumot(natija?.malumot ?? {})
      setLoading(false)
    }
    load()
  }, [id, mavzu])

  const set = (key: string, val: any) => {
    setMalumot((d) => ({ ...d, [key]: val }))
    setSaqlandi(false)
  }

  const saqla = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setSaving(true)
    await supabase.from('bemor_natijalar').upsert({
      bemor_id: id, doctor_id: user.id, mavzu, malumot, yangilangan: new Date().toISOString(),
    }, { onConflict: 'bemor_id,doctor_id,mavzu' })
    setSaving(false)
    setSaqlandi(true)
  }

  const guruhlar = NATIJA_MAYDONLAR[mavzu] ?? []
  const guruhNomlari = GURUH_NOMLARI[mavzu] ?? []

  return (
    <AppShell
      title={`Natija — ${bemor?.fio ?? ''}`}
      actions={
        <button onClick={() => router.push(`/doctor/patients/${id}`)} className="btn-animated soft-press" style={{
          background: 'var(--surface-2)', color: 'var(--ink-soft)', border: '1px solid var(--line)',
          borderRadius: '999px', padding: '8px 16px', cursor: 'pointer', fontSize: '13.5px', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          ← Bemorga qaytish
        </button>
      }
    >
      <div className="fade-in px-4 py-6 sm:px-8 sm:py-8" style={{ maxWidth: '760px' }}>

        {/* Mavzu tanlash */}
        <div style={card}>
          {sectionTitle('📋', 'Tashxis / mavzu')}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {MAVZULAR.map((m) => (
              <button key={m.id} onClick={() => setMavzu(m.id)} className="btn-animated" style={{
                border: 'none', borderRadius: '999px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                background: mavzu === m.id ? 'var(--accent)' : 'var(--surface-2)',
                color: mavzu === m.id ? 'white' : 'var(--ink-soft)',
              }}>
                {m.nom}
              </button>
            ))}
          </div>
        </div>

        {/* Oldingi ma'lumot (tashrifdan) */}
        {asosiyTashrif && mavzu === 'varikotsele' && (
          <div style={{ ...card, borderColor: 'var(--accent)', opacity: 0.9 }}>
            {sectionTitle('📁', 'Tashrifdan avtomatik (oldingi ma\'lumot)')}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '13px' }}>
              {[
                ['Tomon / Daraja', `${asosiyTashrif.tomon ?? '—'} / ${asosiyTashrif.daraja ?? '—'}`],
                ['Vena diametri', asosiyTashrif.vena_diametri ? `${asosiyTashrif.vena_diametri} mm` : '—'],
                ['Reflux', asosiyTashrif.reflux ?? '—'],
                ['Sperm konts. oldin', asosiyTashrif.sperm_konts ? `${asosiyTashrif.sperm_konts} mln/ml` : '—'],
                ['Progressiv harakat', asosiyTashrif.sperm_harakat ? `${asosiyTashrif.sperm_harakat}%` : '—'],
                ['Testosteron', asosiyTashrif.testosteron ? `${asosiyTashrif.testosteron} nmol/L` : '—'],
              ].map(([label, val]) => (
                <div key={label as string}>
                  <div style={{ color: 'var(--muted)', fontSize: '11px', marginBottom: '2px' }}>{label}</div>
                  <div style={{ fontWeight: 600 }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Natija maydonlar */}
        {loading ? (
          <UrosferaLoaderMini />
        ) : guruhlar.map((maydonlar, gi) => (
          <div key={gi} style={card}>
            {sectionTitle('', guruhNomlari[gi] ?? `Guruh ${gi + 1}`)}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
              {maydonlar.map((m) => (
                <div key={m.key} style={{ gridColumn: m.type === 'text' ? 'span 2' : 'span 1' }}>
                  <label style={lbl}>{m.label}</label>
                  {m.type === 'select' ? (
                    <select style={inp} value={malumot[m.key] ?? ''} onChange={(e) => set(m.key, e.target.value)}>
                      <option value="">— tanlang —</option>
                      {m.variantlar!.map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                  ) : (
                    <input
                      type={m.type}
                      style={inp}
                      value={malumot[m.key] ?? ''}
                      onChange={(e) => set(m.key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Izoh */}
        <div style={card}>
          {sectionTitle('📝', 'Qo\'shimcha izoh')}
          <textarea
            style={{ ...inp, minHeight: '80px' }}
            value={malumot.izoh ?? ''}
            onChange={(e) => set('izoh', e.target.value)}
            placeholder="Qo'shimcha klinik ma'lumotlar..."
          />
        </div>

        {/* Saqlash */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button onClick={saqla} disabled={saving} className="btn-animated soft-press" style={{
            background: saqlandi ? 'var(--good)' : 'var(--accent)', color: 'white', border: 'none',
            borderRadius: '12px', padding: '12px 32px', cursor: saving ? 'not-allowed' : 'pointer',
            fontSize: '15px', fontWeight: 700, opacity: saving ? 0.7 : 1,
          }}>
            {saving ? 'Saqlanmoqda...' : saqlandi ? '✓ Saqlandi' : 'Saqlash'}
          </button>
        </div>
      </div>
    </AppShell>
  )
}
