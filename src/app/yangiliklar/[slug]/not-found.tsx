import Link from 'next/link'

export default function YangilikTopilmadi() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', display: 'grid', placeItems: 'center', padding: '32px 18px' }}>
      <section style={{ width: '100%', maxWidth: '620px', textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '22px', padding: '44px 24px' }}>
        <div aria-hidden="true" style={{ fontSize: '48px', marginBottom: '14px' }}>📰</div>
        <h1 style={{ margin: '0 0 12px', fontSize: 'clamp(26px, 5vw, 38px)' }}>Yangilik topilmadi</h1>
        <p style={{ color: 'var(--muted)', lineHeight: 1.7, margin: '0 auto 24px', maxWidth: '480px' }}>
          Bu maqola manzili noto‘g‘ri, maqola hali nashr qilinmagan yoki keyinroq olib tashlangan bo‘lishi mumkin.
        </p>
        <Link href="/" style={{ display: 'inline-block', background: 'var(--accent)', color: 'white', borderRadius: '12px', padding: '11px 18px', fontWeight: 800, textDecoration: 'none' }}>
          Urosfera bosh sahifasiga qaytish
        </Link>
      </section>
    </main>
  )
}
