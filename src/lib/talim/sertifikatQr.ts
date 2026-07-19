import QRCode from 'qrcode'
import { SAYT_URL } from '@/lib/saytUrl'

export function tekshirishUrl(kod: string) {
  return `${SAYT_URL}/sertifikat/${kod}`
}

// QR data URL sifatida serverda tayyorlanadi — sahifa va canvas rasmi ikkalasi ham
// shu bitta rasmdan foydalanadi, tashqi xizmatga murojaat qilinmaydi.
export async function qrDataUrl(kod: string) {
  return QRCode.toDataURL(tekshirishUrl(kod), {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 512,
    color: { dark: '#14213dff', light: '#ffffffff' },
  })
}
