'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/AppShell'

const DARAJALAR = [
  {
    ball: 0, rang: '#6b7280',
    nom: '0-daraja — Ereksiya yo\'q',
    tavsif: 'Jinsiy qo\'zg\'alishga qaramay, penis kattalashmaydi.',
    taqqos: null,
  },
  {
    ball: 1, rang: '#dc2626',
    nom: '1-daraja — Katta, lekin qattiq emas',
    tavsif: 'Penis kattalashadi, lekin penetratsiya uchun etarli darajada qattiqlashmaydi.',
    taqqos: '🥩 Tofu ga o\'xshaydi — yumshoq',
  },
  {
    ball: 2, rang: '#f97316',
    nom: '2-daraja — Qattiq, lekin to\'liq rigidlik yo\'q',
    tavsif: 'Qisman qattiqlashgan, ammo penetratsiya qiyin.',
    taqqos: '🍌 Terilgan banan ga o\'xshaydi',
  },
  {
    ball: 3, rang: '#eab308',
    nom: '3-daraja — Qattiq, lekin to\'liq rigidlik emas',
    tavsif: 'Penetratsiya uchun etarli, lekin maksimal rigidlik yo\'q.',
    taqqos: '🍌 Terilanmagan banan ga o\'xshaydi',
  },
  {
    ball: 4, rang: '#16a34a',
    nom: '4-daraja — To\'liq rigidlik',
    tavsif: 'Penis to\'liq qattiq va mutlaq rigid — normaga mos ereksiya.',
    taqqos: '🥒 Bodring ga o\'xshaydi — to\'liq qattiq',
  },
]

export default function EHSPage() {
  const router = useRouter()
  const [tanlangan, setTanlangan] = useState<number | null>(null)

  const natija = tanlangan !== null ? DARAJALAR[tanlangan] : null

  return (
    <AppShell title="EHS — Ereksiya Qattiqligi Shkala">
      <div className="mx-auto max-w-[820px] px-8 py-8">
        <button onClick={() => router.push('/doctor/calculators')} style={{
          background: 'none', border: 'none', color: 'var(--muted)', fontSize: '13px', cursor: 'pointer',
          padding: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          ← Kalkulyatorlarga qaytish
        </button>

        <div className="rise" style={{
          background: 'linear-gradient(135deg, #7c3aed, #db2777)', color: 'white',
          borderRadius: '18px', padding: '26px 28px', marginBottom: '20px',
        }}>
          <h2 style={{ margin: 0, fontSize: '21px', fontWeight: 800 }}>EHS — Ereksiya Qattiqligi Shkala</h2>
          <p style={{ margin: '8px 0 0', fontSize: '14px', opacity: 0.92, maxWidth: '60ch' }}>
            <strong>EHS</strong> (Erection Hardness Score) — ereksiya qattiqligi darajasini 4 bosqichli shkala orqali baholash uchun
            kliniklarda keng qo&apos;llaniladigan oddiy va tezkor vosita. EAU guidelines tomonidan tavsiya etilgan.
          </p>
        </div>

        <div className="rise" style={{
          background: 'var(--surface)', border: '1px solid var(--line)',
          borderRadius: '14px', padding: '20px 22px', marginBottom: '16px',
        }}>
          <p style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>
            Bemordan so&apos;rang: «Jinsiy aloq paytida ereksiyangiz qanchalik qattiq bo&apos;ladi?»
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {DARAJALAR.map((d) => (
              <button
                key={d.ball}
                onClick={() => setTanlangan(d.ball)}
                className="soft-press"
                style={{
                  textAlign: 'left', padding: '14px 18px', borderRadius: '12px', cursor: 'pointer',
                  border: tanlangan === d.ball ? `2px solid ${d.rang}` : '1px solid var(--line)',
                  background: tanlangan === d.ball ? d.rang + '18' : 'var(--surface-2)',
                  transition: 'all .15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%', background: d.rang,
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '15px', fontWeight: 800, flexShrink: 0,
                  }}>{d.ball}</div>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: d.ball === tanlangan ? d.rang : 'var(--ink)' }}>
                      {d.nom}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>{d.tavsif}</div>
                    {d.taqqos && <div style={{ fontSize: '11.5px', color: d.rang, marginTop: '3px', fontWeight: 600 }}>{d.taqqos}</div>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {natija && (
          <div className="rise" style={{
            background: natija.rang + '18', border: `2px solid ${natija.rang}`,
            borderRadius: '16px', padding: '22px 24px', marginBottom: '20px',
          }}>
            <div style={{ fontSize: '12px', color: natija.rang, textTransform: 'uppercase', fontWeight: 800, letterSpacing: '.04em', marginBottom: '8px' }}>
              Tanlangan daraja
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: natija.rang }}>{natija.nom}</div>
            <p style={{ margin: '8px 0 0', fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              {natija.ball < 3
                ? '⚠️ EHS < 3 — erektil disfunksiya mavjud. IIEF-5 anketasi va qo\'shimcha tekshiruv tavsiya etiladi.'
                : natija.ball === 3
                ? '✅ EHS = 3 — klinik jihatdan yetarli, lekin optimal emas. Bemor qoniqmasligi mumkin.'
                : '✅ EHS = 4 — normal ereksiya. Erektil disfunksiya belgilari yo\'q.'}
            </p>
          </div>
        )}

        <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '22px 24px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
            Standart haqida
          </h3>
          <div style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>EHS</strong> 1998-yilda Mulhall tomonidan tavsiya etilgan va kliniklarda ereksiya sifatini tezkor baholash uchun keng qo&apos;llaniladi.
              IIEF-5 bilan birga ishlatilganda erektil disfunksiya diagnostikasini to&apos;ldiradi.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>EHS ≥ 3</strong> penetratsiya uchun etarli deb hisoblanadi. <strong style={{ color: 'var(--ink)' }}>EHS &lt; 3</strong> esa erektil disfunksiya diagnostik mezoni sifatida ishlatiladi.
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>
              Manba: Mulhall JP et al. (1998). J Urol. EAU Guidelines on Sexual and Reproductive Health (2023).
              Faqat klinik yordamchi vosita — tashxis va davolash shifokor tomonidan belgilanadi.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
