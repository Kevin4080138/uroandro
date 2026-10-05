import { describe, expect, it } from 'vitest'
import { postUpdateInput } from './telegramContent'

const valid = { title: 'Buyrak salomatligi', topic: 'Buyrak toshlari', body: 'Foydali matn', audience: 'patient', status: 'approved', revision: 2 }

describe('Telegram post muharriri validatsiyasi', () => {
  it('tasdiqlangan tahrirni normalizatsiya qiladi', () => {
    expect(postUpdateInput({ ...valid, title: '  Buyrak salomatligi  ' })).toEqual(valid)
  })
  it.each(['sent', 'failed', 'scheduled', 'unknown'])('muharrir orqali %s holatini o‘rnatmaydi', (status) => {
    expect(() => postUpdateInput({ ...valid, status })).toThrow('Post holati noto‘g‘ri')
  })
  it('bo‘sh yoki haddan uzun matnni rad etadi', () => {
    expect(() => postUpdateInput({ ...valid, body: ' ' })).toThrow('Post matni')
    expect(() => postUpdateInput({ ...valid, body: 'x'.repeat(3501) })).toThrow('Post matni')
  })
  it('eskirgan versiya qiymatini rad etadi', () => {
    expect(() => postUpdateInput({ ...valid, revision: 0 })).toThrow('Post versiyasi')
  })
})
