export type SelectableBanner = {
  id: string
  content_origin: 'manual' | 'automation'
  is_pinned: boolean
  priority: number
  created_at: string
  published_at: string | null
}
export type BannerLimits = { maxVisible: number; autoBannerSlots: number }

export function bannerlarniTanla<T extends SelectableBanner>(all: T[], limits: BannerLimits): T[] {
  const maxVisible = Math.max(0, limits.maxVisible)
  const autoSlots = Math.max(0, Math.min(limits.autoBannerSlots, maxVisible))
  const manual = all.filter((b) => b.content_origin === 'manual').sort((a, b) =>
    Number(b.is_pinned) - Number(a.is_pinned)
    || b.priority - a.priority
    || new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  const automatic = all.filter((b) => b.content_origin === 'automation').sort((a, b) =>
    b.priority - a.priority
    || new Date(b.published_at ?? b.created_at).getTime() - new Date(a.published_at ?? a.created_at).getTime())

  if (automatic.length === 0 || autoSlots === 0) return manual.slice(0, maxVisible)
  return [
    ...manual.slice(0, Math.max(0, maxVisible - autoSlots)),
    ...automatic.slice(0, autoSlots),
  ]
}
