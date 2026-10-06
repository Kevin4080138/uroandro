import { describe, expect, it } from 'vitest'
import { imageProviderUrl, pinterestImages, pixabayImages, validatePinterestRights } from './telegramImages'

describe('Telegram rasm provayderlari', () => {
  it('parses Pixabay results with attribution and license', () => {
    const result = pixabayImages({ hits: [{ largeImageURL: 'https://pixabay.com/get/a_1280.jpg', previewURL: 'https://cdn.pixabay.com/photo/a_150.jpg', pageURL: 'https://pixabay.com/photos/example-1/', user: '<b>Ali</b>' }] })
    expect(result[0]).toMatchObject({ provider: 'pixabay', credit: 'Ali / Pixabay', license: 'Pixabay Content License' })
  })
  it('drops malformed and unapproved Pixabay hosts', () => {
    expect(pixabayImages({ hits: [{ largeImageURL: 'https://evil.example/a.jpg', previewURL: 'https://cdn.pixabay.com/a.jpg', pageURL: 'https://pixabay.com/photos/a/', user: 'A' }] })).toEqual([])
  })
  it('parses image pins and ignores videos', () => {
    const result = pinterestImages({ success: true, data: [
      { id: '123', type: 'pin', imageURL: 'https://i.pinimg.com/736x/a.jpg' },
      { id: '456', type: 'video', imageURL: 'https://i.pinimg.com/736x/b.jpg' },
    ] })
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({ provider: 'pinterest', source_url: 'https://www.pinterest.com/pin/123/' })
  })
  it('requires explicit Pinterest commercial-use evidence', () => {
    const candidate = pinterestImages({ success: true, data: [{ id: '123', type: 'pin', imageURL: 'https://i.pinimg.com/736x/a.jpg' }] })[0]
    expect(() => validatePinterestRights(candidate)).toThrow('foydalanish ruxsati')
    expect(() => validatePinterestRights({ ...candidate, license: 'Muallifning yozma ruxsati', rights_confirmed: true })).not.toThrow()
  })
  it.each([
    ['https://evil.example/a.jpg', 'pinterest'], ['http://i.pinimg.com/a.jpg', 'pinterest'],
    ['https://user:pass@i.pinimg.com/a.jpg', 'pinterest'], ['https://pixabay.com/users/a', 'pixabay'],
  ] as const)('rejects unsafe provider URL %s', (url, provider) => {
    expect(() => imageProviderUrl(url, provider)).toThrow()
  })
})
