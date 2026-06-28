'use client'

import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

export default function Hero() {
  return (
    <div className="relative hidden flex-1 flex-col justify-center overflow-hidden px-12 lg:flex" style={{ background: 'var(--bg)' }}>
      <div
        className="pointer-events-none absolute -left-20 top-1/4 h-[420px] w-[420px] rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}
      />

      <motion.span
        initial="hidden"
        animate="show"
        variants={fadeUp}
        transition={{ duration: 0.5 }}
        className="relative mb-6 w-fit rounded-full border px-4 py-1.5 text-sm font-medium"
        style={{ borderColor: 'var(--line)', color: 'var(--accent)', background: 'var(--accent-soft)' }}
      >
        Urologiya va Andrologiya platformasi
      </motion.span>

      <motion.h1
        initial="hidden"
        animate="show"
        variants={fadeUp}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative max-w-md text-4xl font-extrabold leading-tight sm:text-5xl"
        style={{ color: 'var(--ink)' }}
      >
        Sog&apos;ligingiz <span style={{ color: 'var(--accent)' }}>professional</span> nazoratda
      </motion.h1>

      <motion.p
        initial="hidden"
        animate="show"
        variants={fadeUp}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative mt-6 max-w-sm text-base"
        style={{ color: 'var(--muted)' }}
      >
        Bemorlar, shifokorlar va talabalar uchun yagona platforma: konsultatsiya,
        monitoring, o&apos;z-tekshiruv va ta&apos;lim materiallari bir joyda.
      </motion.p>
    </div>
  )
}
