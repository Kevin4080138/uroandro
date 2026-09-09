import { describe, it, expect } from 'vitest'
import {
  utcSana, sanaQosh, kunFarqi,
  homiladorlikHisobla, crlGestatsionYosh, hadlockVazn,
  faiHisob, homaIr, rmiHisob, ovulyatsiyaHisob, sanaFormat,
  rcogVteBaho, preekAspirinBaho,
} from './ginekologiyaHisoblash'

const iso = (d: Date) => d.toISOString().slice(0, 10)

describe('sana yordamchilari', () => {
  it('oy oxiri: 31-yanvar + 1 kun = 1-fevral', () => {
    expect(iso(sanaQosh(utcSana('2026-01-31'), 1))).toBe('2026-02-01')
  })
  it('kabisa yili: 2024-02-28 + 2 kun = 2024-03-01 (29-fevral bor)', () => {
    expect(iso(sanaQosh(utcSana('2024-02-28'), 2))).toBe('2024-03-01')
  })
  it('kabisa bo\'lmagan yil: 2026-02-28 + 1 kun = 2026-03-01', () => {
    expect(iso(sanaQosh(utcSana('2026-02-28'), 1))).toBe('2026-03-01')
  })
  it('kunFarqi kabisa oralig\'ida to\'g\'ri', () => {
    expect(kunFarqi(utcSana('2024-02-28'), utcSana('2024-03-01'))).toBe(2)
  })
  it('sanaFormat o\'zbekcha oy nomini beradi (M05 emas)', () => {
    expect(sanaFormat(utcSana('2027-05-14'))).toBe('14 may 2027')
  })
})

describe('homiladorlikHisobla', () => {
  it('OHS 2026-08-07, 28 kun, 2026-09-08 → 4 hafta 4 kun, TTS 2027-05-14', () => {
    const r = homiladorlikHisobla('2026-08-07', 28, '2026-09-08')
    expect(r.otganKun).toBe(32)
    expect(r.hafta).toBe(4)
    expect(r.kun).toBe(4)
    expect(iso(r.tts)).toBe('2027-05-14')
  })
  it('embrion yoshi gestatsiondan 14 kun kam', () => {
    const r = homiladorlikHisobla('2026-08-07', 28, '2026-09-08')
    expect(r.embrionBor).toBe(true)
    expect(r.embrionHafta).toBe(2)
    expect(r.embrionKunQoldiq).toBe(4)
  })
  it('GA < 14 kun bo\'lsa embrion ko\'rsatilmaydi', () => {
    const r = homiladorlikHisobla('2026-08-07', 28, '2026-08-15') // 8 kun
    expect(r.embrionBor).toBe(false)
  })
  it('sikl 28 dan farq qilsa tuzatish qo\'llanadi (30 kun → otganKun 2 kam)', () => {
    const r28 = homiladorlikHisobla('2026-08-07', 28, '2026-09-08')
    const r30 = homiladorlikHisobla('2026-08-07', 30, '2026-09-08')
    expect(r30.otganKun).toBe(r28.otganKun - 2)
    // uzun siklda TTS kechroq
    expect(kunFarqi(r28.tts, r30.tts)).toBe(2)
  })
})

describe('crlGestatsionYosh (INTERGROWTH-21st)', () => {
  it('CRL 45 mm → 78 kun (11 hafta 1 kun)', () => {
    const r = crlGestatsionYosh(45)
    expect(r.jamiKun).toBe(78)
    expect(r.hafta).toBe(11)
    expect(r.kun).toBe(1)
  })
  it('CRL katta bo\'lsa gestatsion yosh katta (monoton)', () => {
    expect(crlGestatsionYosh(60).jamiKun).toBeGreaterThan(crlGestatsionYosh(30).jamiKun)
  })
})

describe('hadlockVazn (Hadlock IV, mm kirish)', () => {
  it('BPD90 HC330 AC350 FL70 → ~3305 g', () => {
    expect(hadlockVazn(90, 330, 350, 70)).toBeCloseTo(3305, -1) // ±5 g
  })
})

describe('faiHisob', () => {
  it('T 2.5, SHBG 40 → 6.25%', () => {
    expect(faiHisob(2.5, 40)).toBeCloseTo(6.25, 2)
  })
})

describe('homaIr', () => {
  it('mmol: glukoza 5, insulin 8 → 1.78', () => {
    expect(homaIr(5, 8, 'mmol')).toBeCloseTo(40 / 22.5, 4)
  })
  it('mg/dL: glukoza 90, insulin 8 → mmol bilan bir xil (90 mg/dL ≈ 5 mmol/L)', () => {
    expect(homaIr(90, 8, 'mgdl')).toBeCloseTo(homaIr(5, 8, 'mmol'), 3)
  })
})

describe('rmiHisob (RMI I)', () => {
  it('belgi soni U ni to\'g\'ri beradi: 0→0, 1→1, 2→3, 5→3', () => {
    expect(rmiHisob(0, false, 30).U).toBe(0)
    expect(rmiHisob(1, false, 30).U).toBe(1)
    expect(rmiHisob(2, false, 30).U).toBe(3)
    expect(rmiHisob(5, false, 30).U).toBe(3)
  })
  it('menopauza M ni beradi: pre→1, post→3', () => {
    expect(rmiHisob(1, false, 30).M).toBe(1)
    expect(rmiHisob(1, true, 30).M).toBe(3)
  })
  it('3 belgi, postmenopauza, CA-125 85 → RMI 765', () => {
    expect(rmiHisob(3, true, 85).rmi).toBe(3 * 3 * 85)
  })
})

describe('rcogVteBaho (RCOG 37a)', () => {
  it('antenatal: oldingi VTE → 4 ball → 1-trimestr', () => {
    const r = rcogVteBaho(new Set(['oldingi_vte']), 'ante')
    expect(r.jami).toBe(4)
    expect(r.tavsif).toContain('Birinchi trimestr')
  })
  it('antenatal: komorbid → 3 ball → 28-hafta', () => {
    expect(rcogVteBaho(new Set(['komorbid']), 'ante').tavsif).toContain('28-hafta')
  })
  it('antenatal: yosh35 + bmi30 → 2 ball → profilaktikasiz', () => {
    const r = rcogVteBaho(new Set(['yosh35', 'bmi30']), 'ante')
    expect(r.jami).toBe(2)
    expect(r.tavsif).toContain('Mobilizatsiya')
  })
  it('postnatal: shoshilinch kesar → 2 ball → 10 kun', () => {
    const r = rcogVteBaho(new Set(['shosh_kesar']), 'post')
    expect(r.jami).toBe(2)
    expect(r.tavsif).toContain('10 kun')
  })
  it('ivf faqat antenatal (postnatalда 0 ball)', () => {
    expect(rcogVteBaho(new Set(['ivf']), 'post').jami).toBe(0)
    expect(rcogVteBaho(new Set(['ivf']), 'ante').jami).toBe(1)
  })
})

describe('preekAspirinBaho', () => {
  it('≥1 yuqori → tavsiya', () => {
    expect(preekAspirinBaho(1, 0).holat).toBe('tavsiya')
  })
  it('≥2 o\'rta → ko\'rib chiqiladi', () => {
    expect(preekAspirinBaho(0, 2).holat).toBe('korilsin')
  })
  it('1 o\'rta → shart emas', () => {
    expect(preekAspirinBaho(0, 1).holat).toBe('shart_emas')
  })
  it('yuqori o\'rtadan ustun', () => {
    expect(preekAspirinBaho(2, 3).holat).toBe('tavsiya')
  })
})

describe('ovulyatsiyaHisob', () => {
  it('OHS 2026-08-07, 28 kun → ovulyatsiya 2026-08-21, keyingi hayz 2026-09-04', () => {
    const r = ovulyatsiyaHisob('2026-08-07', 28)
    expect(iso(r.keyingiHayz)).toBe('2026-09-04')
    expect(iso(r.ovulyatsiya)).toBe('2026-08-21')
    expect(iso(r.fertilBosh)).toBe('2026-08-16')
    expect(iso(r.fertilTugash)).toBe('2026-08-21')
  })
})
