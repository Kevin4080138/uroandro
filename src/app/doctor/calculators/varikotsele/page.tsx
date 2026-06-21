'use client'

import Link from 'next/link'
import { T, card } from './_theme'

const MODULES = [
  { href: '/doctor/calculators/varikotsele/talim', icon: '🎓', title: "Ta'lim moduli", desc: 'Kasallik, 5 usul va ularning qiyosiy tavsifi.' },
  { href: '/doctor/calculators/varikotsele/klinik-qaror', icon: '🎯', title: 'Klinik qaror', desc: "Bemor ma'lumotlari asosida usul tavsiyasi va asoslari." },
  { href: '/doctor/calculators/varikotsele/bemorlar-bazasi', icon: '🗄️', title: 'Bemorlar bazasi', desc: "Bajarilgan operatsiyalar va natijalarni ro'yxatga olish." },
  { href: '/doctor/calculators/varikotsele/statistika', icon: '📊', title: 'Statistik tahlil', desc: "Usullar samaradorligini bazangiz asosida qiyoslash." },
]

export default function VariCompareHome() {
  return (
    <div>
      <div style={{
        background: `linear-gradient(135deg, ${T.deep}, #15545C)`, color: '#fff', borderRadius: 18,
        padding: '34px 32px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 600, letterSpacing: '.13em', textTransform: 'uppercase', color: '#7FD8DC', marginBottom: 10 }}>
          Qiyosiy samaradorlik tizimi
        </div>
        <h2 style={{ fontSize: 25, fontWeight: 800, letterSpacing: '-.03em', maxWidth: '24ch', margin: 0 }}>
          Varikotseleni davolashda 5 jarrohlik usulining qiyosiy tahlili
        </h2>
        <p style={{ color: '#BFDDDE', marginTop: 12, maxWidth: '54ch', fontSize: 15 }}>
          Laparoskopik, Marmar (mikrojarrohlik), Skleroterapiya, Palomo va Ivanissevich usullarini bemor ma&apos;lumotlari, ilmiy adabiyot va o&apos;z bazangiz statistikasi asosida qiyoslang.
        </p>
        <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {['Dalillarga asoslangan', '5 jarrohlik usuli', "Bazangiz bo'yicha statistika"].map((c) => (
            <span key={c} style={{ fontFamily: 'monospace', fontSize: 11.5, background: 'rgba(255,255,255,.1)', padding: '6px 11px', borderRadius: 8, color: '#DDF0F0', border: '1px solid rgba(255,255,255,.12)' }}>✓ {c}</span>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 18, fontWeight: 700, margin: '34px 0 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 4, height: 18, background: T.teal, borderRadius: 2, display: 'inline-block' }} />
        Modullar
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14 }}>
        {MODULES.map((m) => (
          <Link key={m.href} href={m.href} style={{ ...card, textDecoration: 'none', color: T.ink, display: 'flex', flexDirection: 'column', gap: 9 }}>
            <span style={{ width: 38, height: 38, borderRadius: 10, display: 'grid', placeItems: 'center', background: T.surface2, color: T.teal, fontSize: 18 }}>{m.icon}</span>
            <h3 style={{ fontSize: 15.5, margin: 0 }}>{m.title}</h3>
            <p style={{ fontSize: 13, color: T.muted, margin: 0 }}>{m.desc}</p>
          </Link>
        ))}
      </div>

      <div style={{ fontSize: 18, fontWeight: 700, margin: '34px 0 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 4, height: 18, background: T.teal, borderRadius: 2, display: 'inline-block' }} />
        Tizim haqida
      </div>
      <div style={card}>
        <p style={{ margin: '0 0 12px', color: T.inkSoft }}>
          Ushbu modul varikotsele (urug&apos;don venalarining kengayishi) kasalligini davolashda qo&apos;llaniladigan besh asosiy jarrohlik usuli — laparoskopik, mikrojarrohlik (Marmar), skleroterapiya (Tauber), Palomo va Ivanissevich — usullarining qiyosiy samaradorligini baholashga mo&apos;ljallangan.
        </p>
        <p style={{ margin: 0, color: T.inkSoft }}>
          Modul shifokorlar, androloglar va tadqiqotchilar uchun klinik qaror qabul qilishni qo&apos;llab-quvvatlash va ilmiy ma&apos;lumotlarni yig&apos;ish vositasi sifatida xizmat qiladi.
        </p>
      </div>
    </div>
  )
}
