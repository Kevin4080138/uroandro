'use client'

import { useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { TASNIFLAR, TASNIF_KATEGORIYALARI, type Tasnif } from '@/lib/klassifikatsiyalar'

// Ma'lumotnoma bo'limi: talaba imtihon oldidan yoki amaliyotda kerakli tasnifni
// tez topib olishi kerak. Shuning uchun kartalar yopiq turadi va bosilganda
// ochiladi — 21 ta jadval bir vaqtda ochiq bo'lsa, sahifa o'qib bo'lmas edi.

export default function StudentKlassifikatsiyalarPage() {
  const [filtr, setFiltr] = useState<string>('Hammasi')
  const [qidiruv, setQidiruv] = useState('')
  const [ochiq, setOchiq] = useState<string | null>(null)

  const royxat = useMemo(() => {
    const q = qidiruv.trim().toLowerCase()
    return TASNIFLAR.filter((t) => {
      if (filtr !== 'Hammasi' && t.kategoriya !== filtr) return false
      if (!q) return true
      return (
        t.nom.toLowerCase().includes(q) ||
        (t.toliq ?? '').toLowerCase().includes(q) ||
        t.maqsad.toLowerCase().includes(q)
      )
    })
  }, [filtr, qidiruv])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
      <Header backHref="/student/dashboard" backLabel="Bosh sahifa" />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '24px 20px' }}>
        <div className="rise" style={{ marginBottom: '16px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px' }}>🗂️ Klassifikatsiyalar</h1>
          <p style={{ color: 'var(--muted)', fontSize: '13.5px', margin: 0, lineHeight: 1.6 }}>
            Urologiyada ishlatiladigan {TASNIFLAR.length}{' '}ta tasnif — nomiga bosing, to&apos;liq jadval ochiladi.
          </p>
        </div>

        <div
          className="rise"
          style={{
            background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '12px',
            padding: '11px 13px', marginBottom: '16px', animationDelay: '.04s',
          }}
        >
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
            ℹ️ Bu — o&apos;quv ma&apos;lumotnomasi. Tasniflar vaqti-vaqti bilan qayta ko&apos;rib chiqiladi,
            shuning uchun klinik qaror qabul qilishda amaldagi gaydlar bilan solishtiring.
          </p>
        </div>

        <input
          value={qidiruv}
          onChange={(e) => setQidiruv(e.target.value)}
          placeholder="Qidirish — masalan, Bosniak yoki prostatit"
          style={{
            width: '100%', background: 'var(--surface-2)', color: 'var(--ink)',
            border: '1px solid var(--line)', borderRadius: '12px', padding: '11px 14px',
            fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '12px',
          }}
        />

        <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginBottom: '18px' }}>
          {TASNIF_KATEGORIYALARI.map((kat) => {
            const faol = filtr === kat
            return (
              <button
                key={kat}
                onClick={() => setFiltr(kat)}
                className="soft-press"
                style={{
                  border: `1px solid ${faol ? 'var(--accent)' : 'var(--line)'}`,
                  background: faol ? 'var(--accent-soft)' : 'var(--surface)',
                  color: faol ? 'var(--accent)' : 'var(--muted)',
                  borderRadius: '999px', padding: '6px 13px', fontSize: '12.5px',
                  fontWeight: faol ? 700 : 500, cursor: 'pointer',
                }}
              >
                {kat}
              </button>
            )
          })}
        </div>

        {royxat.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: '13.5px', textAlign: 'center', padding: '30px 0' }}>
            Bunday tasnif topilmadi.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {royxat.map((t) => (
              <TasnifKartasi
                key={t.slug}
                tasnif={t}
                ochiqmi={ochiq === t.slug}
                bosildi={() => setOchiq(ochiq === t.slug ? null : t.slug)}
              />
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}

function TasnifKartasi({ tasnif, ochiqmi, bosildi }: {
  tasnif: Tasnif; ochiqmi: boolean; bosildi: () => void
}) {
  return (
    <div style={{
      background: 'var(--surface)', border: `1px solid ${ochiqmi ? 'var(--accent)' : 'var(--line)'}`,
      borderRadius: '14px', overflow: 'hidden',
    }}>
      <button
        onClick={bosildi}
        style={{
          width: '100%', background: 'none', border: 'none', padding: '14px 16px',
          textAlign: 'left', cursor: 'pointer', color: 'var(--ink)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <strong style={{ fontSize: '14.5px', display: 'block' }}>{tasnif.nom}</strong>
            {tasnif.toliq && (
              <span style={{ fontSize: '11.5px', color: 'var(--muted)', fontStyle: 'italic' }}>{tasnif.toliq}</span>
            )}
          </div>
          <span style={{
            fontSize: '10.5px', color: 'var(--muted)', border: '1px solid var(--line)',
            borderRadius: '999px', padding: '2px 8px', whiteSpace: 'nowrap',
          }}>
            {tasnif.qatorlar.length} ta
          </span>
          <span style={{
            fontSize: '13px', color: 'var(--muted)',
            transform: ochiqmi ? 'rotate(180deg)' : 'none', transition: 'transform .2s',
          }}>
            ▾
          </span>
        </div>
        {!ochiqmi && (
          <p style={{ margin: '7px 0 0', fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.5 }}>
            {tasnif.maqsad}
          </p>
        )}
      </button>

      {ochiqmi && (
        <div style={{ padding: '0 16px 16px' }}>
          <p style={{ margin: '0 0 10px', fontSize: '13px', lineHeight: 1.6 }}>{tasnif.maqsad}</p>

          <div style={{
            background: 'var(--surface-2)', borderRadius: '10px', padding: '10px 12px', marginBottom: '12px',
            borderLeft: '3px solid var(--accent)',
          }}>
            <strong style={{ fontSize: '10.5px', color: 'var(--accent)', display: 'block', marginBottom: '3px' }}>
              QACHON ISHLATILADI
            </strong>
            <span style={{ fontSize: '12.5px', lineHeight: 1.6 }}>{tasnif.qachon}</span>
          </div>

          {/* Jadval tor ekranda o'z ichida siljiydi — sahifa gorizontal ketmaydi */}
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', marginBottom: '10px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', minWidth: '340px' }}>
              <thead>
                <tr>
                  {tasnif.ustunlar.map((u) => (
                    <th key={u} style={{
                      textAlign: 'left', padding: '8px 10px', background: 'var(--surface-2)',
                      color: 'var(--muted)', fontSize: '10.5px', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '.04em', whiteSpace: 'nowrap',
                    }}>
                      {u}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tasnif.qatorlar.map((q, i) => (
                  <tr key={i}>
                    {q.map((hujayra, j) => (
                      <td key={j} style={{
                        padding: '9px 10px', borderTop: '1px solid var(--line)', lineHeight: 1.5,
                        fontWeight: j === 0 ? 700 : 400,
                        whiteSpace: j === 0 ? 'nowrap' : 'normal',
                        color: j === 0 ? 'var(--accent)' : 'var(--ink)',
                      }}>
                        {hujayra}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {tasnif.izoh && (
            <div style={{
              background: 'var(--warn-soft, rgba(217,131,36,.1))', borderRadius: '10px',
              padding: '10px 12px', marginBottom: '10px',
            }}>
              <p style={{ margin: 0, fontSize: '12.5px', lineHeight: 1.6 }}>💡 {tasnif.izoh}</p>
            </div>
          )}

          <p style={{ margin: 0, fontSize: '11px', color: 'var(--muted)' }}>📖 {tasnif.manba}</p>
        </div>
      )}
    </div>
  )
}
