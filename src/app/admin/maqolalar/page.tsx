import { Header } from '@/components/Header'

export default function AdminMaqolalarPage() {
  return (
    <>
      <Header backHref="/admin/dashboard" backLabel="Admin paneli" />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>📰 Maqolalar</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '32px' }}>Ilmiy va klinik maqolalarni boshqarish</p>

        <div style={{
          border: '2px dashed var(--line)', borderRadius: '20px',
          padding: '60px 32px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📰</div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Tez orada</h2>
          <p style={{ color: 'var(--muted)', fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
            Maqolalar bo&apos;limi tayyorlanmoqda. Bu yerda ilmiy va klinik maqolalarni
            qo&apos;shish, tahrirlash va nashr qilish imkoniyati bo&apos;ladi.
          </p>
        </div>
      </div>
    </>
  )
}
