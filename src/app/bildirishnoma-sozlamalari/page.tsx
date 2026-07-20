'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

/**
 * Bildirishnoma sozlamalari — barcha rollar uchun bitta sahifa.
 *
 * Har bir turni foydalanuvchi o'zi yoqib-o'chiradi. Bu botni butunlay
 * o'chirib qo'yishning oldini oladi: keraksiz turini o'chirgan odam
 * muhimini olishda davom etadi.
 */

type Kalit = 'navbat' | 'dori' | 'operatsiya' | 'murojaat' | 'seriya' | 'takrorlash' | 'yarim_dars'

type Sozlama = Record<Kalit, boolean>

const HAMMASI: Sozlama = {
  navbat: true, dori: true, operatsiya: true, murojaat: true,
  seriya: true, takrorlash: true, yarim_dars: true,
}

const TAVSIF: Record<Kalit, { belgi: string; nom: string; izoh: string }> = {
  navbat:     { belgi: '🗓', nom: 'Navbat eslatmasi',   izoh: 'Qabuldan bir kun oldin eslatib turamiz' },
  dori:       { belgi: '💊', nom: 'Dori vaqti',          izoh: 'Retseptdagi dori ichish vaqtida' },
  operatsiya: { belgi: '🩹', nom: 'Operatsiya kuzatuvi', izoh: 'Tiklanish bosqichlari bo\'yicha maslahatlar' },
  murojaat:   { belgi: '💬', nom: 'Murojaatlar',         izoh: 'Javob kelgani va javobsiz qolganlar haqida' },
  seriya:     { belgi: '🔥', nom: 'Kunlik seriya',       izoh: 'Seriya uzilish arafasida ogohlantiramiz' },
  takrorlash: { belgi: '🃏', nom: 'Takrorlash vaqti',    izoh: 'Flashcardlarni 1, 3, 7 va 30-kunlarda takrorlash' },
  yarim_dars: { belgi: '📖', nom: 'Yarim qolgan dars',   izoh: 'Boshlangan dars uzoq turib qolsa' },
}

// Rolga tegishli bo'lmagan turni ko'rsatishning ma'nosi yo'q
const ROL_KALITLARI: Record<string, Kalit[]> = {
  patient: ['navbat', 'dori', 'operatsiya', 'murojaat'],
  doctor:  ['navbat', 'murojaat'],
  student: ['seriya', 'takrorlash', 'yarim_dars'],
  admin:   ['navbat', 'dori', 'operatsiya', 'murojaat', 'seriya', 'takrorlash', 'yarim_dars'],
}

export default function BildirishnomaSozlamalariPage() {
  const router = useRouter()
  const supabase = createClient()

  const [sozlama, setSozlama] = useState<Sozlama>(HAMMASI)
  const [kalitlar, setKalitlar] = useState<Kalit[]>([])
  const [yuklandi, setYuklandi] = useState(false)
  const [saqlanmoqda, setSaqlanmoqda] = useState<Kalit | null>(null)
  const [xato, setXato] = useState('')

  useEffect(() => {
    const yukla = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/auth/login'); return }

      const [{ data: profil }, { data: mavjud }] = await Promise.all([
        supabase.from('profiles').select('role').eq('id', user.id).maybeSingle(),
        supabase.from('bildirishnoma_sozlamalari').select('*').eq('user_id', user.id).maybeSingle(),
      ])

      setKalitlar(ROL_KALITLARI[profil?.role ?? 'patient'] ?? ROL_KALITLARI.patient)
      if (mavjud) {
        setSozlama({
          navbat: mavjud.navbat, dori: mavjud.dori, operatsiya: mavjud.operatsiya,
          murojaat: mavjud.murojaat, seriya: mavjud.seriya,
          takrorlash: mavjud.takrorlash, yarim_dars: mavjud.yarim_dars,
        })
      }
      setYuklandi(true)
    }
    yukla()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const almashtir = async (k: Kalit) => {
    const yangi = { ...sozlama, [k]: !sozlama[k] }
    setSozlama(yangi)          // darrov ko'rinsin
    setSaqlanmoqda(k)
    setXato('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('bildirishnoma_sozlamalari')
      .upsert({ user_id: user.id, ...yangi, updated_at: new Date().toISOString() })

    if (error) {
      setSozlama(sozlama)      // saqlanmadi — orqaga qaytaramiz
      setXato('Saqlanmadi: ' + error.message)
    }
    setSaqlanmoqda(null)
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '16px 20px', borderBottom: '1px solid var(--line)',
        maxWidth: 560, margin: '0 auto',
      }}>
        <button
          onClick={() => router.back()}
          style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 15, cursor: 'pointer' }}
        >
          ‹ Orqaga
        </button>
        <span style={{ fontSize: 16, fontWeight: 800 }}>Bildirishnomalar</span>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '20px 20px 48px' }}>
        <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.6, margin: '0 0 20px' }}>
          Qaysi eslatmalarni olishni o&apos;zingiz tanlaysiz. Xabarlar Telegram va
          brauzer bildirishnomasi orqali keladi.
        </p>

        {!yuklandi && (
          <div className="pulse" style={{ color: 'var(--muted)', fontSize: 14 }}>Yuklanmoqda...</div>
        )}

        {yuklandi && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {kalitlar.map((k) => {
              const t = TAVSIF[k]
              const yoqiq = sozlama[k]
              return (
                <button
                  key={k}
                  onClick={() => almashtir(k)}
                  disabled={saqlanmoqda === k}
                  className="lift"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
                    background: 'var(--surface)', border: '1px solid var(--line)',
                    borderRadius: 16, padding: '16px 18px', cursor: 'pointer', width: '100%',
                    opacity: saqlanmoqda === k ? 0.6 : 1,
                  }}
                >
                  <span style={{ fontSize: 22, width: 42, height: 42, flexShrink: 0, borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'var(--surface-2)' }}>{t.belgi}</span>

                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: 15, fontWeight: 700 }}>{t.nom}</span>
                    <span style={{ display: 'block', fontSize: 12.5, color: 'var(--muted)', marginTop: 2, lineHeight: 1.4 }}>
                      {t.izoh}
                    </span>
                  </span>

                  {/* Kalit (switch) */}
                  <span style={{
                    width: 46, height: 27, borderRadius: 999, flexShrink: 0, position: 'relative',
                    background: yoqiq ? 'var(--accent)' : 'var(--line)',
                    transition: 'background .2s ease',
                  }}>
                    <span style={{
                      position: 'absolute', top: 3, left: yoqiq ? 22 : 3,
                      width: 21, height: 21, borderRadius: '50%', background: '#fff',
                      transition: 'left .2s cubic-bezier(.2,.7,.3,1)',
                    }} />
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {xato && (
          <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 14 }}>{xato}</p>
        )}

        <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6, marginTop: 22 }}>
          Shifokor javobi va yangi retsept kabi shaxsiy xabarlar har doim keladi —
          ular eslatma emas, sizga to&apos;g&apos;ridan-to&apos;g&apos;ri yuborilgan javob.
        </p>
      </div>
    </div>
  )
}
