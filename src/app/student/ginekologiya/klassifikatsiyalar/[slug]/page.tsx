import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { GINEKOLOGIYA_KLASSIFIKATSIYALARI, ginKlassifikatsiyaTop } from '@/lib/ginekologiyaKlassifikatsiyalari'

export function generateStaticParams() {
  return GINEKOLOGIYA_KLASSIFIKATSIYALARI.map(({ slug }) => ({ slug }))
}

export default async function GinKlassifikatsiyaIchkiPage({ params }: PageProps<'/student/ginekologiya/klassifikatsiyalar/[slug]'>) {
  const { slug } = await params
  const t = ginKlassifikatsiyaTop(slug)
  if (!t) notFound()

  return <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: 90 }}>
    <Header backHref="/student/ginekologiya/klassifikatsiyalar" backLabel="Klassifikatsiyalar" />
    <main style={{ maxWidth: 820, margin: '0 auto', padding: '24px 20px' }}>
      <Link href="/student/ginekologiya/klassifikatsiyalar" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: 13 }}>← Ro‘yxatga qaytish</Link>
      <section className="rise" style={{ marginTop: 16, padding: '25px 26px', borderRadius: 18, color: 'white', background: 'linear-gradient(135deg, var(--gyn), #ec6eae)' }}>
        <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.06em', opacity: .85 }}>{t.kategoriya} · {t.yangilanish}</span>
        <h1 style={{ margin: '7px 0 5px', fontSize: 25 }}>{t.nom}</h1>
        {t.toliq && <p style={{ margin: 0, opacity: .9, fontSize: 13 }}>{t.toliq}</p>}
      </section>
      <section className="rise" style={{ marginTop: 16, background: 'var(--gyn-soft)', border: '1px solid var(--gyn)', borderRadius: 16, padding: '18px 20px', display: 'flex', gap: 12 }}>
        <span style={{ fontSize: 20, lineHeight: 1 }}>💡</span>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--gyn)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 5 }}>Sodda tilda</div>
          <p style={{ margin: 0, lineHeight: 1.7, fontSize: 14.5, color: 'var(--ink)' }}>{t.nimaBu}</p>
        </div>
      </section>
      <section style={{ marginTop: 16, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: '20px 22px' }}>
        <h2 style={{ fontSize: 17, margin: '0 0 8px' }}>Batafsil</h2><p style={{ margin: 0, lineHeight: 1.7, fontSize: 14 }}>{t.tushuntirish}</p>
        <h2 style={{ fontSize: 17, margin: '20px 0 8px' }}>Qachon ishlatiladi?</h2><p style={{ margin: 0, lineHeight: 1.7, fontSize: 14 }}>{t.qachon}</p>
      </section>
      <section style={{ marginTop: 16, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: '20px 22px' }}>
        <h2 style={{ fontSize: 17, margin: '0 0 12px' }}>Darajalar va mezonlar</h2>
        <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', minWidth: 420, borderCollapse: 'collapse', fontSize: 13 }}><thead><tr>{t.ustunlar.map((u) => <th key={u} style={{ textAlign: 'left', padding: '9px 10px', background: 'var(--gyn-soft)', color: 'var(--gyn)', whiteSpace: 'nowrap' }}>{u}</th>)}</tr></thead><tbody>{t.qatorlar.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j} style={{ padding: '10px', borderTop: '1px solid var(--line)', lineHeight: 1.55, fontWeight: j === 0 ? 800 : 400, color: j === 0 ? 'var(--gyn)' : 'var(--ink)' }}>{cell}</td>)}</tr>)}</tbody></table></div>
      </section>
      <section style={{ marginTop: 16, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: '20px 22px', fontSize: 13.5, lineHeight: 1.65 }}>
        <p style={{ margin: '0 0 12px' }}><strong style={{ color: 'var(--gyn)' }}>Eslab qoling:</strong> {t.eslabQolish}</p>
        <p style={{ margin: '0 0 14px' }}><strong style={{ color: 'var(--warn)' }}>Ehtiyot nuqta:</strong> {t.ehtiyot}</p>
        <h2 style={{ fontSize: 15, margin: '0 0 7px' }}>Manbalar</h2>
        <ul style={{ margin: 0, paddingLeft: 20 }}>{t.manbalar.map((m) => <li key={m.url}><a href={m.url} target="_blank" rel="noreferrer" style={{ color: 'var(--gyn)' }}>{m.nom}</a></li>)}</ul>
      </section>
    </main>
    <BottomNav />
  </div>
}
