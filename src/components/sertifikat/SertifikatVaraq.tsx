'use client'

// A4 (landshaft) sertifikat varag'i. Chop etish uchun mo'ljallangan: brauzerning
// "Print → Save as PDF" oqimi vektor PDF beradi, shu sabab alohida PDF kutubxonasi
// kerak emas va matn PDF ichida tanlanadigan/qidiriladigan bo'lib qoladi.

export type SertifikatMalumoti = {
  kod: string
  ism: string
  turi: 'bosqich' | 'bob'
  bosqichNomi: string
  kategoriya: string | null
  foiz: number | null
  darsSoni: number
  sana: string
  qrDataUrl: string
  tekshirishUrl: string
}

function sanaFormat(iso: string) {
  return new Date(iso).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function SertifikatVaraq({ s }: { s: SertifikatMalumoti }) {
  const nishonmi = s.turi === 'bob'

  return (
    <>
      <style>{`
        .sert-varaq {
          /* A4 landshaft nisbati (297×210mm). Ekranda kichrayadi, chop etishda aynan A4. */
          width: 1123px; height: 794px;
          position: relative; overflow: hidden;
          background: #fdfcf8;
          color: #14213d;
          font-family: var(--font-inter), system-ui, sans-serif;
        }
        .sert-ramka {
          position: absolute; inset: 18px;
          border: 2px solid #c9a227;
          border-radius: 6px;
        }
        .sert-ramka::before {
          content: ''; position: absolute; inset: 9px;
          border: 1px solid rgba(20,33,61,.35);
          border-radius: 3px;
        }
        /* Burchak bezaklari */
        .sert-burchak {
          position: absolute; width: 58px; height: 58px;
          border: 3px solid #14213d;
        }
        .sert-burchak.tc { top: 30px; left: 30px; border-right: 0; border-bottom: 0; }
        .sert-burchak.to { top: 30px; right: 30px; border-left: 0; border-bottom: 0; }
        .sert-burchak.pc { bottom: 30px; left: 30px; border-right: 0; border-top: 0; }
        .sert-burchak.po { bottom: 30px; right: 30px; border-left: 0; border-top: 0; }

        .sert-ichki { position: relative; height: 100%; padding: 62px 78px; display: flex; flex-direction: column; }
        .sert-yuqori { display: flex; align-items: center; justify-content: space-between; }
        .sert-logo { display: flex; align-items: center; gap: 11px; }
        .sert-logo-belgi {
          width: 42px; height: 42px; border-radius: 11px;
          background: linear-gradient(135deg, #14213d, #2563eb);
          color: #fff; display: flex; align-items: center; justify-content: center;
          font-size: 20px; font-weight: 800;
        }
        .sert-logo-nom { font-size: 19px; font-weight: 800; letter-spacing: .02em; }
        .sert-logo-izoh { font-size: 10.5px; color: #5b6478; letter-spacing: .06em; text-transform: uppercase; }

        .sert-tur {
          font-size: 10.5px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase;
          color: #8a6d1f; border: 1px solid #d9c47e; background: #fbf5e2;
          padding: 6px 14px; border-radius: 999px;
        }

        .sert-tana { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; margin-top: -14px; }
        .sert-sarlavha {
          font-family: var(--font-display), Georgia, serif;
          font-size: 41px; font-weight: 800; letter-spacing: .02em; margin: 0;
        }
        .sert-tagsarlavha { font-size: 13px; color: #5b6478; margin: 9px 0 0; letter-spacing: .04em; }
        .sert-ism {
          font-family: var(--font-display), Georgia, serif;
          font-size: 52px; font-weight: 800; margin: 22px 0 6px; color: #14213d;
          line-height: 1.15; max-width: 900px;
        }
        .sert-chiziq { width: 340px; height: 2px; background: linear-gradient(90deg, transparent, #c9a227, transparent); margin: 4px 0 20px; }
        .sert-matn { font-size: 15px; line-height: 1.75; color: #38415a; max-width: 760px; margin: 0; }
        .sert-daraja { font-weight: 800; color: #14213d; }

        .sert-natija { display: flex; gap: 34px; margin-top: 24px; }
        .sert-natija-item { text-align: center; }
        .sert-natija-son { font-size: 25px; font-weight: 800; color: #14213d; line-height: 1; }
        .sert-natija-nom { font-size: 10px; color: #5b6478; text-transform: uppercase; letter-spacing: .1em; margin-top: 5px; }

        .sert-past { display: flex; align-items: flex-end; justify-content: space-between; gap: 26px; }
        .sert-imzo { text-align: center; width: 232px; }
        .sert-imzo-chiziq { border-top: 1.5px solid #14213d; margin-bottom: 6px; }
        .sert-imzo-nom { font-size: 12.5px; font-weight: 700; }
        .sert-imzo-lav { font-size: 10.5px; color: #5b6478; margin-top: 1px; }

        .sert-qr { text-align: center; }
        .sert-qr img { width: 92px; height: 92px; display: block; border: 4px solid #fff; box-shadow: 0 0 0 1px #d8d3c4; }
        .sert-kod { font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 12px; font-weight: 700; letter-spacing: .06em; margin-top: 7px; }
        .sert-kod-izoh { font-size: 9px; color: #5b6478; margin-top: 2px; }

        /* Muhr */
        .sert-muhr { position: relative; width: 132px; height: 132px; flex-shrink: 0; }
        .sert-muhr svg { width: 100%; height: 100%; }

        @media print {
          @page { size: A4 landscape; margin: 0; }
          body { margin: 0; background: #fff; }
          /* Chop etishda faqat varaqning o'zi qolsin */
          body * { visibility: hidden; }
          .sert-varaq, .sert-varaq * { visibility: visible; }
          .sert-varaq { position: absolute; left: 0; top: 0; transform: none !important; box-shadow: none !important; }
          .sert-yashir-chop { display: none !important; }
        }
      `}</style>

      <div className="sert-varaq">
        <div className="sert-ramka" />
        <span className="sert-burchak tc" /><span className="sert-burchak to" />
        <span className="sert-burchak pc" /><span className="sert-burchak po" />

        <div className="sert-ichki">
          <div className="sert-yuqori">
            <div className="sert-logo">
              <div className="sert-logo-belgi">U</div>
              <div>
                <div className="sert-logo-nom">UROSFERA</div>
                <div className="sert-logo-izoh">Urologiya va andrologiya</div>
              </div>
            </div>
            <div className="sert-tur">{nishonmi ? 'Bob nishoni' : 'Sertifikat'}</div>
          </div>

          <div className="sert-tana">
            <h1 className="sert-sarlavha">{nishonmi ? 'NISHON' : 'SERTIFIKAT'}</h1>
            <p className="sert-tagsarlavha">
              {nishonmi ? "quyidagi bo'limni tugallagani uchun beriladi" : "quyidagi bosqichni muvaffaqiyatli yakunlagani uchun beriladi"}
            </p>

            <div className="sert-ism">{s.ism}</div>
            <div className="sert-chiziq" />

            <p className="sert-matn">
              {nishonmi ? (
                <>
                  <span className="sert-daraja">{s.kategoriya}</span> bo&apos;limidagi barcha darslarni
                  ({s.darsSoni} ta) to&apos;liq o&apos;zlashtirdi.
                  Bosqich: <span className="sert-daraja">{s.bosqichNomi}</span>.
                </>
              ) : (
                <>
                  <span className="sert-daraja">{s.bosqichNomi}</span> bosqichining barcha {s.darsSoni} ta darsini
                  o&apos;zlashtirib, har bir dars bo&apos;yicha yakuniy nazorat testidan muvaffaqiyatli o&apos;tdi.
                </>
              )}
            </p>

            <div className="sert-natija">
              <div className="sert-natija-item">
                <div className="sert-natija-son">{s.darsSoni}</div>
                <div className="sert-natija-nom">Dars</div>
              </div>
              {s.foiz != null && s.foiz > 0 && (
                <div className="sert-natija-item">
                  <div className="sert-natija-son">{s.foiz}%</div>
                  <div className="sert-natija-nom">O&apos;rtacha natija</div>
                </div>
              )}
              <div className="sert-natija-item">
                <div className="sert-natija-son">{sanaFormat(s.sana)}</div>
                <div className="sert-natija-nom">Berilgan sana</div>
              </div>
            </div>
          </div>

          <div className="sert-past">
            <div className="sert-imzo">
              <div className="sert-imzo-chiziq" />
              <div className="sert-imzo-nom">Urosfera ta&apos;lim bo&apos;limi</div>
              <div className="sert-imzo-lav">urosfera.uz</div>
            </div>

            <Muhr nishonmi={nishonmi} />

            <div className="sert-qr">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.qrDataUrl} alt={`${s.kod} tekshirish kodi`} />
              <div className="sert-kod">{s.kod}</div>
              <div className="sert-kod-izoh">{s.tekshirishUrl.replace(/^https?:\/\//, '')}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Doiraviy muhr — ichki matn aylana bo'ylab yoziladi.
function Muhr({ nishonmi }: { nishonmi: boolean }) {
  return (
    <div className="sert-muhr" aria-hidden="true">
      <svg viewBox="0 0 200 200">
        <defs>
          <path id="muhr-yoy-tepa" d="M 100,100 m -74,0 a 74,74 0 1,1 148,0" fill="none" />
          <path id="muhr-yoy-past" d="M 100,100 m -66,0 a 66,66 0 1,0 132,0" fill="none" />
        </defs>

        <circle cx="100" cy="100" r="88" fill="none" stroke="#14213d" strokeWidth="2.5" />
        <circle cx="100" cy="100" r="80" fill="none" stroke="#c9a227" strokeWidth="1.2" />
        <circle cx="100" cy="100" r="56" fill="none" stroke="#14213d" strokeWidth="1.2" />

        {/* Tishli hoshiya */}
        {Array.from({ length: 48 }).map((_, i) => {
          const burchak = (i / 48) * Math.PI * 2
          const x1 = 100 + Math.cos(burchak) * 82
          const y1 = 100 + Math.sin(burchak) * 82
          const x2 = 100 + Math.cos(burchak) * 87
          const y2 = 100 + Math.sin(burchak) * 87
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#14213d" strokeWidth="1.6" />
        })}

        <text fontSize="13.5" fontWeight="700" fill="#14213d" letterSpacing="2.4">
          <textPath href="#muhr-yoy-tepa" startOffset="50%" textAnchor="middle">
            UROSFERA · UROLOGIYA
          </textPath>
        </text>
        <text fontSize="11" fontWeight="600" fill="#14213d" letterSpacing="2">
          <textPath href="#muhr-yoy-past" startOffset="50%" textAnchor="middle">
            {nishonmi ? "BO'LIM NISHONI" : "RASMIY SERTIFIKAT"}
          </textPath>
        </text>

        <text x="100" y="93" textAnchor="middle" fontSize="34" fontWeight="800" fill="#14213d">U</text>
        <text x="100" y="116" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#8a6d1f" letterSpacing="1.6">
          UZBEKISTAN
        </text>
      </svg>
    </div>
  )
}
