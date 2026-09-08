'use client'

import { useMemo, useState } from 'react'
import { GinekologiyaKalkulyatorQobiq, KalkulyatorKontent, KlinikOgohlantirish, ginInput, ginKarta, ginLabel } from '@/components/GinekologiyaKalkulyatorQobiq'
import { rmiHisob } from '@/lib/ginekologiyaHisoblash'

const BELGILAR = ['Multilokulyar kista', 'Solid soha', 'Ikki tomonlama massa', 'Ascit', 'Intraabdominal metastaz belgisi']

export default function RmiPage() {
  const [belgi, setBelgi] = useState<boolean[]>(Array(BELGILAR.length).fill(false))
  const [post, setPost] = useState<'' | 'pre' | 'post'>('')
  const [ca125, setCa125] = useState('')
  const caN = Number(ca125)
  const belgiSoni = belgi.filter(Boolean).length
  const natija = useMemo(() => (post !== '' && caN > 0 ? rmiHisob(belgiSoni, post === 'post', caN) : null), [belgiSoni, post, caN])
  const yuqori = natija && natija.rmi >= 200

  return <GinekologiyaKalkulyatorQobiq title="RMI — tuxumdon o‘smasi malignlik indeksi" subtitle="UTT belgilari, menopauzal holat va CA-125 ni birlashtirib adneksal massaning malignlik xavfini baholaydi (RMI I).">
    <section className="rise" style={{ ...ginKarta, marginBottom: '16px' }}>
      <label style={{ ...ginLabel, marginBottom: '10px' }}>UTT belgilari (mavjudlarini belgilang)</label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
        {BELGILAR.map((b, i) => (
          <label key={b} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--ink-soft)', cursor: 'pointer' }}>
            <input type="checkbox" checked={belgi[i]} onChange={() => setBelgi((p) => p.map((x, j) => (j === i ? !x : x)))} style={{ width: '18px', height: '18px', accentColor: 'var(--gyn)' }} />
            {b}
          </label>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div>
          <label style={ginLabel}>Menopauzal status</label>
          <select style={ginInput} value={post} onChange={(e) => setPost(e.target.value as 'pre' | 'post')}>
            <option value="">Tanlang…</option>
            <option value="pre">Premenopauza</option>
            <option value="post">Postmenopauza</option>
          </select>
        </div>
        <div><label style={ginLabel}>CA-125 (U/mL)</label><input style={ginInput} type="number" min="0" step="0.1" value={ca125} onChange={(e) => setCa125(e.target.value)} placeholder="masalan, 85" /></div>
      </div>
    </section>
    <section className="rise" style={ginKarta}>
      {!natija ? <p style={{ margin: 0, color: 'var(--muted)' }}>Menopauzal status va CA-125 qiymatini kiriting.</p> : <>
        <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>RMI I bali</div>
        <div style={{ fontSize: '38px', fontWeight: 800, color: yuqori ? '#dc2626' : 'var(--gyn)' }}>{Math.round(natija.rmi).toLocaleString('uz-UZ')}</div>
        <div style={{ marginTop: '4px', fontSize: '13px', color: 'var(--muted)' }}>U = {natija.U} · M = {natija.M} · CA-125 = {caN}</div>
        <div style={{ marginTop: '8px', fontSize: '15px', fontWeight: 700, color: yuqori ? '#dc2626' : '#16a34a' }}>{yuqori ? '≥200 — yuqori xavf, onkoginekologik yo‘naltirish' : '<200 — past xavf (mahalliy cutoffga qarang)'}</div>
      </>}
      <KlinikOgohlantirish>CA-125 endometrioz, yallig‘lanish va hayzda ham ko‘tarilishi mumkin; erta bosqichda normal bo‘lishi mumkin. Yo‘naltirish cutoffi mahalliy protokolga bog‘liq.</KlinikOgohlantirish>
    </section>
    <KalkulyatorKontent slug="rmi" />
  </GinekologiyaKalkulyatorQobiq>
}
