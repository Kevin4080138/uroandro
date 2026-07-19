'use client'

import { BolimTayyorlanmoqda } from '@/components/BolimTayyorlanmoqda'

// Urologiyada ishlatiladigan tasniflar bir joyda — talaba imtihon oldidan
// yoki amaliyotda tez topib olishi uchun ma'lumotnoma bo'limi.
//
// Mazmuni keyin to'ldiriladi: har bir tasnif uchun to'liq jadval, oxirgi
// tahriri va qaysi holatda ishlatilishi. Hozircha reja ko'rsatiladi.

export default function StudentKlassifikatsiyalarPage() {
  return (
    <BolimTayyorlanmoqda
      emoji="🗂️"
      nom="Klassifikatsiyalar"
      tavsif="Urologiyada ishlatiladigan tasniflar bir joyda — imtihon oldidan va amaliyotda tez topish uchun."
      izoh="Har bir tasnif uchun to'liq jadval, oxirgi tahriri va qaysi klinik holatda ishlatilishi beriladi."
      reja={[
        {
          sarlavha: 'Buyrak va siydik yo\'llari',
          punktlar: [
            'Buyrak kistalari — Bosniak tasnifi (I, II, IIF, III, IV)',
            'Gidronefroz darajalari — SFU tasnifi',
            'Sistoureteral reflyuks — I–V darajalar',
            'Buyrak travmasi — AAST tasnifi',
            'Surunkali buyrak kasalligi — KDIGO (G1–G5, A1–A3)',
          ],
        },
        {
          sarlavha: 'Yallig\'lanish kasalliklari',
          punktlar: [
            'Pielonefrit — eng so\'nggi tasnif bo\'yicha',
            'Prostatit — NIH tasnifi (I, II, IIIA, IIIB, IV)',
            'Siydik yo\'llari infeksiyasi — asoratlangan va asoratlanmagan',
            'Urosepsis — SIRS va qSOFA me\'zonlari',
          ],
        },
        {
          sarlavha: 'Onkourologiya',
          punktlar: [
            'TNM — prostata, qovuq, buyrak, moyak uchun alohida',
            'Gleason ball va ISUP darajalari',
            'Buyrak o\'smasi — Fuhrman darajasi',
            'Moyak o\'smalari — IGCCCG prognostik guruhlari',
            'Qovuq o\'smasi — yuzaki va invaziv, EORTC xavf guruhlari',
          ],
        },
        {
          sarlavha: 'Andrologiya',
          punktlar: [
            'Varikotsele — Dubin-Amelar darajalari (I–III)',
            'Erektil disfunksiya — IIEF-5 bo\'yicha og\'irlik',
            'Ereksiya qattiqligi — EHS shkalasi (1–4)',
            'Peyroni kasalligi — bosqichlari',
            'Spermogramma — WHO 2021 me\'zonlari',
          ],
        },
        {
          sarlavha: 'Simptom va funksional shkalalar',
          punktlar: [
            'IPSS — pastki siydik yo\'llari simptomlari',
            'OAB-V8 — giperaktiv qovuq',
            'NIH-CPSI — surunkali chanoq og\'rig\'i',
            'Uroflowmetriya — Qmax me\'zonlari',
          ],
        },
        {
          sarlavha: 'Jarrohlik',
          punktlar: [
            'Clavien-Dindo — operatsiyadan keyingi asoratlar (I–V)',
            'Charlson — yondosh kasalliklar indeksi',
            'R.E.N.A.L. — buyrak o\'smasi nefrometriyasi',
            'ASA — anesteziologik xavf darajasi',
          ],
        },
      ]}
    />
  )
}
