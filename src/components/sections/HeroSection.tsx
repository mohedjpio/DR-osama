'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import Image from 'next/image'

const QUOTE = "Some people don't just teach… they change lives."

export default function HeroSection() {
  const quoteRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!quoteRef.current) return
    const el = quoteRef.current
    el.innerHTML = ''

    ;Array.from(QUOTE).forEach((char, i) => {
      const span = document.createElement('span')
      span.textContent = char === ' ' ? '\u00a0' : char
      span.style.opacity = '0'
      span.style.display = 'inline-block'
      span.style.transform = 'translateY(18px)'
      el.appendChild(span)

      gsap.to(span, {
        opacity: 1,
        y: 0,
        duration: 0.45,
        delay: 3.0 + i * 0.038,
        ease: 'power2.out',
      })
    })
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
    >
      {/* Ambient orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-900/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-5%] w-80 h-80 rounded-full bg-gold/5 blur-[90px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] bg-[radial-gradient(ellipse,rgba(212,175,55,0.04)_0%,transparent_70%)] pointer-events-none" />

      {/* Eyebrow label */}
      <motion.p
        className="text-gold/50 text-[10px] tracking-[0.5em] uppercase mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.9, duration: 0.8 }}
      >
        A Tribute — Class of 2026
      </motion.p>

      {/* ── Professor Portrait ─────────────────────────────────────────── */}
      <motion.div
        className="relative mb-10"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 3.0, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Outer golden ring */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-gold via-gold/40 to-transparent blur-sm opacity-70" />
        {/* Ring border */}
        <div className="absolute -inset-[3px] rounded-full border border-gold/30" />

        {/* Avatar circle */}
        <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-2 border-gold/20">
          <Image
            src="/dr-osama.jpg"
            alt="Dr. Osama El Nahas"
            fill
            className="object-cover object-top"
            priority
          />
        </div>

        {/* Rotating ring decoration */}
        <motion.div
          className="absolute -inset-3 rounded-full border border-dashed border-gold/15"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>

      {/* Professor Name */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.3, duration: 0.9 }}
      >
        <p className="font-serif text-gold text-2xl md:text-3xl tracking-wide mb-1">
          Dr. Osama El Nahas
        </p>
        <p className="text-cream/35 text-xs tracking-[0.3em] uppercase">
          Professor · Mentor · Legend
        </p>
      </motion.div>

      {/* Animated quote */}
      <h1
        ref={quoteRef}
        className="font-serif font-light text-cream text-3xl md:text-4xl lg:text-5xl leading-tight max-w-2xl min-h-[4rem]"
        aria-label={QUOTE}
      />

      {/* Subtitle */}
      <motion.p
        className="text-cream/35 text-xs tracking-[0.25em] mt-8 uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5.5, duration: 1 }}
      >
        Scroll to remember &nbsp;·&nbsp; Scroll to celebrate
      </motion.p>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5.8, duration: 1 }}
      >
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-gold to-transparent"
          animate={{ scaleY: [1, 0.55, 1], opacity: [1, 0.35, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="text-gold/35 text-[9px] tracking-[0.4em] uppercase">Scroll</span>
      </motion.div>
    </section>
  )
}
