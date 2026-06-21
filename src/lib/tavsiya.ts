// app.py'dagi tavsiya_berish() funksiyasining TypeScript ko'chirmasi.
export function tavsiyaBerish(
  daraja: string,
  tomon: string,
  ogriq: string,
  oldinOperatsiya: string,
  spermKonts: number,
  spermHarakat: number
): { tavsiya: string; sabab: string } {
  const patologikSperma = spermKonts < 16 || spermHarakat < 42
  const simptomatik = ogriq === 'bor'

  if (daraja === 'I' && !patologikSperma && !simptomatik) {
    return {
      tavsiya: 'Konservativ kuzatuv',
      sabab: "I daraja, simptomsiz, spermogramma me'yorida — dinamik kuzatuv tavsiya etiladi.",
    }
  }

  if (oldinOperatsiya === 'ha') {
    return {
      tavsiya: 'Perkutan emboliyalash / skleroterapiya',
      sabab: 'Operatsiyadan keyingi retsidivda endovaskulyar usul afzal.',
    }
  }

  if (tomon === 'ikki tomonlama' || daraja === 'II' || daraja === 'III') {
    return {
      tavsiya: "Mikroxirurgik subinguinal varikotselektomiya (Marmar usuli)",
      sabab: 'Eng past retsidiv va asorat darajasi; reproduktiv natijaga ijobiy ta\'sir.',
    }
  }

  return {
    tavsiya: "Mikroxirurgik subinguinal varikotselektomiya (Marmar usuli)",
    sabab: 'Standart minimal invaziv tavsiya.',
  }
}
