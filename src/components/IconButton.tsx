'use client'

export function IconButton({
  icon, label, onClick, color, variant = 'default',
}: {
  icon: string
  label: string
  onClick: () => void
  color?: string
  variant?: 'default' | 'danger'
}) {
  return (
    <div className="group relative inline-flex">
      <button
        onClick={onClick}
        aria-label={label}
        className="btn-animated flex items-center justify-center rounded-lg border"
        style={{
          width: 36, height: 36,
          background: 'var(--surface-2)',
          borderColor: 'var(--line)',
          color: color ?? (variant === 'danger' ? 'var(--danger)' : 'var(--ink-soft)'),
          fontSize: 16,
        }}
      >
        {icon}
      </button>
      <span
        className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-xs opacity-0 transition-opacity group-hover:opacity-100"
        style={{ background: 'var(--ink)', color: 'var(--bg)', zIndex: 50 }}
      >
        {label}
      </span>
    </div>
  )
}
