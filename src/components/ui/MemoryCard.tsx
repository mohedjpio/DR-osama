'use client'
import { useRef, useState, MouseEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import type { Memory } from '@/types'
import { optimizeCloudinaryUrl } from '@/lib/cloudinary'
import { formatDate } from '@/lib/utils'

interface Props {
  memory: Memory
  onClick: (m: Memory) => void
  onDelete: (m: Memory) => void
  index: number
  view?: 'grid' | 'list'
}

const GRADIENTS = [
  ['#0a1628','#050c18'],
  ['#0a1f14','#050f09'],
  ['#170a28','#0d0518'],
  ['#281208','#160803'],
  ['#081828','#040c18'],
  ['#1a0a1a','#0d050d'],
]
const ACCENTS = [
  'rgba(212,175,55,0.15)',
  'rgba(80,200,120,0.10)',
  'rgba(150,90,220,0.10)',
  'rgba(220,130,50,0.10)',
  'rgba(50,150,220,0.10)',
  'rgba(220,70,110,0.09)',
]

const PREVIEW_CHARS = 160

export default function MemoryCard({ memory, onClick, onDelete, index, view = 'grid' }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const [c1, c2] = GRADIENTS[index % GRADIENTS.length]
  const accent   = ACCENTS[index % ACCENTS.length]
  const initial  = memory.name?.charAt(0)?.toUpperCase() || '✦'
  const isLong   = memory.message.length > PREVIEW_CHARS
  const preview  = isLong && !expanded
    ? memory.message.slice(0, PREVIEW_CHARS).trimEnd() + '…'
    : memory.message

  const onMouseMove = (e: MouseEvent) => {
    if (view !== 'grid') return
    const el = cardRef.current; if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top)  / r.height - 0.5
    el.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateZ(6px)`
  }
  const onMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = ''
    setHovered(false)
  }

  /* ── LIST ─────────────────────────────────────────────────────── */
  if (view === 'list') {
    return (
      <motion.article
        className="group relative flex rounded-2xl border border-white/[0.06] overflow-hidden cursor-pointer"
        style={{ background: `linear-gradient(135deg,${c1},${c2})`, height: 120 }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(index * 0.04, 0.5), duration: 0.5, ease: [0.16,1,0.3,1] }}
        whileHover={{ boxShadow: `0 12px 50px rgba(0,0,0,0.5), 0 0 0 1px ${accent}` }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => onClick(memory)}
      >
        {/* Top shimmer */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

        {/* Image strip — fixed width, full height */}
        {memory.image_url ? (
          <div className="relative flex-shrink-0 w-28 sm:w-36 h-full">
            <Image
              src={optimizeCloudinaryUrl(memory.image_url, 300)}
              alt={memory.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
              style={{ objectPosition: 'center 15%' }}
              sizes="144px"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40" />
          </div>
        ) : (
          /* Avatar block for text-only */
          <div
            className="flex-shrink-0 w-20 h-full flex items-center justify-center"
            style={{ background: `radial-gradient(circle,${accent},rgba(0,0,0,0.4))` }}
          >
            <span className="font-serif text-gold text-2xl leading-none">{initial}</span>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 min-w-0 flex flex-col justify-center px-5 py-3">
          <div className="flex items-baseline gap-2 mb-1.5">
            <p className="font-serif text-gold text-base leading-tight truncate">{memory.name}</p>
            {memory.created_at && (
              <p className="text-gold/25 text-[9px] tracking-wide flex-shrink-0">{formatDate(memory.created_at)}</p>
            )}
          </div>
          <p className="text-cream/55 text-xs leading-[1.7] line-clamp-3">{memory.message}</p>
        </div>

        {/* Delete */}
        <AnimatePresence>
          {hovered && (
            <motion.button
              key="del"
              className="absolute top-2.5 right-2.5 z-20 w-6 h-6 rounded-full bg-black/60 border border-red-700/40 flex items-center justify-center text-red-400/70 hover:text-red-300 hover:bg-red-950/80 transition-all text-[9px] backdrop-blur-md"
              onClick={e => { e.stopPropagation(); onDelete(memory) }}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.14 }}
            >✕</motion.button>
          )}
        </AnimatePresence>
      </motion.article>
    )
  }

  /* ── GRID — uniform card, image fills top half ────────────────── */
  return (
    <motion.article
      ref={cardRef}
      className="group relative rounded-2xl overflow-hidden border border-white/[0.07] cursor-pointer flex flex-col"
      style={{
        background: `linear-gradient(145deg,${c1},${c2})`,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s',
        /* Fixed uniform card height */
        height: 420,
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseEnter={() => setHovered(true)}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.06, 0.6), duration: 0.6, ease: [0.16,1,0.3,1] }}
      whileHover={{ boxShadow: `0 24px 70px rgba(0,0,0,0.65), 0 0 0 1px ${accent}, inset 0 1px 0 rgba(255,255,255,0.04)` }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
        style={{ background: `radial-gradient(ellipse at 50% 0%,${accent} 0%,transparent 65%)` }}
      />
      {/* Top shimmer */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-10" />

      {/* Delete */}
      <AnimatePresence>
        {hovered && (
          <motion.button
            key="del"
            className="absolute top-3 right-3 z-30 w-7 h-7 rounded-full bg-black/65 border border-red-700/40 flex items-center justify-center text-red-400/70 hover:text-red-300 hover:bg-red-950/85 transition-all text-[10px] backdrop-blur-md"
            onClick={e => { e.stopPropagation(); onDelete(memory) }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.14 }}
          >✕</motion.button>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col h-full" onClick={() => onClick(memory)}>

        {/* ── IMAGE — exactly 50% of card height (210px) ── */}
        {memory.image_url ? (
          <div className="relative w-full flex-shrink-0 overflow-hidden" style={{ height: 210 }}>
            <Image
              src={optimizeCloudinaryUrl(memory.image_url, 700)}
              alt={`Photo from ${memory.name}`}
              fill
              className="object-cover transition-transform duration-600 ease-out group-hover:scale-[1.04]"
              style={{ objectPosition: 'center 15%' }}
              sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,380px"
              loading="lazy"
            />
            {/* Bottom gradient into card body */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

            {/* Name badge at bottom of image */}
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-6">
              <div className="flex items-end gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gold/25 border border-gold/40 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  <span className="font-serif text-gold text-xs leading-none">{initial}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-gold text-base leading-tight truncate drop-shadow-lg">{memory.name}</p>
                  {memory.created_at && (
                    <p className="text-white/35 text-[9px] tracking-wide">{formatDate(memory.created_at)}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* No image — compact header, same flex-shrink-0 height */
          <div className="flex-shrink-0 flex items-center gap-4 px-5 pt-5 pb-3" style={{ height: 90 }}>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border border-gold/25"
              style={{ background: `radial-gradient(circle,${accent},rgba(0,0,0,0.35))` }}
            >
              <span className="font-serif text-gold text-xl leading-none">{initial}</span>
            </div>
            <div className="min-w-0">
              <p className="font-serif text-gold text-lg leading-tight truncate">{memory.name}</p>
              {memory.created_at && (
                <p className="text-gold/30 text-[9px] tracking-wide mt-0.5">{formatDate(memory.created_at)}</p>
              )}
            </div>
            {/* Decorative quote */}
            <div className="ml-auto font-serif text-6xl text-gold/5 leading-none select-none flex-shrink-0">"</div>
          </div>
        )}

        {/* ── MESSAGE — fills remaining height, scrollable if long ── */}
        <div className="flex-1 flex flex-col px-5 pt-3 pb-4 min-h-0">
          <div className="flex items-center gap-2 mb-2.5 flex-shrink-0">
            <div className="w-px h-3 bg-gold/30" />
            <span className="text-gold/30 text-[9px] tracking-[0.3em] uppercase">Memory</span>
          </div>

          {/* Message text — fills space, overflow hidden with expand */}
          <div className="flex-1 min-h-0 overflow-hidden relative">
            <p className="text-cream/65 text-[0.83rem] leading-[1.78]">
              {preview}
            </p>
            {/* Bottom fade if long and collapsed */}
            {isLong && !expanded && (
              <div
                className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
                style={{ background: `linear-gradient(to top, ${c2}, transparent)` }}
              />
            )}
          </div>

          {isLong && (
            <button
              className="mt-1.5 text-gold/40 hover:text-gold text-[9px] tracking-widest uppercase transition-colors flex-shrink-0 text-left"
              onClick={e => { e.stopPropagation(); setExpanded(v => !v) }}
            >
              {expanded ? 'Show less ↑' : 'Read more ↓'}
            </button>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.05] flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="text-gold/16 text-xs">✦</span>
              <span className="text-gold/16 text-[9px] tracking-[0.15em] uppercase">
                {memory.image_url ? 'Photo' : 'Written'}
              </span>
            </div>
            <motion.span
              className="text-gold/20 text-[9px] tracking-[0.15em] uppercase"
              animate={{ x: hovered ? 3 : 0 }}
              transition={{ duration: 0.18 }}
            >
              Open →
            </motion.span>
          </div>
        </div>

      </div>
    </motion.article>
  )
}
