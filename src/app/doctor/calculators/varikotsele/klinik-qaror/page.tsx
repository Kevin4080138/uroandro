'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { T, card, input, label, btnPrimary, btnGhost } from '../_theme'
import { USULLAR, USUL_IDLARI, usulTavsiyaBerish, type QarorKirish } from '@/lib/varikotseleUsullari'

const bosh: QarorKirish = { indic: 'infertility', lat: 'left', recur: false, expert: true, bmi: 0 }
const boshBemor = { fio: '', telefon: '', age: '', grade: '3' }

const seg = (active: boolean): React.CSSProperties => ({
  flex: 1, border: 'none', padding: '9px 6px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
  background: active ? T.teal : T.surface, color: active ? '#fff' : T.muted,
})

export default function KlinikQarorPage() {
  const supabase = createClient()
  const [bemor, setBemor] = useState(boshBemor)
  const [forma, setForma] = useState<QarorKirish>(bosh)
  const [natija, setNatija] = useState<ReturnType<typeof usulTavsiyaBerish> | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const hisobla = () => { setNatija(usulTavsiyaBerish(forma)); setSaved(false) }

  const bazagaQoshish = async () => {
    if (!natija || !bemor.fio.trim()) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setSaving(true)
    await supabase.from('varikotsele_tadqiqot').insert({
      doctor_id: user.id,
      fio: bemor.fio,
      telefon: bemor.telefon || null,
      age: Number(bemor.age) || null,
      method: natija.winner,
      grade: Number(bemor.grade),
      followup: 0,
      notes: '(klinik qaror moduli)',
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => { setBemor(boshBemor); setForma(bosh); setNatija(null); setSaved(false) }, 1500)
  }

  return (
    <div>
      <div style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 600, letterSpacing: '.13em', textTransform: 'uppercase', color: T.teal, marginBottom: 10 }}>
        Klinik qaror qo&apos;llab-quvvatlash
      </div>
      <h1 style={{ fontSize: 27, fontWeight: 800, letterSpacing: '-.025em', marginBottom: 8 }}>Bemor uchun usul tavsiyasi</h1>
      <p style={{ color: T.inkSoft, fontSize: 15.5, maxWidth: '62ch' }}>
        Bemor ma&apos;lumotlarini kiriting — tizim 5 usul orasidan dalillarga asoslangan ballar tizimi orqali tavsiya beradi.
      </p>

      <div style={{ ...card, marginTop: 22 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 10.5, letterSpacing: '.1em', textTransform: 'uppercase', color: T.muted, marginBottom: 12 }}>
          Bemor ma&apos;lumotlari
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginBottom: 22 }}>
          <div>
            <label style={label}>F.I.O. <span style={{ color: '#B4520C' }}>*</span></label>
            <input style={input} value={bemor.fio} onChange={(e) => setBemor((b) => ({ ...b, fio: e.target.value }))} placeholder="Familiya Ism Sharif" />
          </div>
          <div>
            <label style={label}>Telefon</label>
            <input style={input} value={bemor.telefon} onChange={(e) => setBemor((b) => ({ ...b, telefon: e.target.value }))} placeholder="+998 90 123 45 67" />
          </div>
          <div>
            <label style={label}>Yoshi</label>
            <input type="number" style={input} value={bemor.age} onChange={(e) => setBemor((b) => ({ ...b, age: e.target.value }))} />
          </div>
          <div>
            <label style={label}>Darajasi (Dubin)</label>
            <select style={input} value={bemor.grade} onChange={(e) => setBemor((b) => ({ ...b, grade: e.target.value }))}>
              <option value="1">I</option><option value="2">II</option><option value="3">III</option><option value="0">Subklinik</option>
            </select>
          </div>
        </div>

        <div style={{ fontFamily: 'monospace', fontSize: 10.5, letterSpacing: '.1em', textTransform: 'uppercase', color: T.muted, marginBottom: 12 }}>
          Klinik ko&apos;rsatkichlar
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
          <div>
            <label style={label}>Asosiy ko&apos;rsatma</label>
            <select style={input} value={forma.indic} onChange={(e) => setForma((f) => ({ ...f, indic: e.target.value as QarorKirish['indic'] }))}>
              <option value="infertility">Bepushtlik</option>
              <option value="pain">Og&apos;riq</option>
              <option value="hypo">Urug&apos;don gipotrofiyasi</option>
              <option value="cosmetic">Kosmetik/boshqa</option>
            </select>
          </div>
          <div>
            <label style={label}>Tomoni</label>
            <div style={{ display: 'flex', border: `1.5px solid #C5D4D5`, borderRadius: 9, overflow: 'hidden' }}>
              {([['left', 'Chap'], ['right', "O'ng"], ['bilateral', 'Ikki tomon']] as const).map(([v, l]) => (
                <button key={v} style={seg(forma.lat === v)} onClick={() => setForma((f) => ({ ...f, lat: v }))}>{l}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={label}>Avval operatsiya qilinganmi (retsidiv)?</label>
            <div style={{ display: 'flex', border: `1.5px solid #C5D4D5`, borderRadius: 9, overflow: 'hidden' }}>
              <button style={seg(!forma.recur)} onClick={() => setForma((f) => ({ ...f, recur: false }))}>Yo&apos;q</button>
              <button style={seg(forma.recur)} onClick={() => setForma((f) => ({ ...f, recur: true }))}>Ha</button>
            </div>
          </div>
          <div>
            <label style={label}>Mikrojarrohlik imkoniyati bormi?</label>
            <div style={{ display: 'flex', border: `1.5px solid #C5D4D5`, borderRadius: 9, overflow: 'hidden' }}>
              <button style={seg(forma.expert)} onClick={() => setForma((f) => ({ ...f, expert: true }))}>Ha</button>
              <button style={seg(!forma.expert)} onClick={() => setForma((f) => ({ ...f, expert: false }))}>Yo&apos;q</button>
            </div>
          </div>
          <div>
            <label style={label}>Tana massasi indeksi (BMI) <span style={{ fontWeight: 400 }}>(ixtiyoriy)</span></label>
            <input type="number" style={input} value={forma.bmi || ''} onChange={(e) => setForma((f) => ({ ...f, bmi: Number(e.target.value) || 0 }))} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
          <button style={btnPrimary} onClick={hisobla}>Tavsiyani hisoblash</button>
          <button style={btnGhost} onClick={() => { setForma(bosh); setNatija(null) }}>Tozalash</button>
        </div>
      </div>

      {natija && (
        <div style={{ marginTop: 24, borderRadius: 14, overflow: 'hidden', border: `1px solid ${T.line}`, background: T.surface }}>
          <div style={{ padding: '22px 24px', color: '#fff', background: `linear-gradient(120deg, ${USULLAR[natija.winner].color}, ${USULLAR[natija.winner].color}CC)` }}>
            <div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '.13em', textTransform: 'uppercase', opacity: .85 }}>Tavsiya etilgan usul</div>
            <h3 style={{ fontSize: 23, marginTop: 6, color: '#fff' }}>{USULLAR[natija.winner].nom}</h3>
            <div style={{ fontFamily: 'monospace', fontSize: 12, opacity: .85, marginTop: 4 }}>{USULLAR[natija.winner].alias}</div>
            <div style={{ marginTop: 14, fontSize: 13, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span>Ishonchlilik: <strong>{natija.conf}%</strong></span>
              <span style={{ height: 11, borderRadius: 6, background: 'rgba(255,255,255,.25)', overflow: 'hidden', flex: 1, minWidth: 160, position: 'relative' }}>
                <i style={{ display: 'block', height: '100%', background: '#fff', borderRadius: 6, width: `${natija.conf}%` }} />
              </span>
            </div>
          </div>
          <div style={{ padding: '22px 24px' }}>
            <h4 style={{ fontSize: 13.5, textTransform: 'uppercase', letterSpacing: '.05em', color: T.muted, fontFamily: 'monospace', fontWeight: 600, marginBottom: 12 }}>Asoslar</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
              {natija.sabablar.map((r, i) => (
                <li key={i} style={{ display: 'flex', gap: 11, fontSize: 14, alignItems: 'flex-start' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', marginTop: 7, flexShrink: 0, background: USULLAR[r.usul].color }} />
                  <span>{r.matn}</span>
                </li>
              ))}
            </ul>

            <h4 style={{ fontSize: 13.5, textTransform: 'uppercase', letterSpacing: '.05em', color: T.muted, fontFamily: 'monospace', fontWeight: 600, margin: '20px 0 12px' }}>Kutilayotgan natijalar (adabiyot bo&apos;yicha)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
              <div style={{ ...card, padding: '17px 18px' }}>
                <div style={{ fontFamily: 'monospace', fontSize: 30, fontWeight: 600, color: USULLAR[natija.winner].color }}>{USULLAR[natija.winner].recur}</div>
                <div style={{ fontSize: 12.5, color: T.muted, marginTop: 7 }}>Retsidiv darajasi</div>
              </div>
              <div style={{ ...card, padding: '17px 18px' }}>
                <div style={{ fontFamily: 'monospace', fontSize: 30, fontWeight: 600, color: USULLAR[natija.winner].color }}>{USULLAR[natija.winner].hydro}</div>
                <div style={{ fontSize: 12.5, color: T.muted, marginTop: 7 }}>Gidrotsele rivojlanishi</div>
              </div>
            </div>

            <div style={{ marginTop: 18, background: T.warnBg, border: '1px solid #F0D6BF', borderRadius: 9, padding: '13px 15px', fontSize: 12.5, color: T.warnText }}>
              Bu vosita faqat qaror qabul qilishni qo&apos;llab-quvvatlaydi va malakali shifokor klinik baholashining o&apos;rnini bosmaydi. Yakuniy qaror bemorni shaxsan ko&apos;rgan jarroh tomonidan qabul qilinadi.
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 22, flexWrap: 'wrap' }}>
              <button style={btnGhost} onClick={bazagaQoshish} disabled={saving || !bemor.fio.trim()} title={!bemor.fio.trim() ? "Avval bemor F.I.O.sini kiriting" : ''}>{saving ? 'Saqlanmoqda...' : saved ? '✓ Bazaga qo\'shildi' : "Bemorlar bazasiga saqlash"}</button>
              <button style={btnGhost} onClick={() => window.print()}>Chop etish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
