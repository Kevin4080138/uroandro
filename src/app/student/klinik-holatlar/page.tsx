'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'

type Qadam = {
  savol: string
  variantlar: string[]
  togri: number
  izoh: string
}

type Holat = {
  id: number
  sarlavha: string
  emoji: string
  bemor: string
  shikoyat: string
  tekshiruv: string
  qadamlar: Qadam[]
  xulosa: string
}

const HOLATLAR: Holat[] = [
  {
    id: 1,
    sarlavha: 'Yosh yigit va bolasizlik muammosi',
    emoji: '👨',
    bemor: '28 yoshli erkak, nikohda 2 yil, homiladorlik yo\'q.',
    shikoyat: 'Chap tomon chov sohasida og\'irlik hissi, ba\'zan og\'riq. Ish faoliyatida o\'zgarish yo\'q.',
    tekshiruv: 'Ko\'rikda: chap testisda to\'lqin uruvchi venalar palpatsiyada aniqlanadi (Valsalva sinamasida kuchayadi). O\'ng tomon — normal. Spermogramma: oligoastenozoospermiya. USI: chap pampiniform pleksus venalari 3.8 mm gacha kengaygan.',
    qadamlar: [
      {
        savol: 'Bu bemorga dastlab qaysi tashxisni qo\'yasiz?',
        variantlar: [
          'Epididimorxit',
          'Chap tomon varikotsele',
          'Gidrotsele',
          'Spermatotsele',
        ],
        togri: 1,
        izoh: 'Palpatsiyada to\'lqin uruvchi venalar + Valsalva sinamasida kuchayish + USI da 3.8 mm — bu varikotsele uchun klassik tasvir. Epididimorxit uchun og\'riq va isitma bo\'lishi kerak edi.',
      },
      {
        savol: 'WHO me\'yori bo\'yicha varikotsele uchun USI da venaning minimal diametri qancha bo\'lishi kerak?',
        variantlar: [
          '> 2 mm',
          '> 3 mm',
          '> 4 mm',
          '> 5 mm',
        ],
        togri: 1,
        izoh: 'WHO tavsiyasi bo\'yicha pampiniform pleksus venalarining diametri > 3 mm (dam olish holatida yoki Valsalva paytida) bo\'lsa varikotsele deyiladi. Bizning bemorning 3.8 mm — bu chegara qiymatdan oshgan.',
      },
      {
        savol: 'Bemorga qaysi davolash usuli eng maqsadga muvofiq?',
        variantlar: [
          'Konservativ davolash (skrotal qo\'llab-quvvatlash)',
          'Palomo operatsiyasi',
          'Mikrojarrohlik varikotselectomiya (Marmar usuli)',
          'Skleroterapiya',
        ],
        togri: 2,
        izoh: 'Yoshli bemor, bolasizlik, klinik varikotsele — mikrojarrohlik usuli (Marmar/subingvinal) eng past retsidiv (< 1%) va eng kam yon ta\'sirga ega. Palomo ham qabul qilinishi mumkin, lekin gidrotsele xavfi yuqoriroq.',
      },
    ],
    xulosa: 'Varikotsele — erkak bepushtligining davolanuvchi sabablaridan biri. Klinik tashxis + USI + spermogramma kombinatsiyasi to\'g\'ri yo\'naltirish imkonini beradi. Mikrojarrohlik usuli zamonaviy standartda afzal ko\'riladi.',
  },
  {
    id: 2,
    sarlavha: 'O\'smirda aniqlanib qolgan varikotsele',
    emoji: '🧑',
    bemor: '15 yoshli o\'g\'il bola, maktab tibbiy ko\'rigi paytida aniqlangan.',
    shikoyat: 'Shikoyat yo\'q, tasodifan aniqlangan. Sport bilan shug\'ullanadi.',
    tekshiruv: 'Ko\'rikda: chap testisda \'qurt to\'pi\' ko\'rinishidagi venalar, o\'ng tomon normal. Testis hajmi: chap — 12 ml, o\'ng — 18 ml (chap testis atrofiyasi). Valsalva sinamasida kuchayadi. Gormonlar normal.',
    qadamlar: [
      {
        savol: 'O\'smirda varikotsele qaysi tomonda ko\'proq uchraydi?',
        variantlar: [
          'O\'ng tomon',
          'Chap tomon',
          'Ikki tomon teng',
          'Ko\'pincha ikki tomonlama',
        ],
        togri: 1,
        izoh: 'Varikotsele 80-90% hollarda chap tomonda uchraydi. Bu chap testikular venaning chap buyrak venasiga to\'g\'ri burchak ostida quyilishi bilan bog\'liq — bu gidrostatik bosimni oshiradi.',
      },
      {
        savol: 'Bemorning chap testisi kichikroq (12 ml vs 18 ml). Bu qanday nomlanadi?',
        variantlar: [
          'Giperspermiya',
          'Ipsilateral testikular atrofiya',
          'Orxit',
          'Testikular torsion',
        ],
        togri: 1,
        izoh: 'Bir tomon testisning kontralateral tomon bilan solishtirib 20% dan kichik bo\'lishi — ipsilateral testikular atrofiya. O\'smirlarda bu jarrohlikka absolyut ko\'rsatma hisoblanadi.',
      },
      {
        savol: 'Bu bemorga nima qilish kerak?',
        variantlar: [
          'Kuzatib turish, hech narsa qilmaslik',
          'Darhol jarrohlik — testikular atrofiya bor',
          '6 oyda bir USI bilan kuzatuv',
          'Gormon terapiyasi',
        ],
        togri: 1,
        izoh: 'O\'smirlarda testikular atrofiya (> 20% hajm farqi) jarrohlik uchun absolyut ko\'rsatma. Kechiktirish sperm ishlab chiqarishni yanada yomonlashtiradi. Operatsiyadan so\'ng testis hajmini tiklash mumkin (\'catch-up growth\').',
      },
    ],
    xulosa: 'O\'smirda varikotsele bilan ipsilateral testikular atrofiya aniqlansa — kutish noto\'g\'ri. Erta jarrohlik testis funksiyasini saqlash va to\'g\'ri rivojlanishni ta\'minlaydi.',
  },
  {
    id: 3,
    sarlavha: 'Operatsiyadan keyin retsidiv',
    emoji: '🏥',
    bemor: '32 yoshli erkak, 1 yil oldin Palomo usuli bilan operatsiya qilingan.',
    shikoyat: 'Og\'riq yo\'q, ammo spermogramma yaxshilanmagan. Nazorat USI da venalar yana kengaygan.',
    tekshiruv: 'Ko\'rikda: chap tomon venalari palpatsiyada seziladi, lekin birlamchi operatsiyaga qaraganda kamroq. USI: 3.2 mm. Spermogramma: oldingi ko\'rsatkichlar o\'zgarmagan. Gidrotsele yo\'q.',
    qadamlar: [
      {
        savol: 'Palomo usulida retsidiv eng ko\'p qaysi sababdan kelib chiqadi?',
        variantlar: [
          'Operator xatosi',
          'Kolateral venalarning rivojlanishi',
          'Arteriyaning bog\'lanishi',
          'Limfa tomirlarining shikastlanishi',
        ],
        togri: 1,
        izoh: 'Palomo usulida yuqori ligatura qilinadi, lekin kolateral venalar (gubernakulum, kremasteral venalar) ligatura ostida qolishi mumkin. Bu venalar kengayib retsidivga olib keladi. Shu sababli zamonaviy standart — past (subingvinal/mikrojarrohlik) ligatura.',
      },
      {
        savol: 'Retsidivda qayta operatsiya uchun qaysi usul afzal?',
        variantlar: [
          'Yana Palomo',
          'Mikrojarrohlik (Marmar usuli)',
          'Sklero­terapiya',
          'Laparoskopiya',
        ],
        togri: 1,
        izoh: 'Retsidiv varikotsele uchun mikrojarrohlik usuli eng maqsadga muvofiq — chunki aniq vizualizatsiya (mikroskop ostida) barcha kollateral venalarni bog\'lash imkonini beradi, arteriya va limfa tomirlarini saqlab qoladi.',
      },
      {
        savol: 'Palomo operatsiyasining eng ko\'p uchraydigan yon ta\'siri qaysi?',
        variantlar: [
          'Orxalgia',
          'Gidrotsele',
          'Testikular atrofiya',
          'Infektsiya',
        ],
        togri: 1,
        izoh: 'Palomo (retroperitoneal) usulida limfa tomirlari ko\'pincha bog\'lanadi yoki shikastlanadi. Bu limfostaz natijasida gidrotselega olib keladi — 7-30% holatlarda uchraydi. Shu sababli zamonaviy shifokorlar mikrojarrohlikni afzal ko\'radi.',
      },
    ],
    xulosa: 'Retsidiv varikotsele klinik amaliyotda uchrab turadi. Qayta jarrohlikda mikrojarrohlik usuli (Marmar) eng yaxshi natijalar beradi — retsidiv < 1%, gidrotsele < 1%. Birlamchi operatsiyada ham shu usul tanlansa maqsadga muvofiq.',
  },
]

type Holat_Soni = 'menu' | number

export default function KlinikHolatlarPage() {
  const [ko_rinish, setKo_rinish] = useState<Holat_Soni>('menu')
  const [qadam, setQadam] = useState(0)
  const [tanlangan, setTanlangan] = useState<number | null>(null)
  const [tekshirildi, setTekshirildi] = useState(false)
  const [yakunlangan, setYakunlangan] = useState<Set<number>>(new Set())
  const [togrilar, setTogrilar] = useState(0)

  const holat = typeof ko_rinish === 'number' ? HOLATLAR[ko_rinish] : null
  const joriyQadam = holat?.qadamlar[qadam]

  const boshla = (i: number) => {
    setKo_rinish(i)
    setQadam(0)
    setTanlangan(null)
    setTekshirildi(false)
    setTogrilar(0)
  }

  const tekshir = () => {
    if (tanlangan === null) return
    setTekshirildi(true)
    if (tanlangan === joriyQadam?.togri) setTogrilar((t) => t + 1)
  }

  const keyingi = () => {
    if (!holat) return
    if (qadam < holat.qadamlar.length - 1) {
      setQadam((q) => q + 1)
      setTanlangan(null)
      setTekshirildi(false)
    } else {
      setYakunlangan((prev) => new Set([...prev, ko_rinish as number]))
      setKo_rinish('yakun')
    }
  }

  if (ko_rinish === 'menu') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
        <Header backHref="/student/dashboard" backLabel="Bosh sahifa" />
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 20px' }}>
          <div className="rise" style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 8px' }}>🏥 Klinik holatlar</h1>
            <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0 }}>
              Real klinik scenariylar — bemor historiyasini o&apos;qib, qadam-ba-qadam tashxis va davolash tanlaysiz.
              Har bir qadam bo&apos;yicha tushuntirish beriladi.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {HOLATLAR.map((h, i) => {
              const tugallangan = yakunlangan.has(i)
              return (
                <div
                  key={h.id}
                  onClick={() => boshla(i)}
                  className="rise lift"
                  style={{
                    background: 'var(--surface)', border: `1.5px solid ${tugallangan ? 'var(--good)' : 'var(--line)'}`,
                    borderRadius: '16px', padding: '20px 22px', cursor: 'pointer', animationDelay: `${i * 0.07}s`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{ fontSize: '28px' }}>{h.emoji}</span>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 700 }}>{h.sarlavha}</div>
                        <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '3px' }}>
                          {h.qadamlar.length} ta savol
                        </div>
                      </div>
                    </div>
                    {tugallangan && (
                      <span style={{ fontSize: '20px' }}>✅</span>
                    )}
                  </div>
                  <div style={{
                    marginTop: '12px', fontSize: '13px', color: 'var(--ink-soft)',
                    background: 'var(--surface-2)', borderRadius: '10px', padding: '10px 14px', lineHeight: 1.6,
                  }}>
                    🧑 {h.bemor}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <BottomNav />
      </div>
    )
  }

  if (ko_rinish === 'yakun') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
        <Header backHref="/student/dashboard" backLabel="Bosh sahifa" />
        <div style={{ maxWidth: '560px', margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>
            {togrilar === holat?.qadamlar.length ? '🎉' : togrilar >= Math.ceil((holat?.qadamlar.length ?? 0) / 2) ? '👍' : '📚'}
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 8px' }}>
            {togrilar}/{holat?.qadamlar.length} to&apos;g&apos;ri javob
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '24px' }}>
            {togrilar === holat?.qadamlar.length
              ? 'Ajoyib! Barcha savollarga to\'g\'ri javob berdingiz.'
              : 'Xulosa: ' + holat?.xulosa}
          </p>
          {holat?.xulosa && togrilar === holat.qadamlar.length && (
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--line)',
              borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', textAlign: 'left',
            }}>
              <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase' }}>Klinik xulosa</div>
              <p style={{ fontSize: '14px', color: 'var(--ink-soft)', margin: 0, lineHeight: 1.6 }}>{holat.xulosa}</p>
            </div>
          )}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setKo_rinish('menu')} style={{
              background: 'var(--accent)', color: 'white', border: 'none',
              borderRadius: '12px', padding: '12px 24px', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
            }}>
              Ro&apos;yxatga qaytish
            </button>
          </div>
        </div>
        <BottomNav />
      </div>
    )
  }

  if (!holat || !joriyQadam) return null

  const progress = ((qadam) / holat.qadamlar.length) * 100

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
      <Header backHref="/student/klinik-holatlar" backLabel="Klinik holatlar" />
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px' }}>

        {/* Progress */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px' }}>
            <span>{holat.sarlavha}</span>
            <span>{qadam + 1} / {holat.qadamlar.length}</span>
          </div>
          <div style={{ height: '6px', borderRadius: '999px', background: 'var(--surface-2)', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: '999px', width: `${progress}%`, background: 'var(--accent)', transition: 'width .3s ease' }} />
          </div>
        </div>

        {/* Bemor ma'lumotlari */}
        {qadam === 0 && (
          <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '.04em' }}>
              📋 Bemor historiyasi
            </div>
            <p style={{ margin: '0 0 8px', fontSize: '14px', color: 'var(--ink)', lineHeight: 1.6 }}>
              <strong>Bemor:</strong> {holat.bemor}
            </p>
            <p style={{ margin: '0 0 8px', fontSize: '14px', color: 'var(--ink)', lineHeight: 1.6 }}>
              <strong>Shikoyat:</strong> {holat.shikoyat}
            </p>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink)', lineHeight: 1.6 }}>
              <strong>Ko&apos;rik:</strong> {holat.tekshiruv}
            </p>
          </div>
        )}

        {/* Savol */}
        <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px', marginBottom: '14px' }}>
          <div style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 700, marginBottom: '10px' }}>
            Savol {qadam + 1}
          </div>
          <p style={{ fontSize: '15px', fontWeight: 600, margin: 0, lineHeight: 1.5 }}>{joriyQadam.savol}</p>
        </div>

        {/* Variantlar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          {joriyQadam.variantlar.map((v, i) => {
            const togri = i === joriyQadam.togri
            const tanlandi = tanlangan === i
            let bg = 'var(--surface)'
            let border = 'var(--line)'
            if (tekshirildi) {
              if (togri) { bg = '#16a34a18'; border = '#16a34a' }
              else if (tanlandi) { bg = '#dc262618'; border = '#dc2626' }
            } else if (tanlandi) {
              bg = 'var(--accent-soft)'; border = 'var(--accent)'
            }
            return (
              <button
                key={i}
                onClick={() => !tekshirildi && setTanlangan(i)}
                style={{
                  background: bg, border: `1.5px solid ${border}`,
                  borderRadius: '12px', padding: '13px 16px', textAlign: 'left', cursor: tekshirildi ? 'default' : 'pointer',
                  fontSize: '14px', color: 'var(--ink)', display: 'flex', gap: '10px', alignItems: 'center',
                  transition: 'all .15s',
                }}
              >
                <span style={{ fontWeight: 700, color: tekshirildi && togri ? '#16a34a' : tekshirildi && tanlandi ? '#dc2626' : 'var(--muted)', minWidth: '18px' }}>
                  {tekshirildi ? (togri ? '✓' : tanlandi ? '✗' : String.fromCharCode(65 + i)) : String.fromCharCode(65 + i)}
                </span>
                {v}
              </button>
            )
          })}
        </div>

        {/* Izoh */}
        {tekshirildi && (
          <div className="rise" style={{
            background: tanlangan === joriyQadam.togri ? '#16a34a12' : '#dc262612',
            border: `1px solid ${tanlangan === joriyQadam.togri ? '#16a34a' : '#dc2626'}`,
            borderRadius: '12px', padding: '14px 16px', marginBottom: '14px',
          }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: tanlangan === joriyQadam.togri ? '#16a34a' : '#dc2626', marginBottom: '6px' }}>
              {tanlangan === joriyQadam.togri ? '✓ To\'g\'ri!' : '✗ Noto\'g\'ri'}
            </div>
            <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{joriyQadam.izoh}</p>
          </div>
        )}

        {/* Tugmalar */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {!tekshirildi ? (
            <button
              onClick={tekshir}
              disabled={tanlangan === null}
              style={{
                flex: 1, background: tanlangan !== null ? 'var(--accent)' : 'var(--surface-2)',
                color: tanlangan !== null ? 'white' : 'var(--muted)',
                border: 'none', borderRadius: '12px', padding: '13px',
                fontSize: '14px', fontWeight: 700, cursor: tanlangan !== null ? 'pointer' : 'not-allowed',
              }}
            >
              Tekshirish
            </button>
          ) : (
            <button
              onClick={keyingi}
              style={{
                flex: 1, background: 'var(--accent)', color: 'white',
                border: 'none', borderRadius: '12px', padding: '13px',
                fontSize: '14px', fontWeight: 700, cursor: 'pointer',
              }}
            >
              {qadam < holat.qadamlar.length - 1 ? 'Keyingi savol →' : 'Yakunlash ✓'}
            </button>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
