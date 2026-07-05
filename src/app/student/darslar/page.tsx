'use client'

import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { DARSLAR, BOSQICHLAR, BOSQICH_YOLI } from '@/lib/talim/darslar'
import { useMeningObunalarim } from '@/lib/talim/useObuna'

const BOSQICH_GRADIENT: Record<string, string> = {
  oson:    'linear-gradient(135deg, #16a34a 0%, #059669 50%, #0d9488 100%)',
  "o'rta": 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #eab308 100%)',
  qiyin:   'linear-gradient(135deg, #dc2626 0%, #e11d48 50%, #9333ea 100%)',
}

const BOSQICH_ACCENT: Record<string, string> = {
  oson:    '#16a34a',
  "o'rta": '#d97706',
  qiyin:   '#dc2626',
}

const BOSQICH_BOLIMLAR: Record<string, { emoji: string; nom: string }[]> = {
  oson: [
    { emoji: '📖', nom: 'Nazariya' },
    { emoji: '🎥', nom: 'Video' },
    { emoji: '🃏', nom: 'Flashcard' },
    { emoji: '✅', nom: 'Amaliy test' },
    { emoji: '📂', nom: 'Materiallar' },
  ],
  "o'rta": [
    { emoji: '📖', nom: 'Nazariya' },
    { emoji: '🎥', nom: 'Video' },
    { emoji: '🃏', nom: 'Flashcard' },
    { emoji: '✅', nom: 'Amaliy test' },
    { emoji: '📂', nom: 'Materiallar' },
    { emoji: '🏅', nom: 'USMLE' },
    { emoji: '🔒', nom: 'Nazorat' },
  ],
  qiyin: [
    { emoji: '📖', nom: 'Nazariya' },
    { emoji: '🎥', nom: 'Video' },
    { emoji: '🃏', nom: 'Flashcard' },
    { emoji: '✅', nom: 'Amaliy test' },
    { emoji: '📂', nom: 'Materiallar' },
    { emoji: '🏅', nom: 'USMLE' },
    { emoji: '🔒', nom: 'Nazorat' },
    { emoji: '🏥', nom: 'Klinik holat' },
    { emoji: '🧩', nom: 'Interaktiv case' },
  ],
}

export default function DarslarPage() {
  const router = useRouter()
  const { egami, yuklandi } = useMeningObunalarim()

  const jami = DARSLAR.length
  const bepulJami = DARSLAR.filter((d) => d.bepulNamuna).length

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
      <Header backHref="/student/dashboard" backLabel="Bosh sahifa" />

      <div className="mx-auto max-w-[760px] px-6 py-8">
        {/* Sarlavha */}
        <div className="rise" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>📖 Darslar</h2>
              <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontSize: '13.5px' }}>
                Jami <strong style={{ color: 'var(--ink)' }}>{jami}</strong> ta dars —{' '}
                <strong style={{ color: '#16a34a' }}>🎁 {bepulJami} ta bepul</strong> sinab ko&apos;rish uchun ochiq.
              </p>
            </div>
            <button
              onClick={() => router.push('/student/profil/yoriqnoma')}
              className="soft-press"
              style={{
                background: 'var(--surface-2)', color: 'var(--accent)', border: '1px solid var(--line)',
                borderRadius: '999px', padding: '7px 16px', fontSize: '12.5px', fontWeight: 700,
                cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
              }}
            >
              ❓ Qanday o&apos;zlashtirish kerak?
            </button>
          </div>
        </div>

        {/* Bosqich kartalari */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {BOSQICHLAR.map((b, i) => {
            const darsSoni = DARSLAR.filter((d) => d.bosqich === b.id).length
            const bepulSoni = DARSLAR.filter((d) => d.bosqich === b.id && d.bepulNamuna).length
            const qulflangan = yuklandi && !egami(b.id)
            const gradient = BOSQICH_GRADIENT[b.id] ?? BOSQICH_GRADIENT['oson']
            const accent = BOSQICH_ACCENT[b.id] ?? '#16a34a'
            const bolimlar = BOSQICH_BOLIMLAR[b.id] ?? BOSQICH_BOLIMLAR['oson']

            return (
              <div
                key={b.id}
                onClick={() => router.push(`/student/darslar/bosqich/${BOSQICH_YOLI[b.id]}`)}
                className="rise lift"
                style={{
                  animationDelay: `${i * 0.08}s`,
                  cursor: 'pointer',
                  borderRadius: '22px',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow)',
                  position: 'relative',
                }}
              >
                {/* Gradient header qismi */}
                <div style={{
                  background: gradient,
                  color: 'white',
                  padding: '24px 24px 20px',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {/* Fon doiralari */}
                  <div style={{
                    position: 'absolute', top: '-30px', right: '-30px',
                    width: '130px', height: '130px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                  }} />
                  <div style={{
                    position: 'absolute', bottom: '-50px', left: '-10px',
                    width: '160px', height: '160px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                  }} />

                  {/* Lock belgisi */}
                  {qulflangan && (
                    <div style={{
                      position: 'absolute', top: '16px', right: '16px',
                      background: 'rgba(0,0,0,0.25)', borderRadius: '50%',
                      width: '34px', height: '34px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '16px',
                    }}>
                      🔒
                    </div>
                  )}

                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '52px', height: '52px', borderRadius: '15px',
                      background: 'rgba(255,255,255,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '26px', flexShrink: 0,
                    }}>
                      {b.emoji}
                    </div>
                    <div>
                      <h3 style={{ margin: '0 0 3px', fontSize: '18px', fontWeight: 900 }}>{b.nom}</h3>
                      <p style={{ margin: 0, fontSize: '12.5px', opacity: 0.88, lineHeight: 1.4 }}>{b.tavsif}</p>
                    </div>
                  </div>
                </div>

                {/* Pastki oq qism */}
                <div style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderTop: 'none',
                  borderRadius: '0 0 22px 22px',
                  padding: '16px 24px',
                }}>
                  {/* Statistika */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '11.5px', fontWeight: 700,
                      color: accent, background: accent + '14',
                      borderRadius: '999px', padding: '4px 12px',
                    }}>
                      📚 {darsSoni} ta dars
                    </span>
                    {bepulSoni > 0 && (
                      <span style={{
                        fontSize: '11.5px', fontWeight: 700,
                        color: '#16a34a', background: '#16a34a14',
                        borderRadius: '999px', padding: '4px 12px',
                      }}>
                        🎁 {bepulSoni} ta bepul
                      </span>
                    )}
                  </div>

                  {/* Bo'limlar */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                    {bolimlar.map((bl) => (
                      <span key={bl.nom} style={{
                        fontSize: '11px', fontWeight: 600,
                        color: 'var(--ink-soft)',
                        background: 'var(--surface-2)',
                        border: '1px solid var(--line)',
                        borderRadius: '999px', padding: '3px 10px',
                      }}>
                        {bl.emoji} {bl.nom}
                      </span>
                    ))}
                  </div>

                  {/* Havolа */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: accent }}>
                      {qulflangan ? 'Sotib olish →' : 'Darslarni ko\'rish →'}
                    </span>
                  </div>
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
