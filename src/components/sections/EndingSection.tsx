'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const slides = [
  { bg: 'linear-gradient(135deg,#0d1c35,#050c18)' },
  { bg: 'linear-gradient(135deg,#0d2218,#061510)' },
  { bg: 'linear-gradient(135deg,#200e14,#110813)' },
  { bg: 'linear-gradient(135deg,#2a1506,#160803)' },
  { bg: 'linear-gradient(135deg,#071c2a,#040f18)' },
]

export default function EndingSection() {
  const [slideIdx, setSlideIdx] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end end'] })
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1])
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1])
  const y = useTransform(scrollYProgress, [0, 1], [60, 0])

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIdx((i) => (i + 1) % slides.length)
    }, 3800)
    return () => clearInterval(interval)
  }, [])

  return (
    <section
      ref={sectionRef}
      id="ending"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
    >
      {/* Animated color slideshow backgrounds */}
      {slides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-[2800ms] ease-in-out"
          style={{ background: s.bg, opacity: i === slideIdx ? 1 : 0 }}
        />
      ))}

      {/* Gold center glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.07)_0%,transparent_60%)] pointer-events-none" />

      {/* Stars / particles decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-px rounded-full bg-gold"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.4 + 0.1,
            }}
            animate={{ opacity: [0.1, 0.6, 0.1], scale: [1, 2, 1] }}
            transition={{
              duration: 2 + Math.random() * 4,
              delay: Math.random() * 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div style={{ opacity, scale, y }} className="relative z-10 max-w-2xl mx-auto">
        {/* Top ornament line */}
        <motion.div
          className="w-px h-20 bg-gradient-to-b from-transparent via-gold/50 to-transparent mx-auto mb-10"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        />

        <motion.p
          className="text-gold/40 text-[10px] tracking-[0.6em] uppercase mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          From all of us
        </motion.p>

        <motion.h2
          className="font-serif font-light text-cream text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Thank you<br />
          for <em className="text-gold not-italic">everything.</em>
        </motion.h2>

        <motion.p
          className="text-cream/25 text-sm italic leading-relaxed mb-4 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          "A teacher affects eternity; he can never tell where his influence stops."
        </motion.p>

        <motion.p
          className="text-gold/30 text-xs tracking-widest"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          — Dr. Osama El Nahas · Class of 2026
        </motion.p>

        {/* Bottom ornament */}
        <motion.div
          className="w-px h-16 bg-gradient-to-b from-gold/40 to-transparent mx-auto mt-10"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
        />

        {/* Decorative dots */}
        <div className="flex items-center justify-center gap-4 mt-8">
          {slides.map((_, i) => (
            <motion.div
              key={i}
              className="rounded-full bg-gold transition-all duration-700"
              animate={{
                width: i === slideIdx ? 24 : 4,
                height: 4,
                opacity: i === slideIdx ? 0.7 : 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Giant decorative year */}
      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-serif text-[10rem] md:text-[14rem] text-gold/[0.03] select-none whitespace-nowrap pointer-events-none leading-none">
        2026
      </p>
    </section>
  )
}
