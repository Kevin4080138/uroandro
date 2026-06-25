'use client'

const ranglar = { stroke: 'var(--accent)', fill: 'var(--accent-soft)' }

export function OzTekshiruvIkon({ tur, size = 64 }: { tur: string; size?: number }) {
  const props = { width: size, height: size, viewBox: '0 0 64 64', fill: 'none' }

  switch (tur) {
    case 'dush':
      return (
        <svg {...props}>
          <rect x="14" y="10" width="36" height="6" rx="3" fill={ranglar.fill} />
          <circle cx="20" cy="10" r="2" fill={ranglar.stroke} />
          <path d="M22 22 v6 M32 22 v8 M42 22 v6" stroke={ranglar.stroke} strokeWidth="2" strokeLinecap="round" />
          <path d="M20 34 q12 14 24 0" stroke={ranglar.stroke} strokeWidth="2" fill="none" />
          <path d="M16 14 L48 14 L46 18 L18 18 Z" fill={ranglar.fill} stroke={ranglar.stroke} strokeWidth="1.5" />
        </svg>
      )
    case 'qollar':
      return (
        <svg {...props}>
          <ellipse cx="32" cy="34" rx="11" ry="14" fill={ranglar.fill} stroke={ranglar.stroke} strokeWidth="2" />
          <path d="M14 24 q6 8 7 20" stroke={ranglar.stroke} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M50 24 q-6 8 -7 20" stroke={ranglar.stroke} strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx="14" cy="22" r="3" fill={ranglar.stroke} />
          <circle cx="50" cy="22" r="3" fill={ranglar.stroke} />
        </svg>
      )
    case 'aylantirish':
      return (
        <svg {...props}>
          <ellipse cx="32" cy="32" rx="13" ry="16" fill={ranglar.fill} stroke={ranglar.stroke} strokeWidth="2" />
          <path d="M20 20 A 16 16 0 0 1 32 14" stroke={ranglar.stroke} strokeWidth="2.5" strokeLinecap="round" fill="none" markerEnd="url(#arrow)" />
          <path d="M44 44 A 16 16 0 0 1 32 50" stroke={ranglar.stroke} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <defs>
            <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={ranglar.stroke} />
            </marker>
          </defs>
        </svg>
      )
    case 'solishtirish':
      return (
        <svg {...props}>
          <ellipse cx="20" cy="32" rx="9" ry="12" fill={ranglar.fill} stroke={ranglar.stroke} strokeWidth="2" />
          <ellipse cx="44" cy="34" rx="9" ry="13" fill={ranglar.fill} stroke={ranglar.stroke} strokeWidth="2" />
          <path d="M32 18 v28" stroke={ranglar.stroke} strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>
      )
    case 'jurnal':
      return (
        <svg {...props}>
          <rect x="14" y="10" width="36" height="44" rx="4" fill={ranglar.fill} stroke={ranglar.stroke} strokeWidth="2" />
          <path d="M20 22 h24 M20 30 h24 M20 38 h16" stroke={ranglar.stroke} strokeWidth="2" strokeLinecap="round" />
          <circle cx="42" cy="44" r="3" fill={ranglar.stroke} />
        </svg>
      )
    case 'kalendar':
      return (
        <svg {...props}>
          <rect x="12" y="14" width="40" height="36" rx="4" fill={ranglar.fill} stroke={ranglar.stroke} strokeWidth="2" />
          <path d="M12 24 h40" stroke={ranglar.stroke} strokeWidth="2" />
          <path d="M20 10 v8 M44 10 v8" stroke={ranglar.stroke} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="22" cy="34" r="2.5" fill={ranglar.stroke} />
          <circle cx="32" cy="34" r="2.5" fill={ranglar.stroke} />
          <circle cx="42" cy="34" r="2.5" fill={ranglar.stroke} />
          <circle cx="22" cy="43" r="2.5" fill={ranglar.stroke} />
        </svg>
      )
    case 'shifokor':
      return (
        <svg {...props}>
          <circle cx="32" cy="20" r="8" fill={ranglar.fill} stroke={ranglar.stroke} strokeWidth="2" />
          <path d="M16 52 q0 -16 16 -16 q16 0 16 16" fill={ranglar.fill} stroke={ranglar.stroke} strokeWidth="2" />
          <path d="M28 34 v8 M24 38 h8" stroke={ranglar.stroke} strokeWidth="2" strokeLinecap="round" />
          <circle cx="40" cy="46" r="6" fill="none" stroke={ranglar.stroke} strokeWidth="2" />
          <path d="M44 50 l4 4" stroke={ranglar.stroke} strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    case 'kuzatish':
    default:
      return (
        <svg {...props}>
          <ellipse cx="32" cy="36" rx="20" ry="12" fill="none" stroke={ranglar.stroke} strokeWidth="2" />
          <circle cx="32" cy="36" r="7" fill={ranglar.fill} stroke={ranglar.stroke} strokeWidth="2" />
          <circle cx="32" cy="36" r="2.5" fill={ranglar.stroke} />
        </svg>
      )
  }
}
