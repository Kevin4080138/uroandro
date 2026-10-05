import { describe, expect, it } from 'vitest'
import { scheduleTime, tashkentInput } from './telegramSchedule'

const now = Date.parse('2026-10-05T05:00:00Z')
describe('Toshkent rejalashtirish vaqti', () => {
  it('converts explicit Tashkent time to UTC regardless of the browser timezone', () => {
    expect(scheduleTime('2026-10-05T12:30', now)).toBe('2026-10-05T07:30:00.000Z')
  })
  it('roundtrips across a UTC date boundary', () => {
    const utc = scheduleTime('2026-10-06T00:30', now)
    expect(utc).toBe('2026-10-05T19:30:00.000Z')
    expect(tashkentInput(new Date(utc))).toBe('2026-10-06T00:30')
  })
  it.each(['2026-10-05T09:59', '2026-10-05T10:00', '2028-10-05T10:00', '2026-02-30T12:00', '2026-10-05T25:00', 'invalid', '2026-10-05T12:00Z'])('rejects invalid or out-of-range time %s', value => {
    expect(() => scheduleTime(value, now)).toThrow()
  })
})
