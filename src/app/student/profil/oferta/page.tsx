'use client'

import { Header } from '@/components/Header'

export default function OfertaPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/student/profil" backLabel="Profil" />
      <div className="mx-auto max-w-[600px] px-5 py-8 sm:px-8">
        <h2 style={{ margin: '0 0 16px', fontSize: '22px', fontWeight: 800 }}>📄 Ommaviy oferta</h2>
        <p className="rise" style={{ margin: '0 0 16px', fontSize: '12.5px', color: 'var(--muted)' }}>
          Loyiha hozirda faollashtirish bosqichida — quyidagi shartlar dastlabki loyiha, yuridik ko&apos;rikdan keyin yakuniy tasdiqlanadi.
        </p>
        <div className="rise" style={{
          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '24px',
          color: 'var(--ink-soft)', fontSize: '13.5px', lineHeight: 1.75, display: 'flex', flexDirection: 'column', gap: '16px',
        }}>
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>1. Umumiy qoidalar</h3>
            <p style={{ margin: 0 }}>
              Mazkur ommaviy oferta &quot;Urosfera&quot; ta&apos;lim platformasi (keyingi o&apos;rinlarda — &quot;Platforma&quot;)
              tomonidan taqdim etiladi va platformadan ro&apos;yxatdan o&apos;tib foydalanuvchi (talaba) bilan
              tuzilgan ommaviy shartnoma hisoblanadi. Ro&apos;yxatdan o&apos;tish va/yoki to&apos;lov amalga oshirish
              ushbu shartlarga roziligini bildiradi.
            </p>
          </div>
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>2. Xizmat tarkibi</h3>
            <p style={{ margin: 0 }}>
              Platforma urologiya va andrologiya yo&apos;nalishida ta&apos;lim materiallari (nazariya, video, test
              bo&apos;limlari) taqdim etadi. Tarkib uch qiyinlik bosqichiga (EASY, O&apos;RTA, QIYIN) bo&apos;lingan,
              har biri alohida obuna sifatida sotib olinadi.
            </p>
          </div>
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>3. To&apos;lov va obuna</h3>
            <p style={{ margin: 0 }}>
              Har bir bosqichga kirish huquqi to&apos;lov asosida beriladi. To&apos;lov tartibi va narxlari admin
              bilan bevosita kelishiladi (Telegram: @urolog_arabboyev). Obuna faollashtirilgandan so&apos;ng tegishli
              bosqich darslari, testlari va materiallariga kirish ochiladi.
            </p>
          </div>
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>4. Qaytarish siyosati</h3>
            <p style={{ margin: 0 }}>
              Agar obuna faollashtirilgandan keyin tarkibga texnik sabablarga ko&apos;ra umuman kirish imkoni
              bo&apos;lmasa, foydalanuvchi to&apos;lovni qaytarishni so&apos;rab adminga murojaat qilishi mumkin.
              Tarkibdan faol foydalanilgan holatlarda pul qaytarilmaydi.
            </p>
          </div>
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>5. Foydalanuvchi majburiyatlari</h3>
            <p style={{ margin: 0 }}>
              Foydalanuvchi o&apos;z hisob ma&apos;lumotlarini (login/parol) uchinchi shaxslarga bermasligi, tarkibni
              (video, test, konspekt) ko&apos;chirib tarqatmasligi va boshqa shaxslarga sotmasligi shart.
            </p>
          </div>
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>6. Intellektual mulk</h3>
            <p style={{ margin: 0 }}>
              Platformadagi barcha o&apos;quv materiallari, testlar va video tarkib Platforma egasiga tegishli
              bo&apos;lib, mualliflik huquqi bilan himoyalangan.
            </p>
          </div>
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>7. Shartlarning o&apos;zgarishi</h3>
            <p style={{ margin: 0 }}>
              Platforma ushbu shartlarni va narxlarni oldindan xabar berib o&apos;zgartirish huquqini saqlab qoladi.
              O&apos;zgarishlar platformada e&apos;lon qilingan kundan boshlab kuchga kiradi.
            </p>
          </div>
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>8. Aloqa</h3>
            <p style={{ margin: 0 }}>
              Savol va murojaatlar uchun: Telegram{' '}
              <a href="https://t.me/urolog_arabboyev" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>@urolog_arabboyev</a>,
              telefon <a href="tel:+998904080138" style={{ color: 'var(--accent)' }}>+998 90 408 01 38</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
