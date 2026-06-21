export type UsulId = 'lap' | 'micro' | 'sklero' | 'palomo' | 'ivan'

export const USULLAR: Record<UsulId, {
  nom: string
  alias: string
  color: string
  recur: string
  hydro: string
}> = {
  lap:    { nom: 'Laparoskopik varikotselektomiya', alias: "Retroperitoneal yuqori bog'lash", color: '#2C5FA8', recur: '3–15%', hydro: '7–12%' },
  micro:  { nom: 'Mikrojarrohlik varikotselektomiya (Marmar)', alias: "Subingvinal · «oltin standart»", color: '#11897A', recur: '1–2%', hydro: '0–1%' },
  sklero: { nom: 'Skleroterapiya (Tauber usuli)', alias: 'Antegrad skrotal — minimal invaziv, kesuvsiz', color: '#9333EA', recur: '5–15%', hydro: '<1%' },
  palomo: { nom: 'Palomo usuli', alias: "Retroperitoneal — arteriya va vena birgalikda bog'lanadi", color: '#D97706', recur: '5–15%', hydro: '10–40%' },
  ivan:   { nom: 'Ivanissevich usuli', alias: 'Transingvinal — ochiq, mikroskopsiz', color: '#DC2626', recur: '9–25%', hydro: '3–10%' },
}

export const USUL_IDLARI: UsulId[] = ['lap', 'micro', 'sklero', 'palomo', 'ivan']

export type QarorKirish = {
  indic: 'infertility' | 'pain' | 'hypo' | 'cosmetic'
  lat: 'left' | 'right' | 'bilateral'
  recur: boolean
  expert: boolean
  bmi: number
  venaDiametri: number   // mm, USDG
  reflux: boolean
  spermKonts: number     // mln/ml
  spermHarakat: number   // %
}

export type Sabab = { usul: UsulId; matn: string }

export function usulTavsiyaBerish(kirish: QarorKirish): {
  winner: UsulId
  conf: number
  sabablar: Sabab[]
} {
  const s: Record<UsulId, number> = { lap: 0, micro: 0, sklero: 0, palomo: 0, ivan: 0 }
  const sabablar: Sabab[] = []

  if (kirish.indic === 'infertility') { s.micro += 3; sabablar.push({ usul: 'micro', matn: "Bepushtlik holatida mikrojarrohlik spermogramma va homiladorlik natijalari bo'yicha ustun." }) }
  else if (kirish.indic === 'pain') { s.micro += 1; sabablar.push({ usul: 'micro', matn: "Og'riq holatida mikrojarrohlik arteriya/limfani saqlab, asoratlarni kamaytiradi." }) }
  else if (kirish.indic === 'hypo') { s.micro += 2; sabablar.push({ usul: 'micro', matn: "Urug'don gipotrofiyasida limfani saqlash gidrotsele xavfini kamaytiradi." }) }

  if (kirish.lat === 'bilateral') { s.lap += 2; sabablar.push({ usul: 'lap', matn: 'Ikki tomonlama holat — laparoskopik usul bitta yondashuvda ikkala tomonni qamrab oladi.' }) }
  else { s.micro += 1; sabablar.push({ usul: 'micro', matn: "Bir tomonlama holat — mikrojarrohlik aniq, past asoratli yondashuv beradi." }) }

  if (kirish.recur) {
    s.lap += 3; s.sklero += 2; s.palomo += 1; s.ivan -= 2
    sabablar.push({ usul: 'lap', matn: "Retsidiv (avval ingvinal operatsiya) — laparoskopik retroperitoneal yondashuv chandiqsiz sohada ishlaydi." })
    sabablar.push({ usul: 'sklero', matn: 'Retsidiv holatida skleroterapiya ham chandiq to\'qimasini chetlab, perkutan yo\'l bilan amalga oshiriladi.' })
    sabablar.push({ usul: 'ivan', matn: 'Ivanissevich — oldin xuddi shu sohada operatsiya bo\'lgan bo\'lsa, chandiq yondashuvni qiyinlashtiradi.' })
  }

  if (!kirish.expert) {
    s.lap += 4; s.palomo += 2; s.ivan += 2; s.sklero += 2
    sabablar.push({ usul: 'lap', matn: "Mikrojarrohlik imkoniyati yo'q — laparoskopik amaliy tanlov bo'lib qoladi." })
    sabablar.push({ usul: 'palomo', matn: "Mikrojarrohlik imkoniyati yo'q — Palomo, Ivanissevich yoki skleroterapiya amaliy alternativ bo'la oladi." })
  } else { s.micro += 1; sabablar.push({ usul: 'micro', matn: 'Mikrojarrohlik imkoniyati mavjud — past retsidiv va asorat darajasidan foydalaning.' }) }

  if (kirish.bmi >= 30) {
    s.lap += 1; s.sklero += 1; s.ivan -= 1
    sabablar.push({ usul: 'lap', matn: 'Yuqori BMI — chuqur ingvinal ekspozitsiya qiyinlashishi mumkin, laparoskopik biroz qulayroq.' })
    sabablar.push({ usul: 'ivan', matn: "Yuqori BMI'da Ivanissevichning chuqur ingvinal kesimi texnik jihatdan qiyinlashadi." })
  }

  if (kirish.reflux && kirish.venaDiametri >= 3) {
    s.micro += 2; s.palomo += 1; s.sklero -= 1
    sabablar.push({ usul: 'micro', matn: "Sezilarli reflux va kengaygan vena (≥3 mm) — to'liq ligatsiya beradigan usul (mikrojarrohlik) ishonchliroq." })
    sabablar.push({ usul: 'sklero', matn: "Sezilarli reflux mavjudligida skleroterapiya yetarli berkitishni har doim ta'minlamasligi mumkin." })
  }

  const patologikSperma = kirish.spermKonts > 0 && (kirish.spermKonts < 16 || kirish.spermHarakat < 42)
  if (patologikSperma) {
    s.micro += 2
    sabablar.push({ usul: 'micro', matn: "Spermogramma ko'rsatkichlari me'yordan past (WHO 2021) — mikrojarrohlikning reproduktiv natijalari yaxshiroq." })
  }

  s.micro += 1; sabablar.push({ usul: 'micro', matn: 'Eng past retsidiv va gidrotsele darajasi mikrojarrohlik usulida.' })
  s.sklero -= 1; sabablar.push({ usul: 'sklero', matn: 'Skleroterapiya kam invaziv, lekin adabiyotda retsidiv darajasi mikrojarrohlikdan yuqoriroq.' })
  s.palomo -= 1; sabablar.push({ usul: 'palomo', matn: 'Palomo — keng tarqalgan usul, ammo limfa saqlanmagani uchun gidrotsele xavfi yuqori.' })
  s.ivan -= 1; sabablar.push({ usul: 'ivan', matn: "Ivanissevich — eng oddiy ochiq usul, ammo kattalashtirishsiz bajarilgani uchun retsidiv darajasi yuqoriroq." })

  const clamped = Object.fromEntries(USUL_IDLARI.map((id) => [id, Math.max(s[id], 0)])) as Record<UsulId, number>
  const winner = USUL_IDLARI.reduce((best, id) => (s[id] > s[best] ? id : best), USUL_IDLARI[0])
  const total = USUL_IDLARI.reduce((sum, id) => sum + clamped[id], 0) || 1
  const conf = Math.round((clamped[winner] / total) * 100)

  const tartiblangan = [...sabablar.filter((r) => r.usul === winner), ...sabablar.filter((r) => r.usul !== winner)]

  return { winner, conf, sabablar: tartiblangan }
}
