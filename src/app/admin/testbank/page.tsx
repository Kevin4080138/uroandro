'use client'

// Test banki — har bir dars bo'yicha savol banklari to'liqligi (kod + dars_tarkibi bazasi).
// Maqsadlar kontent qoidalaridan (AGENTS.md): amaliy 40/45/50, flashcard 20/30/40.
// Tahrirlash "Darslar tarkibi" sahifasida — bu sahifa kamchiliklarni ko'rsatuvchi auditor.

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { DARSLAR, type Bosqich } from '@/lib/talim/darslar'
import { UrosferaLoaderMini } from '@/components/UrosferaLoader'

type TarkibQator = {
  dars_slug: string
  savollar_banki: unknown[] | null
  usmle_savollar: unknown[] | null
  nazorat_savollar: unknown[] | null
  flashcardlar: unknown[] | null
}

const AMALIY_MAQSAD: Record<Bosqich, number> = { oson: 40, "o'rta": 45, qiyin: 50 }
const FLASH_MAQSAD: Record<Bosqich, number> = { oson: 20, "o'rta": 30, qiyin: 40 }
const BOSQICH_NOMI: Record<string, string> = { oson: '🟢 OSON', "o'rta": "🟡 O'RTA", qiyin: '🔴 QIYIN' }
const BOSQICH_RANG: Record<string, string> = { oson: '#16a34a', "o'rta": '#d97706', qiyin: '#dc2626' }

function Katak({ bor, maqsad }: { bor: number; maqsad: number | null }) {
  // maqsad=null — bu bosqich uchun talab qilinmaydi
  if (maqsad === null) return <td style={{ padding: '10px 12px', color: 'var(--muted)', fontSize: '12px' }}>—</td>
  const toliq = bor >= maqsad
  const rang = bor === 0 ? '#dc2626' : toliq ? '#16a34a' : '#d97706'
  return (
    <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
      <span style={{ fontSize: '12.5px', fontWeight: 900, color: rang }}>
        {bor === 0 ? '❌ 0' : `${toliq ? '✅' : '⚠️'} ${bor}`}
      </span>
      <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}> / {maqsad}</span>
    </td>
  )
}

export default function AdminTestbankPage() {
  const supabase = createClient()
  const [tarkiblar, setTarkiblar] = useState<Map<string, TarkibQator>>(new Map())
  const [yuklandi, setYuklandi] = useState(false)
  const [bosqichFiltr, setBosqichFiltr] = useState<'hammasi' | Bosqich>('hammasi')
  const [faqatKamlar, setFaqatKamlar] = useState(false)

  useEffect(() => {
    supabase
      .from('dars_tarkibi')
      .select('dars_slug, savollar_banki, usmle_savollar, nazorat_savollar, flashcardlar')
      .then(({ data }) => {
        setTarkiblar(new Map(((data as TarkibQator[]) ?? []).map((r) => [r.dars_slug, r])))
        setYuklandi(true)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const qatorlar = useMemo(() => DARSLAR.map((d) => {
    const db = tarkiblar.get(d.slug)
    // Baza ustuvor (talaba sahifasi ham shunday o'qiydi), bo'lmasa kod
    const amaliy = db?.savollar_banki?.length ?? (d.savollarBanki?.length || d.test.length)
    const usmle = db?.usmle_savollar?.length ?? (d.usmleSavollar?.length ?? 0)
    const nazorat = db?.nazorat_savollar?.length ?? (d.nazoratSavollar?.length ?? 0)
    const flash = db?.flashcardlar?.length ?? 0
    const usmleKerak = d.bosqich !== 'oson'
    const nazoratKerak = d.bosqich !== 'oson'
    const kamlik =
      amaliy < AMALIY_MAQSAD[d.bosqich] ||
      flash < FLASH_MAQSAD[d.bosqich] ||
      (usmleKerak && usmle === 0) ||
      (nazoratKerak && nazorat === 0)
    return { dars: d, amaliy, usmle, nazorat, flash, usmleKerak, nazoratKerak, kamlik }
  }), [tarkiblar])

  const korinadigan = useMemo(() => {
    let r = qatorlar
    if (bosqichFiltr !== 'hammasi') r = r.filter((x) => x.dars.bosqich === bosqichFiltr)
    if (faqatKamlar) r = r.filter((x) => x.kamlik)
    return r
  }, [qatorlar, bosqichFiltr, faqatKamlar])

  const kamlar = qatorlar.filter((x) => x.kamlik).length

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/admin/dashboard" backLabel="Dashboard" />

      <div className="mx-auto max-w-[1100px] px-6 py-8">
        <h1 style={{ margin: '0 0 6px', fontSize: '23px', fontWeight: 900 }}>❓ Test banki auditi</h1>
        <p style={{ margin: '0 0 20px', color: 'var(--muted)', fontSize: '13px' }}>
          Har bir dars banklari to&apos;liqligi (kod + baza). Tahrirlash — <strong>Darslar tarkibi</strong> sahifasida.
          Hozir <strong style={{ color: kamlar > 0 ? '#d97706' : '#16a34a' }}>{kamlar} ta darsda kamchilik</strong> bor.
        </p>

        {/* Filtrlar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {(['hammasi', 'oson', "o'rta", 'qiyin'] as const).map((b) => (
            <button key={b} onClick={() => setBosqichFiltr(b)} className="soft-press" style={{
              background: bosqichFiltr === b ? 'var(--accent)' : 'var(--surface-2)',
              color: bosqichFiltr === b ? 'white' : 'var(--ink-soft)',
              border: bosqichFiltr === b ? 'none' : '1px solid var(--line)',
              borderRadius: '999px', padding: '7px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
            }}>{b === 'hammasi' ? 'Barchasi' : BOSQICH_NOMI[b]}</button>
          ))}
          <button onClick={() => setFaqatKamlar(!faqatKamlar)} className="soft-press" style={{
            background: faqatKamlar ? '#d97706' : 'var(--surface-2)',
            color: faqatKamlar ? 'white' : 'var(--ink-soft)',
            border: faqatKamlar ? 'none' : '1px solid var(--line)',
            borderRadius: '999px', padding: '7px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
          }}>⚠️ Faqat kamchiliklar</button>
        </div>

        {!yuklandi ? (
          <UrosferaLoaderMini />
        ) : (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--line)', background: 'var(--surface-2)' }}>
                    {['Dars', 'Bosqich', 'Amaliy bank', 'Flashcard', 'USMLE', 'Nazorat'].map((h) => (
                      <th key={h} style={{ padding: '11px 12px', textAlign: 'left', fontSize: '11px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.03em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {korinadigan.map(({ dars: d, amaliy, usmle, nazorat, flash, usmleKerak, nazoratKerak }) => (
                    <tr key={d.slug} style={{ borderBottom: '1px solid var(--line)' }}>
                      <td style={{ padding: '10px 12px', maxWidth: '340px' }}>
                        <div style={{ fontWeight: 700, fontSize: '12.5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.sarlavha}</div>
                        <div style={{ fontSize: '10.5px', color: 'var(--muted)' }}>{d.slug}</div>
                      </td>
                      <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                        <span style={{
                          fontSize: '10px', fontWeight: 900, color: BOSQICH_RANG[d.bosqich],
                          background: BOSQICH_RANG[d.bosqich] + '14', borderRadius: '999px', padding: '2px 8px',
                        }}>{BOSQICH_NOMI[d.bosqich]}</span>
                      </td>
                      <Katak bor={amaliy} maqsad={AMALIY_MAQSAD[d.bosqich]} />
                      <Katak bor={flash} maqsad={FLASH_MAQSAD[d.bosqich]} />
                      <Katak bor={usmle} maqsad={usmleKerak ? 1 : null} />
                      <Katak bor={nazorat} maqsad={nazoratKerak ? 1 : null} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p style={{ margin: '14px 0 0', fontSize: '11.5px', color: 'var(--muted)', lineHeight: 1.6 }}>
          Maqsadlar kontent qoidalaridan: amaliy bank — oson 40 / o&apos;rta 45 / qiyin 50; flashcard — 20 / 30 / 40.
          USMLE va Nazorat oson bosqichda talab qilinmaydi; o&apos;rta/qiyin uchun kamida bank mavjudligi tekshiriladi (❌ 0 = butunlay yo&apos;q).
        </p>
      </div>
    </div>
  )
}
