'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { T, card } from '../_theme'
import { USULLAR, USUL_IDLARI, type UsulId } from '@/lib/varikotseleUsullari'

type Yozuv = {
  method: UsulId
  followup: number
  recur: boolean
  hydro: boolean
  semen: boolean
  preg: boolean
}

const LIT_SEMEN: Record<UsulId, string> = { lap: '60–70%', micro: '70–80%', sklero: '50–65%', palomo: '55–70%', ivan: '55–70%' }
const LIT_PREG: Record<UsulId, string> = { lap: '30–40%', micro: '40–45%', sklero: '25–35%', palomo: '30–40%', ivan: '30–40%' }

const METRICS = [
  { key: 'recur', label: 'Retsidiv darajasi', dir: 'lower' as const, lit: (id: UsulId) => USULLAR[id].recur },
  { key: 'hydro', label: 'Gidrotsele darajasi', dir: 'lower' as const, lit: (id: UsulId) => USULLAR[id].hydro },
  { key: 'semen', label: 'Spermogramma yaxshilanishi', dir: 'higher' as const, lit: (id: UsulId) => LIT_SEMEN[id] },
  { key: 'preg', label: 'Homiladorlik darajasi', dir: 'higher' as const, lit: (id: UsulId) => LIT_PREG[id] },
] as const

export default function StatistikaPage() {
  const supabase = createClient()
  const [yozuvlar, setYozuvlar] = useState<Yozuv[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('varikotsele_tadqiqot').select('method,followup,recur,hydro,semen,preg').then(({ data }) => {
      setYozuvlar((data as Yozuv[]) ?? [])
      setLoading(false)
    })
  }, [])

  if (loading) return <p style={{ color: T.muted }}>Yuklanmoqda...</p>

  const byMethod = Object.fromEntries(USUL_IDLARI.map((id) => [id, yozuvlar.filter((y) => y.method === id)])) as Record<UsulId, Yozuv[]>
  const pct = (arr: Yozuv[], key: 'recur' | 'hydro' | 'semen' | 'preg') => arr.length ? Math.round((arr.filter((y) => y[key]).length / arr.length) * 100) : 0
  const avgFollow = yozuvlar.length ? yozuvlar.reduce((s, y) => s + (y.followup || 0), 0) / yozuvlar.length : 0

  return (
    <div>
      <div style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 600, letterSpacing: '.13em', textTransform: 'uppercase', color: T.teal, marginBottom: 10 }}>
        Statistik tahlil
      </div>
      <h1 style={{ fontSize: 27, fontWeight: 800, letterSpacing: '-.025em', marginBottom: 8 }}>Usullar samaradorligini qiyoslash</h1>
      <p style={{ color: T.inkSoft, fontSize: 15.5, maxWidth: '62ch' }}>
        O&apos;z bazangizdagi ma&apos;lumotlar asosida besh usulning natijalari hisoblanadi va ilmiy adabiyot bilan solishtiriladi.
      </p>

      {yozuvlar.length === 0 ? (
        <div style={{ ...card, marginTop: 22, textAlign: 'center', padding: '48px 24px' }}>
          <h3 style={{ fontSize: 16, color: T.inkSoft, marginBottom: 6 }}>Tahlil uchun ma&apos;lumot yo&apos;q</h3>
          <p style={{ fontSize: 13.5, color: T.muted, margin: 0 }}>Statistikani ko&apos;rish uchun bemorlar bazasiga kamida bir necha yozuv qo&apos;shing.</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginTop: 22 }}>
            <div style={card}><div style={{ fontFamily: 'monospace', fontSize: 30, fontWeight: 600 }}>{yozuvlar.length}</div><div style={{ fontSize: 12.5, color: T.muted, marginTop: 7 }}>Jami bemorlar</div></div>
            {USUL_IDLARI.map((id) => (
              <div key={id} style={card}>
                <div style={{ fontFamily: 'monospace', fontSize: 30, fontWeight: 600, color: USULLAR[id].color }}>{byMethod[id].length}</div>
                <div style={{ fontSize: 12.5, color: T.muted, marginTop: 7 }}>{USULLAR[id].nom}</div>
              </div>
            ))}
            <div style={card}><div style={{ fontFamily: 'monospace', fontSize: 30, fontWeight: 600 }}>{avgFollow.toFixed(0)}<span style={{ fontSize: 14 }}> oy</span></div><div style={{ fontSize: 12.5, color: T.muted, marginTop: 7 }}>O&apos;rtacha kuzatuv</div></div>
          </div>

          <div style={{ fontSize: 18, fontWeight: 700, margin: '34px 0 14px' }}>Natijalar bo&apos;yicha qiyoslash (sizning bazangiz)</div>
          <div style={card}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {METRICS.map((m) => {
                const vals = USUL_IDLARI.map((id) => pct(byMethod[id], m.key))
                const maxv = Math.max(...vals, 10)
                return (
                  <div key={m.key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, fontWeight: 600, marginBottom: 8, color: T.inkSoft }}>
                      <span>{m.label}</span>
                      <span style={{ fontFamily: 'monospace', fontWeight: 500, color: T.muted, fontSize: 11.5 }}>{m.dir === 'lower' ? 'past = yaxshi' : 'yuqori = yaxshi'}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {USUL_IDLARI.map((id, i) => (
                        <div key={id} style={{ display: 'grid', gridTemplateColumns: '130px 1fr 50px', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontFamily: 'monospace', fontSize: 11, color: T.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{USULLAR[id].nom}</span>
                          <span style={{ background: T.surface2, borderRadius: 6, height: 20, overflow: 'hidden', display: 'block' }}>
                            <i style={{ display: 'block', height: '100%', borderRadius: 6, background: USULLAR[id].color, width: `${Math.round((vals[i] / maxv) * 100)}%` }} />
                          </span>
                          <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 600, textAlign: 'right', color: USULLAR[id].color }}>{vals[i]}%</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: 11, color: T.muted, borderLeft: `2px solid #C5D4D5`, paddingLeft: 10, marginTop: 6 }}>
                      Adabiyot: {USUL_IDLARI.map((id) => `${USULLAR[id].nom} ${m.lit(id)}`).join(' · ')}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <p style={{ fontSize: 12, color: T.muted, marginTop: 12 }}>Sizning natijalaringiz yuqoridagi adabiyot diapazonlari bilan solishtiriladi.</p>
        </>
      )}
    </div>
  )
}
