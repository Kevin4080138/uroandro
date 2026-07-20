/**
 * Hero yonidagi mahsulot maketi.
 *
 * Bu skrinshot emas, uslublashtirilgan maket — platformaning vizual tilini
 * ko'rsatadi. Sof div/CSS bilan chizilgan: rasm yuklanmaydi, telefonda
 * umuman ko'rsatilmaydi (`.hero-mock` faqat >=900px da ochiladi).
 */

const DARSLAR = [
  { nom: 'Prostata adenomasi', bosqich: "O'rta", foiz: 82, rang: 'var(--accent)' },
  { nom: 'Moyak torsiyasi', bosqich: 'Oson', foiz: 100, rang: 'var(--good)' },
  { nom: 'Gidronefroz', bosqich: 'Qiyin', foiz: 34, rang: 'var(--accent-2)' },
]

export function HeroMock() {
  return (
    <div className="hero-mock" aria-hidden="true">
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: 20,
          boxShadow: 'var(--shadow)',
          overflow: 'hidden',
        }}
      >
        {/* Oyna sarlavhasi */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 16px',
            borderBottom: '1px solid var(--line)',
            background: 'var(--surface-2)',
          }}
        >
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--danger)', opacity: .55 }} />
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--warn)', opacity: .55 }} />
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--good)', opacity: .55 }} />
          <span style={{ marginLeft: 8, fontSize: 11.5, color: 'var(--muted)', fontWeight: 600 }}>
            urosfera.uz — talaba paneli
          </span>
        </div>

        <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Kalkulyator natijasi */}
          <div
            style={{
              background: 'var(--accent-soft)',
              border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)',
              borderRadius: 14,
              padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 14,
            }}
          >
            <div
              style={{
                width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                background: 'var(--accent)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 17, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              18
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--ink)' }}>IPSS — og&apos;ir daraja</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>
                Uroflowmetriya tavsiya qilinadi
              </div>
            </div>
          </div>

          {/* Darslar ro'yxati */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {DARSLAR.map((d) => (
              <div
                key={d.nom}
                style={{
                  border: '1px solid var(--line)',
                  borderRadius: 12,
                  padding: '11px 14px',
                  background: 'var(--surface)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink)' }}>{d.nom}</span>
                  <span
                    style={{
                      fontSize: 10, fontWeight: 700, color: d.rang,
                      background: `color-mix(in srgb, ${d.rang} 14%, transparent)`,
                      borderRadius: 6, padding: '2px 7px', flexShrink: 0,
                    }}
                  >
                    {d.bosqich}
                  </span>
                </div>
                {/* Progress chizig'i */}
                <div
                  style={{
                    marginTop: 8, height: 5, borderRadius: 3,
                    background: 'var(--surface-2)', overflow: 'hidden',
                  }}
                >
                  <div style={{ width: `${d.foiz}%`, height: '100%', background: d.rang, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>

          {/* Pastki qator — sertifikat */}
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              borderTop: '1px solid var(--line)', paddingTop: 13,
            }}
          >
            <span style={{ fontSize: 19 }}>🏅</span>
            <div style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.4 }}>
              <strong style={{ color: 'var(--ink)', fontWeight: 700 }}>Oson bosqich</strong> tugadi —
              sertifikat ochildi
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
