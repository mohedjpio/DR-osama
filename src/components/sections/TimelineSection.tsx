'use client'
import { motion } from 'framer-motion'

const milestones = [
  { year: 'Day One', label: 'The First Lecture', desc: 'The room fell quiet. Not from boredom — from awe. This was not an ordinary teacher.' },
  { year: 'Semester 1', label: 'The Office Hours', desc: 'The door was always open. No question too small. No student turned away.' },
  { year: 'Midterms', label: 'The Turning Point', desc: 'Some failed. None were abandoned. He showed up for every student who needed him.' },
  { year: 'Finals', label: 'The Revelation', desc: 'We didn\'t just learn the subject. We learned something about ourselves.' },
  { year: 'Graduation', label: 'The Goodbye', desc: 'We leave with degrees in our hands and a lesson in our hearts: be kind, be present, be great.' },
]

export default function TimelineSection() {
  return (
    <section
      id="timeline"
      className="relative z-10 py-32 px-6"
      style={{ background: 'linear-gradient(180deg, #0a0f1e 0%, #060a14 100%)' }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20 reveal">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-gold/40" />
            <span className="text-gold/50 text-[10px] tracking-[0.5em] uppercase">The Journey</span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-gold/40" />
          </div>
          <h2 className="font-serif font-light text-cream text-4xl lg:text-5xl leading-tight">
            A year that<br /><em className="text-gold not-italic">changed everything.</em>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent md:-translate-x-1/2" />

          <div className="space-y-14">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                className={`relative flex gap-8 md:gap-0 items-start ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Content */}
                <div className={`flex-1 pl-14 md:pl-0 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <p className="text-gold/50 text-[10px] tracking-[0.35em] uppercase mb-1">{m.year}</p>
                  <h3 className="font-serif text-cream text-xl mb-2">{m.label}</h3>
                  <p className="text-cream/45 text-sm leading-relaxed">{m.desc}</p>
                </div>

                {/* Dot — centered on line */}
                <div className="absolute left-6 md:left-1/2 top-0 md:-translate-x-1/2 flex-shrink-0">
                  <motion.div
                    className="w-3 h-3 rounded-full bg-gold/80 border-2 border-ink shadow-[0_0_12px_rgba(212,175,55,0.5)]"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.3, type: 'spring', stiffness: 200 }}
                  />
                </div>

                {/* Spacer for opposite side */}
                <div className="hidden md:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
