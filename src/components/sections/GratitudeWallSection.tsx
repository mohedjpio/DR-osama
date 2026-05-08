'use client'
import { motion } from 'framer-motion'

// Floating words of gratitude that form a visual word cloud
const words = [
  { text: 'Inspiring', size: 'text-3xl', delay: 0 },
  { text: 'Kind', size: 'text-xl', delay: 0.05 },
  { text: 'Patient', size: 'text-2xl', delay: 0.1 },
  { text: 'Brilliant', size: 'text-4xl', delay: 0.15 },
  { text: 'Generous', size: 'text-xl', delay: 0.2 },
  { text: 'Wise', size: 'text-3xl', delay: 0.25 },
  { text: 'Dedicated', size: 'text-2xl', delay: 0.3 },
  { text: 'Passionate', size: 'text-3xl', delay: 0.35 },
  { text: 'Mentor', size: 'text-5xl', delay: 0.4 },
  { text: 'Legendary', size: 'text-4xl', delay: 0.45 },
  { text: 'Life-changing', size: 'text-2xl', delay: 0.5 },
  { text: 'Present', size: 'text-xl', delay: 0.55 },
  { text: 'Honest', size: 'text-2xl', delay: 0.6 },
  { text: 'Human', size: 'text-3xl', delay: 0.65 },
  { text: 'Real', size: 'text-xl', delay: 0.7 },
  { text: 'Unforgettable', size: 'text-4xl', delay: 0.75 },
]

const opacities = [
  'text-gold', 'text-gold/60', 'text-gold/40', 'text-cream/50', 'text-gold/70',
  'text-gold/30', 'text-cream/40', 'text-gold/80', 'text-gold', 'text-cream/60',
  'text-gold/50', 'text-cream/30', 'text-gold/65', 'text-gold/45', 'text-cream/45', 'text-gold',
]

export default function GratitudeWallSection() {
  return (
    <section
      id="gratitude"
      className="relative z-10 py-28 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #060a14 0%, #050810 100%)' }}
    >
      {/* Center glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05)_0%,transparent_65%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-gold/40" />
            <span className="text-gold/50 text-[10px] tracking-[0.5em] uppercase">In One Word</span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-gold/40" />
          </div>
          <h2 className="font-serif font-light text-cream text-4xl lg:text-5xl leading-tight">
            How students describe<br /><em className="text-gold not-italic">Dr. Osama El Nahas.</em>
          </h2>
        </div>

        {/* Word cloud */}
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-4 py-8">
          {words.map((word, i) => (
            <motion.span
              key={word.text}
              className={`font-serif ${word.size} ${opacities[i % opacities.length]} leading-tight cursor-default select-none`}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: word.delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{
                scale: 1.15,
                textShadow: '0 0 30px rgba(212,175,55,0.6)',
                transition: { duration: 0.2 },
              }}
            >
              {word.text}
            </motion.span>
          ))}
        </div>

        {/* Bottom quote */}
        <motion.div
          className="text-center mt-16 pt-12 border-t border-gold/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <p className="font-serif italic text-cream/40 text-lg max-w-lg mx-auto leading-relaxed">
            "To the world you may be one person, but to one person you may be the world."
          </p>
        </motion.div>
      </div>
    </section>
  )
}
