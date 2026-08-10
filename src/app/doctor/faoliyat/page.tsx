'use client'

import { useEffect, useState } from 'react'
import { AppShell } from '@/components/AppShell'
import { createClient } from '@/lib/supabase'
import { CountUp } from '@/components/CountUp'
import { postOpHolat, POSTOP_JADVALI } from '@/lib/operatsiyalar'
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { UrosferaLoaderMini } from '@/components/UrosferaLoader'

const card: React.CSSProperties = {
  background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '20px',
}
const cardTitle: React.CSSProperties = {
  fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em', margin: '0 0 18px 0', fontWeight: 600,
}

const MUROJAAT_KUTAYOTGAN = ['kutilmoqda', 'yangi', 'qabulda', 'qabul_qilindi', 'tekshirilmoqda']

const NAVBAT_HOLAT: { kalit: string; nom: string; rang: string }[] = [
  { kalit: 'kutilmoqda', nom: 'Kutilmoqda', rang: '#f59e0b' },
  { kalit: 'tasdiqlandi', nom: 'Tasdiqlandi', rang: '#3b82f6' },
  { kalit: 'yakunlandi', nom: 'Yakunlandi', rang: '#10b981' },
  { kalit: 'bekor', nom: 'Bekor', rang: '#ef4444' },
]

const REYTING_MEZON: { kalit: 'muomala' | 'samara' | 'tushuntirish' | 'kutish'; nom: string; rang: string }[] = [
  { kalit: 'muomala', nom: 'Muomala', rang: '#3b82f6' },
  { kalit: 'samara', nom: 'Samaradorlik', rang: '#10b981' },
  { kalit: 'tushuntirish', nom: 'Tushuntirish', rang: '#8b5cf6' },
  { kalit: 'kutish', nom: 'Kutish vaqti', rang: '#f59e0b' },
]

function oyBoshi(offset: number) {
  const d = new Date(); d.setDate(1); d.setHours(0, 0, 0, 0)
  d.setMonth(d.getMonth() - offset)
  return d
}
function oyLabel(d: Date) {
  return d.toLocaleDateString('uz-UZ', { month: 'short', year: '2-digit' })
}
function sanaISO(d: Date) {
  return d.toISOString().slice(0, 10)
}

function StatCard({ label, value, color, suffix, delta }: { label: string; value: number; color: string; suffix?: string; delta?: number | null }) {
  return (
    <div style={{ ...card, borderTop: `3px solid ${color}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '32px', fontWeight: 700, color }}>
          <CountUp value={value} />{suffix}
        </div>
        {delta != null && (
          <span style={{
            fontSize: '11px', fontWeight: 800, borderRadius: '999px', padding: '3px 8px',
            display: 'inline-flex', alignItems: 'center', gap: '3px',
            color: delta >= 0 ? '#16a34a' : '#dc2626', background: delta >= 0 ? '#16a34a16' : '#dc262616',
          }}>
            {delta >= 0 ? <ArrowUp size={11} strokeWidth={2.6} /> : <ArrowDown size={11} strokeWidth={2.6} />}
            {delta >= 0 ? '+' : ''}{delta}%
          </span>
        )}
      </div>
      <div style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '6px' }}>{label}</div>
    </div>
  )
}

export default function DoctorFaoliyatPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)

  const [buOyMurojaat, setBuOyMurojaat] = useState(0)
  const [murojaatDelta, setMurojaatDelta] = useState<number | null>(null)
  const [kutayotgan, setKutayotgan] = useState(0)
  const [buHaftaNavbat, setBuHaftaNavbat] = useState(0)
  const [ortachaReyting, setOrtachaReyting] = useState(0)
  const [bahoSoni, setBahoSoni] = useState(0)

  const [oylikData, setOylikData] = useState<{ oy: string; soni: number }[]>([])
  const [navbatData, setNavbatData] = useState<{ nom: string; soni: number; rang: string }[]>([])
  const [reytingData, setReytingData] = useState<{ nom: string; qiymat: number; rang: string }[]>([])
  const [yaqinBosqichlar, setYaqinBosqichlar] = useState<{ bemor: string; operatsiya: string; bosqich: string; qoldi: number }[]>([])
  const [faolKuzatuv, setFaolKuzatuv] = useState(0)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const uid = user.id

      const [{ data: murojaatlar }, { data: navbatlar }, { data: baholar }, { data: kuzatuvlar }] = await Promise.all([
        supabase.from('murojaatlar').select('holat, created_at, doctor_id, target_doctor_id')
          .or(`doctor_id.eq.${uid},target_doctor_id.eq.${uid}`),
        supabase.from('navbatlar').select('holat, sana').eq('doctor_id', uid),
        supabase.from('baholar').select('muomala, samara, tushuntirish, kutish').eq('doctor_id', uid),
        supabase.from('operatsiya_kuzatuvi').select('bemor_ismi, operatsiya_nomi, operatsiya_sanasi').eq('doctor_id', uid),
      ])

      const m = murojaatlar ?? []
      const buOy = oyBoshi(0)
      setBuOyMurojaat(m.filter((x) => new Date(x.created_at) >= buOy).length)
      setKutayotgan(m.filter((x) => MUROJAAT_KUTAYOTGAN.includes(x.holat)).length)

      // Oylik murojaatlar (so'nggi 6 oy)
      const oylar = Array.from({ length: 6 }, (_, i) => oyBoshi(5 - i))
      const oyMap: Record<string, number> = {}
      for (const o of oylar) oyMap[`${o.getFullYear()}-${o.getMonth()}`] = 0
      for (const x of m) {
        const d = new Date(x.created_at)
        const key = `${d.getFullYear()}-${d.getMonth()}`
        if (key in oyMap) oyMap[key]++
      }
      setOylikData(oylar.map((o) => ({ oy: oyLabel(o), soni: oyMap[`${o.getFullYear()}-${o.getMonth()}`] })))

      // Bu oy vs o'tgan oy delta (Lordbank metrika+delta naqshi)
      const oCur = oylar[oylar.length - 1], oPrev = oylar[oylar.length - 2]
      const curSon = oCur ? oyMap[`${oCur.getFullYear()}-${oCur.getMonth()}`] : 0
      const prevSon = oPrev ? oyMap[`${oPrev.getFullYear()}-${oPrev.getMonth()}`] : 0
      setMurojaatDelta(prevSon > 0 ? Math.round(((curSon - prevSon) / prevSon) * 100) : null)

      // Navbatlar holati + bu hafta
      const nv = navbatlar ?? []
      const nc: Record<string, number> = {}
      for (const x of nv) nc[x.holat] = (nc[x.holat] ?? 0) + 1
      setNavbatData(NAVBAT_HOLAT.map((h) => ({ nom: h.nom, soni: nc[h.kalit] ?? 0, rang: h.rang })))

      const bugun = new Date(); bugun.setHours(0, 0, 0, 0)
      const haftaOxiri = new Date(bugun); haftaOxiri.setDate(haftaOxiri.getDate() + 7)
      const bugunISO = sanaISO(bugun), haftaISO = sanaISO(haftaOxiri)
      setBuHaftaNavbat(nv.filter((x) => x.holat !== 'bekor' && x.sana >= bugunISO && x.sana < haftaISO).length)

      // Reyting
      const bh = baholar ?? []
      setBahoSoni(bh.length)
      if (bh.length > 0) {
        const mezonOrt = REYTING_MEZON.map((mz) => ({
          nom: mz.nom, rang: mz.rang,
          qiymat: bh.reduce((s, b: any) => s + (b[mz.kalit] ?? 0), 0) / bh.length,
        }))
        setReytingData(mezonOrt)
        setOrtachaReyting(mezonOrt.reduce((s, x) => s + x.qiymat, 0) / mezonOrt.length)
      } else {
        setReytingData(REYTING_MEZON.map((mz) => ({ nom: mz.nom, qiymat: 0, rang: mz.rang })))
        setOrtachaReyting(0)
      }

      // Operatsiya kuzatuvi — yaqin bosqichlar
      const kz = kuzatuvlar ?? []
      const yaqin: { bemor: string; operatsiya: string; bosqich: string; qoldi: number }[] = []
      let faol = 0
      for (const k of kz) {
        const bosqichlar = postOpHolat(k.operatsiya_sanasi)
        const keyingi = bosqichlar.find((b) => !b.otdi)
        if (keyingi) {
          faol++
          yaqin.push({ bemor: k.bemor_ismi, operatsiya: k.operatsiya_nomi, bosqich: keyingi.nom, qoldi: keyingi.qoldi })
        }
      }
      yaqin.sort((a, b) => a.qoldi - b.qoldi)
      setYaqinBosqichlar(yaqin.slice(0, 6))
      setFaolKuzatuv(faol)

      setLoading(false)
    }
    load()
  }, [])

  return (
    <AppShell title="Faoliyat paneli">
      <div className="fade-in px-4 py-6 sm:px-8 sm:py-8">
        <p style={{ color: 'var(--muted)', fontSize: '14px', margin: '0 0 24px' }}>
          Amaliyotingiz bo&apos;yicha jonli ko&apos;rsatkichlar: murojaatlar, navbatlar, reyting va operatsiya kuzatuvi.
        </p>

        {loading ? <UrosferaLoaderMini /> : (
          <>
            {/* KPI kartalar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px', marginBottom: '24px' }}>
              <StatCard label="Bu oygi murojaatlar" value={buOyMurojaat} color="#3b82f6" delta={murojaatDelta} />
              <StatCard label="Javob kutayotgan" value={kutayotgan} color="#f59e0b" />
              <StatCard label="Bu hafta navbatlar" value={buHaftaNavbat} color="#10b981" />
              <div style={{ ...card, borderTop: '3px solid #8b5cf6' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '32px', fontWeight: 700, color: '#8b5cf6' }}>
                  {ortachaReyting > 0 ? `${ortachaReyting.toFixed(1)}★` : '—'}
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '6px' }}>
                  O&apos;rtacha reyting {bahoSoni > 0 && `(${bahoSoni} baho)`}
                </div>
              </div>
            </div>

            {/* Oylik murojaatlar */}
            <div style={{ ...card, marginBottom: '20px' }}>
              <h3 style={cardTitle}>So&apos;nggi 6 oy — murojaatlar dinamikasi</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={oylikData} margin={{ top: 4, right: 12, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gMurojaat" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
                  <XAxis dataKey="oy" tick={{ fontSize: 12, fill: 'var(--muted)' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--muted)' }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, fontSize: 13 }} />
                  <Area type="monotone" dataKey="soni" name="Murojaatlar" stroke="#3b82f6" fill="url(#gMurojaat)" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              {/* Navbatlar holati */}
              <div style={card}>
                <h3 style={cardTitle}>Navbatlar holati bo&apos;yicha</h3>
                {navbatData.every((d) => d.soni === 0) ? (
                  <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Hozircha navbat yo&apos;q.</p>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <ResponsiveContainer width={160} height={160}>
                      <PieChart>
                        <Pie data={navbatData} cx="50%" cy="50%" innerRadius={46} outerRadius={70} dataKey="soni" paddingAngle={3}>
                          {navbatData.map((entry, i) => <Cell key={i} fill={entry.rang} />)}
                        </Pie>
                        <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, fontSize: 13 }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                      {navbatData.map((d) => (
                        <div key={d.nom} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                          <span style={{ width: 10, height: 10, borderRadius: '50%', background: d.rang, flexShrink: 0 }} />
                          <span style={{ flex: 1 }}>{d.nom}</span>
                          <span style={{ fontWeight: 700 }}>{d.soni}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Reyting mezonlari */}
              <div style={card}>
                <h3 style={cardTitle}>Reyting — mezonlar bo&apos;yicha o&apos;rtacha</h3>
                {bahoSoni === 0 ? (
                  <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Hozircha baho yo&apos;q.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {reytingData.map((d) => (
                      <div key={d.nom}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                          <span style={{ color: 'var(--ink-soft)' }}>{d.nom}</span>
                          <span style={{ fontWeight: 700, color: d.rang }}>{d.qiymat.toFixed(1)}</span>
                        </div>
                        <div style={{ background: 'var(--surface-2)', borderRadius: '6px', height: '10px', overflow: 'hidden' }}>
                          <div style={{ width: `${(d.qiymat / 5) * 100}%`, height: '100%', background: d.rang, borderRadius: '6px', transition: 'width .4s' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Operatsiya kuzatuvi — yaqin bosqichlar */}
            <div style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <h3 style={{ ...cardTitle, margin: 0 }}>Operatsiya kuzatuvi — yaqin bosqichlar</h3>
                <span style={{ fontSize: '12.5px', color: 'var(--muted)' }}>{faolKuzatuv} ta faol kuzatuv</span>
              </div>
              {yaqinBosqichlar.length === 0 ? (
                <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Yaqin bosqich yo&apos;q. (Barcha kuzatuvlar yakunlangan yoki mavjud emas.)</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ background: 'var(--surface-2)' }}>
                        {['Bemor', 'Operatsiya', 'Keyingi bosqich', 'Qoldi'].map((h) => (
                          <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: 'var(--muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {yaqinBosqichlar.map((y, i) => (
                        <tr key={i} style={{ borderTop: '1px solid var(--line)' }}>
                          <td style={{ padding: '10px 14px', fontWeight: 600 }}>{y.bemor}</td>
                          <td style={{ padding: '10px 14px', color: 'var(--ink-soft)' }}>{y.operatsiya}</td>
                          <td style={{ padding: '10px 14px' }}>
                            <span style={{ background: 'var(--accent-soft)', color: 'var(--accent)', borderRadius: '999px', padding: '2px 10px', fontWeight: 700, fontSize: '12px' }}>{y.bosqich}</span>
                          </td>
                          <td style={{ padding: '10px 14px', color: y.qoldi <= 2 ? 'var(--danger)' : 'var(--ink-soft)', fontWeight: 600 }}>
                            {y.qoldi === 0 ? 'Bugun' : `${y.qoldi} kun`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p style={{ margin: '12px 0 0', fontSize: '11.5px', color: 'var(--muted)' }}>
                    Bosqichlar: {POSTOP_JADVALI.map((b) => b.nom).join(' · ')}. Har bosqichda bemorga avtomatik push yuboriladi.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AppShell>
  )
}
