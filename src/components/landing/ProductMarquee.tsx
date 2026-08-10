/**
 * Imkoniyatlarni ko'rsatuvchi aylanma tasma.
 *
 * O'zi aylanadi VA qo'lda suriladi (AylanmaTasma) — telefonda barmoq bilan,
 * kompyuterda sichqoncha bilan. Sichqoncha ustiga kelganda va foydalanuvchi
 * surganda to'xtaydi, prefers-reduced-motion da auto o'chadi (surish qoladi).
 */

import { AylanmaTasma } from './AylanmaTasma'

type Karta = { belgi: string; nom: string; izoh: string; rang: string }

const QATOR_1: Karta[] = [
  { belgi: '🎬', nom: 'Video darslar', izoh: 'Bosqichma-bosqich, oson→qiyin', rang: 'var(--accent)' },
  { belgi: '🧮', nom: 'Kalkulyatorlar', izoh: 'IPSS, PSA, eGFR, IIEF-5', rang: 'var(--accent-2)' },
  { belgi: '🃏', nom: 'Flashcardlar', izoh: 'Tez yodlash uchun kartochkalar', rang: 'var(--good)' },
  { belgi: '🧩', nom: 'Interaktiv case', izoh: 'Qaror qabul qilib, oqibatini ko‘rish', rang: 'var(--accent)' },
  { belgi: '🗓', nom: 'Onlayn navbat', izoh: "Bemor o'zi qulay vaqtga yoziladi", rang: 'var(--warn)' },
  { belgi: '✍️', nom: 'Amaliy testlar', izoh: 'Har mavzu uchun savol banki', rang: 'var(--accent)' },
  { belgi: '🗂', nom: 'Klassifikatsiyalar', izoh: 'Urologik tasniflar bir joyda', rang: 'var(--good)' },
]

const QATOR_2: Karta[] = [
  { belgi: '🧑‍🤝‍🧑', nom: 'Bemorlar reestri', izoh: 'Tashriflar va tarix tartibli', rang: 'var(--good)' },
  { belgi: '🏅', nom: 'Sertifikat', izoh: 'Bosqich nazoratidan o‘tgach', rang: 'var(--warn)' },
  { belgi: '🌐', nom: 'USMLE savollari', izoh: 'Xalqaro format bo‘yicha mashq', rang: 'var(--accent-2)' },
  { belgi: '🔍', nom: 'Xatolar tahlili', izoh: 'Tipik xatolar va ularning sabablari', rang: 'var(--danger)' },
  { belgi: '🏥', nom: 'Vaziyatli masalalar', izoh: 'Real klinik holatlar ustida ish', rang: 'var(--accent-2)' },
  { belgi: '🩹', nom: 'Operatsiya kuzatuvi', izoh: 'Avtomatik eslatmalar', rang: 'var(--danger)' },
  { belgi: '📚', nom: 'Kutubxona', izoh: "O'zbek tilidagi manbalar", rang: 'var(--accent)' },
]

function KartaKorinishi({ k }: { k: Karta }) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 13,
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 16,
        padding: '15px 20px',
        width: 265,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontSize: 21, width: 44, height: 44, flexShrink: 0, borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `color-mix(in srgb, ${k.rang} 13%, transparent)`,
        }}
      >
        {k.belgi}
      </span>
      <span style={{ minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{k.nom}</span>
        <span style={{ display: 'block', fontSize: 12, color: 'var(--muted)', marginTop: 2, lineHeight: 1.35 }}>
          {k.izoh}
        </span>
      </span>
    </div>
  )
}

function Qator({ kartalar, teskari, tezlikPx }: { kartalar: Karta[]; teskari?: boolean; tezlikPx: number }) {
  return (
    <AylanmaTasma tezlikPx={tezlikPx} teskari={teskari}>
      {kartalar.map((k, i) => (
        <KartaKorinishi key={`${k.nom}-${i}`} k={k} />
      ))}
    </AylanmaTasma>
  )
}

/**
 * Bitta qator — kirish sahifasida skrinshot tasmasi bilan birga turadi,
 * shuning uchun ikki qator ortiqcha bo'lardi. Yo'nalishi teskari:
 * rasmlar chapga, matn kartalari o'ngga suriladi.
 */
export function ProductMarquee() {
  return <Qator kartalar={[...QATOR_1, ...QATOR_2]} tezlikPx={34} teskari />
}
