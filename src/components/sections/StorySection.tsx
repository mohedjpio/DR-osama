'use client'
import { useParallax } from '@/hooks/useScrollReveal'

const stats = [
  { num: '∞', label: 'Lives shaped' },
  { num: '20+', label: 'Years teaching' },
  { num: '1', label: 'In a million' },
]

export default function StorySection() {
  const parallaxRef = useParallax(0.4)

  return (
    <section
      id="story"
      className="relative z-10 py-32 px-6"
      style={{ background: 'linear-gradient(180deg, #050810 0%, #0a0f1e 50%, #050810 100%)' }}
    >
      {/* Section border top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/12 to-transparent" />

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-20 items-center">

        {/* Left */}
        <div ref={parallaxRef}>
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-6 h-px bg-gold/40" />
            <p className="reveal text-gold/50 text-[10px] tracking-[0.5em] uppercase">The Journey</p>
          </div>
          <h2 className="reveal font-serif font-light text-cream text-4xl lg:text-5xl leading-[1.15] mb-8">
            A life spent in service<br />of others' growth.
          </h2>
          <div className="gold-line reveal" />

          <blockquote className="reveal font-serif italic text-cream/55 text-[1.2rem] leading-relaxed border-l border-gold/25 pl-6 mb-10">
            "The best teacher is not the one who knows the most — but the one who makes you believe in yourself."
          </blockquote>

          <div className="reveal flex flex-wrap gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex-1 min-w-[110px] rounded-2xl p-5 border border-gold/10 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg,rgba(212,175,55,0.05) 0%,rgba(5,8,16,0.5) 100%)' }}
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                <p className="font-serif text-gold text-4xl leading-none mb-1">{s.num}</p>
                <p className="text-cream/30 text-[10px] tracking-[0.2em] uppercase">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="space-y-6">
          <p className="reveal text-cream/50 text-[0.95rem] leading-[1.95]">
            Some teachers give you knowledge. Some give you skills. Very few give you something far more
            precious — the confidence to become who you were always meant to be.
          </p>
          <p className="reveal text-cream/38 text-[0.95rem] leading-[1.95]">
            This space was built with love, by students whose lives were quietly, profoundly changed by
            one extraordinary human being. Their words, their memories, their gratitude — collected here, forever.
          </p>
          <p className="reveal text-cream/28 text-[0.95rem] leading-[1.95]">
            Every lecture was a gift. Every office-hours conversation, a turning point. Every moment of
            genuine care — a reminder that education, at its best, is an act of love.
          </p>

          {/* Signature ornament */}
          <div className="reveal pt-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-gold/20 to-transparent" />
              <span className="font-serif text-gold/30 text-sm italic">Dr. Osama El Nahas</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
