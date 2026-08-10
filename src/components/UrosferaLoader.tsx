'use client'

import { useEffect, useRef } from 'react'

export default function UrosferaLoader({ matn = 'Yuklanmoqda...' }: { matn?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 340, H = 340
    const cx = W / 2, cy = H / 2
    const EGG_R = 62
    let eggPulse = 0
    let fertilized = false
    let fertilizeTimer = 0
    let burstParticles: { x: number; y: number; vx: number; vy: number; life: number; decay: number; r: number; hue: number }[] = []
    let t = 0
    let restartTimer = 0

    class Sperm {
      x: number; y: number; angle: number; speed: number
      wigglePhase: number; wiggleFreq: number; wiggleAmp: number
      tailHistory: { x: number; y: number }[]
      hue: number; alpha: number
      delay: number; t: number; won: boolean; dead: boolean; hitEgg: boolean

      constructor(delay: number) {
        this.delay = delay
        this.t = -delay
        this.won = false
        this.dead = false
        this.hitEgg = false
        const startAngle = Math.random() * Math.PI * 2
        const startR = 155 + Math.random() * 40
        this.x = cx + Math.cos(startAngle) * startR
        this.y = cy + Math.sin(startAngle) * startR
        const toEgg = Math.atan2(cy - this.y, cx - this.x)
        this.angle = toEgg + (Math.random() - 0.5) * 0.6
        this.speed = 0.55 + Math.random() * 0.5
        this.wigglePhase = Math.random() * Math.PI * 2
        this.wiggleFreq = 0.18 + Math.random() * 0.08
        this.wiggleAmp = 0.06 + Math.random() * 0.05
        this.tailHistory = Array.from({ length: 10 }, () => ({ x: this.x, y: this.y }))
        this.hue = 188 + Math.random() * 20
        this.alpha = 0.7 + Math.random() * 0.3
      }

      update(frame: number) {
        this.t = frame
        if (this.dead || this.won) return false
        this.wigglePhase += this.wiggleFreq
        this.angle += Math.sin(this.wigglePhase) * this.wiggleAmp
        const toEggAngle = Math.atan2(cy - this.y, cx - this.x)
        let angleDiff = toEggAngle - this.angle
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2
        this.angle += angleDiff * 0.025
        this.x += Math.cos(this.angle) * this.speed
        this.y += Math.sin(this.angle) * this.speed
        this.tailHistory.unshift({ x: this.x, y: this.y })
        if (this.tailHistory.length > 22) this.tailHistory.pop()
        const dist = Math.hypot(this.x - cx, this.y - cy)
        if (dist < EGG_R + 2 && !this.hitEgg) {
          this.hitEgg = true
          return true
        }
        return false
      }

      draw(c: CanvasRenderingContext2D) {
        if (this.dead) return
        const a = this.won ? 0 : this.alpha
        if (this.tailHistory.length > 1) {
          for (let i = 0; i < this.tailHistory.length - 1; i++) {
            const t0 = this.tailHistory[i], t1 = this.tailHistory[i + 1]
            const f = 1 - i / this.tailHistory.length
            c.beginPath()
            c.moveTo(t0.x, t0.y)
            c.lineTo(t1.x, t1.y)
            c.strokeStyle = `hsla(${this.hue},75%,72%,${a * f * 0.7})`
            c.lineWidth = 1.4 * f
            c.stroke()
          }
        }
        c.save()
        c.translate(this.x, this.y)
        c.rotate(this.angle)
        const headGrd = c.createRadialGradient(-1, -1, 0.5, 0, 0, 5)
        headGrd.addColorStop(0, `hsla(${this.hue},50%,90%,${a})`)
        headGrd.addColorStop(1, `hsla(${this.hue},75%,58%,${a})`)
        c.beginPath()
        c.ellipse(0, 0, 5, 3.2, 0, 0, Math.PI * 2)
        c.fillStyle = headGrd
        c.fill()
        c.restore()
      }
    }

    let sperms: Sperm[] = []
    let winner: Sperm | null = null

    function initSperms() {
      sperms = []
      winner = null
      fertilized = false
      fertilizeTimer = 0
      burstParticles = []
      for (let i = 0; i < 22; i++) sperms.push(new Sperm(i * 8))
    }

    function triggerFertilize() {
      fertilized = true
      fertilizeTimer = 0
      for (let i = 0; i < 48; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 1.2 + Math.random() * 3.5
        burstParticles.push({
          x: cx, y: cy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          life: 1, decay: 0.012 + Math.random() * 0.018, r: 2 + Math.random() * 4,
          hue: 185 + Math.random() * 30,
        })
      }
    }

    function drawEgg() {
      eggPulse += 0.03
      const glow = 8 + Math.sin(eggPulse) * 3
      const grd = ctx!.createRadialGradient(cx, cy, EGG_R * 0.3, cx, cy, EGG_R + glow + 10)
      grd.addColorStop(0, 'rgba(100,220,255,0.20)')
      grd.addColorStop(1, 'rgba(10,180,220,0)')
      ctx!.beginPath()
      ctx!.arc(cx, cy, EGG_R + glow + 10, 0, Math.PI * 2)
      ctx!.fillStyle = grd
      ctx!.fill()
      ctx!.beginPath()
      ctx!.arc(cx, cy, EGG_R + glow, 0, Math.PI * 2)
      ctx!.strokeStyle = 'rgba(180,240,255,0.20)'
      ctx!.lineWidth = 10
      ctx!.stroke()
      const eggGrd = ctx!.createRadialGradient(cx - 18, cy - 18, 6, cx, cy, EGG_R)
      eggGrd.addColorStop(0, '#c8f4ff')
      eggGrd.addColorStop(0.4, '#3ac8e8')
      eggGrd.addColorStop(0.8, '#0a8aaa')
      eggGrd.addColorStop(1, '#065a78')
      ctx!.beginPath()
      ctx!.arc(cx, cy, EGG_R, 0, Math.PI * 2)
      ctx!.fillStyle = eggGrd
      ctx!.fill()
      ctx!.beginPath()
      ctx!.arc(cx, cy, 22, 0, Math.PI * 2)
      ctx!.fillStyle = 'rgba(255,255,255,0.10)'
      ctx!.fill()
      ctx!.strokeStyle = 'rgba(200,240,255,0.25)'
      ctx!.lineWidth = 1.5
      ctx!.stroke()
    }

    function drawBurst() {
      fertilizeTimer++
      for (let i = burstParticles.length - 1; i >= 0; i--) {
        const p = burstParticles[i]
        p.x += p.vx; p.y += p.vy; p.vx *= 0.97; p.vy *= 0.97; p.life -= p.decay
        if (p.life <= 0) { burstParticles.splice(i, 1); continue }
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2)
        ctx!.fillStyle = `hsla(${p.hue},80%,70%,${p.life})`
        ctx!.fill()
      }
      if (fertilizeTimer < 30) {
        const alpha = (1 - fertilizeTimer / 30) * 0.6
        const radius = EGG_R + fertilizeTimer * 3
        ctx!.beginPath()
        ctx!.arc(cx, cy, radius, 0, Math.PI * 2)
        ctx!.strokeStyle = `rgba(150,240,255,${alpha})`
        ctx!.lineWidth = 3
        ctx!.stroke()
      }
    }

    initSperms()

    function loop() {
      animRef.current = requestAnimationFrame(loop)
      ctx!.clearRect(0, 0, W, H)
      const bgGrd = ctx!.createRadialGradient(cx, cy, 30, cx, cy, W * 0.7)
      bgGrd.addColorStop(0, 'rgba(20,160,200,0.10)')
      bgGrd.addColorStop(1, 'rgba(0,0,0,0)')
      ctx!.fillStyle = bgGrd
      ctx!.fillRect(0, 0, W, H)
      drawEgg()
      if (fertilized) drawBurst()
      t++
      for (const s of sperms) {
        if (s.dead || s.won) continue
        if (t < s.delay) continue
        const hit = s.update(t)
        if (hit && !winner && !fertilized) {
          winner = s
          s.won = true
          triggerFertilize()
          for (const o of sperms) { if (o !== s) o.dead = true }
        }
        s.draw(ctx!)
      }
      if (fertilized) {
        restartTimer++
        if (restartTimer > 150) { restartTimer = 0; initSperms() }
      }
    }

    loop()
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '24px 0',
    }}>
      <canvas ref={canvasRef} width={340} height={340} style={{ display: 'block' }} />
      <p style={{
        marginTop: '-8px', fontSize: '13px', letterSpacing: '2px',
        color: 'var(--muted)', animation: 'pulse 1.8s ease-in-out infinite',
      }}>
        {matn}
      </p>
    </div>
  )
}

const orbitStyle: React.CSSProperties = {
  position: 'relative', width: 64, height: 64,
  animation: 'uroEggPulse 2.4s ease-in-out infinite',
}
const eggWrapStyle: React.CSSProperties = {
  position: 'absolute', inset: 0,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}
const eggImgStyle: React.CSSProperties = {
  width: 32, height: 32, borderRadius: '50%',
  boxShadow: '0 0 12px rgba(10,138,170,.35)',
}
const dotBase: React.CSSProperties = {
  position: 'absolute', width: 5, height: 5, borderRadius: '50%',
  background: 'var(--accent)', opacity: 0.7,
  top: '50%', left: '50%',
  animation: 'uroOrbit 2.8s linear infinite',
}

const MINI_KEYFRAMES = `
@keyframes uroOrbit {
  0%   { transform: translate(-50%,-50%) rotate(0deg)   translateX(28px) scale(1);   opacity: .8; }
  50%  { transform: translate(-50%,-50%) rotate(180deg) translateX(28px) scale(.65);  opacity: .35; }
  100% { transform: translate(-50%,-50%) rotate(360deg) translateX(28px) scale(1);   opacity: .8; }
}
@keyframes uroEggPulse {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.06); }
}
`

export function UrosferaLoaderMini({ matn = 'Yuklanmoqda...' }: { matn?: string }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '28px 0', gap: 10,
    }}>
      <style dangerouslySetInnerHTML={{ __html: MINI_KEYFRAMES }} />
      <div style={orbitStyle}>
        <div style={eggWrapStyle}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/urosfera-logo.png" alt="" style={eggImgStyle} />
        </div>
        {[0, -0.56, -1.12, -1.68, -2.24].map((d, i) => (
          <span key={i} style={{ ...dotBase, animationDelay: `${d}s` }} />
        ))}
      </div>
      <p style={{
        fontSize: 13, color: 'var(--muted)', margin: 0,
        animation: 'pulse 1.8s ease-in-out infinite',
      }}>
        {matn}
      </p>
    </div>
  )
}
