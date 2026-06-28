'use client'

import { useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { DARSLAR, BOSQICHLAR, bosqichYolidanTop } from '@/lib/talim/darslar'
import { useMeningObunalarim } from '@/lib/talim/useObuna'

const KATEGORIYA_RANGI: Record<string, string> = {
  Prostata: 'linear-gradient(135deg, #2563eb, #0891b2)',
  Andrologiya: 'linear-gradient(135deg, #7c3aed, #c026d3)',
  Urolitiaz: 'linear-gradient(135deg, #57534e, #a8a29e)',
  Onkourologiya: 'linear-gradient(135deg, #dc2626, #f97316)',
  'Kirish va semiotika': 'linear-gradient(135deg, #16a34a, #65a30d)',
  'Anatomiya va fiziologiya': 'linear-gradient(135deg, #0d9488, #06b6d4)',
  "Yallig'lanish kasalliklari": 'linear-gradient(135deg, #ea580c, #f59e0b)',
  "Buyrak va siydik yo'llari": 'linear-gradient(135deg, #57534e, #a8a29e)',
  "Prostata va erkak jinsiy a'zolari": 'linear-gradient(135deg, #2563eb, #0891b2)',
  'Shoshilinch holatlar': 'linear-gradient(135deg, #dc2626, #f97316)',
}

export default function BosqichDarslariPage() {
  const router = useRouter()
  const { bosqich: bosqichYoli } = useParams<{ bosqich: string }>()
  const bosqich = bosqichYolidanTop(bosqichYoli)
  const [filtr, setFiltr] = useState<string>('Hammasi')
  const { egami, yuklandi } = useMeningObunalarim()

  const bosqichMa = BOSQICHLAR.find((b) => b.id === bosqich)
  const bosqichDarslari = useMemo(() => DARSLAR.filter((d) => d.bosqich === bosqich), [bosqich])
  const kategoriyalar = useMemo(
    () => ['Hammasi', ...Array.from(new Set(bosqichDarslari.map((d) => d.kategoriya)))],
    [bosqichDarslari]
  )
  const royxat = filtr === 'Hammasi' ? bosqichDarslari : bosqichDarslari.filter((d) => d.kategoriya === filtr)

  if (!bosqich || !bosqichMa) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
        <Header backHref="/student/darslar" backLabel="Darslar" />
        <div className="mx-auto max-w-[760px] px-8 py-12">
          <p>Bosqich topilmadi.</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
      <Header backHref="/student/darslar" backLabel="Darslar" />
      <div className="mx-auto max-w-[980px] px-8 py-8">
        <div className="rise" style={{ marginBottom: '22px' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>{bosqichMa.emoji} {bosqichMa.nom}</h2>
          <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontSize: '13.5px' }}>
            {bosqichMa.tavsif} — <strong style={{ color: 'var(--ink)' }}>{bosqichDarslari.length}</strong> ta dars.
          </p>
        </div>

        <div className="rise" style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap', animationDelay: '.05s' }}>
          {kategoriyalar.map((kat) => (
            <button
              key={kat}
              onClick={() => setFiltr(kat)}
              className="soft-press"
              style={{
                background: filtr === kat ? 'var(--accent)' : 'var(--surface-2)',
                color: filtr === kat ? 'white' : 'var(--ink-soft)',
                border: filtr === kat ? 'none' : '1px solid var(--line)',
                borderRadius: '999px', padding: '8px 16px', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer', transition: 'all .18s ease', whiteSpace: 'nowrap',
              }}
            >
              {kat}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {royxat.map((d, i) => (
            <div
              key={d.slug}
              onClick={() => router.push(`/student/darslar/${d.slug}`)}
              className="rise lift"
              style={{
                animationDelay: `${Math.min(i * 0.06, 0.4)}s`,
                background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
                padding: '20px 22px', cursor: 'pointer', display: 'flex', gap: '16px', alignItems: 'flex-start',
              }}
            >
              <div style={{
                width: '46px', height: '46px', borderRadius: '13px', flexShrink: 0,
                background: KATEGORIYA_RANGI[d.kategoriya] ?? 'var(--accent)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 800,
              }}>
                {i + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
                    {yuklandi && !egami(d.bosqich) && <span title="Sotib olinmagan">🔒 </span>}
                    {d.sarlavha}
                  </h3>
                  <span style={{ fontSize: '11px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>⏱ {d.daqiqa} daqiqa</span>
                </div>
                <p style={{ margin: '6px 0 8px', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{d.qisqa}</p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '10.5px', color: 'var(--muted)', border: '1px solid var(--line)', borderRadius: '999px',
                    padding: '2px 10px', fontWeight: 600,
                  }}>
                    {d.kategoriya}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 700 }}>{d.test.length} savollik test</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
