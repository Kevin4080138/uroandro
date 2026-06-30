'use client'

import { useState, useCallback } from 'react'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'

type Karta = {
  id: number
  kategoriya: string
  old: string    // old tomoni — savol/atama
  yangi: string  // orqa tomoni — javob/ta'rif
}

const KARTALAR: Karta[] = [
  // Epidemiologiya
  { id: 1, kategoriya: 'Epidemiologiya', old: 'Varikotsele umumiy tarqalishi qancha?', yangi: '15% umumiy populyatsiyada\n35–40% birlamchi bepushtlikda\n80% ikkilamchi bepushtlikda' },
  { id: 2, kategoriya: 'Epidemiologiya', old: 'Varikotsele qaysi tomonda ko\'proq uchraydi va nima uchun?', yangi: '80–90% — chap tomon\n\nSabab: chap v. testicularis chap buyrak venasiga to\'g\'ri burchak ostida quyiladi → venoz bosim yuqori → qon oqimi sekinlashadi' },
  { id: 3, kategoriya: 'Epidemiologiya', old: 'O\'smirlarda varikotsele qachon ko\'proq ko\'rinadi?', yangi: 'Pubertат davrida (10–15 yosh)\n\nTestis tez o\'sishi natijasida qon aylanishi ko\'payadi, venalar kuchsizlashadi' },

  // Anatomiya
  { id: 4, kategoriya: 'Anatomiya', old: 'Pampiniform pleksus nima?', yangi: 'Testis venalarining to\'ri — chov kanalida joylashgan\n\nFunksiyasi: arterial qonni sovutadi (issiqlik almashinuvi) → testis haroratini tanadan 2–4°C past ushlab turadi' },
  { id: 5, kategoriya: 'Anatomiya', old: 'Chap v. testicularis qayerga quyiladi?', yangi: 'Chap buyrak venasiga (v. renalis sinistra)\n\nO\'ng tomon: bevosita pastki kovak venaga (v. cava inferior) — shuning uchun o\'ng tomonda bosim kamroq' },
  { id: 6, kategoriya: 'Anatomiya', old: 'Gemodinamik nazariya nima deydi?', yangi: 'Venoz bosim oshadi → qonning testisga qayta oqishi (reflux)\n\nBu testis haroratini ko\'taradi → sperm ishlab chiqarish buziladi' },

  // Diagnostika
  { id: 7, kategoriya: 'Diagnostika', old: 'Varikotsele USI da qanday aniqlanadi?', yangi: 'Pampiniform pleksus vena diametri > 3 mm\n(dam olish yoki Valsalva paytida)\n\nDoppler: Valsalva bilan reflux aniqlanadi' },
  { id: 8, kategoriya: 'Diagnostika', old: 'Valsalva sinamasi nima va nima uchun ishlatiladi?', yangi: 'Og\'iz yopiq holda kuchli nafas chiqarish (bosimni oshirish)\n\nVarikotsele tekshiruvida: venalar kengayishini kuchaytiradi — aniqroq palpatsiya va USI imkonini beradi' },
  { id: 9, kategoriya: 'Diagnostika', old: 'Varikotsele darajalariga ko\'ra tasniflanadi (WHO/Dubin-Amelar)', yangi: 'I daraja: faqat Valsalva paytida palpatsiyada seziladi\nII daraja: dam olishda ham palpatsiyada aniqlanadi\nIII daraja: ko\'z bilan ko\'rinadi ("qurt to\'pi")' },
  { id: 10, kategoriya: 'Diagnostika', old: 'Subklinik varikotsele nima?', yangi: 'Ko\'rish va qo\'l bilan sezib bo\'lmaydi, faqat USI/doppler bilan aniqlanadi\n\nDavolash bo\'yicha tortishuv bor — ko\'pchilik mutaxassislar davolashni tavsiya etmaydi' },

  // Jarrohlik usullari
  { id: 11, kategoriya: 'Jarrohlik usullari', old: 'Marmar usuli (mikrojarrohlik) — asosiy afzalliklari', yangi: 'Retsidiv: < 1%\nGidrotsele: < 1%\nArteriya va limfa saqlangan\n\nSubingvinal yo\'l + mikroskop\nZamonaviy oltin standart' },
  { id: 12, kategoriya: 'Jarrohlik usullari', old: 'Palomo operatsiyasi — nimaga e\'tibor berish kerak?', yangi: 'Retroperitoneal yo\'l\nYuqori (retroperitoneal) ligatura\n\nKamchiligi: limfa tomirlari ko\'pincha bog\'lanadi → gidrotsele 7–30%\nRetsidiv: kolateral venalar orqali 5–15%' },
  { id: 13, kategoriya: 'Jarrohlik usullari', old: 'Laparoskopik varikotselectomiya — qachon tanlash kerak?', yangi: 'Ikki tomonlama varikotsele\nOldingi chov operatsiyasi (spayklar)\n\nAfzalligi: bir marta ikki tomoni ham\nKamchiligi: umumiy narkoz, qorin ichiga kirish' },
  { id: 14, kategoriya: 'Jarrohlik usullari', old: 'Skleroterapiya (perkutan embolizatsiya) — mohiyati', yangi: 'Paх venasiga kateter — kontrast bilan vena aniqlanadi — sklerozant yuboriladi\n\nAfzalligi: kesish yo\'q\nKamchiligi: texnik jihatdan murakkab, radiatsiya, retsidiv 10–15%' },
  { id: 15, kategoriya: 'Jarrohlik usullari', old: 'Ivanissevich operatsiyasi qanday farq qiladi?', yangi: 'Ingvinal (chov) yo\'l bilan yuqori ligatura\n\nPalomoga o\'xshash, lekin chov kanalidan\nGidrotsele kamroq Palomoga nisbatan, ammo mikrojarrohlikdan ko\'p' },

  // Spermogramma
  { id: 16, kategoriya: 'Spermogramma', old: 'WHO 2021 bo\'yicha normal sperm konsentratsiyasi', yangi: '≥ 16 million/ml\n(yoki jami ≥ 39 million bir ejakulyatda)' },
  { id: 17, kategoriya: 'Spermogramma', old: 'WHO 2021 bo\'yicha normal sperm harakatchanligi', yangi: 'Progressiv harakat (PR): ≥ 30%\nJami harakat (PR+NP): ≥ 42%' },
  { id: 18, kategoriya: 'Spermogramma', old: 'Oligoastenoteratozoospermiya (OAT) nima?', yangi: 'Uchta ko\'rsatkich birga buzilgan:\n- Oligo: konsentratsiya past\n- Asteno: harakatchanlik past\n- Terato: morfologiya buzilgan\n\nVarikotsele da tez-tez uchraydi' },
  { id: 19, kategoriya: 'Spermogramma', old: 'Varikotsele operatsiyasidan keyin sperm qachon yaxshilanadi?', yangi: '3–6 oy\n(chunki spermatogenez sikli ~74 kun)\n\nNatijalarni 6 oydan oldin baholash noto\'g\'ri' },

  // Klinik ko\'rsatmalar
  { id: 20, kategoriya: 'Klinik ko\'rsatmalar', old: 'Varikotsele uchun jarrohlik ko\'rsatmalari (EAU)', yangi: '1. Klinik varikotsele + bepushtlik + normal spermogramma yo\'q\n2. O\'smirlarda testikular atrofiya (> 20% hajm farqi)\n3. Og\'riq (boshqa sabablar chiqarib tashlangandan keyin)\n4. Kattalar — ikkitasi ham: klinik belgi + sperm patologiyasi' },
  { id: 21, kategoriya: 'Klinik ko\'rsatmalar', old: 'Subklinik varikotsele (faqat USI) uchun operatsiya qilinishi kerakmi?', yangi: 'Odatda YO\'Q\n\nEAU va AUA: subklinik varikotsele uchun davolash tavsiya etilmaydi, chunki klinik foyda isbotlanmagan' },
  { id: 22, kategoriya: 'Klinik ko\'rsatmalar', old: 'Varikotsele operatsiyasidan keyin homiladorlik ehtimoli?', yangi: '30–50% (tabiiy yo\'l bilan)\nOperatsiyasiz: 16–20%\n\nSperm yaxshilanishi bilan birga ART (IVF/ICSI) natijasi ham yaxshilanadi' },

  // Differensial tashxis
  { id: 23, kategoriya: 'Differensial tashxis', old: 'O\'ng tomonda varikotsele bo\'lsa nima o\'ylash kerak?', yangi: 'Retroperitoneal ommaviy o\'sma (buyrak, qorin pardasi)\n\nO\'ng v. testicularis pastki kovak venaga quyiladi — reflux kamroq\nO\'ng tomon varikotsele — boshqa sababni istisno qilish kerak!' },
  { id: 24, kategoriya: 'Differensial tashxis', old: 'Gidrotsele va varikotsele farqi', yangi: 'Gidrotsele:\n- Skrotumda suyuqlik\n- Diafanoskopiya — yorug\'lik o\'tadi\n- Yumshoq, og\'riqsiz\n\nVarikotsele:\n- Venalar kengayishi\n- Diafanoskopiya o\'tmaydi\n- "Qurt to\'pi" hissi' },
]

const KATEGORIYALAR = ['Barchasi', ...Array.from(new Set(KARTALAR.map((k) => k.kategoriya)))]

export default function FlashcardPage() {
  const [faolKat, setFaolKat] = useState('Barchasi')
  const [tartib, setTartib] = useState<number[]>(() => KARTALAR.map((_, i) => i))
  const [joriy, setJoriy] = useState(0)
  const [ochiq, setOchiq] = useState(false)
  const [bilganlar, setBilganlar] = useState<Set<number>>(new Set())
  const [bilmaganlar, setBilmaganlar] = useState<Set<number>>(new Set())

  const filtrlangan = KARTALAR.filter((k) => faolKat === 'Barchasi' || k.kategoriya === faolKat)
  const tartiblanganKartalar = tartib.map((i) => KARTALAR[i]).filter((k) => faolKat === 'Barchasi' || k.kategoriya === faolKat)

  const joriyKarta = tartiblanganKartalar[joriy]
  const jami = tartiblanganKartalar.length
  const tugadi = joriy >= jami

  const katTanlash = (k: string) => {
    setFaolKat(k)
    setJoriy(0)
    setOchiq(false)
    setBilganlar(new Set())
    setBilmaganlar(new Set())
    setTartib(KARTALAR.map((_, i) => i).sort(() => Math.random() - 0.5))
  }

  const aralashtir = () => {
    setTartib((t) => [...t].sort(() => Math.random() - 0.5))
    setJoriy(0)
    setOchiq(false)
    setBilganlar(new Set())
    setBilmaganlar(new Set())
  }

  const bildi = () => {
    if (!joriyKarta) return
    setBilganlar((b) => new Set([...b, joriyKarta.id]))
    setOchiq(false)
    setTimeout(() => setJoriy((j) => j + 1), 100)
  }

  const bilmadi = () => {
    if (!joriyKarta) return
    setBilmaganlar((b) => new Set([...b, joriyKarta.id]))
    setOchiq(false)
    setTimeout(() => setJoriy((j) => j + 1), 100)
  }

  const qaytadan = () => {
    setJoriy(0)
    setOchiq(false)
    setBilganlar(new Set())
    setBilmaganlar(new Set())
    setTartib(KARTALAR.map((_, i) => i).sort(() => Math.random() - 0.5))
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
      <Header backHref="/student/dashboard" backLabel="Bosh sahifa" />
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px' }}>

        {/* Sarlavha */}
        <div className="rise" style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px' }}>🃏 Flashcardlar</h1>
          <p style={{ color: 'var(--muted)', fontSize: '13.5px', margin: 0 }}>
            Kartani bosing — orqa tomoni ochiladi. Varikotselening muhim faktlarini yod oling.
          </p>
        </div>

        {/* Kategoriya filter */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {KATEGORIYALAR.map((k) => (
            <button
              key={k}
              onClick={() => katTanlash(k)}
              className="soft-press"
              style={{
                background: faolKat === k ? 'var(--accent)' : 'var(--surface)',
                color: faolKat === k ? 'white' : 'var(--muted)',
                border: `1.5px solid ${faolKat === k ? 'var(--accent)' : 'var(--line)'}`,
                borderRadius: '999px', padding: '6px 14px', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer',
              }}
            >
              {k}
            </button>
          ))}
          <button
            onClick={aralashtir}
            className="soft-press"
            style={{
              background: 'var(--surface-2)', color: 'var(--muted)',
              border: '1.5px solid var(--line)', borderRadius: '999px',
              padding: '6px 14px', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            🔀 Aralashtir
          </button>
        </div>

        {/* Progress */}
        {!tugadi && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--muted)', marginBottom: '5px' }}>
              <span>{joriy + 1} / {jami}</span>
              <span>✅ {bilganlar.size} · ❌ {bilmaganlar.size}</span>
            </div>
            <div style={{ height: '5px', borderRadius: '999px', background: 'var(--surface-2)', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: '999px', width: `${(joriy / jami) * 100}%`, background: 'var(--accent)', transition: 'width .3s' }} />
            </div>
          </div>
        )}

        {/* Karta */}
        {tugadi ? (
          <div className="rise" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>
              {bilmaganlar.size === 0 ? '🎉' : bilganlar.size > bilmaganlar.size ? '👍' : '📚'}
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 8px' }}>
              {jami} ta karta tugadi!
            </h2>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', margin: '16px 0 24px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#16a34a' }}>{bilganlar.size}</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Bildim</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#dc2626' }}>{bilmaganlar.size}</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Bilmadim</div>
              </div>
            </div>
            {bilmaganlar.size > 0 && (
              <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '20px' }}>
                {bilmaganlar.size} ta karta yodlanmagan — qayta ishlang!
              </p>
            )}
            <button
              onClick={qaytadan}
              style={{
                background: 'var(--accent)', color: 'white', border: 'none',
                borderRadius: '12px', padding: '13px 28px',
                fontSize: '14px', fontWeight: 700, cursor: 'pointer',
              }}
            >
              Qaytadan boshlash
            </button>
          </div>
        ) : joriyKarta ? (
          <>
            {/* Flip card */}
            <div
              onClick={() => setOchiq((o) => !o)}
              className="rise"
              style={{
                cursor: 'pointer',
                minHeight: '220px',
                background: ochiq ? 'var(--accent-soft, #eff6ff)' : 'var(--surface)',
                border: `2px solid ${ochiq ? 'var(--accent)' : 'var(--line)'}`,
                borderRadius: '20px',
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                position: 'relative',
                transition: 'all .2s ease',
                userSelect: 'none',
                marginBottom: '14px',
              }}
            >
              <div style={{ position: 'absolute', top: '14px', right: '16px', fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>
                {ochiq ? '🔵 Orqa tomon' : '⚪ Old tomon'} · {joriyKarta.kategoriya}
              </div>

              {!ochiq ? (
                <div>
                  <p style={{ fontSize: '17px', fontWeight: 700, margin: 0, lineHeight: 1.5, color: 'var(--ink)' }}>
                    {joriyKarta.old}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '12px 0 0' }}>
                    👆 Bosing — javobni ko&apos;rish uchun
                  </p>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '15px', fontWeight: 500, margin: 0, lineHeight: 1.7, color: 'var(--ink)', whiteSpace: 'pre-line' }}>
                    {joriyKarta.yangi}
                  </p>
                </div>
              )}
            </div>

            {/* Tugmalar */}
            {ochiq && (
              <div className="rise" style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={bilmadi}
                  style={{
                    flex: 1, background: '#dc262612', color: '#dc2626',
                    border: '1.5px solid #dc2626', borderRadius: '12px', padding: '12px',
                    fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  ✗ Bilmadim
                </button>
                <button
                  onClick={bildi}
                  style={{
                    flex: 1, background: '#16a34a12', color: '#16a34a',
                    border: '1.5px solid #16a34a', borderRadius: '12px', padding: '12px',
                    fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  ✓ Bildim
                </button>
              </div>
            )}
          </>
        ) : null}

        {/* Karta ro'yxati hint */}
        {!tugadi && (
          <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--muted)', textAlign: 'center' }}>
            Jami {filtrlangan.length} ta karta · {KATEGORIYALAR.length - 1} ta kategoriya
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
