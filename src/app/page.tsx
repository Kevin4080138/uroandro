'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

const sections = [
  {
    icon: '🎓',
    title: 'Talabalar uchun',
    desc: "Darslar, qo'llanmalar, testlar va reyting tizimi orqali urologiya yo'nalishini chuqur o'rganing.",
    c: 'var(--accent)',
  },
  {
    icon: '👨‍⚕️',
    title: 'Shifokorlar uchun',
    desc: "Bemorlar bilan ishlash, protokollar, kalkulyatorlar va kasbiy kutubxona bir platformada.",
    c: 'var(--accent-2)',
  },
  {
    icon: '🧑',
    title: 'Bemorlar uchun',
    desc: "Shifokorga murojaat qilish, tavsiyalarni kuzatish va sog'liq ma'lumotlarini bir joyda saqlash.",
    c: 'var(--good)',
  },
]

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <div className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute -top-32 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}
        />

        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center sm:py-32">
          <motion.span
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mb-6 w-fit rounded-full border px-4 py-1.5 text-sm font-medium"
            style={{ borderColor: 'var(--line)', color: 'var(--accent)', background: 'var(--accent-soft)' }}
          >
            Urologiya va Andrologiya platformasi
          </motion.span>

          <motion.h1
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-extrabold leading-tight sm:text-6xl"
            style={{ color: 'var(--ink)' }}
          >
            Uro<span style={{ color: 'var(--accent)' }}>sfera</span>{' '}bilan o&apos;qing va ishlang
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 max-w-xl text-lg"
            style={{ color: 'var(--muted)' }}
          >
            Talabalar va shifokorlar uchun ta&apos;lim, amaliyot va kasbiy rivojlanishni bir joyga
            jamlagan platforma.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/auth/register"
              className="rounded-xl px-6 py-3 text-base font-semibold text-white shadow-lg transition-transform hover:scale-[1.02]"
              style={{ background: 'var(--accent)', boxShadow: 'var(--shadow)' }}
            >
              Ro&apos;yxatdan o&apos;tish
            </Link>
            <Link
              href="/auth/login"
              className="rounded-xl border px-6 py-3 text-base font-semibold transition-colors"
              style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
            >
              Kirish
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-2">
          {sections.map((s, i) => (
            <motion.div
              key={s.title}
              initial="hidden"
              animate="show"
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="dash-card"
              style={{ ['--c' as any]: s.c }}
            >
              <div className="dash-icon">{s.icon}</div>
              <h3 className="dash-title">{s.title}</h3>
              <p className="dash-desc">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
