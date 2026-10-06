import { describe, expect, it } from 'vitest'
import { imageProviderUrl, pinterestImages, pixabayImages, validatePinterestRights } from './telegramImages'

describe('Telegram rasm provayderlari', () => {
  it('distinguishes an empty Scrappa response from a malformed response', () => {
    expect(pinterestImages({ pins: [] })).toEqual([])
    expect(() => pinterestImages({ message: 'Failed' })).toThrow()
  })
  it('drops unsafe Scrappa images and malformed pins', () => {
    expect(pinterestImages({ pins: [null, { id: '123', image_url: 'https://evil.example/a.jpg' }, { id: 123, image_url: 'https://i.pinimg.com/a.jpg' }] })).toEqual([])
  })
  it('parses Pixabay results with attribution and license', () => {
    const result = pixabayImages({ hits: [{ largeImageURL: 'https://pixabay.com/get/a_1280.jpg', previewURL: 'https://cdn.pixabay.com/photo/a_150.jpg', pageURL: 'https://pixabay.com/photos/example-1/', user: '<b>Ali</b>' }] })
    expect(result[0]).toMatchObject({ provider: 'pixabay', credit: 'Ali / Pixabay', license: 'Pixabay Content License' })
  })
  it('drops malformed and unapproved Pixabay hosts', () => {
    expect(pixabayImages({ hits: [{ largeImageURL: 'https://evil.example/a.jpg', previewURL: 'https://cdn.pixabay.com/a.jpg', pageURL: 'https://pixabay.com/photos/a/', user: 'A' }] })).toEqual([])
  })
  it('parses image pins and ignores videos', () => {
    const result = pinterestImages({ pins: [
      { id: '123', is_video: false, image_url: 'https://i.pinimg.com/736x/a.jpg' },
      { id: '456', is_video: true, image_url: 'https://i.pinimg.com/736x/b.jpg' },
    ] })
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({ provider: 'pinterest', source_url: 'https://www.pinterest.com/pin/123/' })
  })
  it('requires explicit Pinterest commercial-use evidence', () => {
    const candidate = pinterestImages({ pins: [{ id: '123', is_video: false, image_url: 'https://i.pinimg.com/736x/a.jpg' }] })[0]
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
