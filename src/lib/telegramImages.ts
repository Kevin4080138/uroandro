import type { TelegramImageCandidate, TelegramPinterestSearchResult, TelegramVideoCandidate } from './telegramContent'

export function imageProviderUrl(value: string, provider: TelegramImageCandidate['provider']) {
  const url = new URL(value)
  const hosts = { pexels: ['images.pexels.com'], unsplash: ['images.unsplash.com'], pixabay: ['pixabay.com', 'cdn.pixabay.com'], pinterest: ['i.pinimg.com'] }
  if (url.protocol !== 'https:' || url.username || url.password || url.port || !hosts[provider]?.includes(url.hostname)) {
    throw new Error('Rasm manzili tasdiqlangan provayderga tegishli emas.')
  }
  if (provider === 'pixabay' && url.hostname === 'pixabay.com' && !url.pathname.startsWith('/get/')) throw new Error('Pixabay rasm manzili noto‘g‘ri.')
  return url
}

export function pinterestSearchResults(value: unknown): TelegramPinterestSearchResult {
  if (!value || typeof value !== 'object' || !('pins' in value) || !Array.isArray(value.pins)) {
    throw new Error('Pinterest javobi noto‘g‘ri yoki qidiruv bajarilmadi.')
  }
  const images: TelegramImageCandidate[] = []
  const videos: TelegramVideoCandidate[] = []
  for (const pin of value.pins.slice(0, 250) as Record<string, unknown>[]) {
    try {
      if (!pin || typeof pin.id !== 'string' || !/^\d+$/.test(pin.id) || typeof pin.image_url !== 'string') continue
      imageProviderUrl(pin.image_url, 'pinterest')
      const source_url = `https://www.pinterest.com/pin/${pin.id}/`
      const credit = `Pinterest · pin ${pin.id}`
      if (pin.is_video === true) {
        if (typeof pin.video_url !== 'string') continue
        const video = new URL(pin.video_url)
        if (video.protocol !== 'https:' || !['v1.pinimg.com', 'v.pinimg.com'].includes(video.hostname) || video.username || video.password || video.port) continue
        videos.push({ provider: 'pinterest', video_url: video.href, preview_url: pin.image_url, source_url, credit })
        continue
      }
      images.push({ provider: 'pinterest', image_url: pin.image_url, preview_url: pin.image_url,
        source_url, credit, license: 'Muallif tasdig‘i mavjud' })
    } catch { /* Noto‘g‘ri yoki tasdiqlanmagan hostli natija tashlab ketiladi. */ }
  }
  const bookmark = 'nextBookmark' in value && typeof value.nextBookmark === 'string' && value.nextBookmark.length <= 4096
    ? value.nextBookmark : null
  return { images: images.slice(0, 24), videos: videos.slice(0, 24), nextBookmark: bookmark }
}

export function pinterestImages(value: unknown): TelegramImageCandidate[] {
  return pinterestSearchResults(value).images
}

export function validatePinterestSource(candidate: TelegramImageCandidate) {
  if (candidate.provider !== 'pinterest') return
  const source = new URL(candidate.source_url)
  if (source.protocol !== 'https:' || source.hostname !== 'www.pinterest.com' || !/^\/pin\/\d+\/$/.test(source.pathname) || source.username || source.password) {
    throw new Error('Pinterest manba havolasi noto‘g‘ri.')
  }
}

export function pixabayImages(value: unknown): TelegramImageCandidate[] {
  if (!value || typeof value !== 'object' || !('hits' in value) || !Array.isArray(value.hits)) throw new Error('Pixabay javobi noto‘g‘ri.')
  return value.hits.slice(0, 6).flatMap((hit: Record<string, unknown>) => {
    try {
      if (!hit || typeof hit.largeImageURL !== 'string' || typeof hit.previewURL !== 'string' || typeof hit.pageURL !== 'string') return []
      imageProviderUrl(hit.largeImageURL, 'pixabay'); imageProviderUrl(hit.previewURL, 'pixabay')
      const source = new URL(hit.pageURL)
      if (source.protocol !== 'https:' || source.hostname !== 'pixabay.com' || source.username || source.password) return []
      const author = typeof hit.user === 'string' ? hit.user.replace(/<[^>]*>/g, '').slice(0, 100) : 'Pixabay'
      return [{ provider: 'pixabay' as const, image_url: hit.largeImageURL, preview_url: hit.previewURL,
        source_url: source.href, credit: `${author} / Pixabay`, license: 'Pixabay Content License' }]
    } catch { return [] }
  })
}
