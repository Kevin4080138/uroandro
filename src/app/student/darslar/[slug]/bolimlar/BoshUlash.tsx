// Bo'lim kontenti hali tayyor bo'lmaganda (yoki yuklanayotganda) ko'rsatiladigan
// umumiy bo'sh-holat. Ko'p bo'limlar shundan foydalanadi.
export function BoshUlash({ matn }: { matn: string }) {
  return (
    <div className="rise" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--muted)' }}>
      <div style={{ fontSize: '36px', marginBottom: '10px' }}>🛠️</div>
      <p style={{ margin: 0 }}>{matn}</p>
    </div>
  )
}
