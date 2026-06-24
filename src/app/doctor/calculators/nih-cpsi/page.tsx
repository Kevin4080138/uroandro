'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/AppShell'

// NIH-CPSI — 9 savol, 3 domenga bo'lingan: og'riq (1-4), siyish (5-6), hayot sifati (7-9)
const OGRIQ_SAVOLLARI = [
  { matn: "So'nggi hafta ichida quyidagi joylarda og'riq yoki noqulaylik his qildingizmi: oraliq (anus va moshonka orasi) yoki prostata sohasida?", variantlar: ['Yo\'q', 'Ha'] },
  { matn: "So'nggi hafta ichida quyidagi joylarda og'riq yoki noqulaylik his qildingizmi: moyaklarda?", variantlar: ['Yo\'q', 'Ha'] },
  { matn: "So'nggi hafta ichida quyidagi joylarda og'riq yoki noqulaylik his qildingizmi: jinsiy a'zo uchida (siyish bilan bog'liq emas)?", variantlar: ['Yo\'q', 'Ha'] },
  { matn: "So'nggi hafta ichida quyidagi joylarda og'riq yoki noqulaylik his qildingizmi: pastki qorin sohasida yoki qovuq ustida?", variantlar: ['Yo\'q', 'Ha'] },
] as const

const OGRIQ_DAVOMIYLIK = ["So'nggi hafta ichida yuqoridagi og'riq/noqulaylikni qanchalik tez-tez his qildingiz?"]
const OGRIQ_DAVOMIYLIK_VARIANTLAR = ['Hech qachon', 'Kamdan-kam', 'Ba\'zan', "Ko'pincha", 'Deyarli har doim', 'Har doim']

const OGRIQ_DARAJASI = ["So'nggi hafta ichidagi og'riq/noqulaylikni o'rtacha darajasini 0–10 shkalada baholang (0 — og'riq yo'q, 10 — eng kuchli og'riq)"]

const SIYISH_SAVOLLARI = [
  { matn: "So'nggi hafta ichida siyib bo'lgandan keyin qovuq to'liq bo'shamagandek tuyulgan holatlar qanchalik tez-tez bo'ldi?", variantlar: ['Hech qachon', '5 martadan kamida 1', 'Yarmidan kamida', 'Taxminan yarmida', 'Yarmidan ko\'pida', 'Deyarli har doim'] },
  { matn: "So'nggi hafta ichida siyib bo'lgandan keyin 2 soat o'tmay yana siyish ehtiyoji qanchalik tez-tez bo'ldi?", variantlar: ['Hech qachon', '5 martadan kamida 1', 'Yarmidan kamida', 'Taxminan yarmida', 'Yarmidan ko\'pida', 'Deyarli har doim'] },
] as const

const QOL_SAVOLLARI = [
  { matn: "So'nggi hafta ichida simptomlaringiz odatdagi kundalik faoliyatingizni qanchalik cheklab qo'ydi?", variantlar: ['Umuman yo\'q', 'Faqat sal', "Biroz", "Ko'p"] },
  { matn: "So'nggi hafta ichida simptomlaringiz haqida qanchalik tez-tez o'ylab yurdingiz?", variantlar: ['Umuman yo\'q', 'Faqat sal', "Biroz", "Ko'p"] },
  { matn: "Agar qolgan umringizni so'nggi hafta davomidagi simptomlar bilan o'tkazishga to'g'ri kelsa, bu sizni qanday his qildirardi?", variantlar: ['Juda yaxshi', 'Yaxshi', 'Aralash', 'Yomon', 'Juda yomon', 'Dahshatli'] },
] as const

function daraja(jami: number) {
  if (jami <= 9) return { nom: 'Yengil simptomlar', rang: '#16a34a' }
  if (jami <= 18) return { nom: "O'rtacha simptomlar", rang: '#d97706' }
  return { nom: "Og'ir simptomlar", rang: '#dc2626' }
}

export default function NIHCPSIPage() {
  const router = useRouter()
  const [ogriqJoy, setOgriqJoy] = useState<(number | null)[]>(Array(4).fill(null))
  const [ogriqTezTez, setOgriqTezTez] = useState<number | null>(null)
  const [ogriqDaraja, setOgriqDaraja] = useState<number | null>(null)
  const [siyish, setSiyish] = useState<(number | null)[]>(Array(2).fill(null))
  const [qol, setQol] = useState<(number | null)[]>(Array(3).fill(null))

  const tuldi = ogriqJoy.every((v) => v !== null) && ogriqTezTez !== null && ogriqDaraja !== null
    && siyish.every((v) => v !== null) && qol.every((v) => v !== null)

  const ogriqBall = useMemo(() => {
    const joySoni = ogriqJoy.filter((v) => v === 1).length
    return joySoni + (ogriqTezTez ?? 0) + (ogriqDaraja ?? 0)
  }, [ogriqJoy, ogriqTezTez, ogriqDaraja])

  const siyishBall = useMemo(() => siyish.reduce((s: number, v) => s + (v ?? 0), 0), [siyish])
  const qolBall = useMemo(() => qol.reduce((s: number, v) => s + (v ?? 0), 0), [qol])
  const jami = ogriqBall + siyishBall + qolBall
  const natija = daraja(jami)

  return (
    <AppShell title="NIH-CPSI">
      <div className="mx-auto max-w-[820px] px-8 py-8">
        <button onClick={() => router.push('/doctor/calculators')} style={{
          background: 'none', border: 'none', color: 'var(--muted)', fontSize: '13px', cursor: 'pointer',
          padding: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          ← Kalkulyatorlarga qaytish
        </button>

        <div className="rise" style={{
          background: 'linear-gradient(135deg, #b91c1c, #ea580c)', color: 'white',
          borderRadius: '18px', padding: '26px 28px', marginBottom: '20px',
        }}>
          <h2 style={{ margin: 0, fontSize: '21px', fontWeight: 800 }}>NIH-CPSI</h2>
          <p style={{ margin: '8px 0 0', fontSize: '14px', opacity: 0.92, maxWidth: '60ch' }}>
            <strong>NIH-CPSI</strong> — <em>National Institutes of Health Chronic Prostatitis Symptom Index</em>
            (AQSh Milliy sog'liqni saqlash institutlarining surunkali prostatit simptomlari indeksi) —
            surunkali prostatit / kichik chanoq og'rig'i sindromi (<strong>CP/CPPS</strong>) bemorlarida og'riq,
            siyish simptomlari va hayot sifatini standartlashtirilgan baholash uchun ishlatiladi.
          </p>
        </div>

        {/* Domen 1: og'riq joylashishi */}
        <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '18px 20px', marginBottom: '12px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>Og'riq / noqulaylik (joylashishi)</h3>
          {OGRIQ_SAVOLLARI.map((s, i) => (
            <div key={i} style={{ marginBottom: i < 3 ? '14px' : 0 }}>
              <p style={{ margin: '0 0 8px', fontSize: '13.5px', fontWeight: 600 }}>{s.matn}</p>
              <div style={{ display: 'flex', gap: '6px' }}>
                {s.variantlar.map((v, vi) => (
                  <button key={v} onClick={() => setOgriqJoy((arr) => arr.map((x, j) => (j === i ? vi : x)))} className="soft-press" style={{
                    border: ogriqJoy[i] === vi ? 'none' : '1px solid var(--line)',
                    background: ogriqJoy[i] === vi ? 'var(--accent)' : 'var(--surface-2)', color: ogriqJoy[i] === vi ? 'white' : 'var(--ink-soft)',
                    borderRadius: '999px', padding: '6px 16px', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer',
                  }}>{v}</button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Og'riq tez-tezligi */}
        <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '18px 20px', marginBottom: '12px' }}>
          <p style={{ margin: '0 0 10px', fontSize: '13.5px', fontWeight: 600 }}>{OGRIQ_DAVOMIYLIK[0]}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {OGRIQ_DAVOMIYLIK_VARIANTLAR.map((v, vi) => (
              <button key={v} onClick={() => setOgriqTezTez(vi)} className="soft-press" style={{
                border: ogriqTezTez === vi ? 'none' : '1px solid var(--line)',
                background: ogriqTezTez === vi ? 'var(--accent)' : 'var(--surface-2)', color: ogriqTezTez === vi ? 'white' : 'var(--ink-soft)',
                borderRadius: '999px', padding: '6px 13px', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer',
              }}>{v} <span style={{ opacity: 0.7 }}>({vi})</span></button>
            ))}
          </div>
        </div>

        {/* Og'riq darajasi 0-10 */}
        <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '18px 20px', marginBottom: '12px' }}>
          <p style={{ margin: '0 0 10px', fontSize: '13.5px', fontWeight: 600 }}>{OGRIQ_DARAJASI[0]}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {Array.from({ length: 11 }, (_, n) => n).map((n) => (
              <button key={n} onClick={() => setOgriqDaraja(n)} className="soft-press" style={{
                width: '34px', height: '34px', border: ogriqDaraja === n ? 'none' : '1px solid var(--line)',
                background: ogriqDaraja === n ? 'var(--accent)' : 'var(--surface-2)', color: ogriqDaraja === n ? 'white' : 'var(--ink-soft)',
                borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
              }}>{n}</button>
            ))}
          </div>
        </div>

        {/* Domen 2: siyish */}
        <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '18px 20px', marginBottom: '12px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>Siyish simptomlari</h3>
          {SIYISH_SAVOLLARI.map((s, i) => (
            <div key={i} style={{ marginBottom: i < 1 ? '14px' : 0 }}>
              <p style={{ margin: '0 0 8px', fontSize: '13.5px', fontWeight: 600 }}>{s.matn}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {s.variantlar.map((v, vi) => (
                  <button key={v} onClick={() => setSiyish((arr) => arr.map((x, j) => (j === i ? vi : x)))} className="soft-press" style={{
                    border: siyish[i] === vi ? 'none' : '1px solid var(--line)',
                    background: siyish[i] === vi ? 'var(--accent)' : 'var(--surface-2)', color: siyish[i] === vi ? 'white' : 'var(--ink-soft)',
                    borderRadius: '999px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                  }}>{v} <span style={{ opacity: 0.7 }}>({vi})</span></button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Domen 3: hayot sifati */}
        <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '18px 20px', marginBottom: '18px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>Hayot sifatiga ta'siri</h3>
          {QOL_SAVOLLARI.map((s, i) => (
            <div key={i} style={{ marginBottom: i < 2 ? '14px' : 0 }}>
              <p style={{ margin: '0 0 8px', fontSize: '13.5px', fontWeight: 600 }}>{s.matn}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {s.variantlar.map((v, vi) => (
                  <button key={v} onClick={() => setQol((arr) => arr.map((x, j) => (j === i ? vi : x)))} className="soft-press" style={{
                    border: qol[i] === vi ? 'none' : '1px solid var(--line)',
                    background: qol[i] === vi ? 'var(--accent)' : 'var(--surface-2)', color: qol[i] === vi ? 'white' : 'var(--ink-soft)',
                    borderRadius: '999px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                  }}>{v} <span style={{ opacity: 0.7 }}>({vi})</span></button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Natija */}
        <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '24px 26px', marginBottom: '20px' }}>
          {!tuldi ? (
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px' }}>Natijani ko'rish uchun barcha savollarga javob bering.</p>
          ) : (
            <>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '14px' }}>
                <div><div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700 }}>OG'RIQ (0–21)</div><div style={{ fontSize: '22px', fontWeight: 800 }}>{ogriqBall}</div></div>
                <div><div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700 }}>SIYISH (0–10)</div><div style={{ fontSize: '22px', fontWeight: 800 }}>{siyishBall}</div></div>
                <div><div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700 }}>HAYOT SIFATI (0–12)</div><div style={{ fontSize: '22px', fontWeight: 800 }}>{qolBall}</div></div>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '.04em' }}>Jami ball (0–43)</div>
              <div style={{ fontSize: '40px', fontWeight: 800, color: natija.rang, lineHeight: 1.1 }}>{jami}</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: natija.rang, marginTop: '2px' }}>{natija.nom}</div>
            </>
          )}
        </div>

        <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '22px 24px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
            Standart haqida
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>NIH-CPSI</strong>ni AQSh Milliy sog'liqni saqlash instituti (NIH) homiyligida
              1999-yilda Litwin va hammualliflari ishlab chiqqan — <strong>surunkali prostatit/kichik chanoq og'rig'i
              sindromi (CP/CPPS — Chronic Prostatitis/Chronic Pelvic Pain Syndrome)</strong> bemorlarini baholash uchun
              standartlashtirilgan, validatsiya qilingan vosita.
            </p>
            <p style={{ margin: 0 }}>Anketa 3 domendan iborat:</p>
            <ul style={{ margin: '0 0 0 18px', padding: 0 }}>
              <li><strong>Og'riq/noqulaylik</strong> (0–21 ball) — joylashishi, tez-tezligi va darajasi</li>
              <li><strong>Siyish simptomlari</strong> (0–10 ball) — to'liq bo'shamaslik va tez-tez siyish</li>
              <li><strong>Hayot sifatiga ta'siri</strong> (0–12 ball)</li>
            </ul>
            <p style={{ margin: 0 }}>
              Jami ball <strong style={{ color: 'var(--ink)' }}>0–43</strong> oralig'ida: <strong style={{ color: '#16a34a' }}>0–9</strong> yengil,
              <strong style={{ color: '#d97706' }}> 10–18</strong> o'rtacha, <strong style={{ color: '#dc2626' }}>19–43</strong> og'ir simptomlarni bildiradi.
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>
              Manba: Litwin MS va boshq. (1999) NIH-CPSI validatsiya tadqiqoti. EAU/AUA surunkali prostatit qo'llanmalari. Bu kalkulyator faqat klinik yordamchi vosita — bakterial va abakterial prostatitni farqlash uchun qo'shimcha tekshiruv (siydik/prostata suyuqligi tahlili) zarur.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
