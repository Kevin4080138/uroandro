'use client'

import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { DARSLAR, BOSQICHLAR, BOSQICH_YOLI } from '@/lib/talim/darslar'
import { useMeningObunalarim } from '@/lib/talim/useObuna'

const BOSQICH_RANGI: Record<string, string> = {
  oson: 'linear-gradient(135deg, #16a34a, #65a30d)',
  "o'rta": 'linear-gradient(135deg, #d97706, #f59e0b)',
  qiyin: 'linear-gradient(135deg, #dc2626, #f97316)',
}

export default function DarslarPage() {
  const router = useRouter()
  const { egami, yuklandi } = useMeningObunalarim()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
      <Header backHref="/student/dashboard" backLabel="Bosh sahifa" />
      <div className="mx-auto max-w-[760px] px-8 py-8">
        <div className="rise" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>📖 Darslar</h2>
            <button
              onClick={() => router.push('/student/profil/yoriqnoma')}
              className="soft-press"
              style={{
                background: 'var(--surface-2)', color: 'var(--accent)', border: '1px solid var(--line)',
                borderRadius: '999px', padding: '7px 16px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              ❓ Qanday o&apos;zlashtirish kerak?
            </button>
          </div>
          <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontSize: '13.5px' }}>
            Avval bosqichni tanlang — har biri alohida obuna va o&apos;z sertifikatiga ega.
            Jami <strong style={{ color: 'var(--ink)' }}>{DARSLAR.length}</strong> ta dars,
            har bosqichdan bir nechtasi <strong style={{ color: 'var(--good)' }}>🎁 bepul</strong> sinab ko&apos;rish uchun ochiq.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {BOSQICHLAR.map((b, i) => {
            const darsSoni = DARSLAR.filter((d) => d.bosqich === b.id).length
            const qulflangan = yuklandi && !egami(b.id)
            return (
              <div
                key={b.id}
                onClick={() => router.push(`/student/darslar/bosqich/${BOSQICH_YOLI[b.id]}`)}
                className="rise lift"
                style={{
                  animationDelay: `${i * 0.08}s`, cursor: 'pointer', borderRadius: '20px', overflow: 'hidden',
                  background: BOSQICH_RANGI[b.id] ?? 'var(--accent)', color: 'white', padding: '26px 26px',
                  position: 'relative', boxShadow: 'var(--shadow)',
                }}
              >
                {qulflangan && (
                  <span style={{
                    position: 'absolute', top: '16px', right: '16px', fontSize: '20px',
                    background: 'rgba(0,0,0,.25)', borderRadius: '50%', width: '36px', height: '36px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    🔒
                  </span>
                )}
                <div style={{ fontSize: '34px', marginBottom: '8px' }}>{b.emoji}</div>
                <h3 style={{ margin: '0 0 4px', fontSize: '19px', fontWeight: 800 }}>{b.nom}</h3>
                <p style={{ margin: '0 0 12px', fontSize: '13px', opacity: .9, lineHeight: 1.5 }}>{b.tavsif}</p>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '12.5px', fontWeight: 700 }}>
                  <span style={{ background: 'rgba(255,255,255,.2)', borderRadius: '999px', padding: '4px 12px' }}>
                    {darsSoni} ta dars
                  </span>
                  {qulflangan ? (
                    <span>Sotib olish uchun bosing →</span>
                  ) : (
                    <span>Ochish →</span>
                  )}
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
