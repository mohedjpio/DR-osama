'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const letters = [
  {
    from: 'A Student Who Almost Gave Up',
    text: 'You sat with me for three hours after class when I was ready to quit. You didn\'t fix my equations — you fixed my belief in myself. I graduated with honors because of one conversation in that office.',
    icon: '💛',
  },
  {
    from: 'A Student Who Found Their Path',
    text: 'I came in wanting to study business. One semester with you and I discovered what I was truly made for. You didn\'t teach a subject — you revealed a person.',
    icon: '✨',
  },
  {
    from: 'A Student Far From Home',
    text: 'I was thousands of miles from my family, lost in a foreign land. Your classroom was the first place that felt like home. Thank you for making space for all of us.',
    icon: '🌙',
  },
]

export default function LoveLetterSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <section
      ref={ref}
      id="love-letters"
      className="relative z-10 py-32 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #060a14 0%, #08101e 50%, #060a14 100%)' }}
    >
      {/* Floating orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%)', y }}
      />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20 reveal">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-gold/40" />
            <span className="text-gold/50 text-[10px] tracking-[0.5em] uppercase">Letters of Love</span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-gold/40" />
          </div>
          <h2 className="font-serif font-light text-cream text-4xl lg:text-5xl leading-tight mb-4">
            What they never had<br />the chance to say.
          </h2>
          <p className="text-cream/35 text-sm max-w-md mx-auto leading-relaxed">
            Some words live in hearts for years before they find their way out.
          </p>
        </div>

        {/* Letter cards — horizontal staggered layout */}
        <div className="space-y-6">
          {letters.map((letter, i) => (
            <motion.div
              key={i}
              className="reveal relative"
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className={`relative rounded-2xl border border-gold/10 overflow-hidden p-8 md:p-10 ${
                  i % 2 === 0 ? 'md:mr-24' : 'md:ml-24'
                }`}
                style={{
                  background: 'linear-gradient(135deg, rgba(212,175,55,0.04) 0%, rgba(5,8,16,0.9) 100%)',
                }}
              >
                {/* Decorative quote mark */}
                <div className="absolute top-4 right-6 font-serif text-8xl text-gold/5 leading-none select-none pointer-events-none">"</div>

                {/* Icon */}
                <div className="text-2xl mb-5">{letter.icon}</div>

                {/* Text */}
                <blockquote className="font-serif text-cream/75 text-lg lg:text-xl leading-relaxed italic mb-6">
                  "{letter.text}"
                </blockquote>

                {/* Attribution */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-px bg-gold/30" />
                  <span className="text-gold/50 text-xs tracking-widest">— {letter.from}</span>
                </div>

                {/* Left accent bar */}
                <div className="absolute left-0 top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
