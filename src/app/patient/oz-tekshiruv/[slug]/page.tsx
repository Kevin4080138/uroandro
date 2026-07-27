'use client'

import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { yoriqnomaTop } from '@/lib/ozTekshiruv'
import { OzTekshiruvIkon } from '@/components/OzTekshiruvIkon'
import { useState } from 'react'
import { Lightbulb, AlertTriangle, Repeat } from 'lucide-react'

// ── IIEF-5 kalkulyatori ────────────────────────────────────────────
const IIEF5_SAVOLLAR = [
  {
    id: 1,
    matn: 'Ereksiyaga erishish imkoniyatingizga qanchalik ishonchingiz bor edi?',
    javoblar: ['1 — Juda past', '2 — Past', '3 — O\'rtacha', '4 — Yuqori', '5 — Juda yuqori'],
    boshlash: 1,
  },
  {
    id: 2,
    matn: 'Jinsiy stimulyatsiya bo\'lganda ereksiyaniz kiritish uchun yetarlicha mustahkam bo\'ldimi?',
    javoblar: ['0 — Jinsiy aloqa bo\'lmadi', '1 — Deyarli hech qachon', '2 — Kamdan-kam (yarimdan kam)', '3 — Ba\'zan (taxminan yarmi)', '4 — Ko\'p vaqt (yarimdan ko\'p)', '5 — Deyarli doim'],
    boshlash: 0,
  },
  {
    id: 3,
    matn: 'Jinsiy aloqa davomida kiritgandan keyin ereksiyaniz davom etdimi?',
    javoblar: ['0 — Jinsiy aloqa bo\'lmadi', '1 — Deyarli hech qachon', '2 — Kamdan-kam', '3 — Ba\'zan', '4 — Ko\'p vaqt', '5 — Deyarli doim'],
    boshlash: 0,
  },
  {
    id: 4,
    matn: 'Jinsiy aloqani yakunlash uchun ereksiyanizni saqlab qolish qanchalik qiyin bo\'ldi?',
    javoblar: ['1 — Juda qiyin', '2 — Qiyin', '3 — O\'rtacha', '4 — Oson', '5 — Juda oson'],
    boshlash: 1,
  },
  {
    id: 5,
    matn: 'Jinsiy aloqa urinishlaringiz qanchalik qoniqarli bo\'ldi?',
    javoblar: ['0 — Jinsiy aloqa bo\'lmadi', '1 — Deyarli hech qachon', '2 — Kamdan-kam', '3 — Ba\'zan', '4 — Ko\'p vaqt', '5 — Deyarli doim'],
    boshlash: 0,
  },
]

function iief5Natija(ball: number) {
  if (ball >= 22) return { daraja: 'Normal', rang: '#16a34a', tavsiya: 'Erektil funksiyangiz normal darajada. Sog\'lom turmush tarzini davom ettiring.' }
  if (ball >= 17) return { daraja: 'Yengil ED', rang: '#ca8a04', tavsiya: 'Yengil erektil disfunksiya belgilari bor. Stress, charchoq yoki psixologik omillar ta\'sir qilishi mumkin. Shifokor bilan maslahat oling.' }
  if (ball >= 12) return { daraja: 'Yengil–o\'rta ED', rang: '#ea580c', tavsiya: 'Yengil-o\'rta darajadagi ED. Urologga murojaat qilish tavsiya etiladi. Gormonal tekshiruv va qon tomir holati baholanishi kerak.' }
  if (ball >= 8) return { daraja: 'O\'rta darajali ED', rang: '#dc2626', tavsiya: 'O\'rta darajali ED. Shifokorga tezroq murojaat qiling. Ushbu holat davolanishi mumkin — kechiktirmang.' }
  return { daraja: 'Og\'ir ED', rang: '#991b1b', tavsiya: 'Og\'ir erektil disfunksiya. Darhol urolog bilan maslahatlashing. Kompleks tekshiruv zarur.' }
}

function IIEF5Kalkulator({ onMurojaat }: { onMurojaat: () => void }) {
  const [yosh, setYosh] = useState('')
  const [javoblar, setJavoblar] = useState<Record<number, number>>({})
  const [natija, setNatija] = useState<null | { ball: number; daraja: string; rang: string; tavsiya: string }>(null)

  const hisoblash = () => {
    const jami = Object.values(javoblar).reduce((s, v) => s + v, 0)
    const n = iief5Natija(jami)
    setNatija({ ball: jami, ...n })
  }

  const hammaToldirilganmi = IIEF5_SAVOLLAR.every(s => javoblar[s.id] !== undefined)

  if (natija) {
    return (
      <div>
        <div className="rise" style={{
          background: `${natija.rang}18`, border: `2px solid ${natija.rang}`, borderRadius: '18px',
          padding: '28px 28px', marginBottom: '20px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '40px', fontWeight: 900, color: natija.rang }}>{natija.ball}</div>
          <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '2px' }}>25 balldan</div>
          <div style={{
            display: 'inline-block', marginTop: '12px', background: natija.rang, color: 'white',
            borderRadius: '20px', padding: '6px 18px', fontSize: '14px', fontWeight: 700,
          }}>
            {natija.daraja}
          </div>
          <p style={{ margin: '16px 0 0', fontSize: '14px', lineHeight: 1.6, color: 'var(--ink-soft)' }}>{natija.tavsiya}</p>
          {yosh && (
            <p style={{ margin: '8px 0 0', fontSize: '12.5px', color: 'var(--muted)' }}>
              Yosh: {yosh} yosh
              {parseInt(yosh) > 50 && natija.ball < 17 ? ' · 50+ yoshda ED xavfi oshadi — gormonal tekshiruv muhim.' : ''}
            </p>
          )}
        </div>

        <div style={{
          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
          padding: '16px 20px', marginBottom: '16px', fontSize: '13px', lineHeight: 1.6, color: 'var(--ink-soft)',
        }}>
          <strong style={{ color: 'var(--ink)', display: 'block', marginBottom: '8px' }}>Tavsiya etiladigan tahlillar:</strong>
          <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <li>Testosteron (umumiy va erkin)</li>
            <li>Prolaktin, LH, FSH</li>
            <li>Qon shakarи (glyukoza, HbA1c)</li>
            <li>Umumiy qon tahlili, lipid profili</li>
            <li>Qon bosimi o'lchash</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => { setNatija(null); setJavoblar({}) }}
            style={{
              flex: 1, background: 'var(--surface)', border: '1px solid var(--line)',
              borderRadius: '12px', padding: '14px', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', color: 'var(--ink)',
            }}
          >
            Qayta boshlash
          </button>
          <button
            onClick={onMurojaat}
            style={{
              flex: 2, background: 'var(--accent)', color: 'white', border: 'none',
              borderRadius: '12px', padding: '14px', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
            }}
          >
            Shifokorga murojaat →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', display: 'block', marginBottom: '8px' }}>
          Yoshingiz (ixtiyoriy)
        </label>
        <input
          type="number"
          min={18}
          max={90}
          value={yosh}
          onChange={e => setYosh(e.target.value)}
          placeholder="Masalan: 42"
          style={{
            width: '120px', padding: '10px 14px', borderRadius: '10px',
            border: '1px solid var(--line)', background: 'var(--surface)',
            fontSize: '15px', color: 'var(--ink)', outline: 'none',
          }}
        />
      </div>

      <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--muted)' }}>
        So&apos;nggi <strong>4 hafta</strong> ichidagi holatni baholang:
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {IIEF5_SAVOLLAR.map((savol, si) => (
          <div key={savol.id} className="rise" style={{
            animationDelay: `${si * 0.06}s`,
            background: 'var(--surface)', border: `1px solid ${javoblar[savol.id] !== undefined ? 'var(--accent)' : 'var(--line)'}`,
            borderRadius: '14px', padding: '18px 20px',
          }}>
            <p style={{ margin: '0 0 12px', fontSize: '13.5px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.5 }}>
              {si + 1}. {savol.matn}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {savol.javoblar.map((j, ji) => {
                const qiymat = savol.boshlash + ji
                const tanlangan = javoblar[savol.id] === qiymat
                return (
                  <button
                    key={ji}
                    onClick={() => setJavoblar(prev => ({ ...prev, [savol.id]: qiymat }))}
                    style={{
                      textAlign: 'left', background: tanlangan ? 'var(--accent)' : 'var(--surface-2)',
                      color: tanlangan ? 'white' : 'var(--ink-soft)', border: 'none',
                      borderRadius: '9px', padding: '9px 14px', fontSize: '13px', cursor: 'pointer',
                      fontWeight: tanlangan ? 600 : 400, transition: 'all .15s',
                    }}
                  >
                    {j}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={hisoblash}
        disabled={!hammaToldirilganmi}
        className="btn-animated"
        style={{
          width: '100%', marginTop: '20px', background: hammaToldirilganmi ? 'var(--accent)' : 'var(--surface-2)',
          color: hammaToldirilganmi ? 'white' : 'var(--muted)', border: 'none', borderRadius: '12px',
          padding: '16px', fontSize: '15px', fontWeight: 700,
          cursor: hammaToldirilganmi ? 'pointer' : 'not-allowed', transition: 'all .2s',
        }}
      >
        Natijani ko&apos;rish
      </button>
    </div>
  )
}

// ── PEDT + IELT kalkulyatori ───────────────────────────────────────
const PEDT_SAVOLLAR = [
  {
    id: 1,
    matn: 'Ejakulyatsiyani kechiktirish qanchalik qiyin?',
    javoblar: ['1 — Umuman qiyin emas', '2 — Biroz qiyin', '3 — O\'rtacha', '4 — Juda qiyin', '5 — Mumkin emas'],
  },
  {
    id: 2,
    matn: 'Xohlamagan holda erta ejakulyatsiya sodir bo\'ladimi?',
    javoblar: ['1 — Deyarli hech qachon', '2 — Kamdan-kam', '3 — Ba\'zan', '4 — Ko\'p vaqt', '5 — Deyarli doim'],
  },
  {
    id: 3,
    matn: 'Minimal jinsiy stimulyatsiya yoki kiritishdan darhol keyin ejakulyatsiya sodir bo\'ladimi?',
    javoblar: ['1 — Deyarli hech qachon', '2 — Kamdan-kam', '3 — Ba\'zan', '4 — Ko\'p vaqt', '5 — Deyarli doim'],
  },
  {
    id: 4,
    matn: 'Erta ejakulyatsiya tufayli hamkoringiz qoniqmay qoladimi?',
    javoblar: ['1 — Umuman emas', '2 — Kamdan-kam', '3 — Ba\'zan', '4 — Ko\'p vaqt', '5 — Deyarli doim'],
  },
  {
    id: 5,
    matn: 'Erta ejakulyatsiya sizga qanchalik tashvish beradi?',
    javoblar: ['1 — Umuman emas', '2 — Biroz', '3 — O\'rtacha', '4 — Juda ko\'p', '5 — Haddan ziyod'],
  },
]

function pedtNatija(ball: number, ielt: number) {
  let daraja = ''
  let rang = ''
  let tavsiya = ''

  if (ball <= 8) {
    daraja = 'Premature ejaculation yo\'q'
    rang = '#16a34a'
    tavsiya = 'Ejakulyatsiya nazoratIngiz yetarli darajada. Agar vaqt ba\'zan qisqa bo\'lsa ham, bu normal hisoblanadi.'
  } else if (ball <= 10) {
    daraja = 'Chegaraviy holat'
    rang = '#ca8a04'
    tavsiya = 'Ejakulyatsiya nazorati chegarada. Stres va psixologik omillar ta\'sir qilishi mumkin. Relaksatsiya texnikalarini sinab ko\'ring.'
  } else {
    daraja = 'Premature ejaculation ehtimoli yuqori'
    rang = '#dc2626'
    tavsiya = 'Tez bo\'shanish (premature ejaculation) belgilari aniq. Urolog yoki androlog bilan maslahatlashing. Davolanish samarali.'
  }

  if (ielt > 0 && ielt < 1) tavsiya += ' IELT 1 daqiqadan kam — bu klinik mezon bo\'yicha tez bo\'shanish.'
  else if (ielt >= 1 && ielt < 3) tavsiya += ' IELT 1-3 daqiqa — bu chegaraviy zona.'

  return { daraja, rang, tavsiya }
}

function PEDTKalkulator({ onMurojaat }: { onMurojaat: () => void }) {
  const [yosh, setYosh] = useState('')
  const [ielt, setIelt] = useState('')
  const [javoblar, setJavoblar] = useState<Record<number, number>>({})
  const [natija, setNatija] = useState<null | { ball: number; daraja: string; rang: string; tavsiya: string }>(null)

  const hammaToldirilganmi = PEDT_SAVOLLAR.every(s => javoblar[s.id] !== undefined)

  const hisoblash = () => {
    const ball = Object.values(javoblar).reduce((s, v) => s + v, 0)
    const ieltSon = ielt ? parseFloat(ielt) : 0
    const n = pedtNatija(ball, ieltSon)
    setNatija({ ball, ...n })
  }

  if (natija) {
    const ieltSon = ielt ? parseFloat(ielt) : null
    return (
      <div>
        <div className="rise" style={{
          background: `${natija.rang}18`, border: `2px solid ${natija.rang}`, borderRadius: '18px',
          padding: '28px 28px', marginBottom: '20px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '40px', fontWeight: 900, color: natija.rang }}>{natija.ball}</div>
          <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '2px' }}>PEDT ball (25 dan)</div>
          {ieltSon !== null && ieltSon > 0 && (
            <div style={{ fontSize: '15px', marginTop: '8px', color: 'var(--ink)' }}>
              IELT: <strong>{ieltSon} daqiqa</strong>
            </div>
          )}
          <div style={{
            display: 'inline-block', marginTop: '12px', background: natija.rang, color: 'white',
            borderRadius: '20px', padding: '6px 18px', fontSize: '14px', fontWeight: 700,
          }}>
            {natija.daraja}
          </div>
          <p style={{ margin: '16px 0 0', fontSize: '14px', lineHeight: 1.6, color: 'var(--ink-soft)' }}>{natija.tavsiya}</p>
        </div>

        {natija.ball >= 9 && (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
            padding: '16px 20px', marginBottom: '16px', fontSize: '13px', lineHeight: 1.6, color: 'var(--ink-soft)',
          }}>
            <strong style={{ color: 'var(--ink)', display: 'block', marginBottom: '8px' }}>Tavsiya etiladigan tekshiruvlar:</strong>
            <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>Testosteron va prolaktin darajasi</li>
              <li>Tiroid gormonlari (TTG)</li>
              <li>Psixologik baholash (agar stress/tashvish bo\'lsa)</li>
              <li>Urologik ko\'rik (prostatit istisno etish uchun)</li>
            </ul>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => { setNatija(null); setJavoblar({}) }}
            style={{
              flex: 1, background: 'var(--surface)', border: '1px solid var(--line)',
              borderRadius: '12px', padding: '14px', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', color: 'var(--ink)',
            }}
          >
            Qayta boshlash
          </button>
          <button
            onClick={onMurojaat}
            style={{
              flex: 2, background: 'var(--accent)', color: 'white', border: 'none',
              borderRadius: '12px', padding: '14px', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
            }}
          >
            Shifokorga murojaat →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', display: 'block', marginBottom: '6px' }}>
            Yoshingiz (ixtiyoriy)
          </label>
          <input
            type="number" min={18} max={90}
            value={yosh} onChange={e => setYosh(e.target.value)}
            placeholder="Masalan: 35"
            style={{
              width: '100%', padding: '10px 14px', borderRadius: '10px',
              border: '1px solid var(--line)', background: 'var(--surface)',
              fontSize: '15px', color: 'var(--ink)', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', display: 'block', marginBottom: '6px' }}>
            IELT — necha daqiqa? (ixtiyoriy)
          </label>
          <input
            type="number" min={0} step={0.5}
            value={ielt} onChange={e => setIelt(e.target.value)}
            placeholder="Masalan: 2.5"
            style={{
              width: '100%', padding: '10px 14px', borderRadius: '10px',
              border: '1px solid var(--line)', background: 'var(--surface)',
              fontSize: '15px', color: 'var(--ink)', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
      </div>
      <p style={{ margin: '0 0 4px', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>
        IELT — jinsiy aloqa boshlanishidan ejakulyatsiyagacha o'tgan o'rtacha vaqt (daqiqa). 3 daqiqadan kam klinik mezon hisoblanadi.
      </p>

      <p style={{ margin: '16px 0 12px', fontSize: '13px', color: 'var(--muted)' }}>
        So&apos;nggi <strong>6 oy</strong> ichidagi holatni baholang:
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {PEDT_SAVOLLAR.map((savol, si) => (
          <div key={savol.id} className="rise" style={{
            animationDelay: `${si * 0.06}s`,
            background: 'var(--surface)', border: `1px solid ${javoblar[savol.id] !== undefined ? 'var(--accent)' : 'var(--line)'}`,
            borderRadius: '14px', padding: '18px 20px',
          }}>
            <p style={{ margin: '0 0 12px', fontSize: '13.5px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.5 }}>
              {si + 1}. {savol.matn}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {savol.javoblar.map((j, ji) => {
                const qiymat = ji + 1
                const tanlangan = javoblar[savol.id] === qiymat
                return (
                  <button
                    key={ji}
                    onClick={() => setJavoblar(prev => ({ ...prev, [savol.id]: qiymat }))}
                    style={{
                      textAlign: 'left', background: tanlangan ? 'var(--accent)' : 'var(--surface-2)',
                      color: tanlangan ? 'white' : 'var(--ink-soft)', border: 'none',
                      borderRadius: '9px', padding: '9px 14px', fontSize: '13px', cursor: 'pointer',
                      fontWeight: tanlangan ? 600 : 400, transition: 'all .15s',
                    }}
                  >
                    {j}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={hisoblash}
        disabled={!hammaToldirilganmi}
        className="btn-animated"
        style={{
          width: '100%', marginTop: '20px', background: hammaToldirilganmi ? 'var(--accent)' : 'var(--surface-2)',
          color: hammaToldirilganmi ? 'white' : 'var(--muted)', border: 'none', borderRadius: '12px',
          padding: '16px', fontSize: '15px', fontWeight: 700,
          cursor: hammaToldirilganmi ? 'pointer' : 'not-allowed', transition: 'all .2s',
        }}
      >
        Natijani ko&apos;rish
      </button>
    </div>
  )
}

// ── Jinsiy zaiflik umumiy baholash ────────────────────────────────
const KASALLIKLAR = [
  { id: 'diabet', matn: 'Qandli diabet' },
  { id: 'yurak', matn: 'Yurak-qon tomir kasalligi' },
  { id: 'gipertenziya', matn: 'Yuqori qon bosimi (gipertenziya)' },
  { id: 'depressiya', matn: 'Depressiya yoki tashvish buzilishi' },
  { id: 'prostatit', matn: 'Prostatit yoki prostata muammolari' },
  { id: 'semizlik', matn: 'Ortiqcha vazn / semizlik' },
  { id: 'chekish', matn: 'Chekish (kuniga 5+ dona)' },
]

const BELGILAR = [
  { id: 'libido_past', matn: 'Jinsiy istak (libido) pasayishi' },
  { id: 'ereksiya_zaif', matn: 'Ereksiya zaifligi' },
  { id: 'tez_boshanish', matn: 'Tez bo\'shanish (ejakulyatsiya)' },
  { id: 'kechikkan_boshanish', matn: 'Kechikkan ejakulyatsiya' },
  { id: 'orgasm_yoq', matn: 'Orgazm sezilmasligi' },
  { id: 'soqol_kamaydi', matn: 'Soqol/tuk kamayishi' },
  { id: 'koqkrak', matn: 'Ko\'krak bezlari kattalashishi' },
  { id: 'charchoq', matn: 'Kuchli charchoq / energiya pastligi' },
  { id: 'kayfiyat', matn: 'Kayfiyat o\'zgarishi / depressiya' },
]

function JinsiyZaiflikKalkulator({ onMurojaat }: { onMurojaat: () => void }) {
  const [yosh, setYosh] = useState('')
  const [davom, setDavom] = useState('')
  const [kasalliklar, setKasalliklar] = useState<string[]>([])
  const [belgilar, setBelgilar] = useState<string[]>([])
  const [dorilar, setDorilar] = useState('')
  const [natija, setNatija] = useState(false)

  const toggle = (arr: string[], setArr: (v: string[]) => void, id: string) => {
    setArr(arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id])
  }

  const xavfDarajasi = () => {
    let ball = 0
    const y = parseInt(yosh) || 0
    if (y > 40) ball += 1
    if (y > 55) ball += 1
    const d = parseInt(davom) || 0
    if (d > 3) ball += 1
    if (d > 12) ball += 1
    if (kasalliklar.includes('diabet')) ball += 2
    if (kasalliklar.includes('yurak')) ball += 2
    if (kasalliklar.includes('gipertenziya')) ball += 1
    if (kasalliklar.includes('chekish')) ball += 1
    ball += Math.min(belgilar.length, 4)
    if (belgilar.includes('soqol_kamaydi') || belgilar.includes('koqkrak')) ball += 2
    if (dorilar.trim()) ball += 1

    if (ball <= 3) return { daraja: 'Past xavf', rang: '#16a34a', tavsiya: 'Hozircha klinik ko\'rsatkichlar past xavfli. Sog\'lom turmush tarzi muhim. Belgilar kuchaysa urolog bilan maslahatlashing.' }
    if (ball <= 6) return { daraja: 'O\'rta xavf', rang: '#ca8a04', tavsiya: 'O\'rta xavf. Urolog yoki androlog bilan maslahatlashish va asosiy tahlillarni topshirish tavsiya etiladi.' }
    return { daraja: 'Yuqori xavf', rang: '#dc2626', tavsiya: 'Yuqori xavf. Mutaxassisga tezroq murojaat qiling. Kompleks tekshiruv zarur.' }
  }

  const tahlillar = () => {
    const t: string[] = ['Testosteron (umumiy va erkin)', 'Prolaktin', 'LH, FSH']
    if (kasalliklar.includes('diabet') || kasalliklar.includes('semizlik')) t.push('Qon shakarи, HbA1c, insulin')
    if (kasalliklar.includes('gipertenziya') || kasalliklar.includes('yurak')) t.push('Lipid profili, EKG')
    if (belgilar.includes('soqol_kamaydi') || belgilar.includes('koqkrak')) t.push('Estradiol, SHBG')
    t.push('Umumiy qon va siydik tahlili')
    if (parseInt(yosh) > 45) t.push('PSA (prostata bezi antigeni)')
    return t
  }

  if (natija) {
    const n = xavfDarajasi()
    return (
      <div>
        <div className="rise" style={{
          background: `${n.rang}18`, border: `2px solid ${n.rang}`, borderRadius: '18px',
          padding: '24px 28px', marginBottom: '20px',
        }}>
          <div style={{
            display: 'inline-block', background: n.rang, color: 'white',
            borderRadius: '20px', padding: '6px 18px', fontSize: '14px', fontWeight: 700, marginBottom: '12px',
          }}>
            {n.daraja}
          </div>
          <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: 'var(--ink-soft)' }}>{n.tavsiya}</p>
        </div>

        <div style={{
          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
          padding: '16px 20px', marginBottom: '16px', fontSize: '13px', lineHeight: 1.65, color: 'var(--ink-soft)',
        }}>
          <strong style={{ color: 'var(--ink)', display: 'block', marginBottom: '10px' }}>Tavsiya etiladigan tahlillar:</strong>
          <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {tahlillar().map(t => <li key={t}>{t}</li>)}
          </ul>
        </div>

        {(belgilar.includes('ereksiya_zaif')) && (
          <div style={{
            background: 'var(--accent-soft)', border: '1px solid var(--accent)', borderRadius: '14px',
            padding: '14px 18px', marginBottom: '16px', fontSize: '13px', color: 'var(--ink-soft)',
            display: 'flex', alignItems: 'flex-start', gap: '8px',
          }}>
            <Lightbulb size={15} strokeWidth={2} style={{ flexShrink: 0, marginTop: '1px' }} /> <span>Ereksiya zaifligi bo&apos;lgani uchun <strong>IIEF-5 testi</strong>ni ham to&apos;ldirishingiz tavsiya etiladi.</span>
          </div>
        )}

        {(belgilar.includes('tez_boshanish')) && (
          <div style={{
            background: 'var(--accent-soft)', border: '1px solid var(--accent)', borderRadius: '14px',
            padding: '14px 18px', marginBottom: '16px', fontSize: '13px', color: 'var(--ink-soft)',
            display: 'flex', alignItems: 'flex-start', gap: '8px',
          }}>
            <Lightbulb size={15} strokeWidth={2} style={{ flexShrink: 0, marginTop: '1px' }} /> <span>Tez bo&apos;shanish bo&apos;lgani uchun <strong>PEDT testi</strong>ni ham to&apos;ldirishingiz tavsiya etiladi.</span>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setNatija(false)}
            style={{
              flex: 1, background: 'var(--surface)', border: '1px solid var(--line)',
              borderRadius: '12px', padding: '14px', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', color: 'var(--ink)',
            }}
          >
            Qayta boshlash
          </button>
          <button
            onClick={onMurojaat}
            style={{
              flex: 2, background: 'var(--accent)', color: 'white', border: 'none',
              borderRadius: '12px', padding: '14px', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
            }}
          >
            Shifokorga murojaat →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', display: 'block', marginBottom: '6px' }}>Yosh *</label>
          <input
            type="number" min={18} max={90}
            value={yosh} onChange={e => setYosh(e.target.value)}
            placeholder="Masalan: 45"
            style={{
              width: '100%', padding: '10px 14px', borderRadius: '10px',
              border: '1px solid var(--line)', background: 'var(--surface)',
              fontSize: '15px', color: 'var(--ink)', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', display: 'block', marginBottom: '6px' }}>
            Muammo qancha oydan beri? *
          </label>
          <input
            type="number" min={0}
            value={davom} onChange={e => setDavom(e.target.value)}
            placeholder="Oy soni, masalan: 6"
            style={{
              width: '100%', padding: '10px 14px', borderRadius: '10px',
              border: '1px solid var(--line)', background: 'var(--surface)',
              fontSize: '15px', color: 'var(--ink)', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <p style={{ margin: '0 0 10px', fontSize: '13.5px', fontWeight: 600, color: 'var(--ink)' }}>
          Quyidagi kasallik yoki holatlardan qaysilariga egasiz?
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {KASALLIKLAR.map(k => (
            <button
              key={k.id}
              onClick={() => toggle(kasalliklar, setKasalliklar, k.id)}
              style={{
                padding: '8px 14px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer',
                border: `1px solid ${kasalliklar.includes(k.id) ? 'var(--accent)' : 'var(--line)'}`,
                background: kasalliklar.includes(k.id) ? 'var(--accent)' : 'var(--surface)',
                color: kasalliklar.includes(k.id) ? 'white' : 'var(--ink-soft)',
                fontWeight: kasalliklar.includes(k.id) ? 600 : 400, transition: 'all .15s',
              }}
            >
              {k.matn}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <p style={{ margin: '0 0 10px', fontSize: '13.5px', fontWeight: 600, color: 'var(--ink)' }}>
          Qanday belgilar bor? (bir nechtasini tanlang)
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {BELGILAR.map(b => (
            <button
              key={b.id}
              onClick={() => toggle(belgilar, setBelgilar, b.id)}
              style={{
                padding: '8px 14px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer',
                border: `1px solid ${belgilar.includes(b.id) ? 'var(--accent)' : 'var(--line)'}`,
                background: belgilar.includes(b.id) ? 'var(--accent)' : 'var(--surface)',
                color: belgilar.includes(b.id) ? 'white' : 'var(--ink-soft)',
                fontWeight: belgilar.includes(b.id) ? 600 : 400, transition: 'all .15s',
              }}
            >
              {b.matn}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', display: 'block', marginBottom: '6px' }}>
          Qabul qilayotgan dorilar (ixtiyoriy)
        </label>
        <input
          type="text"
          value={dorilar} onChange={e => setDorilar(e.target.value)}
          placeholder="Masalan: metformin, lisinopril, antidepressant..."
          style={{
            width: '100%', padding: '10px 14px', borderRadius: '10px',
            border: '1px solid var(--line)', background: 'var(--surface)',
            fontSize: '14px', color: 'var(--ink)', outline: 'none', boxSizing: 'border-box',
          }}
        />
        <p style={{ margin: '5px 0 0', fontSize: '11.5px', color: 'var(--muted)' }}>
          Ko&apos;pgina dorilar (antidepressantlar, gipertenziya dorилari) jinsiy funksiyaga ta&apos;sir qilishi mumkin.
        </p>
      </div>

      <button
        onClick={() => setNatija(true)}
        disabled={!yosh || !davom}
        className="btn-animated"
        style={{
          width: '100%', background: (yosh && davom) ? 'var(--accent)' : 'var(--surface-2)',
          color: (yosh && davom) ? 'white' : 'var(--muted)', border: 'none', borderRadius: '12px',
          padding: '16px', fontSize: '15px', fontWeight: 700,
          cursor: (yosh && davom) ? 'pointer' : 'not-allowed', transition: 'all .2s',
        }}
      >
        Tavsiya olish
      </button>
    </div>
  )
}

// ── Asosiy sahifa ──────────────────────────────────────────────────
export default function YoriqnomaDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const y = yoriqnomaTop(slug)

  if (!y) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
        <Header backHref="/patient/oz-tekshiruv" backLabel="Yo'riqnomalar" />
        <div className="mx-auto max-w-[700px] px-8 py-12">
          <p>Yo&apos;riqnoma topilmadi.</p>
        </div>
      </div>
    )
  }

  const murojaat = () => router.push('/patient/murojaat')

  if (y.tur === 'kalkulyator') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
        <Header backHref="/patient/oz-tekshiruv" backLabel="O'z-o'zini tekshirish" />
        <div className="mx-auto max-w-[700px] px-8 py-8">
          <div className="rise" style={{
            background: 'linear-gradient(135deg, #2563eb, #0891b2)', color: 'white',
            borderRadius: '18px', padding: '26px 28px', marginBottom: '28px',
          }}>
            <span style={{ fontSize: '11px', fontWeight: 700, opacity: 0.85, textTransform: 'uppercase', letterSpacing: '.04em' }}>
              {y.organ} · Kalkulyator
            </span>
            <h1 style={{ margin: '6px 0 0', fontSize: '21px', fontWeight: 800, lineHeight: 1.3 }}>{y.sarlavha}</h1>
            <p style={{ margin: '10px 0 0', fontSize: '13.5px', opacity: 0.92 }}>{y.qisqa}</p>
          </div>

          {slug === 'erektil-disfunksiya' && <IIEF5Kalkulator onMurojaat={murojaat} />}
          {slug === 'tez-boshanish' && <PEDTKalkulator onMurojaat={murojaat} />}
          {slug === 'jinsiy-zaiflik' && <JinsiyZaiflikKalkulator onMurojaat={murojaat} />}

          <div style={{
            marginTop: '24px', background: 'var(--surface)', border: '2px solid #dc262633', borderRadius: '16px',
            padding: '20px 22px',
          }}>
            <h3 style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 800, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertTriangle size={15} strokeWidth={2} /> Diqqat</h3>
            <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {y.ogohlantiruvchiBelgilar.map(b => (
                <li key={b} style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{b}</li>
              ))}
            </ul>
          </div>

          <p style={{ margin: '14px 0 0', fontSize: '11.5px', color: 'var(--muted)' }}>Manba: {y.manba}</p>
          <p style={{ margin: '6px 0 0', fontSize: '11.5px', color: 'var(--muted)', lineHeight: 1.5 }}>
            Bu kalkulyator tashxis qo&apos;yish vositasi emas. Natijalarni faqat mutaxassis bilan birgalikda baholang.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/patient/oz-tekshiruv" backLabel="Yo'riqnomalar" />
      <div className="mx-auto max-w-[700px] px-8 py-8">
        <div className="rise" style={{
          background: 'linear-gradient(135deg, #2563eb, #0891b2)', color: 'white',
          borderRadius: '18px', padding: '26px 28px', marginBottom: '24px',
        }}>
          <span style={{ fontSize: '11px', fontWeight: 700, opacity: 0.85, textTransform: 'uppercase', letterSpacing: '.04em' }}>{y.organ}</span>
          <h1 style={{ margin: '6px 0 0', fontSize: '21px', fontWeight: 800, lineHeight: 1.3 }}>{y.sarlavha}</h1>
          <p style={{ margin: '10px 0 0', fontSize: '13.5px', opacity: 0.92 }}>{y.qisqa}</p>
          <p style={{ margin: '8px 0 0', fontSize: '12.5px', opacity: 0.85, display: 'flex', alignItems: 'center', gap: '5px' }}><Repeat size={13} strokeWidth={2} /> {y.davriylik}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {y.bosqichlar.map((b, i) => (
            <div key={i} className="rise" style={{
              animationDelay: `${Math.min(i * 0.07, 0.4)}s`,
              background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
              padding: '20px 22px', display: 'flex', gap: '18px', alignItems: 'flex-start',
            }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '14px', flexShrink: 0,
                background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <OzTekshiruvIkon tur={b.svg} size={40} />
              </div>
              <div>
                <h3 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 700 }}>{b.sarlavha}</h3>
                <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.65, color: 'var(--ink-soft)' }}>{b.matn}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rise" style={{
          marginTop: '20px', background: 'var(--surface)', border: '2px solid #dc262633', borderRadius: '16px',
          padding: '20px 22px',
        }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 800, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertTriangle size={15} strokeWidth={2} /> Qachon shifokorga murojaat qilish kerak</h3>
          <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {y.ogohlantiruvchiBelgilar.map((belgi) => (
              <li key={belgi} style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{belgi}</li>
            ))}
          </ul>
        </div>

        <p style={{ margin: '16px 0 0', fontSize: '11.5px', color: 'var(--muted)' }}>Manba: {y.manba}</p>

        <button
          onClick={murojaat}
          className="btn-animated soft-press"
          style={{
            width: '100%', marginTop: '20px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '12px',
            padding: '16px', fontSize: '15px', fontWeight: 700, cursor: 'pointer',
          }}
        >
          Shifokorga murojaat yuborish →
        </button>
      </div>
    </div>
  )
}
