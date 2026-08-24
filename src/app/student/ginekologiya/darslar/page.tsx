'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import {
  BookOpen, Video, Layers, ClipboardCheck, HelpCircle, ChevronRight, type LucideIcon,
} from 'lucide-react'

type BolimQatori = { Icon: LucideIcon; nom: string; yangi?: boolean }
type GinDars = { slug: string; sarlavha: string; kategoriya: string | null; bosqich: string; qisqa: string | null; daqiqa: number }

// Har bir modul tarkibi (hozircha barcha bosqichlarda bir xil).
// Qolgan formatlar (USMLE, sertifikat, case) keyin qo'shiladi.
const MODUL_TARKIBI: BolimQatori[] = [
  { Icon: BookOpen, nom: 'Nazariya' },
  { Icon: Video, nom: 'Video darslik' },
  { Icon: Layers, nom: 'Flashcard' },
  { Icon: ClipboardCheck, nom: 'Test' },
]

const BOLIM_SARLAVHA: Record<string, string> = {
  klassifikatsiyalar: 'Klassifikatsiyalar',
  operativ: 'Operativ ginekologiya',
}

function Qator({ b, accent }: { b: BolimQatori; accent: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '5px 0' }}>
      <span style={{
        width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
        background: accent + '22', color: accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '11px', fontWeight: 900,
      }}>✓</span>
      <span style={{ fontSize: '13px', fontWeight: b.yangi ? 800 : 600, color: 'var(--ink)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        <b.Icon size={15} strokeWidth={2} style={{ color: accent, flexShrink: 0 }} /> {b.nom}
      </span>
      {b.yangi && (
        <span style={{
          fontSize: '9px', fontWeight: 900, letterSpacing: '.05em',
          color: accent, background: accent + '1c',
          border: `1px solid ${accent}44`,
          borderRadius: '999px', padding: '2px 7px', marginLeft: 'auto',
        }}>YANGI</span>
      )}
    </div>
  )
}

// ── Landing: 3 bosqich (urologiya dizayni, ginekologiya kontenti) ──
function BosqichLanding() {
  const router = useRouter()
  const supabase = createClient()
  const [sonlar, setSonlar] = useState<Record<string, number>>({})

  useEffect(() => {
    supabase.from('gin_darslar').select('bosqich').eq('faol', true).eq('bolim', 'darslar').then(({ data }) => {
      const s: Record<string, number> = {}
      for (const r of (data ?? []) as { bosqich: string }[]) s[r.bosqich] = (s[r.bosqich] ?? 0) + 1
      setSonlar(s)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const soni = (b: string) => sonlar[b] ?? 0
  const och = (b: string) => router.push(`/student/ginekologiya/darslar/bosqich/${b}`)

  return (
    <div className="mx-auto max-w-[1080px] px-6 py-8">
      {/* Sarlavha */}
      <div className="rise" style={{ textAlign: 'center', marginBottom: '8px' }}>
        <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 900, lineHeight: 1.25 }}>
          Ginekologiyani <span style={{ color: 'var(--gyn)' }}>bosqichma-bosqich</span> egallang
        </h1>
        <p style={{ margin: '10px auto 0', color: 'var(--muted)', fontSize: '13.5px', maxWidth: '520px', lineHeight: 1.6 }}>
          Har bir dars ketma-ket ochiladi — video, nazariya, materiallar va testlar bitta yo&apos;lda.
          Boshlash uchun hech narsa to&apos;lamaysiz.
        </p>
        <button
          onClick={() => router.push('/student/profil/yoriqnoma')}
          className="soft-press"
          style={{
            marginTop: '12px',
            background: 'var(--surface-2)', color: 'var(--gyn)', border: '1px solid var(--line)',
            borderRadius: '999px', padding: '7px 16px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: '6px',
          }}
        >
          <HelpCircle size={14} strokeWidth={2} /> Qanday o&apos;zlashtirish kerak?
        </button>
      </div>

      {/* Yo'l ko'rsatkich */}
      <div className="rise" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        margin: '18px 0 30px', flexWrap: 'wrap', animationDelay: '.05s',
      }}>
        {[
          { t: '1. Bepul boshlaysiz', c: '#16a34a' },
          { t: '2. Klinik daraja + sertifikat', c: '#d97706' },
          { t: '3. Mutaxassis darajasi', c: '#dc2626' },
        ].map((s, i) => (
          <span key={s.t} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '11.5px', fontWeight: 800, color: s.c,
              background: s.c + '14', border: `1px solid ${s.c}33`,
              borderRadius: '999px', padding: '5px 13px',
            }}>{s.t}</span>
            {i < 2 && <span style={{ color: 'var(--muted)', fontSize: '13px' }}>→</span>}
          </span>
        ))}
      </div>

      {/* Uch karta */}
      <div style={{
        display: 'grid', gap: '18px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        alignItems: 'stretch',
      }}>

        {/* ===== 1-BOSQICH — ASOSLAR (bepul, ochiq) ===== */}
        <div
          onClick={() => och('oson')}
          className="rise lift"
          style={{
            background: 'var(--surface)',
            border: '2px solid #16a34a55',
            borderRadius: '22px', overflow: 'hidden', cursor: 'pointer',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 8px 30px rgba(22,163,74,.10)',
          }}
        >
          <div style={{ background: 'linear-gradient(135deg,#16a34a,#059669)', color: 'white', padding: '20px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '.08em', opacity: .85 }}>1-BOSQICH</span>
              <span style={{
                fontSize: '11px', fontWeight: 900, background: 'white', color: '#16a34a',
                borderRadius: '999px', padding: '4px 12px',
              }}>🎁 100% BEPUL</span>
            </div>
            <h2 style={{ margin: '10px 0 2px', fontSize: '20px', fontWeight: 900 }}>🟢 Asoslar</h2>
            <p style={{ margin: 0, fontSize: '12.5px', opacity: .9 }}>Ginekologiyaga birinchi qadam — anatomiya, hayz sikli, kontratseptsiya. Hech narsa to&apos;lamasdan darhol boshlang</p>
          </div>

          <div style={{ padding: '18px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#16a34a', background: '#16a34a12', borderRadius: '999px', padding: '4px 12px' }}>
                📚 {soni('oson')} ta dars
              </span>
              <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#16a34a', background: '#16a34a12', borderRadius: '999px', padding: '4px 12px' }}>
                🔓 Hammasi ochiq
              </span>
            </div>

            {MODUL_TARKIBI.map((b) => <Qator key={b.nom} b={b} accent="#16a34a" />)}

            <div style={{
              marginTop: '14px', fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.55,
              background: '#16a34a0d', border: '1px dashed #16a34a44', borderRadius: '12px', padding: '10px 12px',
            }}>
              🎮 Darslar <strong>ketma-ket ochiladi</strong> — har bir darsni tugatib, keyingisini oching va progressingizni kuzating.
            </div>

            <button className="soft-press" style={{
              marginTop: 'auto',
              background: 'linear-gradient(135deg,#16a34a,#059669)', color: 'white',
              border: 'none', borderRadius: '14px', padding: '13px', fontSize: '14px', fontWeight: 800,
              cursor: 'pointer', width: '100%', marginBlockStart: '18px',
            }}>
              Bepul boshlash →
            </button>
          </div>
        </div>

        {/* ===== 2-BOSQICH — KLINIK CHUQURLIK (eng ommabop) ===== */}
        <div
          onClick={() => och('orta')}
          className="rise lift"
          style={{
            background: 'var(--surface)',
            border: '2.5px solid #f59e0b',
            borderRadius: '22px', overflow: 'hidden', cursor: 'pointer',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 14px 44px rgba(217,119,6,.22)',
            position: 'relative',
            animationDelay: '.07s',
          }}
        >
          <div style={{
            position: 'absolute', top: '14px', right: '-34px', transform: 'rotate(38deg)',
            background: 'linear-gradient(90deg,#f59e0b,#d97706)', color: 'white',
            fontSize: '10px', fontWeight: 900, letterSpacing: '.06em',
            padding: '5px 40px', zIndex: 2, boxShadow: '0 2px 8px rgba(0,0,0,.2)',
          }}>ENG OMMABOP</div>

          <div style={{ background: 'linear-gradient(135deg,#d97706,#f59e0b)', color: 'white', padding: '20px 22px' }}>
            <span style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '.08em', opacity: .85 }}>2-BOSQICH</span>
            <h2 style={{ margin: '10px 0 2px', fontSize: '20px', fontWeight: 900 }}>🟡 Klinik chuqurlik</h2>
            <p style={{ margin: 0, fontSize: '12.5px', opacity: .92 }}>Haqiqiy shifokor kabi fikrlashni o&apos;rganasiz — sikl buzilishlari, infeksiyalar, mioma, endometrioz</p>
          </div>

          <div style={{ padding: '18px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#d97706', background: '#d9770614', borderRadius: '999px', padding: '4px 12px' }}>
                📚 {soni('orta')} ta dars
              </span>
              <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#d97706', background: '#d9770614', borderRadius: '999px', padding: '4px 12px' }}>
                🎁 Bepul namuna darslar
              </span>
            </div>

            {MODUL_TARKIBI.map((b) => <Qator key={b.nom} b={b} accent="#d97706" />)}

            <div style={{
              marginTop: '14px',
              background: '#f59e0b14', border: '1px solid #f59e0b55',
              borderRadius: '12px', padding: '12px 14px', display: 'flex', gap: '10px', alignItems: 'center',
            }}>
              <span style={{ fontSize: '26px' }}>🏆</span>
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: 900, color: 'var(--ink)' }}>Bosqich sertifikati</div>
                <div style={{ fontSize: '11.5px', color: 'var(--ink-soft)', lineHeight: 1.45 }}>
                  Barcha nazoratlardan o&apos;ting — ismingiz yozilgan rasmiy sertifikat oling
                </div>
              </div>
            </div>

            <button className="soft-press" style={{
              marginTop: 'auto',
              background: 'linear-gradient(135deg,#d97706,#f59e0b)', color: 'white',
              border: 'none', borderRadius: '14px', padding: '13px', fontSize: '14px', fontWeight: 800,
              cursor: 'pointer', width: '100%', marginBlockStart: '18px',
              boxShadow: '0 6px 18px rgba(217,119,6,.35)',
            }}>
              Bosqichni ochish 🔓
            </button>
            <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--muted)', marginTop: '8px' }}>
              Avval bepul namuna darslarni sinab ko&apos;ring
            </div>
          </div>
        </div>

        {/* ===== 3-BOSQICH — MURAKKAB HOLATLAR (premium dark) ===== */}
        <div
          onClick={() => och('qiyin')}
          className="rise lift"
          style={{
            background: 'linear-gradient(160deg,#171123 0%,#1e1229 55%,#2a0f1d 100%)',
            border: '1.5px solid #dc262666',
            borderRadius: '22px', overflow: 'hidden', cursor: 'pointer',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 14px 44px rgba(220,38,38,.18)',
            color: '#f5f0ff',
            animationDelay: '.12s',
          }}
        >
          <div style={{ padding: '20px 22px', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '.08em', opacity: .6 }}>3-BOSQICH</span>
              <span style={{
                fontSize: '10.5px', fontWeight: 900, letterSpacing: '.06em',
                background: 'linear-gradient(90deg,#fbbf24,#f59e0b)', color: '#1c1917',
                borderRadius: '999px', padding: '4px 12px',
              }}>⚡ PRO</span>
            </div>
            <h2 style={{
              margin: '10px 0 2px', fontSize: '20px', fontWeight: 900,
              background: 'linear-gradient(90deg,#fca5a5,#fbbf24)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>🔴 Murakkab holatlar</h2>
            <p style={{ margin: 0, fontSize: '12.5px', opacity: .65 }}>
              Williams Gynecology darajasi — PCOS, onkologiya, bepushtlik, jarrohlik va real klinik qarorlar
            </p>
          </div>

          <div style={{ padding: '18px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#fbbf24', background: 'rgba(251,191,36,.12)', borderRadius: '999px', padding: '4px 12px' }}>
                📚 {soni('qiyin')} ta dars
              </span>
              <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#fbbf24', background: 'rgba(251,191,36,.12)', borderRadius: '999px', padding: '4px 12px' }}>
                🎁 Bepul namuna darslar
              </span>
            </div>

            {MODUL_TARKIBI.map((b) => (
              <div key={b.nom} style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '5px 0' }}>
                <span style={{
                  width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(251,191,36,.15)', color: '#fbbf24',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 900,
                }}>✓</span>
                <span style={{ fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}><b.Icon size={15} strokeWidth={2} style={{ color: '#fbbf24', flexShrink: 0 }} /> {b.nom}</span>
              </div>
            ))}

            <div style={{
              marginTop: '14px', fontSize: '12px', lineHeight: 1.55, opacity: .75,
              background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)',
              borderRadius: '12px', padding: '10px 12px',
            }}>
              🩺 Bu bosqichni tugatganlar <strong style={{ color: '#fbbf24' }}>ordinatura va USMLE</strong>ga
              tayyor bilim bilan chiqadi.
            </div>

            <button className="soft-press" style={{
              marginTop: 'auto',
              background: 'linear-gradient(135deg,#dc2626,#e11d48)', color: 'white',
              border: 'none', borderRadius: '14px', padding: '13px', fontSize: '14px', fontWeight: 800,
              cursor: 'pointer', width: '100%', marginBlockStart: '18px',
              boxShadow: '0 6px 18px rgba(220,38,38,.4)',
            }}>
              PRO darajaga o&apos;tish ⚡
            </button>
            <div style={{ textAlign: 'center', fontSize: '11px', opacity: .5, marginTop: '8px' }}>
              Avval bepul namuna darslarni sinab ko&apos;ring
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Flat ro'yxat: klassifikatsiyalar / operativ ──
function FlatRoyxat({ bolim }: { bolim: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [darslar, setDarslar] = useState<GinDars[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('gin_darslar').select('slug, sarlavha, kategoriya, bosqich, qisqa, daqiqa')
      .eq('faol', true).eq('bolim', bolim).order('sort_order').order('created_at')
      .then(({ data }) => { setDarslar((data ?? []) as GinDars[]); setLoading(false) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bolim])

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '20px 20px 40px' }}>
      <h2 style={{ margin: '0 0 5px', fontSize: '22px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '9px' }}>
        <span style={{ color: 'var(--gyn)' }}><BookOpen size={22} strokeWidth={2} /></span> {BOLIM_SARLAVHA[bolim] ?? 'Ginekologiya'}
      </h2>
      <p style={{ margin: '0 0 20px', color: 'var(--muted)', fontSize: '13.5px' }}>Ma&apos;lumotnoma.</p>
      {loading ? (
        <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Yuklanmoqda…</p>
      ) : darslar.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--muted)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px', color: 'var(--gyn)' }}><BookOpen size={38} strokeWidth={1.5} /></div>
          <p style={{ margin: 0 }}>Bu bo&apos;limda hozircha material yo&apos;q — tez orada qo&apos;shiladi.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {darslar.map((d) => (
            <button key={d.slug} onClick={() => router.push(`/student/ginekologiya/darslar/${d.slug}`)} className="soft-press"
              style={{ display: 'flex', alignItems: 'center', gap: '13px', width: '100%', textAlign: 'left', cursor: 'pointer', background: 'var(--surface)', border: '1px solid var(--line)', borderLeft: `4px solid var(--gyn)`, borderRadius: '14px', padding: '14px 16px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '14.5px', fontWeight: 700 }}>{d.sarlavha}</div>
                {d.qisqa && <div style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '3px', lineHeight: 1.45 }}>{d.qisqa}</div>}
              </div>
              <ChevronRight size={18} strokeWidth={2.2} style={{ color: 'var(--muted)', flexShrink: 0 }} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function Ichki() {
  const bolim = useSearchParams().get('bolim') || 'darslar'
  return bolim === 'darslar' ? <BosqichLanding /> : <FlatRoyxat bolim={bolim} />
}

export default function GinDarslar() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
      <Header backHref="/student/dashboard" backLabel="Bosh sahifa" />
      <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>Yuklanmoqda…</div>}>
        <Ichki />
      </Suspense>
      <BottomNav />
    </div>
  )
}
