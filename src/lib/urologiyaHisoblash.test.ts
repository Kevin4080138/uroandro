import { describe, it, expect } from 'vitest'
import {
  ckdEpi2021, egfrBosqich,
  ipssDaraja, psaYoshMezoni, fpsaXavf, sonOqi,
} from './urologiyaHisoblash'

describe('ckdEpi2021 (CKD-EPI 2021, irqsiz)', () => {
  it('erkak, 50 yosh, kreatinin 0.9 mg/dL → ~104', () => {
    expect(Math.round(ckdEpi2021(0.9, 50, 'erkak'))).toBe(104)
  })
  it('ayol, 50 yosh, kreatinin 0.9 mg/dL → ~78', () => {
    expect(Math.round(ckdEpi2021(0.9, 50, 'ayol'))).toBe(78)
  })
  it('kreatinin oshsa eGFR pasayadi (monoton)', () => {
    expect(ckdEpi2021(1.5, 50, 'erkak')).toBeLessThan(ckdEpi2021(0.9, 50, 'erkak'))
  })
  it('yosh oshsa eGFR pasayadi', () => {
    expect(ckdEpi2021(0.9, 70, 'erkak')).toBeLessThan(ckdEpi2021(0.9, 50, 'erkak'))
  })
})

describe('egfrBosqich chegaralari', () => {
  it('90 → G1, 89.99 → G2', () => {
    expect(egfrBosqich(90).nom).toContain('G1')
    expect(egfrBosqich(89.99).nom).toContain('G2')
  })
  it('60 → G2, 59.99 → G3a', () => {
    expect(egfrBosqich(60).nom).toContain('G2')
    expect(egfrBosqich(59.99).nom).toContain('G3a')
  })
  it('45 → G3a, 44.99 → G3b', () => {
    expect(egfrBosqich(45).nom).toContain('G3a')
    expect(egfrBosqich(44.99).nom).toContain('G3b')
  })
  it('30 → G3b, 29.99 → G4; 15 → G4, 14.99 → G5', () => {
    expect(egfrBosqich(30).nom).toContain('G3b')
    expect(egfrBosqich(29.99).nom).toContain('G4')
    expect(egfrBosqich(15).nom).toContain('G4')
    expect(egfrBosqich(14.99).nom).toContain('G5')
  })
})

describe('ipssDaraja chegaralari', () => {
  it('7 → yengil, 8 → o\'rtacha', () => {
    expect(ipssDaraja(7).nom).toBe('Yengil simptomlar')
    expect(ipssDaraja(8).nom).toBe("O'rtacha simptomlar")
  })
  it('19 → o\'rtacha, 20 → og\'ir', () => {
    expect(ipssDaraja(19).nom).toBe("O'rtacha simptomlar")
    expect(ipssDaraja(20).nom).toBe("Og'ir simptomlar")
  })
  it('chekka qiymatlar 0 va 35', () => {
    expect(ipssDaraja(0).nom).toBe('Yengil simptomlar')
    expect(ipssDaraja(35).nom).toBe("Og'ir simptomlar")
  })
})

describe('psaYoshMezoni', () => {
  it('yoshga mos chegaralar', () => {
    expect(psaYoshMezoni(45).maxPSA).toBe(2.5)
    expect(psaYoshMezoni(55).maxPSA).toBe(3.5)
    expect(psaYoshMezoni(65).maxPSA).toBe(4.5)
    expect(psaYoshMezoni(75).maxPSA).toBe(6.5)
  })
  it('oraliq chegaralari (49 va 50)', () => {
    expect(psaYoshMezoni(49).maxPSA).toBe(2.5)
    expect(psaYoshMezoni(50).maxPSA).toBe(3.5)
  })
})

describe('fpsaXavf chegaralari', () => {
  it('9 → yuqori, 10 → o\'rtacha-yuqori', () => {
    expect(fpsaXavf(9).daraja).toBe('Yuqori xavf')
    expect(fpsaXavf(10).daraja).toBe("O'rtacha-yuqori xavf")
  })
  it('past risk yuqori %fPSAda (25+)', () => {
    expect(fpsaXavf(25).daraja).toBe('Past xavf')
    expect(fpsaXavf(30).daraja).toBe('Past xavf')
  })
})

describe('sonOqi (o\'nlik: nuqta va vergul)', () => {
  it('vergul va nuqtani bir xil o\'qiydi', () => {
    expect(sonOqi('5,2')).toBe(5.2)
    expect(sonOqi('5.2')).toBe(5.2)
  })
  it('bo\'sh yoki noto\'g\'ri qiymat NaN', () => {
    expect(Number.isNaN(sonOqi(''))).toBe(true)
    expect(Number.isNaN(sonOqi('abc'))).toBe(true)
  })
})
