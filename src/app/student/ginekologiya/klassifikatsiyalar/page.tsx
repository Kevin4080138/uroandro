'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Search } from 'lucide-react'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { GINEKOLOGIYA_KLASSIFIKATSIYALARI, GIN_KLASSIFIKATSIYA_KATEGORIYALARI } from '@/lib/ginekologiyaKlassifikatsiyalari'

export default function GinKlassifikatsiyalarPage() {
  const router = useRouter()
  const [filtr, setFiltr] = useState('Hammasi')
  const [qidiruv, setQidiruv] = useState('')
  const royxat = useMemo(() => {
    const q = qidiruv.trim().toLocaleLowerCase('uz')
    return GINEKOLOGIYA_KLASSIFIKATSIYALARI.filter((t) =>
      (filtr === 'Hammasi' || t.kategoriya === filtr) &&
      (!q || `${t.nom} ${t.toliq ?? ''} ${t.qisqa}`.toLocaleLowerCase('uz').includes(q)))
  }, [filtr, qidiruv])

  return <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
    <Header backHref="/student/dashboard" backLabel="Bosh sahifa" />
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 20px' }}>
      <h1 style={{ fontSize: '24px', margin: '0 0 6px' }}>🌸 Ginekologiya klassifikatsiyalari</h1>
      <p style={{ margin: '0 0 18px', color: 'var(--muted)', fontSize: '13.5px', lineHeight: 1.6 }}>
        {GINEKOLOGIYA_KLASSIFIKATSIYALARI.length} ta amaliy tasnif. Kartani bosing — izohli to‘liq sahifaga kirasiz.
      </p>
      <div style={{ position: 'relative', marginBottom: '12px' }}>
        <Search size={17} style={{ position: 'absolute', left: 13, top: 12, color: 'var(--muted)' }} />
        <input value={qidiruv} onChange={(e) => setQidiruv(e.target.value)} placeholder="Qidirish — masalan, FIGO yoki PALM-COEIN" style={{ width: '100%', boxSizing: 'border-box', padding: '11px 14px 11px 40px', borderRadius: '12px', border: '1px solid var(--line)', background: 'var(--surface-2)', color: 'var(--ink)', fontSize: '14px', outline: 'none' }} />
      </div>
      <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginBottom: '18px' }}>
        {GIN_KLASSIFIKATSIYA_KATEGORIYALARI.map((kat) => <button key={kat} onClick={() => setFiltr(kat)} className="soft-press" style={{ border: `1px solid ${filtr === kat ? 'var(--gyn)' : 'var(--line)'}`, background: filtr === kat ? 'var(--gyn-soft)' : 'var(--surface)', color: filtr === kat ? 'var(--gyn)' : 'var(--muted)', borderRadius: 999, padding: '6px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>{kat}</button>)}
      </div>
      <div style={{ display: 'grid', gap: '11px' }}>
        {royxat.map((t) => <button key={t.slug} onClick={() => router.push(`/student/ginekologiya/klassifikatsiyalar/${t.slug}`)} className="rise soft-press" style={{ textAlign: 'left', padding: 0, overflow: 'hidden', borderRadius: '14px', border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)', cursor: 'pointer' }}>
          <div style={{ height: 3, background: 'linear-gradient(90deg, var(--gyn), #f472b6)' }} />
          <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}><strong style={{ display: 'block', fontSize: '14.5px' }}>{t.nom}</strong><span style={{ display: 'block', color: 'var(--muted)', fontSize: '12.5px', lineHeight: 1.5, marginTop: 5 }}>{t.qisqa}</span><span style={{ display: 'inline-block', color: 'var(--gyn)', background: 'var(--gyn-soft)', borderRadius: 999, padding: '2px 8px', fontSize: '10.5px', fontWeight: 700, marginTop: 8 }}>{t.yangilanish}</span></div>
            <ArrowRight size={18} color="var(--gyn)" />
          </div>
        </button>)}
      </div>
      {!royxat.length && <p style={{ textAlign: 'center', color: 'var(--muted)', padding: 30 }}>Bunday tasnif topilmadi.</p>}
    </main>
    <BottomNav />
  </div>
}
