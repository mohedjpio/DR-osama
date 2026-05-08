'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const quotes = [
  '"A teacher affects eternity."',
  '"Some people don\'t just teach — they change lives."',
  '"Education is the kindest act of love."',
  '"The dream begins with a teacher who believes in you."',
  '"Not all heroes teach. But the greatest ones do."',
]

export default function QuoteBanner() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-30%'])

  return (
    <div
      ref={ref}
      className="relative overflow-hidden py-16 border-y border-gold/8"
      style={{ background: 'linear-gradient(90deg, #080e1c 0%, #0a1020 50%, #080e1c 100%)' }}
    >
      <motion.div
        className="flex gap-20 whitespace-nowrap will-change-transform"
        style={{ x }}
      >
        {[...quotes, ...quotes, ...quotes].map((q, i) => (
          <span
            key={i}
            className="font-serif italic text-gold/18 text-2xl lg:text-3xl shrink-0 select-none"
          >
            {q}
          </span>
        ))}
      </motion.div>

      {/* Edge fades */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#080e1c] to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#080e1c] to-transparent pointer-events-none" />
    </div>
  )
}
