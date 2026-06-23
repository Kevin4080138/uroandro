// Bemorlar email o'rniga telefon raqami orqali kiradi. Supabase Auth baribir
// email talab qiladi, shu sababli telefon raqamidan ko'rinmas "texnik" email
// hosil qilamiz — bemor buni hech qachon ko'rmaydi va ishlatmaydi.
export function telefonToEmail(telefon: string): string {
  const raqamlar = telefon.replace(/\D/g, '')
  return `p${raqamlar}@patient.urosfera.uz`
}

export function telefonFormatTogri(telefon: string): boolean {
  return telefon.replace(/\D/g, '').length >= 9
}
