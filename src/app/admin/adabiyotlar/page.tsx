import { Header } from '@/components/Header'

export default function AdminAdabiyotlarPage() {
  return (
    <>
      <Header backHref="/admin/dashboard" backLabel="Admin paneli" />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>📖 Adabiyotlar & Darsliklar</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '32px' }}>Darsliklar, qo&apos;llanmalar va adabiyotlarni boshqarish</p>

        <div style={{
          border: '2px dashed var(--line)', borderRadius: '20px',
          padding: '60px 32px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📖</div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Tez orada</h2>
          <p style={{ color: 'var(--muted)', fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
            Adabiyotlar bo&apos;limi tayyorlanmoqda. Bu yerda darsliklar, qo&apos;llanmalar va
            ilmiy adabiyotlarni yuklash, tartiblash va talabalar uchun ulashish mumkin bo&apos;ladi.
          </p>
        </div>
      </div>
    </>
  )
}
