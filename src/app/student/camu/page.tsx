'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import Image from 'next/image'
import { getCamuSemestrDarslar } from '@/lib/camu/darslar'
import {
  GraduationCap, Library, Trophy, BarChart3, FolderOpen,
  Newspaper, BookMarked, Video, FileText, type LucideIcon,
} from 'lucide-react'

const IMKONIYATLAR: { Icon: LucideIcon; sarlavha: string; izoh: string; rang: string }[] = [
  { Icon: GraduationCap, sarlavha: 'Bepul kurslar', izoh: 'CAMU talabalari uchun barcha asosiy kurslar bepul', rang: 'var(--accent)' },
  { Icon: Library, sarlavha: 'Kutubxona', izoh: 'Darsliklar, qo\'llanmalar va rasmiy protokollar', rang: 'var(--good)' },
  { Icon: Trophy, sarlavha: 'Sertifikat', izoh: 'Kursni tugatgandan so\'ng elektron sertifikat', rang: 'var(--accent-2)' },
  { Icon: BarChart3, sarlavha: 'Test banklar', izoh: '500+ USMLE va klinik savol', rang: 'var(--danger)' },
]

const SEMESTR_META: Record<number, { rang: string; soat: number }> = {
  7: { rang: 'var(--accent)', soat: 30 },
  8: { rang: '#7c3aed', soat: 32 },
}

export default function CamuPage() {
  const router = useRouter()
  const [activeSemestr, setActiveSemestr] = useState<7 | 8>(7)

  const meta = SEMESTR_META[activeSemestr]
  const mavzular = getCamuSemestrDarslar(activeSemestr)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
      <Header backHref="/student/dashboard" backLabel="Bosh sahifa" />

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '24px 20px' }}>

        {/* Hero */}
        <div className="rise" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center', marginBottom: '28px', padding: '28px 20px',
          background: 'linear-gradient(135deg, #0f2573 0%, #1a3a9e 60%, #2451c8 100%)',
          borderRadius: '24px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
          <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '140px', height: '140px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

          <div style={{
            width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden',
            border: '3px solid rgba(255,255,255,0.4)', marginBottom: '14px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)', flexShrink: 0,
          }}>
            <Image src="/camu-logo.png" alt="CAMU Logo" width={100} height={100} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <h1 style={{ color: '#fff', fontSize: '20px', fontWeight: 800, margin: '0 0 4px', lineHeight: 1.2 }}>
            Central Asian Medical University
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12.5px', margin: '0 0 10px' }}>
            Since 2022 · Farg&apos;ona, O&apos;zbekiston
          </p>
          <div style={{
            display: 'inline-block', background: 'rgba(255,255,255,0.15)', borderRadius: '999px',
            padding: '5px 16px', fontSize: '12px', color: '#fff', fontWeight: 600,
          }}>
            🎓 CAMU talabalari uchun maxsus bo&apos;lim
          </div>
        </div>

        {/* Imkoniyatlar */}
        <h2 className="rise" style={{ fontSize: '15px', fontWeight: 800, marginBottom: '12px', animationDelay: '.04s' }}>
          ✨ Sizga nima beriladi
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '28px' }}>
          {IMKONIYATLAR.map((item, i) => (
            <div key={item.sarlavha} className="rise" style={{
              background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
              padding: '14px 14px', animationDelay: `${0.06 + i * 0.04}s`,
            }}>
              <div style={{ marginBottom: '5px', color: item.rang }}><item.Icon size={20} strokeWidth={2} /></div>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: item.rang, marginBottom: '3px' }}>{item.sarlavha}</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.4 }}>{item.izoh}</div>
            </div>
          ))}
        </div>

        {/* Amaliy mashg'ulotlar */}
        <h2 className="rise" style={{ fontSize: '15px', fontWeight: 800, marginBottom: '12px', animationDelay: '.1s' }}>
          📋 Amaliy mashg&apos;ulotlar jadvali
        </h2>

        {/* Semestr tabs */}
        <div className="rise" style={{
          display: 'flex', gap: '8px', marginBottom: '16px',
          background: 'var(--surface)', border: '1px solid var(--line)',
          borderRadius: '12px', padding: '4px', animationDelay: '.12s',
        }}>
          {([7, 8] as const).map(s => (
            <button
              key={s}
              onClick={() => setActiveSemestr(s)}
              style={{
                flex: 1, padding: '9px', borderRadius: '9px', border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: '13px', transition: 'all .2s',
                background: activeSemestr === s ? SEMESTR_META[s].rang : 'transparent',
                color: activeSemestr === s ? '#fff' : 'var(--muted)',
              }}
            >
              {s}-semestr
            </button>
          ))}
        </div>

        {/* Mavzular */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
          {mavzular.map((m, i) => (
            <div
              key={m.slug}
              onClick={() => router.push(`/student/camu/darslar/${m.slug}`)}
              className="rise lift list-row"
              style={{
                animationDelay: `${i * 0.04}s`,
                background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
                padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start',
              }}
            >
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                background: meta.rang + '22', color: meta.rang,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: 800,
              }}>
                {m.n}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', lineHeight: 1.4 }}>{m.sarlavha}</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: 'var(--accent)22', color: 'var(--accent)', fontWeight: 600 }}>
                    🏥 Klinik: {m.klinik}s
                  </span>
                  {m.amaliy > 0 && (
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: 'var(--good)22', color: 'var(--good)', fontWeight: 600 }}>
                      🔬 Amaliy: {m.amaliy}s
                    </span>
                  )}
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: 'var(--surface-2)', color: 'var(--muted)', fontWeight: 600 }}>
                    Jami: {m.klinik + m.amaliy}s
                  </span>
                </div>
              </div>
              <span style={{ color: 'var(--muted)', fontSize: '18px', alignSelf: 'center' }}>›</span>
            </div>
          ))}
        </div>

        {/* Jami soat */}
        <div style={{
          background: meta.rang + '15', border: `1px solid ${meta.rang}44`,
          borderRadius: '12px', padding: '12px 16px', marginBottom: '28px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-soft)' }}>
            {activeSemestr}-semestr jami
          </span>
          <span style={{ fontSize: '16px', fontWeight: 800, color: meta.rang }}>
            {meta.soat} soat
          </span>
        </div>

        {/* Qo'shimcha bo'limlar */}
        <h2 className="rise" style={{ fontSize: '15px', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FolderOpen size={17} strokeWidth={2} /> Qo&apos;shimcha materiallar
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
          {[
            { Icon: Newspaper, label: 'Maqolalar', desc: 'Ilmiy va klinik maqolalar', color: 'var(--accent)', soon: true },
            { Icon: BookMarked, label: 'Adabiyotlar', desc: 'Darsliklar va qo\'llanmalar', color: 'var(--good)', soon: true },
            { Icon: Video, label: 'Video darslar', desc: 'Amaliy ko\'rsatmali videolar', color: '#7c3aed', soon: true },
            { Icon: FileText, label: 'Konspektlar', desc: 'Mavzu bo\'yicha qisqacha xulosalar', color: 'var(--warn)', soon: true },
          ].map((item) => (
            <div key={item.label} style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              background: 'var(--surface)', border: '1px solid var(--line)',
              borderRadius: '14px', padding: '14px 16px', opacity: 0.75,
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                background: item.color + '18', color: item.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><item.Icon size={19} strokeWidth={2} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13.5px', fontWeight: 700 }}>{item.label}</div>
                <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '2px' }}>{item.desc}</div>
              </div>
              <span style={{
                fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '999px',
                background: 'var(--surface-2)', color: 'var(--muted)', whiteSpace: 'nowrap',
              }}>Tez orada</span>
            </div>
          ))}
        </div>

        {/* Aloqa */}
        <div className="rise" style={{
          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
          padding: '20px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '26px', marginBottom: '8px' }}>💬</div>
          <h3 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 6px' }}>CAMU talabasisiz?</h3>
          <p style={{ fontSize: '12.5px', color: 'var(--muted)', margin: '0 0 14px', lineHeight: 1.5 }}>
            Savollar, takliflar va hamkorlik uchun Urosfera jamoasi bilan bog&apos;laning.
          </p>
          <button
            onClick={() => router.push('/student/profil/feedback')}
            style={{
              background: '#0f2573', color: '#fff', border: 'none', borderRadius: '10px',
              padding: '10px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
            }}
          >
            ✉️ Xabar yuborish
          </button>
        </div>

      </div>
      <BottomNav />
    </div>
  )
}
