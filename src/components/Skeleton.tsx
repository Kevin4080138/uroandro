export function Skeleton({ w = '100%', h = '16px', radius = '10px', style = {} }: {
  w?: string; h?: string; radius?: string; style?: React.CSSProperties
}) {
  return <div className="skeleton" style={{ width: w, height: h, borderRadius: radius, flexShrink: 0, ...style }} />
}

export function SkeletonCard({ h = '80px' }: { h?: string }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--line)',
      borderRadius: '16px', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '10px',
    }}>
      <Skeleton w="55%" h="14px" />
      <Skeleton w="80%" h="12px" />
      {h !== '80px' && <Skeleton w="40%" h="12px" />}
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--line)',
      borderRadius: '14px', padding: '14px 16px',
      display: 'flex', gap: '12px', alignItems: 'center',
    }}>
      <Skeleton w="36px" h="36px" radius="9px" style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Skeleton w="60%" h="13px" />
        <Skeleton w="40%" h="11px" />
      </div>
    </div>
  )
}

export function SkeletonDashboard() {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px' }}>
      {/* Greeting */}
      <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Skeleton w="120px" h="13px" />
        <Skeleton w="200px" h="30px" radius="8px" />
      </div>
      {/* Hero grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '20px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Skeleton h="120px" radius="16px" />
          <Skeleton h="110px" radius="16px" />
        </div>
        <Skeleton h="335px" radius="18px" />
      </div>
      {/* Cards */}
      <Skeleton w="80px" h="12px" style={{ marginBottom: '12px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} h="120px" radius="18px" />)}
      </div>
    </div>
  )
}
