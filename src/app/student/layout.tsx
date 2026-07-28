// Talaba bo'limini Elevate-ruhidagi pastel palitraga o'raydi (faqat /student/*).
// Shifokor/bemor/admin bo'limlari ko'k palitrada qoladi. Palitra tokenlari
// globals.css dagi `.talaba-palitra` da (light + dark) belgilangan.
export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <div className="talaba-palitra">{children}</div>
}
