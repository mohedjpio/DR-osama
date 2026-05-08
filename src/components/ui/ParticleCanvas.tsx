'use client'
import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number
  vx: number; vy: number
  size: number; opacity: number
  life: number; maxLife: number
  gold: boolean
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let W = 0, H = 0
    let particles: Particle[] = []
    let raf: number

    const resize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }

    const mkParticle = (): Particle => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25 - 0.08,
      size: Math.random() * 1.4 + 0.3,
      opacity: Math.random() * 0.45 + 0.08,
      life: 0,
      maxLife: 300 + Math.random() * 500,
      gold: Math.random() > 0.65,
    })

    resize()
    particles = Array.from({ length: 130 }, mkParticle)

    const animate = () => {
      ctx.clearRect(0, 0, W, H)
      particles.forEach((p, i) => {
        p.life++
        const dx = mouse.current.x - p.x
        const dy = mouse.current.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 130) {
          p.x -= (dx / dist) * 0.45
          p.y -= (dy / dist) * 0.45
        }
        p.x += p.vx; p.y += p.vy
        const alpha = p.opacity * (1 - p.life / p.maxLife)
        ctx.save()
        ctx.globalAlpha = alpha
        ctx.fillStyle = p.gold ? '#D4AF37' : '#F0EAD6'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
        if (p.life > p.maxLife || p.y < -10) particles[i] = mkParticle()
      })
      raf = requestAnimationFrame(animate)
    }
    animate()

    const onMouse = (e: MouseEvent) => { mouse.current.x = e.clientX; mouse.current.y = e.clientY }
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouse)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
      aria-hidden="true"
    />
  )
}
