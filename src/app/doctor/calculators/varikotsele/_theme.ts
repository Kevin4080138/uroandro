import type { CSSProperties } from 'react'

export const T = {
  bg: '#F5F8F8',
  surface: '#FFFFFF',
  surface2: '#EEF3F3',
  ink: '#11272C',
  inkSoft: '#385056',
  muted: '#647A80',
  line: '#DCE6E7',
  deep: '#0E3A40',
  teal: '#127C8A',
  good: '#1B7A4B',
  warnBg: '#FBEEE2',
  warnText: '#7A3A0B',
}

export const card: CSSProperties = {
  background: T.surface,
  border: `1px solid ${T.line}`,
  borderRadius: 14,
  boxShadow: '0 1px 2px rgba(16,40,44,.05), 0 6px 22px -12px rgba(16,40,44,.18)',
  padding: 22,
}

export const input: CSSProperties = {
  width: '100%',
  fontSize: 14,
  padding: '9px 11px',
  border: `1.5px solid #C5D4D5`,
  borderRadius: 9,
  background: T.surface,
  color: T.ink,
  boxSizing: 'border-box',
}

export const label: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: T.inkSoft,
  display: 'block',
  marginBottom: 6,
}

export const btnPrimary: CSSProperties = {
  background: T.deep,
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  padding: '11px 20px',
  fontSize: 14.5,
  fontWeight: 600,
  cursor: 'pointer',
}

export const btnGhost: CSSProperties = {
  background: T.surface2,
  color: T.inkSoft,
  border: 'none',
  borderRadius: 10,
  padding: '11px 20px',
  fontSize: 14.5,
  fontWeight: 600,
  cursor: 'pointer',
}

