'use client'

import { useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { DARSLAR, BOSQICHLAR, bosqichYolidanTop, bosqichBoyichaTartibla, type Dars } from '@/lib/talim/darslar'
import { useMeningObunalarim } from '@/lib/talim/useObuna'

const BOSQICH_GRADIENT: Record<string, string> = {
  oson:   'linear-gradient(135deg, #16a34a 0%, #059669 50%, #0d9488 100%)',
  "o'rta": 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #eab308 100%)',
  qiyin:  'linear-gradient(135deg, #dc2626 0%, #e11d48 50%, #9333ea 100%)',
}

const BOSQICH_ACCENT: Record<string, string> = {
  oson: '#16a34a',
  "o'rta": '#d97706',
  qiyin: '#dc2626',
}

const KATEGORIYA_RANGI: Record<string, string> = {
  Prostata:                       '#2563eb',
  Andrologiya:                    '#7c3aed',
  Urolitiaz:                      '#57534e',
  Onkourologiya:                  '#dc2626',
  'Kirish va semiotika':          '#16a34a',
  'Anatomiya va fiziologiya':     '#0d9488',
  "Yallig'lanish kasalliklari":   '#ea580c',
  "Buyrak va siydik yo'llari":    '#57534e',
  "Prostata va erkak jinsiy a'zolari": '#2563eb',
  'Shoshilinch holatlar':         '#dc2626',
}

function bosqichBolimlar(bosqich: string): { emoji: string; nom: string }[] {
  if (bosqich === 'oson') return [
    { emoji: '📖', nom: 'Nazariya' },
    { emoji: '🎥', nom: 'Video' },
    { emoji: '🃏', nom: 'Flashcard' },
    { emoji: '✅', nom: 'Amaliy test' },
    { emoji: '📂', nom: 'Materiallar' },
  ]
  if (bosqich === "o'rta") return [
    { emoji: '📖', nom: 'Nazariya' },
    { emoji: '🎥', nom: 'Video' },
    { emoji: '🃏', nom: 'Flashcard' },
    { emoji: '✅', nom: 'Amaliy test' },
    { emoji: '📂', nom: 'Materiallar' },
    { emoji: '🏅', nom: 'USMLE' },
    { emoji: '🔒', nom: 'Nazorat' },
  ]
  return [
    { emoji: '📖', nom: 'Nazariya' },
    { emoji: '🎥', nom: 'Video' },
    { emoji: '🃏', nom: 'Flashcard' },
    { emoji: '✅', nom: 'Amaliy test' },
    { emoji: '📂', nom: 'Materiallar' },
    { emoji: '🏅', nom: 'USMLE' },
    { emoji: '🔒', nom: 'Nazorat' },
    { emoji: '🏥', nom: 'Klinik holat' },
    { emoji: '🧩', nom: 'Interaktiv case' },
  ]
}

function DarsKartasi({ dars, tartib, qulflangan, bosqich, onClick }: {
  dars: Dars
  tartib: number
  qulflangan: boolean
  bosqich: string
  onClick: () => void
}) {
  const accent = KATEGORIYA_RANGI[dars.kategoriya] ?? '#2563eb'
  const bolimlar = bosqichBolimlar(bosqich)

  return (
    <div
      onClick={onClick}
      className="rise lift"
      style={{
        animationDelay: `${Math.min(tartib * 0.05, 0.35)}s`,
        background: dars.bepulNamuna ? 'linear-gradient(135deg, #dcfce7, #bbf7d0)' : 'var(--surface)',
        border: dars.bepulNamuna ? '1.5px solid #4ade80' : '1px solid var(--line)',
        borderRadius: '20px',
        padding: '20px 22px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Chap rang chiziq */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px',
        background: accent, borderRadius: '20px 0 0 20px',
      }} />

      <div style={{ paddingLeft: '8px' }}>
        {/* Yuqori qator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
            {/* Tartib raqami */}
            <div style={{
              width: '34px', height: '34px', borderRadius: '10px', flexShrink: 0,
              background: accent + '18', color: accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: 800,
            }}>
              {tartib}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                {dars.bepulNamuna && (
                  <span style={{
                    fontSize: '10px', fontWeight: 800, color: '#16a34a',
                    background: '#16a34a18', borderRadius: '999px', padding: '2px 8px',
                  }}>🎁 BEPUL</span>
                )}
                {qulflangan && !dars.bepulNamuna && (
                  <span style={{
                    fontSize: '10px', fontWeight: 800, color: '#6b7280',
                    background: 'var(--surface-2)', borderRadius: '999px', padding: '2px 8px',
                  }}>🔒 Qulflangan</span>
                )}
              </div>
              <h3 style={{
                margin: '2px 0 0', fontSize: '15px', fontWeight: 700,
                color: 'var(--ink)', lineHeight: 1.35,
                overflow: 'hidden', display: '-webkit-box',
                WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              }}>
                {dars.sarlavha}
              </h3>
            </div>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--muted)', whiteSpace: 'nowrap', flexShrink: 0, paddingTop: '4px' }}>
            ⏱ {dars.daqiqa} daqiqa
          </span>
        </div>

        {/* Qisqa tavsif */}
        <p style={{
          margin: '0 0 12px', fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.55,
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {dars.qisqa}
        </p>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--line)', margin: '0 0 12px' }} />

        {/* Bo'limlar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
          {bolimlar.map((b) => (
            <span key={b.nom} style={{
              fontSize: '11px', fontWeight: 600,
              color: 'var(--ink-soft)',
              background: 'var(--surface-2)',
              border: '1px solid var(--line)',
              borderRadius: '999px', padding: '3px 10px',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              {b.emoji} {b.nom}
            </span>
          ))}
        </div>

        {/* Pastki qator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '11px', color: 'var(--muted)', fontWeight: 600,
            border: '1px solid var(--line)', borderRadius: '999px', padding: '3px 10px',
          }}>
            {dars.kategoriya}
          </span>
          <span style={{ marginLeft: 'auto', fontSize: '12px', color: accent, fontWeight: 700 }}>
            {qulflangan && !dars.bepulNamuna ? "Ko'rish →" : 'Ochish →'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function BosqichDarslariPage() {
  const router = useRouter()
  const { bosqich: bosqichYoli } = useParams<{ bosqich: string }>()
  const bosqich = bosqichYolidanTop(bosqichYoli)
  const [filtr, setFiltr] = useState<string>('Hammasi')
  const { egami, yuklandi } = useMeningObunalarim()

  const bosqichMa = BOSQICHLAR.find((b) => b.id === bosqich)
  const bosqichDarslari = useMemo(
    () => (bosqich ? bosqichBoyichaTartibla(DARSLAR.filter((d) => d.bosqich === bosqich), bosqich) : []),
    [bosqich]
  )
  const kategoriyalar = useMemo(
    () => ['Hammasi', ...Array.from(new Set(bosqichDarslari.map((d) => d.kategoriya)))],
    [bosqichDarslari]
  )
  const royxat = filtr === 'Hammasi' ? bosqichDarslari : bosqichDarslari.filter((d) => d.kategoriya === filtr)
  const gradient = BOSQICH_GRADIENT[bosqich ?? ''] ?? BOSQICH_GRADIENT['oson']
  const accent = BOSQICH_ACCENT[bosqich ?? ''] ?? '#16a34a'
  const bolimlar = bosqichBolimlar(bosqich ?? 'oson')

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

  const bepulSoni = bosqichDarslari.filter((d) => d.bepulNamuna).length

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
      <Header backHref="/student/darslar" backLabel="Darslar" />

      {/* Hero banner */}
      <div style={{ background: gradient, color: 'white', padding: '36px 24px 40px', position: 'relative', overflow: 'hidden' }}>
        {/* Fon dekor */}
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: '180px', height: '180px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-20px',
          width: '220px', height: '220px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
        }} />

        <div className="mx-auto max-w-[760px]" style={{ position: 'relative' }}>
          {/* Emoji va sarlavha */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '18px',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '32px', flexShrink: 0,
            }}>
              {bosqichMa.emoji}
            </div>
            <div>
              <p style={{ margin: '0 0 2px', fontSize: '11px', fontWeight: 700, opacity: 0.75, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Bosqich
              </p>
              <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 900, lineHeight: 1.2 }}>
                {bosqichMa.nom}
              </h1>
            </div>
          </div>

          <p style={{ margin: '0 0 20px', fontSize: '14px', opacity: 0.9, lineHeight: 1.6, maxWidth: '520px' }}>
            {bosqichMa.tavsif}
          </p>

          {/* Statistika */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '22px' }}>
            {[
              { qiymat: `${bosqichDarslari.length} ta`, tavsif: 'dars' },
              { qiymat: `${bepulSoni} ta`, tavsif: 'bepul namuna' },
              { qiymat: `${bolimlar.length} ta`, tavsif: "bo'lim" },
            ].map((s) => (
              <div key={s.tavsif} style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '14px', padding: '10px 18px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '18px', fontWeight: 900 }}>{s.qiymat}</div>
                <div style={{ fontSize: '11px', opacity: 0.8, fontWeight: 600 }}>{s.tavsif}</div>
              </div>
            ))}
          </div>

          {/* Bo'limlar chiplari */}
          <div>
            <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 700, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Har bir darsda mavjud
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {bolimlar.map((b) => (
                <span key={b.nom} style={{
                  background: 'rgba(255,255,255,0.18)',
                  borderRadius: '999px', padding: '5px 14px',
                  fontSize: '12px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: '5px',
                }}>
                  {b.emoji} {b.nom}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[760px] px-6 py-6">
        {/* Kategoriya filtri */}
        {kategoriyalar.length > 2 && (
          <div className="rise" style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', animationDelay: '.05s' }}>
            {kategoriyalar.map((kat) => (
              <button
                key={kat}
                onClick={() => setFiltr(kat)}
                className="soft-press"
                style={{
                  background: filtr === kat ? accent : 'var(--surface-2)',
                  color: filtr === kat ? 'white' : 'var(--ink-soft)',
                  border: filtr === kat ? 'none' : '1px solid var(--line)',
                  borderRadius: '999px', padding: '8px 16px', fontSize: '12.5px', fontWeight: 600,
                  cursor: 'pointer', transition: 'all .18s ease', whiteSpace: 'nowrap',
                }}
              >
                {kat}
              </button>
            ))}
          </div>
        )}

        {/* Darslar ro'yxati */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {royxat.map((d, i) => (
            <DarsKartasi
              key={d.slug}
              dars={d}
              tartib={bosqichDarslari.indexOf(d) + 1}
              qulflangan={yuklandi && !egami(d.bosqich)}
              bosqich={bosqich}
              onClick={() => router.push(`/student/darslar/${d.slug}`)}
            />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
