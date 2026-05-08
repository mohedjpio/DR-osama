'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function InviteSection() {
  return (
    <section
      id="add-memory"
      className="relative z-10 py-36 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #060a14 0%, #050810 100%)' }}
    >
      {/* Border top */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/12 to-transparent" />

      {/* Center glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05)_0%,transparent_60%)] pointer-events-none" />

      {/* Floating ornament */}
      <motion.div
        className="absolute top-12 left-1/2 -translate-x-1/2 font-serif text-gold/5 text-[12rem] leading-none select-none pointer-events-none"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        ✦
      </motion.div>

      <div className="max-w-2xl mx-auto text-center relative z-10">

        {/* Label */}
        <motion.div
          className="inline-flex items-center gap-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-10 h-px bg-gradient-to-r from-transparent to-gold/40" />
          <span className="text-gold/45 text-[10px] tracking-[0.55em] uppercase">Your Turn</span>
          <div className="w-10 h-px bg-gradient-to-l from-transparent to-gold/40" />
        </motion.div>

        {/* Heading */}
        <motion.h2
          className="font-serif font-light text-cream text-4xl md:text-5xl lg:text-6xl leading-tight mb-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.9, ease: [0.16,1,0.3,1] }}
        >
          Have a memory<br />
          to <em className="text-gold not-italic">share?</em>
        </motion.h2>

        {/* Sub */}
        <motion.p
          className="text-cream/35 text-base leading-relaxed mb-14 max-w-md mx-auto"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Every word of gratitude is a thread in a tapestry that will outlast any of us.
          Take a moment and add yours.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.16,1,0.3,1] }}
        >
          <Link
            href="/submit"
            className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-ink font-medium text-sm tracking-[0.15em] uppercase overflow-hidden transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(212,175,55,0.35)]"
            style={{ background: 'linear-gradient(135deg,#D4AF37,#B8952E)' }}
          >
            {/* Shimmer sweep on hover */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

            <span className="relative">Leave a Memory</span>
            <motion.span
              className="relative text-base"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              →
            </motion.span>
          </Link>
        </motion.div>

        {/* Trust line */}
        <motion.p
          className="text-cream/15 text-xs tracking-widest mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Opens a dedicated, distraction-free submission page
        </motion.p>

        {/* Decorative dots row */}
        <motion.div
          className="flex items-center justify-center gap-3 mt-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {[0,1,2,3,4].map(i => (
            <div
              key={i}
              className="rounded-full bg-gold/20"
              style={{ width: i === 2 ? 20 : i === 1 || i === 3 ? 8 : 4, height: 4 }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
